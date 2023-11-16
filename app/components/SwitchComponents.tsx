"use client"
import React, { useState, useEffect } from 'react'

import { Regist } from "./Regist";
import { Add_Tx } from "./Add_Tx";
import { Get_Tx } from "./Get_Tx";
import { Edit_Tx } from "./Edit_Tx";
import { Exit } from "./Exit";

export const SwitchComponents = () => {
	const [showfunc, setShowFunc] = useState('Regist');

	useEffect(() => {
		const storedShowFunc = localStorage.getItem('showfunc');
		if (storedShowFunc) {
			setShowFunc(storedShowFunc);
		}
	}, []);

	// function get_ss_value() {
	// 	const stored_data_string = sessionStorage.getItem('tx_history');
	// 	if (stored_data_string !== null && stored_data_string !== undefined) {
	// 		const stored_data = JSON.parse(stored_data_string);
	// 		return stored_data;
	// 	} else {
	// 		console.log('Data not found in sessionStorage');
	// 	}
	// }

	const handleShowfuncChange = (component: string) => {
		localStorage.setItem('showfunc', component);
		setShowFunc(component);
	}

	return (
		<div className="bg-gray-100">
			<div className='p-20 max-w-xl mx-auto bg-gray-100 rounded-xl text-cyan-800'>
				<div className='flex justify-between'>
					<button onClick={() => handleShowfuncChange('Regist')} className='p-2 border-b border-emerald-500 bg-white rounded-t-xl flex-1'>REGIST</button>
					<button onClick={() => handleShowfuncChange('Add_Tx')} className='p-2 border-b border-emerald-500 bg-white rounded-t-xl flex-1'>ADD</button>
					<button onClick={() => handleShowfuncChange('Get_Tx')} className='p-2 border-b border-emerald-500 bg-white rounded-t-xl flex-1'>GET</button>
					<button onClick={() => handleShowfuncChange('Edit_Tx')} className='p-2 border-b border-emerald-500 bg-white rounded-t-xl flex-1'>EDIT</button>
					<button onClick={() => handleShowfuncChange('Exit')} className='p-2 border-b border-emerald-500 bg-white rounded-t-xl flex-1'>EXIT</button>
				</div>

				{showfunc === 'Regist' && <Regist />}
				{showfunc === 'Add_Tx' && <Add_Tx />}
				{showfunc === 'Get_Tx' && <Get_Tx />}
				{showfunc === 'Edit_Tx' && <Edit_Tx />}
				{showfunc === 'Exit' && <Exit />}
			</div>
		</div>
	)
}