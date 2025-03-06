import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

export type WAIFU_ANIMATION_TYPE =
	| "Idle"
	| "Angry"
	| "Shy"
	| "Greeting"
	| "Talking";

const ctx = createContext<{
	currentAnimation: WAIFU_ANIMATION_TYPE;
	setCurrentAnimation: Dispatch<SetStateAction<WAIFU_ANIMATION_TYPE>>;
}>({
	currentAnimation: "Greeting",
	setCurrentAnimation: () => {},
});

export const WaifuProvider = ({ children }: { children: ReactNode }) => {
	const [currentAnimation, setCurrentAnimation] =
		useState<WAIFU_ANIMATION_TYPE>("Greeting");

	useEffect(() => {
		let temp: WAIFU_ANIMATION_TYPE = "Greeting";
		const itvl = setInterval(() => {
			console.log("interval ran");

			switch (temp) {
				case "Greeting": {
					temp = "Idle";
					break;
				}
				case "Idle":
					temp = "Shy";
					setCurrentAnimation("Shy");
					break;
				case "Shy":
					temp = "Angry";
					setCurrentAnimation("Angry");
					break;
				case "Angry":
					temp = "Greeting";
					setCurrentAnimation("Greeting");
					break;
				default:
					break;
			}
			setCurrentAnimation(temp);
		}, 10000);

		return () => {
			clearInterval(itvl);
		};
	}, []);

	useEffect(() => {
		console.log({ currentAnimation });
	}, [currentAnimation]);

	return (
		<ctx.Provider value={{ currentAnimation, setCurrentAnimation }}>
			{children}
		</ctx.Provider>
	);
};

export const useWaifu = () => useContext(ctx);
