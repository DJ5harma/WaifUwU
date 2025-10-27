import { ToastContainer } from "react-toastify";
import { Waifu } from "./Components/Waifu";
import { BrowserRouter } from "react-router-dom";
import { WaifuProvider } from "./Providers/WaifuProvider";

function App() {
	return (
		<>
			<ToastContainer
				closeButton
				position="bottom-center"
				stacked
				toastStyle={{ backgroundColor: "rgb(10, 10, 44)", color: "white" }}
			/>
			<WaifuProvider>
				<BrowserRouter>
					<Waifu />
				</BrowserRouter>
			</WaifuProvider>
		</>
	);
}

export default App;
