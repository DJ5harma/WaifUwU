import { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiX } from 'react-icons/fi';

interface AudioPlayerProps {
	audioUrl: string | null;
	isPlaying: boolean;
	onPlayPause: () => void;
	onClose: () => void;
	onEnded: () => void;
	audioElement: HTMLAudioElement | null;
}

export const AudioPlayer = ({
	audioUrl,
	isPlaying,
	onPlayPause,
	onClose,
	onEnded,
	audioElement,
}: AudioPlayerProps) => {
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const progressBarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!audioElement) return;

		const updateTime = () => setCurrentTime(audioElement.currentTime);
		const updateDuration = () => setDuration(audioElement.duration);
		const handleEnded = () => {
			setCurrentTime(0);
			onEnded();
		};

		audioElement.addEventListener('timeupdate', updateTime);
		audioElement.addEventListener('loadedmetadata', updateDuration);
		audioElement.addEventListener('ended', handleEnded);

		return () => {
			audioElement.removeEventListener('timeupdate', updateTime);
			audioElement.removeEventListener('loadedmetadata', updateDuration);
			audioElement.removeEventListener('ended', handleEnded);
		};
	}, [audioElement, onEnded]);

	const formatTime = (time: number) => {
		if (isNaN(time)) return '0:00';
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!audioElement || !progressBarRef.current) return;

		const rect = progressBarRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, x / rect.width));
		const newTime = percentage * duration;

		audioElement.currentTime = newTime;
		setCurrentTime(newTime);
	};

	const handleMouseDown = () => setIsDragging(true);
	const handleMouseUp = () => setIsDragging(false);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (isDragging) {
			handleSeek(e);
		}
	};

	const toggleMute = () => {
		if (!audioElement) return;
		const newMuted = !isMuted;
		setIsMuted(newMuted);
		audioElement.muted = newMuted;
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!audioElement) return;
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		audioElement.volume = newVolume;
		if (newVolume > 0 && isMuted) {
			setIsMuted(false);
			audioElement.muted = false;
		}
	};

	if (!audioUrl) return null;

	const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

	return (
		<div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[500px] max-w-[90vw]">
			<div className="bg-gradient-to-br from-slate-900/98 to-purple-900/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 p-4"
				style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)' }}
			>
				<div className="flex items-center gap-3">
					{/* Play/Pause Button */}
					<button
						onClick={onPlayPause}
						className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
					>
						{isPlaying ? <FiPause size={20} className="text-white" /> : <FiPlay size={20} className="text-white ml-0.5" />}
					</button>

					{/* Progress Bar */}
					<div className="flex-1">
						<div
							ref={progressBarRef}
							className="relative h-2 bg-slate-700/50 rounded-full cursor-pointer group"
							onClick={handleSeek}
							onMouseDown={handleMouseDown}
							onMouseUp={handleMouseUp}
							onMouseMove={handleMouseMove}
							onMouseLeave={handleMouseUp}
						>
							<div
								className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
								style={{ width: `${progress}%` }}
							/>
							<div
								className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
								style={{ left: `calc(${progress}% - 8px)` }}
							/>
						</div>
						<div className="flex justify-between text-xs text-purple-300 mt-1">
							<span>{formatTime(currentTime)}</span>
							<span>{formatTime(duration)}</span>
						</div>
					</div>

					{/* Volume Control */}
					<div className="flex items-center gap-2 flex-shrink-0">
						<button
							onClick={toggleMute}
							className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-300 hover:text-white"
						>
							{isMuted || volume === 0 ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
						</button>
						<input
							type="range"
							min="0"
							max="1"
							step="0.01"
							value={volume}
							onChange={handleVolumeChange}
							className="w-20 h-1 bg-slate-700/50 rounded-full appearance-none cursor-pointer
								[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
								[&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
								[&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-purple-500 
								[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
						/>
					</div>

					{/* Close Button */}
					<button
						onClick={onClose}
						className="flex-shrink-0 p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-300 hover:text-white"
					>
						<FiX size={18} />
					</button>
				</div>

				{/* Now Playing Text */}
				<div className="mt-2 text-center">
					<p className="text-xs text-purple-300/70">Now Playing: AI Response</p>
				</div>
			</div>
		</div>
	);
};
