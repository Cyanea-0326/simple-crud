import { SwitchComponents } from "./components/SwitchComponents";

export default async function Index() {
	// const response = await fetch('http://localhost:3000/api');
	// if (!response) {
	// 	console.log(response, "a");
	// }
	// const data = await response.json();

	return (
		<main className="">
			<div className="">
					<SwitchComponents />
			</div>
		</main>
	);
}
