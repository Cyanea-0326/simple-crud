import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import * as limit from '../../limit';

// insert transation into transactions tabale supabase
export async function POST(req: Request) {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const update_data = await req.json();

	const clientIP = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]

	await limit.check(clientIP);
	if (limit.requestsPerMinute[clientIP].count >= limit.MAX_REQUESTS_PER_MINUTE) {
		return NextResponse.json({ message: 'Too Many Requests' });
	}
	try {

		// --check user
		const user: any = await supabase
		.from('users')
		.select()
		.eq('u_name', `${update_data.u_name}`)
		
		if ((user as any).length == 0) {
			return NextResponse.json({
				message: "Failed request. User not found or PIN is different"
			})
		}
		else if (user.data[0].pin != update_data.pin) {
			return NextResponse.json({
				message: "Failed request. User not found or PIN is different"
			})
		}
		// Minus and not yet tx_id will fail
		const transaction: any = await supabase
			.from('transactions')
			.select()
			.eq('tx_id', `${update_data.tx_id}`)
		
		if ((transaction as any).length == 0) {
			return NextResponse.json({ message: "transaction not find" })
		}
		if (transaction.data[0].u_id != user.data[0].u_id) {
			return NextResponse.json({ message: "transaction not find" })
		}
		
		// DELETE PROCESS
		if (update_data.bet === "DELETE" && update_data.payoff === "DELETE") {
			await supabase.from('transactions').delete().eq('tx_id', update_data.tx_id);
			return NextResponse.json({ message: "success: Transaction data has been successfully deleted" });;
		}
		else if (update_data.bet < 0 || update_data.payoff < 0 || isNaN(update_data.bet) || isNaN(update_data.payoff)) {
			return NextResponse.json({ message: "failed: Please check the format" });
		}
			
		//-- edit to transacsions
		const result = (parseInt(update_data.bet) - parseInt(update_data.payoff)) * -1;
		
		await supabase
			.from('transactions')
			.update({
				u_id: user.u_id,
				bet_amount: update_data.bet,
				pay_off: update_data.payoff,
				result: result,
			})
			.eq('tx_id', update_data.tx_id)
			
		return NextResponse.json({ 
			message: `success\n\nBET: ${transaction.data[0].bet_amount} >> ${update_data.bet}\nPAYOFF: ${transaction.data[0].pay_off} >> ${update_data.payoff}\nRESULT: ${transaction.data[0].result} >> ${result}`
		})
	} catch (error) {
		console.log(error);
		return NextResponse.json({ 
			message: `failed: Pls check the information you entered`
		});
	};
}