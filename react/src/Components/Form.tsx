import { useState } from "react";
import { useUser } from "../Providers/UserProvider";
import { api } from "../Systems/api";

export const Form = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [type, setType] = useState<"Login" | "Register">("Register");

	const userHook = useUser();

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
				}
			);
	}

	return (
		<div>
			{type === "Register" && (
				<input
					type="text"
					placeholder="Your name"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			)}
			<input
				type="email"
				placeholder={type === "Register" ? "Your email" : "Registered email"}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				placeholder={
					type === "Register" ? "Make a password" : "Registered password"
				}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			{type === "Register" && (
				<input
					type="password"
					placeholder="Confirm new password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
			)}

			<button onClick={type === "Login" ? handleLogin : handleRegister}>
				{type}
			</button>

			{type === "Register" ? (
				<p>
					Already Registered? <b onClick={() => setType("Login")}>Login!</b>
				</p>
			) : (
				<p>
					New here? <b onClick={() => setType("Register")}>Register!</b>
				</p>
			)}
		</div>
	);
};
