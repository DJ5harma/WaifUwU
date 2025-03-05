import { Request, Response } from "express";
import { USER } from "../../../Database/USER";
import { genSaltSync, hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { u_user_is_email } from "../utils/u_user_is_email";

type body = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

type result = {
	auth_token: string;
};

const minPasswordLength = 8;

export const c_user_register = async (req: Request, res: Response) => {
	const { username, password, email, confirmPassword } = req.body as body;

	if (!u_user_is_email(email)) throw new Error("Invalid email address");

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

	res.json({ auth_token } as result);
	return;
};
