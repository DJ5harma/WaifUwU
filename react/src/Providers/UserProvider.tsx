import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

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

	useEffect(() => {
		if (!username) {
			const stored_username = localStorage.getItem("username");
			if (stored_username) setUsername(username);
		}
	}, [username]);

	return (
		<ctx.Provider value={{ username, setUsername }}>{children}</ctx.Provider>
	);
};

export const useUser = () => useContext(ctx);
