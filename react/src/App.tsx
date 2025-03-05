import "./App.css";
import { ToastContainer } from "react-toastify";
import Waifu from "./Components/Waifu";

function App() {
	return (
		<>
			<ToastContainer
				closeButton
				position="top-center"
				stacked
				toastStyle={{ backgroundColor: "rgb(10, 10, 44)", color: "white" }}
			/>
			<Waifu />
		</>
	);
}

export default App;
