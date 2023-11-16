import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import * as limit from '../../limit';

// insert transation into transactions tabale supabase
export async function POST(req: Request) {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const applicant = await req.json();

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
			.eq('u_name', `${applicant.u_name}`)

		if ((user.data as any).length == 0) {
			return NextResponse.json({
				message: "Failed request. User not found or PIN is different"
			})
		}
		else if (user.data[0].pin != applicant.pin) {
			return NextResponse.json({
				message: "Failed request. User not found or PIN is different"
			})
		}

		//-- Get transacsion
		const tx_history: any = await supabase
		.from('transactions')
		.select()
		.eq('u_id', user.data[0].u_id)
		
		// calc total_result
		tx_history.data[0].total_result = parseInt(tx_history.data[0].result);
		tx_history.data.slice(1).forEach((value: any, index: any) => {
			tx_history.data[index + 1].total_result = parseInt(tx_history.data[index + 1].result) + parseInt(tx_history.data[index].total_result);
		});

		return NextResponse.json({ 
			message: "success: Displayed transaction history",
			tx_history: tx_history.data
		})
	} catch (error) {
		console.log(error);
		return NextResponse.json({ 
			message: "failed" 
		});
	};
}