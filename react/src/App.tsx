import "./Animations.css";
import { ToastContainer } from "react-toastify";
import { Waifu } from "./Components/Waifu";
import { UserProvider } from "./Providers/UserProvider";
import { FloatWrapper } from "./Wrappers/FloatWrapper";
import { BrowserRouter } from "react-router-dom";
import { Nav } from "./Components/Nav";
import { MessageInput } from "./Components/MessageInput";
import { WaifuProvider } from "./Providers/WaifuProvider";
import { GlobalStore } from "./Providers/GlobalStore";

function App() {
	return (
		<>
			<ToastContainer
				closeButton
				position="top-right"
				stacked
				toastStyle={{ backgroundColor: "rgb(10, 10, 44)", color: "white" }}
			/>
			<GlobalStore>
				<UserProvider>
					<FloatWrapper>
						<WaifuProvider>
							<BrowserRouter>
								<>
									<Waifu />
									<Nav />
									<MessageInput />
								</>
							</BrowserRouter>
						</WaifuProvider>
					</FloatWrapper>
				</UserProvider>
			</GlobalStore>
		</>
	);
}

export default App;
