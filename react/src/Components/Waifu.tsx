import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Loading } from "./Loading";
import Waifu1 from "../../public/Waifu1";
import { OrbitControls } from "@react-three/drei";

export const Waifu = () => {
	return (
		<Canvas
			style={{
				border: "solid red",
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
			}}
		>
			<Suspense fallback={<Loading loading_message="Loading 3D model..." />}>
				{(() => {
					return (
						<>
							<Waifu1 scale={0.5} position={[0, -8, 0]} />
							<OrbitControls />
						</>
					);
				})()}
			</Suspense>
		</Canvas>
	);
};
