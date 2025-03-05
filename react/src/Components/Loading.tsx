import { useEffect } from "react";
import { toast } from "react-toastify";

export const Loading = ({
	loading_message,
	success,
}: {
	loading_message?: string;
	success?: string;
}) => {
	useEffect(() => {
		const loading = toast.loading(loading_message || "Loading...");
		return () => {
			toast.success(success || "Success!");
			toast.dismiss(loading);
		};
	}, []);
	return null;
};
