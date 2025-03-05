import { Request, Response } from "express";

type body = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const minPasswordLength = 8;

export function c_user_register(req: Request, res: Response) {
	const { username, password, email, confirmPassword } = req.body as body;

	if (password.length < minPasswordLength)
		throw new Error(`Password shorter than ${minPasswordLength} chars`);

	if (password !== confirmPassword) throw new Error("Passwords mismatch");

	// const user =
}
