export class CONFIG {
	static readonly GRADIENT_1 =
		"linear-gradient(to right, rgb(11, 27, 97), rgb(55, 13, 99))";
	static readonly SHADOW_1 = "0 0 4px 2px white inset";
	static readonly API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
}
