export const AnimatedBackground = () => {
	return (
		<div className="fixed inset-0 -z-10 overflow-hidden">
			{/* Animated gradient background */}
			<div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 animate-gradient-shift" />
			
			{/* Floating orbs */}
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slow" />
			<div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float-slower" />
			<div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
			
			{/* Grid pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
			
			{/* Animated particles */}
			{[...Array(20)].map((_, i) => (
				<div
					key={i}
					className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-particle"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						animationDelay: `${Math.random() * 5}s`,
						animationDuration: `${5 + Math.random() * 10}s`,
					}}
				/>
			))}
			
			{/* Spotlight effect */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)] animate-pulse-slow" />
		</div>
	);
};
