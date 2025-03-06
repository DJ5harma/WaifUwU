import "./App.css";
import { ToastContainer } from "react-toastify";
import { Waifu } from "./Components/Waifu";
import { Form } from "./Components/Form";
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
			{/* <Waifu /> */}
			<UserProvider>
				<FloatWrapper>
					<Form />
				</FloatWrapper>
			</UserProvider>
		</>
	);
}

export default App;
