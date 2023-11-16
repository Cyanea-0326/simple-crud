"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'

export const Regist = () => {
	const [regist_user, setRegistUser] = useState<string>('');
	const [pin, setPin] = useState<string>('');

	const handleRegistUserChange = (event: ChangeEvent<HTMLInputElement>) => {
		setRegistUser(event.target.value);
	};
	const handlePinChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPin(event.target.value);
	};

	
	const handleRegist = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!isRegistFormValid) {
			alert("入力形式を確認してください");
			return ;
		}

		try {
			const response = await fetch(`${process.env.API_URL}/api/functions/regist`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					u_name: regist_user,
					pin: pin
				}),
			});
		if (response.ok) {
			const res = await response.json();
			console.log('Server response:', res);

			alert(res.message);
		} else {
			const res = await response.json();
			console.log('Server response:', res);

			alert(res.message);
		}
		} catch (error) {
			console.error('Error:', error);
			alert(`${error}\nPls check status-code`);
		}
	}

	const isRegistFormValid = (regist_user.trim() !== '' && pin.trim() !== '' && isValidPin(pin));

	function isValidPin(pin: string) {
		const pinPattern = /^[0-9]{4}$/;
		return pinPattern.test(pin);
	}

	return (
		<div className="p-2 bg-white rounded-b-xl shadow-lg text-cyan-800">
			<div className='flex flex-col items-center'>
			<p className='font-bold border-b border-gray-800'>REGIST USER</p>
				<form onSubmit={handleRegist} className='pt-4 flex flex-col place-items-center'>
				<label>
					<span>USER_NAME</span>
					<input type="regist_user" value={regist_user} onChange={handleRegistUserChange} 
					className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
					placeholder="Enter name"/>
				</label>
				<label>
					<span>PIN</span>
					<input type="pin" value={pin} onChange={handlePinChange} maxLength={4} pattern="[0-9]{4}"
					className="flex place-items-center p border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
					placeholder="Enter 4 numbers"/>
				</label>
					<div className='pt-4 pb-2'>
						<button type="submit"
						className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">REGIST</button>
					</div>
				</form>
			</div>
		</div>
	)
}
