import { Request, Response } from "express";
import { USER } from "../../../Database/USER";
import { sign } from "jsonwebtoken";
import { compareSync } from "bcryptjs";
import { isEmail } from "../../../Utils/isEmail";

type body = {
	email: string;
	password: string;
};

type result = {
	auth_token: string;
	username: string;
};

export const c_user_login = async (req: Request, res: Response) => {
	const { email, password } = req.body as body;

	if (!isEmail(email)) throw new Error("Invalid email address");

	const user = await USER.findOne({ email }).select(
		"_id hashedPassword username"
	);

	if (!user || !compareSync(password, user.hashedPassword))
		throw new Error("Invalid credentials!");

	const auth_token = sign({ _id: user._id }, process.env.JWT_SECRET!);

	console.log(user.username);

	res.json({ auth_token, username: user.username } as result);
	return;
};
