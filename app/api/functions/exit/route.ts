import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import * as limit from '../../limit';

// insert transation into transactions tabale supabase
export async function POST(req: Request) {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const exit_user = await req.json();

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
			.eq('u_name', `${exit_user.u_name}`)

		if ((user as any).length == 0) {
			return NextResponse.json({
				message: "Failed request. User not found or PIN is different"
			})
		}
		else if (user.data[0].pin != exit_user.pin) {
			return NextResponse.json({
				message: "Failed request. User not found or PIN is different"
			})
		}

		//-- DELETE info of transacsion and user
		await supabase
			.from('transactions')
			.delete()
			.eq('u_id', user.data[0].u_id)
		await supabase
			.from('users')
			.delete()
			.eq('u_id', user.data[0].u_id)
			
		return NextResponse.json({ message: `success: ${exit_user.u_name}'s user information has been deleted ` })
	} catch (error) {
		console.log(error);
		return NextResponse.json({ 
			message: "failed" 
		});
	};
}