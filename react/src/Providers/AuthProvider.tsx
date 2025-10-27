import { createContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User, AuthResponse } from '../services/api';
import { toast } from 'react-toastify';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isGuest: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (username: string, email: string, password: string) => Promise<void>;
	loginAsGuest: () => Promise<void>;
	logout: () => void;
	updateUser: (data: Partial<Pick<User, 'displayName' | 'avatar' | 'preferences'>>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [isGuest, setIsGuest] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Load user on mount
	useEffect(() => {
		loadUser();
	}, []);

	const loadUser = async () => {
		const token = localStorage.getItem('authToken');
		const guestStatus = localStorage.getItem('isGuest') === 'true';
		
		if (!token) {
			setIsLoading(false);
			return;
		}

		try {
			const response = await authAPI.getMe();
			setUser(response.user);
			setIsGuest(guestStatus);
		} catch (error) {
			console.error('Failed to load user:', error);
			localStorage.removeItem('authToken');
			localStorage.removeItem('isGuest');
		} finally {
			setIsLoading(false);
		}
	};

	const saveAuthData = (data: AuthResponse) => {
		localStorage.setItem('authToken', data.token);
		localStorage.setItem('isGuest', String(data.isGuest || false));
		setUser(data.user);
		setIsGuest(data.isGuest || false);
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

	const loginAsGuest = async () => {
		try {
			const data = await authAPI.createGuest();
			saveAuthData(data);
			toast.success('Welcome, Guest!');
		} catch (error) {
			console.error('Guest login failed:', error);
			toast.error('Failed to create guest session.');
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem('authToken');
		localStorage.removeItem('isGuest');
		setUser(null);
		setIsGuest(false);
		toast.info('Logged out successfully');
	};

	const updateUser = async (data: Partial<Pick<User, 'displayName' | 'avatar' | 'preferences'>>) => {
		try {
			const response = await authAPI.updateProfile(data);
			setUser(response.user);
			toast.success('Profile updated successfully');
		} catch (error) {
			console.error('Profile update failed:', error);
			toast.error('Failed to update profile');
			throw error;
		}
	};

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		isGuest,
		isLoading,
		login,
		register,
		loginAsGuest,
		logout,
		updateUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
