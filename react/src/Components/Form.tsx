import { useState } from "react";
import { useUser } from "../Providers/UserProvider";
import { api } from "../Systems/api";
import { useFloatWrapper } from "../Wrappers/FloatWrapper";

export const Form = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [type, setType] = useState<"Login" | "Register">("Register");

	const userHook = useUser();
	const { setCurrentChild } = useFloatWrapper();

	function handleRegister() {
		api
			.req(api.url.user_register, {
				username,
				email,
				password,
				confirmPassword,
			})
			.then(({ auth_token }: { auth_token: string }) => {
				userHook.setUsername(username);
				localStorage.setItem("auth_token", auth_token);
				setCurrentChild(null);
			});
	}

	function handleLogin() {
		api
			.req(api.url.user_login, {
				email,
				password,
			})
			.then(
				({
					auth_token,
					username,
				}: {
					auth_token: string;
					username: string;
				}) => {
					userHook.setUsername(username);
					localStorage.setItem("auth_token", auth_token);
					setCurrentChild(null);
				}
			);
	}

	return (
		<div className="flex flex-col gap-4 items-center">
			<h1>
				Welcome to{" "}
				<b className="text-fuchsia-200 bg-black p-2 rounded-2xl text-xl">
					WaifUwU 😍
				</b>
			</h1>
			{type === "Register" && (
				<input
					type="text"
					placeholder="Name"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			)}
			<input
				type="email"
				placeholder={type === "Register" ? "Email" : "Registered Email"}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				placeholder={
					type === "Register" ? "Make a new Password" : "Registered Password"
				}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			{type === "Register" && (
				<input
					type="password"
					placeholder="Confirm new Password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
			)}

			<button
				className="w-full"
				onClick={type === "Login" ? handleLogin : handleRegister}
			>
				{type}
			</button>

			{type === "Register" ? (
				<p>
					Already Registered?{" "}
					<b className="cursor-pointer" onClick={() => setType("Login")}>
						Login!
					</b>
				</p>
			) : (
				<p>
					New here?{" "}
					<b className="cursor-pointer" onClick={() => setType("Register")}>
						Register!
					</b>
				</p>
			)}
		</div>
	);
};
