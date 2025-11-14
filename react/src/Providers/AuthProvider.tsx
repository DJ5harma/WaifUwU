import { createContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User, AuthResponse } from '../services/api';
import { toast } from 'react-toastify';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (username: string, email: string, password: string) => Promise<void>;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Load user on mount
	useEffect(() => {
		loadUser();
	}, []);

	const loadUser = async () => {
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			setIsLoading(false);
			return;
		}

		try {
			const response = await authAPI.getMe();
			setUser(response.user);
		} catch (error) {
			console.error('Failed to load user:', error);
			localStorage.removeItem('authToken');
		} finally {
			setIsLoading(false);
		}
	};

	const saveAuthData = (data: AuthResponse) => {
		localStorage.setItem('authToken', data.token);
		setUser(data.user);
	};

	const login = async (email: string, password: string) => {
		try {
			const data = await authAPI.login(email, password);
			saveAuthData(data);
			toast.success(`Welcome back, ${data.user.displayName || data.user.username}!`);
		} catch (error) {
			console.error('Login failed:', error);
			toast.error('Login failed. Please check your credentials.');
			throw error;
		}
	};

	const register = async (username: string, email: string, password: string) => {
		try {
			const data = await authAPI.register(username, email, password);
			saveAuthData(data);
			toast.success(`Welcome, ${data.user.username}!`);
		} catch (error) {
			console.error('Registration failed:', error);
			toast.error('Registration failed. Please try again.');
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem('authToken');
		setUser(null);
		toast.info('Logged out successfully');
	};

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login,
		register,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
