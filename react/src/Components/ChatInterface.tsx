import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { chatAPI, Message, ChatResponse, BackendMessage } from '../services/api';
import { SpeechifyService } from '../services/speechify';
import { useWaifu, WAIFU_ANIMATION_TYPE } from '../Providers/WaifuProvider';
import { useAuth } from '../hooks/useAuth';
import { ConversationSidebar } from './ConversationSidebar';
import { AudioPlayer } from './AudioPlayer';
import { AuthModal } from './AuthModal';
import { FiSend, FiMinimize2, FiMaximize2, FiMenu, FiVolume2, FiCopy, FiRefreshCw, FiMusic } from 'react-icons/fi';
import { toast } from 'react-toastify';

export const ChatInterface = () => {
	const [messages, setMessages] = useState<Message[]>([
		{
			role: 'assistant',
			content: "Hi there! I'm your AI waifu assistant. How can I help you today? 💫",
			timestamp: new Date(),
		}
	]);
	const [inputMessage, setInputMessage] = useState('');
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [showAudioPlayer, setShowAudioPlayer] = useState(false);
	const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
	const [selectedVoice, setSelectedVoice] = useState('kristy');
	const [showVoiceMenu, setShowVoiceMenu] = useState(false);

	const availableVoices = [
		{ id: 'kristy', name: 'Kristy', emoji: '👩' },
		{ id: 'lisa', name: 'Lisa', emoji: '👱‍♀️' },
		{ id: 'emily', name: 'Emily', emoji: '👩‍🦰' },
		{ id: 'erin', name: 'Erin', emoji: '👩‍🦱' },
		{ id: 'lindsey', name: 'Lindsey', emoji: '👸' },
		{ id: 'monica', name: 'Monica', emoji: '💁‍♀️' },
		{ id: 'stacy', name: 'Stacy', emoji: '🧚‍♀️' },
	];

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const voiceMenuRef = useRef<HTMLDivElement>(null);
	const voiceButtonRef = useRef<HTMLButtonElement>(null);
	const { setCurrentAnimation } = useWaifu();
	const { isAuthenticated } = useAuth();

	// Initialize Speechify only
	useEffect(() => {
		SpeechifyService.init();
	}, []);

	// Close voice menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (voiceMenuRef.current && !voiceMenuRef.current.contains(event.target as Node)) {
				setShowVoiceMenu(false);
			}
		};

		if (showVoiceMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showVoiceMenu]);

	// Auto-load last conversation on mount
	useEffect(() => {
		const loadLastConversation = async () => {
			if (!isAuthenticated) return;

			try {
				const data = await chatAPI.getConversations(1, 1);
				if (data.conversations.length > 0) {
					const lastConversation = data.conversations[0];
					await loadConversation(lastConversation._id);
				}
			} catch (error) {
				console.error('Failed to load last conversation:', error);
			}
		};

		loadLastConversation();
	}, [isAuthenticated]);

	// Auto-scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const loadConversation = async (conversationId: string) => {
		try {
			const data = await chatAPI.getConversation(conversationId);
			setSessionId(data.conversation._id);

			// Map backend messages to frontend format (extract audioUrl from metadata)
			const mappedMessages = data.messages.map((msg: BackendMessage): Message => ({
				_id: msg._id,
				role: msg.role,
				content: msg.content,
				timestamp: new Date(msg.createdAt || msg.timestamp || Date.now()),
				audioUrl: msg.metadata?.audioUrl || null,
			}));

			setMessages(mappedMessages);
		} catch (error) {
			console.error('Failed to load conversation:', error);
			toast.error('Failed to load conversation');
		}
	};

	const handleNewConversation = () => {
		setSessionId(null);
		setMessages([{
			role: 'assistant',
			content: "Hi there! I'm your AI waifu assistant. How can I help you today? 💫",
			timestamp: new Date(),
		}]);
		toast.success('New conversation started');
	};

	const playAudioFromUrl = async (audioUrl: string, emotion: WAIFU_ANIMATION_TYPE = 'Talking') => {
		// Stop current audio if playing
		if (currentAudio) {
			currentAudio.pause();
			currentAudio.currentTime = 0;
		}

		try {
			const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${audioUrl}`;
			const audio = new Audio(fullUrl);
			setCurrentAudio(audio);
			setCurrentAudioUrl(audioUrl);
			setShowAudioPlayer(true);

			// Set animation to Talking
			setCurrentAnimation('Talking');
			setIsSpeaking(true);

			audio.onended = () => {
				const validEmotions = ['Idle', 'Angry', 'Shy', 'Greeting', 'Talking'];
				const nextAnimation = validEmotions.includes(emotion) ? emotion : 'Idle';
				setCurrentAnimation(nextAnimation as 'Idle' | 'Angry' | 'Shy' | 'Greeting' | 'Talking');
				setIsSpeaking(false);
			};

			audio.onerror = () => {
				console.error('Audio playback error');
				setCurrentAnimation('Idle');
				setCurrentAudio(null);
				setIsSpeaking(false);
				setShowAudioPlayer(false);
			};

			await audio.play();
		} catch (error) {
			console.error('Audio playback failed:', error);
			setCurrentAnimation('Idle');
			setIsSpeaking(false);
			setShowAudioPlayer(false);
		}
	};

	const handleAudioPlayPause = () => {
		if (!currentAudio) return;

		if (isSpeaking) {
			currentAudio.pause();
			setIsSpeaking(false);
			setCurrentAnimation('Idle');
		} else {
			currentAudio.play();
			setIsSpeaking(true);
			setCurrentAnimation('Talking');
		}
	};

	const handleAudioClose = () => {
		if (currentAudio) {
			currentAudio.pause();
			currentAudio.currentTime = 0;
		}
		setShowAudioPlayer(false);
		setCurrentAudioUrl(null);
		setCurrentAudio(null);
		setIsSpeaking(false);
		setCurrentAnimation('Idle');
	};

	const handleAudioEnded = () => {
		setIsSpeaking(false);
		setCurrentAnimation('Idle');
	};

	const playAudio = async (text: string, voiceId: string, emotion: WAIFU_ANIMATION_TYPE) => {
		if (!text) return;

		// Stop current audio if playing
		if (currentAudio) {
			currentAudio.pause();
			currentAudio.currentTime = 0;
		}

		try {
			// Generate audio using Speechify
			const audio = await SpeechifyService.generateAudio(text, voiceId);
			setCurrentAudio(audio);
			setShowAudioPlayer(true);
			setCurrentAudioUrl('/generated'); // Placeholder since we're generating on-the-fly

			// Set animation to Talking
			setCurrentAnimation('Talking');
			setIsSpeaking(true);

			audio.onended = () => {
				// Return to emotion-based animation after talking
				const validEmotions = ['Idle', 'Angry', 'Shy', 'Greeting', 'Talking'];
				const nextAnimation = validEmotions.includes(emotion) ? emotion : 'Idle';
				setCurrentAnimation(nextAnimation as 'Idle' | 'Angry' | 'Shy' | 'Greeting' | 'Talking');
				setIsSpeaking(false);
			};

			audio.onerror = () => {
				console.error('Audio playback error');
				setCurrentAnimation('Idle');
				setCurrentAudio(null);
				setIsSpeaking(false);
				setShowAudioPlayer(false);
			};

			await audio.play();

			// Fallback: if audio doesn't trigger onended
			const estimatedDuration = SpeechifyService.estimateDuration(text);
			setTimeout(() => {
				if (audio && !audio.paused) {
					audio.pause();
					const validEmotions = ['Idle', 'Angry', 'Shy', 'Greeting', 'Talking'];
					const nextAnimation = validEmotions.includes(emotion) ? emotion : 'Idle';
					setCurrentAnimation(nextAnimation as 'Idle' | 'Angry' | 'Shy' | 'Greeting' | 'Talking');
					setIsSpeaking(false);
				}
			}, estimatedDuration + 1000);

		} catch (error) {
			console.error('Audio playback failed:', error);
			setCurrentAnimation('Idle');
			setIsSpeaking(false);
			setShowAudioPlayer(false);
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard!');
	};

	const sendMessage = async (messageText?: string, isRegenerate = false) => {
		const messageToSend = messageText || inputMessage.trim();
		if (!messageToSend || isLoading) return;

		const userMessage: Message = {
			role: 'user',
			content: messageToSend,
			timestamp: new Date(),
		};

		setMessages(prev => [...prev, userMessage]);
		if (!messageText) {
			setInputMessage('');
		}
		setIsLoading(true);

		try {
			const response: ChatResponse = await chatAPI.sendMessage(
				userMessage.content,
				sessionId || undefined,
				isRegenerate
			);

			// Set sessionId if it was just created (use conversationId from response)
			if (!sessionId && response.conversationId) {
				setSessionId(response.conversationId);
			}

			const assistantMessage: Message = {
				_id: response.messageId,
				role: 'assistant',
				content: response.response,
				timestamp: new Date(),
				audioUrl: response.audioUrl || null,
			};

			setMessages(prev => [...prev, assistantMessage]);

			// Play audio and animate - use cached URL if available
			if (response.audioUrl) {
				await playAudioFromUrl(response.audioUrl, response.emotion);
			} else {
				await playAudio(response.response, selectedVoice, response.emotion);
			}

		} catch (error) {
			console.error('Failed to send message:', error);
			toast.error('Failed to get response');
			setCurrentAnimation('Idle');
		} finally {
			setIsLoading(false);
		}
	};

	const regenerateResponse = async (messageIndex: number) => {
		// Find the user message that came before this assistant message
		const previousUserMessage = messages[messageIndex - 1];
		
		if (!previousUserMessage || previousUserMessage.role !== 'user') {
			toast.error('No previous message found to regenerate');
			return;
		}

		// Remove the assistant message and the previous user message
		setMessages(prev => prev.slice(0, messageIndex - 1));
		
		// Resend the user message with regenerate flag
		toast.info('Regenerating response...');
		await sendMessage(previousUserMessage.content, true);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	if (isMinimized) {
		return (
			<>
				{showAudioPlayer && (
					<AudioPlayer
						audioUrl={currentAudioUrl}
						isPlaying={isSpeaking}
						onPlayPause={handleAudioPlayPause}
						onClose={handleAudioClose}
						onEnded={handleAudioEnded}
						audioElement={currentAudio}
					/>
				)}
				{isAuthenticated && (
					<ConversationSidebar
						currentConversationId={sessionId}
						onSelectConversation={loadConversation}
						onNewConversation={handleNewConversation}
						isCollapsed={isSidebarCollapsed}
						onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
					/>
				)}
				<button
					onClick={() => setIsMinimized(false)}
					className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-xl text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 border border-purple-400/30"
					style={{ 
						boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
					}}
				>
					<FiMaximize2 size={24} />
				</button>
			</>
		);
	}

	return (
		<>
			{/* Auth Modal - Shows on left side when not logged in */}
			{!isAuthenticated && (
				<>
					{/* Transparent overlay to block interaction but show preview */}
					<div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" />
					<AuthModal onClose={() => {}} />
				</>
			)}

			{showAudioPlayer && (
				<AudioPlayer
					audioUrl={currentAudioUrl}
					isPlaying={isSpeaking}
					onPlayPause={handleAudioPlayPause}
					onClose={handleAudioClose}
					onEnded={handleAudioEnded}
					audioElement={currentAudio}
				/>
			)}
			{isAuthenticated && (
				<ConversationSidebar
					currentConversationId={sessionId}
					onSelectConversation={loadConversation}
					onNewConversation={handleNewConversation}
					isCollapsed={isSidebarCollapsed}
					onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
				/>
			)}
			<div
				className="fixed right-6 top-6 bottom-6 w-96 bg-gradient-to-br from-slate-900/40 to-purple-900/40 backdrop-blur-3xl rounded-3xl shadow-2xl flex flex-col z-30 border border-purple-500/30 animate-fade-in-up animate-glow-pulse overflow-hidden"
				style={{ 
					boxShadow: '0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 100px rgba(168, 85, 247, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
					background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(88, 28, 135, 0.4) 100%)'
				}}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm relative z-50">
					<div className="flex items-center gap-2">
						{isAuthenticated && (
							<button
								onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
								className="p-2 hover:bg-purple-500/30 backdrop-blur-sm rounded-lg transition-all text-purple-300 hover:text-white border border-transparent hover:border-purple-500/30 lg:hidden"
								title="Toggle sidebar"
							>
								<FiMenu size={18} />
							</button>
						)}
						<div>
							<h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse" style={{ backgroundSize: '200% auto' }}>Chat with Waifu</h2>
							<p className="text-xs text-purple-300">
								{isSpeaking ? (
									<span className="flex items-center gap-1">
										<span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
										Speaking...
									</span>
								) : (
									'Powered by AI'
								)}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{/* Voice Selector */}
						<div className="relative" ref={voiceMenuRef}>
							<button
								ref={voiceButtonRef}
								onClick={() => setShowVoiceMenu(!showVoiceMenu)}
								className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-xl border border-purple-500/30 hover:border-purple-400/50 hover:scale-105 transition-all group shadow-lg shadow-purple-500/10"
								style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}
								title="Select voice"
							>
								<FiMusic size={14} className="text-purple-300 group-hover:text-purple-200" />
								<span className="text-xs font-medium text-purple-200 group-hover:text-white">
									{availableVoices.find(v => v.id === selectedVoice)?.emoji} {availableVoices.find(v => v.id === selectedVoice)?.name}
								</span>
							</button>
						</div>
						<button
							onClick={() => setIsMinimized(true)}
							className="p-2 hover:bg-purple-500/30 backdrop-blur-sm rounded-lg transition-all text-purple-300 hover:text-white border border-transparent hover:border-purple-500/30"
							title="Minimize"
						>
							<FiMinimize2 size={18} />
						</button>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent relative" style={{ zIndex: 1, isolation: 'isolate' }}>
					{messages.map((msg, idx) => (
						<div
							key={idx}
							className={`group flex ${msg.role === 'user' ? 'justify-end animate-slide-in-right' : 'justify-start animate-slide-in-left'}`}
						>
							<div
								className={`max-w-[80%] p-3 rounded-2xl relative transition-all hover:scale-[1.02] backdrop-blur-sm ${msg.role === 'user'
									? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white shadow-lg shadow-purple-500/50 border border-purple-400/30'
									: 'bg-slate-800/40 text-purple-100 border border-purple-500/20 shadow-lg shadow-purple-500/10 backdrop-blur-md'
									}`}
								style={msg.role === 'assistant' ? { 
									boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
									background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(30, 41, 59, 0.4) 100%)'
								} : {}}
							>
								<p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

								{/* Timestamp */}
								{msg.timestamp && (
									<p className="text-xs opacity-60 mt-2">
										{(() => {
											const date = new Date(msg.timestamp);
											return isNaN(date.getTime())
												? 'Just now'
												: date.toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit'
												});
										})()}
									</p>
								)}

								{/* Action Buttons - Show for assistant messages */}
								{msg.role === 'assistant' && (
									<div className="flex items-center gap-1 mt-2">
										<button
											onClick={() => playAudio(msg.content, selectedVoice, 'Talking')}
											className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-purple-500/30 backdrop-blur-sm rounded transition-all text-purple-300/70 hover:text-white border border-transparent hover:border-purple-500/30"
											title="Listen to audio"
										>
											<FiVolume2 size={12} />
										</button>
										<button
											onClick={() => copyToClipboard(msg.content)}
											className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-purple-500/30 backdrop-blur-sm rounded transition-all text-purple-300/70 hover:text-white border border-transparent hover:border-purple-500/30"
											title="Copy message"
										>
											<FiCopy size={12} />
										</button>
										<button
											onClick={() => regenerateResponse(idx)}
											disabled={isLoading}
											className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-purple-500/30 backdrop-blur-sm rounded transition-all text-purple-300/70 hover:text-white border border-transparent hover:border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
											title="Regenerate response"
										>
											<FiRefreshCw size={12} />
										</button>
									</div>
								)}
							</div>
						</div>
					))}
					{isLoading && (
						<div className="flex justify-start">
							<div className="bg-slate-800/40 backdrop-blur-md text-purple-100 p-3 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/10"
								style={{ 
									boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
									background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(30, 41, 59, 0.4) 100%)'
								}}
							>
								<div className="flex gap-1">
									<div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
									<div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
									<div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
								</div>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input */}
				<div className="p-4 border-t border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
					<div className="flex gap-2">
						<input
							type="text"
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Type your message..."
							disabled={isLoading}
							className="flex-1 bg-slate-800/30 backdrop-blur-xl text-white placeholder-purple-300/50 px-4 py-3 rounded-xl border border-purple-500/20 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-lg"
							style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}
						/>
						<button
							onClick={() => sendMessage()}
							disabled={isLoading || !inputMessage.trim()}
							className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm text-white p-3 rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-transform border border-purple-400/30 shadow-lg shadow-purple-500/20"
							style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)' }}
						>
							<FiSend size={20} />
						</button>
					</div>
				</div>
			</div>

			{/* Voice Menu Popup - Rendered via Portal */}
			{showVoiceMenu && voiceButtonRef.current && (() => {
				const rect = voiceButtonRef.current!.getBoundingClientRect();
				return createPortal(
					<div 
						className="fixed w-48 bg-gradient-to-br from-slate-900/60 to-purple-900/60 backdrop-blur-3xl rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden animate-fade-in-up"
						style={{ 
							top: `${rect.bottom + 8}px`,
							right: `${window.innerWidth - rect.right}px`,
							boxShadow: '0 0 50px rgba(168, 85, 247, 0.3), inset 0 0 60px rgba(168, 85, 247, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
							background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(88, 28, 135, 0.6) 100%)',
							zIndex: 10000
						}}
					>
						<div className="p-2 space-y-1">
							{availableVoices.map(voice => (
								<button
									key={voice.id}
									onClick={() => {
										setSelectedVoice(voice.id);
										setShowVoiceMenu(false);
										toast.success(`Voice changed to ${voice.name} ${voice.emoji}`);
									}}
									className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
										selectedVoice === voice.id
											? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
											: 'text-purple-200 hover:bg-purple-500/20 hover:text-white'
									}`}
								>
									<span className="text-lg">{voice.emoji}</span>
									<span className="text-sm font-medium">{voice.name}</span>
									{selectedVoice === voice.id && (
										<span className="ml-auto text-xs">✓</span>
									)}
								</button>
							))}
						</div>
					</div>,
					document.body
				);
			})()}
		</>
	);
};
