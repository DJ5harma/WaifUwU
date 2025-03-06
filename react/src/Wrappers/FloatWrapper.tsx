import { ReactNode } from "react";
import { CONFIG } from "../CONFIG";
import { useGlobal } from "../Providers/GlobalStore";

export const FloatWrapper = ({ children }: { children: ReactNode }) => {
	const { floatingElement } = useGlobal();

	return (
		<>
			{floatingElement === null ? null : (
				<div
					className="FloatWrapper fixed top-0 left-0 w-screen h-screen flex flex-col justify-end items-start p-4 z-10"
					style={{
						backgroundColor: "rgba(0,0,0,0.5)",
						animation: "flicker 1s infinite",
					}}
				>
					<div
						className="p-10 rounded-xl [&>div]:text-white"
						style={{
							backgroundImage: CONFIG.GRADIENT_1,
							boxShadow: CONFIG.SHADOW_1,
						}}
					>
						{floatingElement}
					</div>
				</div>
			)}
			{children}
		</>
	);
};
