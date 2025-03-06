import { BiSend } from "react-icons/bi";
import { CONFIG } from "../CONFIG";

export const MessageInput = () => {
	return (
		<div
			className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center py-4 px-6 rounded-2xl gap-2 w-fit"
			style={{
				backgroundImage: CONFIG.GRADIENT_1,
				boxShadow: CONFIG.SHADOW_1,
			}}
		>
			<input type="text" placeholder="Tell her about your day!" />
			<button>
				<BiSend size={30} />
			</button>
		</div>
	);
};
