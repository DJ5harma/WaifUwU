import "./App.css";
import { ToastContainer } from "react-toastify";
import { Waifu } from "./Components/Waifu";
import { UserProvider } from "./Providers/UserProvider";
import { FloatWrapper } from "./Wrappers/FloatWrapper";
import { BrowserRouter } from "react-router-dom";
import { Nav } from "./Components/Nav";

function App() {
	return (
		<>
			<ToastContainer
				closeButton
				position="top-center"
				stacked
				toastStyle={{ backgroundColor: "rgb(10, 10, 44)", color: "white" }}
			/>
			<FloatWrapper>
				<UserProvider>
					<BrowserRouter>
						<>
							<Waifu />
							<Nav />
						</>
					</BrowserRouter>
				</UserProvider>
			</FloatWrapper>
		</>
	);
}

export default App;
