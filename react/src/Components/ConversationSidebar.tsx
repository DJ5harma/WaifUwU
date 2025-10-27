import { useState, useEffect } from 'react';
import { chatAPI, ConversationsResponse } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { FiMessageSquare, FiPlus, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ConversationSidebarProps {
	currentConversationId: string | null;
	onSelectConversation: (conversationId: string) => void;
	onNewConversation: () => void;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
}

export const ConversationSidebar = ({
	currentConversationId,
	onSelectConversation,
	onNewConversation,
	isCollapsed,
	onToggleCollapse,
}: ConversationSidebarProps) => {
	const { isAuthenticated } = useAuth();
	const [conversations, setConversations] = useState<ConversationsResponse['conversations']>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			loadConversations();
		}
	}, [isAuthenticated]);

	// Reload conversations when currentConversationId changes (new conversation created)
	useEffect(() => {
		if (isAuthenticated && currentConversationId) {
			loadConversations();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentConversationId]);

	const loadConversations = async () => {
		setIsLoading(true);
		try {
			const data = await chatAPI.getConversations(1, 50);
			setConversations(data.conversations);
		} catch (error) {
			console.error('Failed to load conversations:', error);
			toast.error('Failed to load conversation history');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		
		if (!confirm('Delete this conversation?')) return;

		try {
			await chatAPI.deleteConversation(conversationId);
			setConversations(prev => prev.filter(c => c._id !== conversationId));
			
			if (currentConversationId === conversationId) {
				onNewConversation();
			}
			
			toast.success('Conversation deleted');
		} catch (error) {
			console.error('Failed to delete conversation:', error);
			toast.error('Failed to delete conversation');
		}
	};

	const formatDate = (date: Date) => {
		const now = new Date();
		const conversationDate = new Date(date);
		const diffMs = now.getTime() - conversationDate.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		
		return conversationDate.toLocaleDateString();
	};

	if (!isAuthenticated) {
		return null;
	}

	if (isCollapsed) {
		return (
			<button
				onClick={onToggleCollapse}
				className="fixed left-0 top-1/2 -translate-y-1/2 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl p-3 rounded-r-xl border border-l-0 border-purple-500/30 hover:scale-105 transition-transform z-40"
				style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}
			>
				<FiChevronRight size={20} className="text-purple-300" />
			</button>
		);
	}

	return (
		<div
			className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-r border-purple-500/30 flex flex-col z-40"
			style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.2)' }}
		>
			{/* Header */}
			<div className="p-4 border-b border-purple-500/30 flex items-center justify-between">
				<h2 className="text-lg font-bold text-white flex items-center gap-2">
					<FiMessageSquare size={20} />
					Conversations
				</h2>
				<button
					onClick={onToggleCollapse}
					className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-300"
				>
					<FiChevronLeft size={20} />
				</button>
			</div>

			{/* New Conversation Button */}
			<div className="p-4 border-b border-purple-500/30">
				<button
					onClick={onNewConversation}
					className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2"
				>
					<FiPlus size={20} />
					New Conversation
				</button>
			</div>

			{/* Conversation List */}
			<div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
				{isLoading ? (
					<div className="text-center text-purple-300 py-8">Loading...</div>
				) : conversations.length === 0 ? (
					<div className="text-center text-purple-300/70 py-8 px-4">
						<p className="text-sm">No conversations yet</p>
						<p className="text-xs mt-2">Start chatting to create your first conversation!</p>
					</div>
				) : (
					conversations.map((conversation) => (
						<div
							key={conversation._id}
							onClick={() => onSelectConversation(conversation._id)}
							className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
								currentConversationId === conversation._id
									? 'bg-purple-500/30 border border-purple-500/50'
									: 'bg-slate-800/50 border border-purple-500/20 hover:bg-slate-800/80 hover:border-purple-500/40'
							}`}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="flex-1 min-w-0">
									<p className="text-white text-sm font-medium truncate">
										{conversation.personality 
											? conversation.personality.charAt(0).toUpperCase() + conversation.personality.slice(1) + ' Chat'
											: 'Conversation'
										}
									</p>
									{conversation.lastMessage && (
										<p className="text-purple-300/70 text-xs truncate mt-1">
											{conversation.lastMessage}
										</p>
									)}
									<p className="text-purple-400/50 text-xs mt-1">
										{formatDate(conversation.updatedAt)}
									</p>
								</div>
								<button
									onClick={(e) => handleDeleteConversation(conversation._id, e)}
									className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all text-red-400"
								>
									<FiTrash2 size={14} />
								</button>
							</div>
						</div>
					))
				)}
			</div>

			{/* Footer */}
			<div className="p-4 border-t border-purple-500/30">
				<p className="text-purple-300/50 text-xs text-center">
					{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
				</p>
			</div>
		</div>
	);
};
