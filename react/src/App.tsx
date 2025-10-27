import { ToastContainer } from "react-toastify";
import { Waifu } from "./Components/Waifu";
import { ChatInterface } from "./Components/ChatInterface";
import { UserMenu } from "./Components/UserMenu";
import { BrowserRouter } from "react-router-dom";
import { WaifuProvider } from "./Providers/WaifuProvider";
import { AuthProvider } from "./Providers/AuthProvider";

function App() {
	return (
		<>
			<ToastContainer
				closeButton
				position="bottom-center"
				stacked
				toastStyle={{ backgroundColor: "rgb(10, 10, 44)", color: "white" }}
			/>
			<AuthProvider>
				<WaifuProvider>
					<BrowserRouter>
						<UserMenu />
						<Waifu />
						<ChatInterface />
					</BrowserRouter>
				</WaifuProvider>
			</AuthProvider>
		</>
	);
}

export default App;
