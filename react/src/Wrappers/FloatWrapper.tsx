import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from "react";
import "../Animations/FloatWrapperAnimations.css";
import { CONFIG } from "../CONFIG";

type Context = {
	setCurrentChild: Dispatch<SetStateAction<ReactNode>>;
};

const ctx = createContext<Context>({
	setCurrentChild: () => {},
});

export const FloatWrapper = ({ children }: { children: ReactNode }) => {
	const [currentChild, setCurrentChild] = useState<ReactNode>(null);

	return (
		<ctx.Provider value={{ setCurrentChild }}>
			{currentChild === null ? null : (
				<div
					className="FloatWrapper fixed top-0 left-0 w-screen h-screen flex flex-col justify-end items-start p-4 z-10"
					style={{
						backgroundColor: "rgba(0,0,0,0.5)",
					}}
				>
					<div
						className="p-10 rounded-xl [&>div]:text-white"
						style={{
							backgroundImage: CONFIG.GRADIENT_1,
							boxShadow: CONFIG.SHADOW_1,
						}}
					>
						{currentChild}
					</div>
				</div>
			)}
			{children}
		</ctx.Provider>
	);
};

export const useFloatWrapper = () => useContext(ctx);
