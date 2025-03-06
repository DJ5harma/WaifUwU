import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from "react";

type Context = {
	floatingElement: ReactNode;
	setFloatingElement: Dispatch<SetStateAction<ReactNode>>;
};

const ctx = createContext<Context>({
	floatingElement: null,
	setFloatingElement: () => {},
});

export const GlobalStore = ({ children }: { children: ReactNode }) => {
	const [floatingElement, setFloatingElement] = useState<ReactNode>(null);
	return (
		<ctx.Provider value={{ floatingElement, setFloatingElement }}>
			{children}
		</ctx.Provider>
	);
};

export const useGlobal = () => useContext(ctx);
