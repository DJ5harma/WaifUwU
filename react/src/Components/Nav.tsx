import { useState } from "react";
import { RiMenuUnfold3Fill } from "react-icons/ri";
import "../Animations/NavAnimations.css";
import { IoSettingsSharp } from "react-icons/io5";

export const Nav = () => {
	const [open, setOpen] = useState(false);

	const items = [
		{
			name: "Menu",
			icon: <RiMenuUnfold3Fill />,
			fn: () => {
				setOpen(!open);
			},
		},
		{ name: "About", icon: <IoSettingsSharp /> },
	];

	return (
		<nav className="flex flex-col fixed top-2 left-2 ">
			<nav className="fixed h-screen left-0 top-0 pt-4 px-2 flex flex-col gap-4 text-2xl">
				{items.map(({ icon, name, fn }, i) => {
					return (
						<div
							key={i}
							className="cursor-pointer flex gap-2 items-center py-3 pl-4 pr-5 rounded-l-xl rounded-r-3xl select-none"
							style={{
								backgroundImage:
									"linear-gradient(to right, rgb(11, 27, 97), rgb(55, 13, 99))",
								boxShadow: "inset 0 0 5px 2px white",
								animation:
									i === 0 || open ? "show 0.5s forwards" : "hide 0.5s forwards",
							}}
							onClick={fn}
						>
							{icon}
							<p className="text-xs">{name}</p>
						</div>
					);
				})}
			</nav>
		</nav>
	);
};
