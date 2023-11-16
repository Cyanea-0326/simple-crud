import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';


export async function GET(req: Request) {
	// const user = { u_name: "John Doe", u_id: "0000" }
	// const users = [
	// 	{ u_name: "John Doe", u_id: 123 },
	// 	{ u_name: "Jane Smith", u_id: 456 },
	// 	{ u_name: "Bob Johnson", u_id: 789 }
	// ];

	// return NextResponse.json( users[2].u_name )
	const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
	console.log(ip)
	// console.log(`${process.env.API_URL}/api/`);
	return NextResponse.json({ ip })

	// const cookieStore = cookies();
	// const supabase = createClient(cookieStore);

	// const applicant = await req.json();
	// console.log("//////////////////////////////////////////////\n\n\n");
	// console.log(applicant);
	// console.log("\n\n\n//////////////////////////////////////////////");
}
