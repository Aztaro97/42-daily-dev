/** @type {import('tailwindcss').Config} */
const config =  {
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
					...require("daisyui/src/colors/themes")["[data-theme=night]"],
					primary: "#7100FE",
					secondary: "#00E5FC",
					accent: "#FF5E4F"
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