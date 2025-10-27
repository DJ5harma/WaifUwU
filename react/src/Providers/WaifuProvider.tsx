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

	// Initial greeting animation, then switch to Idle
	useEffect(() => {
		const timer = setTimeout(() => {
			setCurrentAnimation("Idle");
		}, 3000);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	return (
		<ctx.Provider value={{ currentAnimation, setCurrentAnimation }}>
			{children}
		</ctx.Provider>
	);
};

export const useWaifu = () => useContext(ctx);
