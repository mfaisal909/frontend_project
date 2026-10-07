import React from "react";
import { Link } from "react-router-dom";

const navigationItems = [
	{ label: "Home", path: "/" },
	{ label: "Products", path: "/products" },
	{ label: "Best Selling", path: "/best-selling" },
	{ label: "Events", path: "/events" },
	{ label: "FAQ", path: "/faq" },
];

const Navbar = ({ active }) => (
	<nav className="flex flex-col items-stretch md:flex-row md:items-center md:justify-center md:gap-6">
		{navigationItems.map((item) => (
			<Link
				key={item.path}
				to={item.path}
				className={`px-4 py-3 text-sm font-semibold transition-colors md:px-0 md:py-2 ${
					active === item.label
						? "text-indigo-600"
						: "text-gray-700 hover:text-indigo-600"
				}`}
			>
				{item.label}
			</Link>
		))}
	</nav>
);

export default Navbar;
