import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import * as limit from '../../limit';

interface u_elements {
	u_id: number,
	u_name: string,
	create_at: EpochTimeStamp,
}

// insert transation into transactions tabale supabase
export async function POST(req: Request) {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const tx_data = await req.json();
	
	const clientIP = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]

	await limit.check(clientIP);
	if (limit.requestsPerMinute[clientIP].count >= limit.MAX_REQUESTS_PER_MINUTE) {
		return NextResponse.json({ message: 'Too Many Requests' });
	}
	try {
		if (isNaN(tx_data.bet) || isNaN(tx_data.payoff)) {
			return NextResponse.json({ message: "failed: Please enter only numbers greater than 0 for BET and PAYOFF" });
		}
		if (tx_data.bet < 0 || tx_data.payoff < 0) {
			return NextResponse.json({ message: "failed: Please enter only numbers greater than 0 for BET and PAYOFF" });
		}

		// --check user
		const user: any = await supabase
			.from('users')
			.select()
			.eq('u_name', `${tx_data.u_name}`)
	
		if ((user.data as any).length == 0) {
			return NextResponse.json({
				message: "Failed request. User not found or PIN is different"
			})
		}
		else if (user.data[0].pin != tx_data.pin) {
			return NextResponse.json({
				message: "Failed request. User not found or PIN is different"
			})
		}

		//-- insert to transacsions
		const result = (parseInt(tx_data.bet) - parseInt(tx_data.payoff)) * -1;

		await supabase.from('transactions').upsert({
			u_id: user.data[0].u_id,
			bet_amount: tx_data.bet,
			pay_off: tx_data.payoff,
			result: result,
		})
		
		return NextResponse.json({ 
			message: `success: BET=${tx_data.bet} PAYOFF=${tx_data.payoff}\nResult is: ${result}`,
		})
	} catch (error) {
		console.log(error);
		return NextResponse.json({ 
			message: "failed" 
		});
	};
}