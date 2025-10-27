import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FiX, FiUser, FiMail, FiLock } from 'react-icons/fi';

interface AuthModalProps {
	onClose: () => void;
}

export const AuthModal = ({ onClose }: AuthModalProps) => {
	const [mode, setMode] = useState<'login' | 'register'>('login');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const { login, register, loginAsGuest } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (mode === 'login') {
				await login(email, password);
			} else {
				await register(username, email, password);
			}
			onClose();
		} catch {
			// Error is handled in AuthProvider with toast
		} finally {
			setIsLoading(false);
		}
	};

	const handleGuestLogin = async () => {
		setIsLoading(true);
		try {
			await loginAsGuest();
			onClose();
		} catch {
			// Error is handled in AuthProvider
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/30 relative">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
				>
					<FiX size={24} />
				</button>

				{/* Header */}
				<div className="p-6 border-b border-purple-500/30">
					<h2 className="text-2xl font-bold text-white mb-2">
						{mode === 'login' ? 'Welcome Back!' : 'Create Account'}
					</h2>
					<p className="text-purple-300 text-sm">
						{mode === 'login'
							? 'Login to continue chatting with your waifu'
							: 'Register to save your conversations'}
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{mode === 'register' && (
						<div>
							<label className="block text-purple-200 text-sm font-medium mb-2">
								<FiUser className="inline mr-2" />
								Username
							</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								className="w-full bg-slate-800/80 text-white px-4 py-3 rounded-xl border border-purple-500/30 focus:outline-none focus:border-purple-500 transition-colors"
								placeholder="Choose a username"
							/>
						</div>
					)}

					<div>
						<label className="block text-purple-200 text-sm font-medium mb-2">
							<FiMail className="inline mr-2" />
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full bg-slate-800/80 text-white px-4 py-3 rounded-xl border border-purple-500/30 focus:outline-none focus:border-purple-500 transition-colors"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<label className="block text-purple-200 text-sm font-medium mb-2">
							<FiLock className="inline mr-2" />
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={6}
							className="w-full bg-slate-800/80 text-white px-4 py-3 rounded-xl border border-purple-500/30 focus:outline-none focus:border-purple-500 transition-colors"
							placeholder="••••••••"
						/>
						{mode === 'register' && (
							<p className="text-purple-300/70 text-xs mt-1">
								Minimum 6 characters
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-transform"
					>
						{isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
					</button>
				</form>

				{/* Footer */}
				<div className="p-6 border-t border-purple-500/30 space-y-3">
					<button
						onClick={handleGuestLogin}
						disabled={isLoading}
						className="w-full bg-slate-800/80 text-purple-200 py-3 rounded-xl font-medium hover:bg-slate-700/80 disabled:opacity-50 transition-colors border border-purple-500/30"
					>
						Continue as Guest
					</button>

					<p className="text-center text-purple-300 text-sm">
						{mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
						<button
							type="button"
							onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
							className="text-pink-400 hover:text-pink-300 font-semibold"
						>
							{mode === 'login' ? 'Register' : 'Login'}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};
