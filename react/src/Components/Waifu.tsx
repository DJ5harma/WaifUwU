import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Loading } from "./Loading";
// import Waifu1 from "../../public/Waifu1";
import { Environment, OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar";

export const Waifu = () => {
	return (
		<Canvas
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
			}}
			shadows
			camera={{ fov: 15 }}
		>
			<Suspense fallback={<Loading loading_message="Loading 3D model..." />}>
				<OrbitControls />

				<Avatar position={[0, -1.5, 1]} />
				<Environment preset="sunset" />
			</Suspense>
		</Canvas>
	);
};
