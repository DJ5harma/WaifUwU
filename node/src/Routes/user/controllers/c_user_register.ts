import { Request, Response } from "express";
import { USER } from "../../../Database/USER";
import { genSaltSync, hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";

type body = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const minPasswordLength = 8;

export const c_user_register = async (req: Request, res: Response) => {
	const { username, password, email, confirmPassword } = req.body as body;

	if (password.length < minPasswordLength)
		throw new Error(`Password shorter than ${minPasswordLength} chars`);

	if (password !== confirmPassword) throw new Error("Passwords mismatch");

	if (await USER.exists({ email })) throw new Error("Email already registered");

	const hashedPassword = hashSync(password, genSaltSync(10));
	const user = new USER({
		username,
		hashedPassword,
		email,
	});

	const auth_token = sign({ _id: user._id }, process.env.JWT_SECRET!);

	res.json({ auth_token });
	return;
};
