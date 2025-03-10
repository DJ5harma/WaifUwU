import { BiSend } from "react-icons/bi";
import { CONFIG } from "../CONFIG";
import { useState } from "react";
import { api } from "../Systems/api";
import { Synthesis } from "../Systems/Synthesis";
import { useWaifu, WAIFU_ANIMATION_TYPE } from "../Providers/WaifuProvider";

export const MessageInput = () => {
	const [message, setMessage] = useState("");

	const [aiResponse, setAiResponse] = useState("");

	const { setCurrentAnimation } = useWaifu();

	async function handleSend() {
		api
			.req(
				api.url.ai_send_message,
				{
					message,
					auth_token: localStorage.getItem("auth_token"),
					cache_id: localStorage.getItem("cache_id"),
				},
				"She is thinking..."
			)
			.then(
				async ({
					text,
					emotion,
					cache_id,
				}: {
					text: string;
					emotion: WAIFU_ANIMATION_TYPE;
					cache_id: string;
				}) => {
					setMessage("");
					setAiResponse(text);
					localStorage.setItem("cache_id", cache_id);

					const audio = await Synthesis.get_audio(text);
					audio.play();
					setCurrentAnimation("Talking");

					audio.addEventListener("ended", () => {
						setAiResponse("");
						setCurrentAnimation(emotion);
					});
				}
			);
	}

	return (
		<>
			{aiResponse && (
				<div
					className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center py-4 px-6 rounded-2xl gap-2 w-fit"
					style={{
						backgroundImage: CONFIG.GRADIENT_1,
						boxShadow: CONFIG.SHADOW_1,
						animation: "show 1s forwards",
					}}
				>
					<p>{aiResponse}</p>
				</div>
			)}
			<div
				className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center py-4 px-6 rounded-2xl gap-2 w-fit"
				style={{
					backgroundImage: CONFIG.GRADIENT_1,
					boxShadow: CONFIG.SHADOW_1,
				}}
			>
				<input
					type="text"
					placeholder="Tell her about your day!"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>

				{message && (
					<button
						onClick={handleSend}
						style={{ animation: "show 0.5s forwards" }}
					>
						<BiSend size={30} />
					</button>
				)}
			</div>
		</>
	);
};
