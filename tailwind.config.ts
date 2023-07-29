import { colors } from "./src/constants/constants"

/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"node_modules/daisyui/dist/**/*.js",
		"node_modules/react-daisyui/dist/**/*.js"
	],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: [
			{
				night: {
					...require("daisyui/src/theming/themes")["[data-theme=night]"],
					primary: colors.PRIMARY,
					secondary: colors.SECONDARY,
					accent: colors.ACCENT
				}
			},
			"light"
		],
		darkTheme: "night",
		// styled: true,
		// base: true,
		// utils: true,
		// logs: true,
		// rtl: false,
		// prefix: "",
	},
	plugins: [
		require("daisyui"),
		require('tailwindcss-animated'),
		require('@tailwindcss/typography'),
	],
}

export default config