"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'

export const Add_Tx = () => {
		const [user, setUser] = useState<string>('');
		const [pin, setPin] = useState<string>('');
		const [bet, setbet] = useState<string>('');
		const [payoff, setpayoff] = useState<string>('');


		const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
			setUser(event.target.value);
		};
		const handlePinChange = (event: ChangeEvent<HTMLInputElement>) => {
			setPin(event.target.value);
		};
		const handleBetChange = (event: ChangeEvent<HTMLInputElement>) => {
			setbet(event.target.value);
		};
		const handlePayoffChange = (event: ChangeEvent<HTMLInputElement>) => {
			setpayoff(event.target.value);
		};


		const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			if (!isFormValid) {
				alert("入力形式を確認してください");
				return ;
			}

			try {
				const response = await fetch(`/api/functions/add_tx`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						u_name: user,
						pin: pin,
						bet: bet,
						payoff: payoff
					}),
				});

				if (response.ok) {
					const res = await response.json();
					console.log('Server response:', res);
					
					alert(res.message);
				} else {
					console.error('Failed to save bet & payoff')
					const res = await response.json();
					console.log('Server response:', res);
					
					alert(res.message);
				}
				} catch (error) {
					console.error('Error:', error);
					alert(`${error}\nPls check status-code`);
				}
			};
	
	const isFormValid = user.trim() !== '' && pin.trim() !== '' && bet.trim() !== '' && payoff.trim() !== '';

	return (
		<div className="p-2 bg-white rounded-b-xl shadow-lg">
			<div className='flex flex-col items-center'>
			<p className='font-bold border-b border-gray-800'>SUBMIT TRANSACTION</p>
				<form onSubmit={handleSubmit} className='pt-4 flex flex-col place-items-center'>
					<label>
					<span>USER</span>
					<input type="user" value={user} onChange={handleUserChange}
					className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
					placeholder="Enter name" />
					</label>
					<label>
					<span>PIN</span>
					<input type="pin" value={pin} onChange={handlePinChange} 
					className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
					placeholder="Enter PIN"/>
					</label>
					<label>
					<span>BET</span>
					<input type="bet" value={bet} onChange={handleBetChange} 
					className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
					placeholder="Enter"/>
					</label>
					<label>
					<span>PAYOFF</span>
					<input type="payoff" value={payoff} onChange={handlePayoffChange} 
					className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
					placeholder="Enter"/>
					</label>
					<div className='pt-4 pb-2'>
						<button type="submit" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">
						SUBMIT</button>
					</div>
				</form>
			</div>
		</div>
	);
}