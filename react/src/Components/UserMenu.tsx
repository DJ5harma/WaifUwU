import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';
import { FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

export const UserMenu = () => {
	const { user, isAuthenticated, isGuest, logout } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	if (!isAuthenticated) {
		return (
			<>
				<button
					onClick={() => setShowAuthModal(true)}
					className="fixed top-6 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg z-30"
					style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
				>
					Login / Register
				</button>
				{showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
			</>
		);
	}

	const tierLabel = user?.subscription?.tier
		? user.subscription.tier.toUpperCase()
		: isGuest
			? 'GUEST'
			: 'FREE';

	return (
		<>
			<div className="fixed top-6 left-6 z-30">
				<button
					onClick={() => setShowMenu(!showMenu)}
					className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl text-white p-3 rounded-xl border border-purple-500/30 hover:scale-105 transition-transform shadow-lg"
					style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}
				>
					<FiUser size={24} />
				</button>

				{showMenu && (
					<div className="absolute top-16 left-0 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl rounded-xl border border-purple-500/30 shadow-2xl min-w-[250px] overflow-hidden">
						{/* User info */}
						<div className="p-4 border-b border-purple-500/30">
							<p className="text-white font-semibold">
								{user?.displayName || user?.username}
							</p>
							<p className="text-purple-300 text-sm">{user?.email}</p>
							{isGuest && (
								<span className="inline-block mt-2 bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded">
									Guest Account
								</span>
							)}
							<div className="mt-2">
								<span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded">
									{tierLabel}
								</span>
							</div>
						</div>

						{/* Menu items */}
						<div className="p-2">
							<button
								onClick={() => {
									setShowMenu(false);
									// TODO: Add settings modal
								}}
								className="w-full flex items-center gap-3 px-4 py-3 text-purple-200 hover:bg-purple-500/20 rounded-lg transition-colors"
							>
								<FiSettings size={18} />
								Settings
							</button>
							<button
								onClick={() => {
									logout();
									setShowMenu(false);
								}}
								className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
							>
								<FiLogOut size={18} />
								Logout
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};
