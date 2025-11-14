import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

interface AuthModalProps {
	onClose: () => void;
}

export const AuthModal = ({ onClose }: AuthModalProps) => {
	const [mode, setMode] = useState<'login' | 'register'>('login');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const { login, register } = useAuth();

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


	return (
		<div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-slide-in-left">
			<div className="bg-gradient-to-br from-slate-900/50 to-purple-900/50 backdrop-blur-3xl rounded-3xl shadow-2xl border border-purple-500/30 relative animate-glow-pulse"
				style={{ 
					boxShadow: '0 0 100px rgba(168, 85, 247, 0.4), inset 0 0 100px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
					background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(88, 28, 135, 0.5) 100%)'
				}}
			>

				{/* Header */}
				<div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
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
								className="w-full bg-slate-800/30 backdrop-blur-xl text-white px-4 py-3 rounded-xl border border-purple-500/20 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-lg"
								style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}
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
							className="w-full bg-slate-800/30 backdrop-blur-xl text-white px-4 py-3 rounded-xl border border-purple-500/20 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-lg"
							style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}
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
							className="w-full bg-slate-800/30 backdrop-blur-xl text-white px-4 py-3 rounded-xl border border-purple-500/20 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-lg"
							style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}
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
						className="w-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-transform border border-purple-400/30 shadow-lg shadow-purple-500/20"
						style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)' }}
					>
						{isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
					</button>
				</form>

				{/* Footer */}
				<div className="p-6 border-t border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
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
