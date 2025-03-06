import { Speechify } from "@speechify/api-sdk";
import { Queue } from "../Utils/Queue";
import { api } from "./api";

export class Synthesis {
	private static speechify_tokens_queue = new Queue();

	private static speechify = new Speechify({});

	static async init() {}

	static get_token = async () => {
		const fetcher = async () => {
			await api
				.req(api.url.ai_obtain_tts_tokens, { auth_token })
				.then(({ tts_tokens }: { tts_tokens: string[] }) => {
					tts_tokens.forEach((t) => {
						Synthesis.speechify_tokens_queue.enqueue(t);
					});
				});
		};

		const auth_token = localStorage.getItem("auth_token");
		if (!auth_token) return false;

		const cnt = this.speechify_tokens_queue.size();

		if (cnt === 0) await fetcher();
		else if (cnt < 3) fetcher();

		const token = this.speechify_tokens_queue.peek();
		this.speechify_tokens_queue.dequeue();

		return token;
	};

	static get_audio = async (text: string) => {
		this.speechify.setAccessToken(await this.get_token());

		const response = await this.speechify.audioGenerate({
			input: text,
			voiceId: "kristy",
			audioFormat: "mp3",
		});

		const audio = response.audioData;

		const audioElement = new Audio();
		audioElement.src = URL.createObjectURL(
			new Blob([audio], { type: "audio/mpeg" })
		);

		return audioElement;
	};
}
