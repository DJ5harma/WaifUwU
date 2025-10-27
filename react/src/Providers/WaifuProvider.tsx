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
		const itvl = setInterval(() => {
			setCurrentAnimation((p) => {
				switch (p) {
					case "Greeting":
						return "Idle";
					case "Idle":
						return "Shy";
					case "Shy":
						return "Angry";
					case "Angry":
						return "Greeting";
					default:
						return "Idle";
				}
			});
			// console.log("interval ran");
		}, 12000);

		return () => {
			clearInterval(itvl);
		};
	}, []);

	return (
		<ctx.Provider value={{ currentAnimation, setCurrentAnimation }}>
			{children}
		</ctx.Provider>
	);
};

export const useWaifu = () => useContext(ctx);
