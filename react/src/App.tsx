import { ToastContainer } from "react-toastify";
import { Waifu } from "./Components/Waifu";
import { ChatInterface } from "./Components/ChatInterface";
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
					<ChatInterface />
				</BrowserRouter>
			</WaifuProvider>
		</>
	);
}

export default App;
