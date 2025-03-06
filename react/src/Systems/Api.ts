import axios from "axios";
import { toast } from "react-toastify";

const base = "http://localhost:4000";
const Api = axios.create({ baseURL: base });

export class api {
	static url = {
		//
		user_register: base + "/user/register",
		user_login: base + "/user/login",
		//
		ai_send_message: base + "/ai/send_message",
		ai_obtain_tts_tokens: base + "/ai/obtain_tts_tokens",
	};
	static async req(endpoint: string, payload: Object) {
		try {
			const data = (await Api.post(endpoint, payload)).data;

			if (data.error) {
				toast.error(data.error);
				return Promise.reject(data.error);
			}

			return data as Object;
		} catch (err) {
			toast.error("Something went wrong! Please try again.");
			return Promise.reject((err as Error).message);
		}
	}
}

// api.req(api.url.ai_send_message, {}).then((data) => {});
