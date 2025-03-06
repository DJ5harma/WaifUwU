import { Speechify } from "@speechify/api-sdk";
import { api } from "./api";
import { toast } from "react-toastify";

export class Synthesis {
	private static speechify = new Speechify({});
	private static tts_obj: { token: string; expiry: number } = {
		token: "",
		expiry: -1,
	};

	static init = () => {
		const stored_token = localStorage.getItem("tts_obj");
		if (stored_token) {
			this.tts_obj = JSON.parse(stored_token);
			if (this.tts_obj.expiry < Date.now()) this.ensure_token();
		} else {
			this.ensure_token();
		}
	};

	static ensure_token = async () => {
		const fetch_tts_token = async () => {
			const auth_token = localStorage.getItem("auth_token");
			if (!auth_token) return false;
			await api
				.req(api.url.ai_obtain_tts_token, { auth_token })
				.then((tts_obj: { token: string; expiry: number }) => {
					Synthesis.tts_obj = tts_obj;
					localStorage.setItem("tts_obj", JSON.stringify(tts_obj));
				});
		};
		if (this.tts_obj.expiry < Date.now()) {
			await fetch_tts_token();
		}
	};

	static get_audio = async (text: string) => {
		await this.ensure_token();
		this.speechify.setAccessToken(this.tts_obj.token);

		const temp = toast.loading("She is about to speak...");

		const response = await this.speechify.audioGenerate({
			input: text,
			voiceId: "kristy",
			audioFormat: "mp3",
		});
		toast.dismiss(temp);

		const audio = response.audioData;

		const audioElement = new Audio();
		audioElement.src = URL.createObjectURL(
			new Blob([audio], { type: "audio/mpeg" })
		);

		return audioElement;
	};
}
