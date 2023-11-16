import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import * as limit from '../../limit';

// insert new user into users tabale supabase
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
		// --check conflict
		const user: any = await supabase
			.from('users')
			.select()
			.eq('u_name', `${applicant.u_name}`)

		if ((user.data as any).length > 0) {
			return NextResponse.json({ 
				message: "Failed request. Same user name exists" 
			})
		}

		await supabase.from('users').upsert({
			u_name: applicant.u_name,
			pin: applicant.pin,
		})

	} catch (error) {
		console.log(error);
		return NextResponse.json({ 
			message: "failed" 
		});
	};

	return NextResponse.json({ 
		message: "success"
	})
}
