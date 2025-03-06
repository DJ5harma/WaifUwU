import "./App.css";
import { ToastContainer } from "react-toastify";
import { Waifu } from "./Components/Waifu";
import { UserProvider } from "./Providers/UserProvider";
import { FloatWrapper } from "./Wrappers/FloatWrapper";

function App() {
	return (
		<>
			<ToastContainer
				closeButton
				position="top-center"
				stacked
				toastStyle={{ backgroundColor: "rgb(10, 10, 44)", color: "white" }}
			/>
			<UserProvider>
				<FloatWrapper>
					<>{/* <Waifu /> */}</>
				</FloatWrapper>
			</UserProvider>
		</>
	);
}

export default App;
