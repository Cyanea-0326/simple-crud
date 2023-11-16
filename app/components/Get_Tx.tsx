"use client"
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react'

interface history_elements {
	tx_id: number,
	bet_amount: number,
	pay_off: number,
	result: number,
	total_result: number
}

export function Get_Tx() {
	const [user, setUser] = useState('');
	const [pin, setPin] = useState('');
	const [transactions, setTransactions] = useState<history_elements[]>([]);

	const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUser(e.target.value);
	};
	const handlePinChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPin(e.target.value);
	};

	// useEffect(() => {
	// 	const stored_data_string = sessionStorage.getItem('tx_history');
	// 	if (stored_data_string !== null && stored_data_string !== undefined) {
	// 		const stored_data = JSON.parse(stored_data_string);
	// 		setTransactions(stored_data);
	// 	} else {
	// 		console.log('Data not found in sessionStorage');
	// 	}
	// }, []);

	
	const handleGetTx = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!isFormValid) {
			alert("入力形式を確認してください");
			return ;
		}
		
			try {
				console.log(process.env.API_URL);
				const response = await fetch(`${process.env.API_URL}/api/functions/get_tx`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						u_name: user,
						pin: pin
					}),
				});
				
				if (response.ok) {
					const res = await response.json();
					console.log('Server response:', res);
					
					if (res && res.tx_history) {
						setTransactions(res.tx_history);
						sessionStorage.setItem('tx_hitory', JSON.stringify(res.tx_history));
					} else {
						console.error('Invalid server response:', res);
					}
					alert(res.message);
				} else {
					const res = await response.json();
					console.log('Server response:', res);
					
					alert(res.message);
				};
			} catch (error) {
				console.log(error);
				alert(`${error}\nPls check status-code`);
			};
			
		};
		
		const isFormValid = (user.trim() !== '' && pin.trim() !== '' && isValidPin(pin));
		
		function isValidPin(pin: string) {
			const pinPattern = /^[0-9]{4}$/;
			return pinPattern.test(pin);
		}

	return (
		<div className=''>
				<div className="p-2 bg-white rounded-b-xl shadow-lg">
					<div className='flex flex-col items-center'>
					<p className='font-bold border-b border-gray-800'>GET TRANSACTION</p>
						<form onSubmit={handleGetTx} className='pt-4 flex flex-col place-items-center'>
						<label>
							<span>USER</span>
							<input type="user" value={user} onChange={handleUserChange} 
							className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
							placeholder="Enter name"/>
						</label>
						<label>
							<span>PIN</span>
							<input type="pin" value={pin} onChange={handlePinChange} maxLength={4} pattern="[0-9]{4}"
							className="flex place-items-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
							placeholder="Enter PIN"/>
						</label>
							<div className='pt-4 pb-2'>
								<button type="submit"
								className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">
								GET</button>
							</div>
						</form>
				</div>
			</div>
			{/* Txlist の表示 */}
				<div className="mt-10 p-2 max-w-full mx-auto bg-white rounded-xl shadow-lg">
					<div className='flex flex-col items-center'>

						<div className='mt-4 overflow-x-auto'>
							<p className='font-bold'>TRANSACTIONS</p>
						</div>
						<table className="bg-white transform scale-75">
							<thead>
								<tr className="border-t border-b border-gray-300">
									<th className="py-2 px-4 border-r border-l border-gray-300 text-center">TX_ID</th>
									<th className="py-2 px-4 border-r border-gray-300 text-center">Bet Amount</th>
									<th className="py-2 px-4 border-r border-gray-300 text-center">PayOff</th>
									<th className="py-2 px-4 border-r border-gray-300 text-center">Result</th>
									<th className="py-2 px-4 border-r border-gray-300 text-center">Total Result</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map((transaction) => (
									<tr key={transaction.tx_id} className="border border-gray-300">
									<td className="py-2 px-4 border-r border-gray-300 text-center">{transaction.tx_id}</td>
									<td className="py-2 px-4 border-r border-gray-300 text-center">{transaction.bet_amount}</td>
									<td className="py-2 px-4 border-r border-gray-300 text-center">{transaction.pay_off}</td>
									<td className="py-2 px-4 border-r border-gray-300 text-center">{transaction.result}</td>
									<td className="py-2 px-4 text-center">{transaction.total_result}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
		</div>
	);
}