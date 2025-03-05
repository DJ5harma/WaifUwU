import { Request, Response } from "express";
import { USER } from "../../../Database/USER";
import { sign } from "jsonwebtoken";

type body = {
	email: string;
	password: string;
};

export const c_user_login = async (req: Request, res: Response) => {
	const { email, password } = req.body as body;

	const user = await USER.findOne({ email }).select("_id hashedPassword");

	if (!user || password !== user.hashedPassword)
		throw new Error("Invalid credentials!");

	const auth_token = sign({ _id: user._id }, process.env.JWT_SECRET!);

	res.json({ auth_token });
	return;
};
