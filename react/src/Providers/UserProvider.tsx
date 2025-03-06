import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { useFloatWrapper } from "../Wrappers/FloatWrapper";
import { Form } from "../Components/Form";

type Context = {
	username: string;
	setUsername: Dispatch<SetStateAction<string>>;
};

const ctx = createContext<Context>({
	username: "",
	setUsername: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [username, setUsername] = useState("");

	const { setCurrentChild } = useFloatWrapper();

	useEffect(() => {
		if (!username.length) localStorage.setItem("username", username);
	}, [username]);

	useEffect(() => {
		const auth_token = localStorage.getItem("auth_token");
		if (!auth_token) return setCurrentChild(<Form />);

		const stored_username = localStorage.getItem("username");
		if (stored_username) setUsername(username);
	}, []);

	return (
		<ctx.Provider value={{ username, setUsername }}>{children}</ctx.Provider>
	);
};

export const useUser = () => useContext(ctx);
