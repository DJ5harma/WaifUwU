import "./App.css";
import { ToastContainer } from "react-toastify";
import { Waifu } from "./Components/Waifu";
import { UserProvider } from "./Providers/UserProvider";
import { FloatWrapper } from "./Wrappers/FloatWrapper";
import { BrowserRouter } from "react-router-dom";
import { Nav } from "./Components/Nav";
import { MessageInput } from "./Components/MessageInput";

function App() {
	return (
		<>
			<ToastContainer
				closeButton
				position="bottom-right"
				stacked
				toastStyle={{ backgroundColor: "rgb(10, 10, 44)", color: "white" }}
			/>
			<FloatWrapper>
				<UserProvider>
					<BrowserRouter>
						<>
							<Waifu />
							<Nav />
							<MessageInput />
						</>
					</BrowserRouter>
				</UserProvider>
			</FloatWrapper>
		</>
	);
}

export default App;
