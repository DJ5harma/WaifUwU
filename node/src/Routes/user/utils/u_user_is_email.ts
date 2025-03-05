export function u_user_is_email(email: string) {
	// will add a better system to also include 2FA, this is only for dev purposes
	for (let i = 0; i < email.length - 1; ++i) if (email[i] === "@") return true;
	return false;
}
