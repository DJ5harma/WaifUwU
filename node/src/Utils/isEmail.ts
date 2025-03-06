export function isEmail(email: string) {
	// will add a better mechanism, this is only for dev purposes
	for (let i = 0; i < email.length - 1; ++i) if (email[i] === "@") return true;
	return false;
}
