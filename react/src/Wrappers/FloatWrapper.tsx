import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from "react";
import "../Animations/FloatWrapperAnimations.css";
import { Form } from "../Components/Form";

type Component = "Form" | null;

type Context = {
	currentChild: Component;
	setCurrentChild: Dispatch<SetStateAction<Component>>;
};

const ctx = createContext<Context>({
	currentChild: null,
	setCurrentChild: () => {},
});

export const FloatWrapper = ({ children }: { children: ReactNode }) => {
	const [currentChild, setCurrentChild] = useState<Component>("Form");

	const show = () => {
		switch (currentChild) {
			case "Form":
				return <Form />;
			default:
				return null;
		}
	};

	return (
		<ctx.Provider value={{ currentChild, setCurrentChild }}>
			{currentChild === null ? null : (
				<div
					className="FloatWrapper fixed top-0 left-0 w-screen h-screen flex flex-col justify-end items-start p-4 z-10"
					style={{
						backgroundColor: "rgba(0,0,0,0.5)",
					}}
				>
					<div
						className="p-10 rounded-xl shadow-2xl shadow-amber-600 [&>div]:text-white"
						style={{
							backgroundImage:
								"linear-gradient(to right, rgb(11, 27, 97), rgb(55, 13, 99))",
						}}
					>
						{show()}
					</div>
				</div>
			)}
			{children}
		</ctx.Provider>
	);
};

export const useFloatWrapper = () => useContext(ctx);
