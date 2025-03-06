import axios from "axios";
import { toast } from "react-toastify";

const base = "http://localhost:4000";
const api = axios.create({ baseURL: base });

export const request = async (endpoint: string, payload: Object) => {
	try {
		const data = (await api.post(endpoint, payload)).data;

		if (data.error) {
			toast.error(data.error);
			return null;
		}

		return data;
	} catch (err) {
		toast.error("Something went wrong! Please try again.");
		return null;
	}
};

export const url = {
	//
	user_register: base + "/user/register",
	user_login: base + "/user/login",
	//
	ai_send_message: base + "/ai/send_message",
	ai_obtain_tts_tokens: base + "/ai/obtain_tts_tokens",
};
