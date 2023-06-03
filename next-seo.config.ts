import { APP_NAME } from "@/constants/constants";
import { Router } from "next/router";


export const buildCanonical = ({ origin, path }: { origin: Location["origin"]; path: Router["asPath"] }) => {
	return `${origin}${path === "/" ? "" : path}`.split("?")[0];
};

export const NEXT_SEO_DEFAULT = {
	title: APP_NAME,
	titleTemplate: "%s | Home Page",
	description: "42 Daily Dev App",
	openGraph: {
		type: "website",
		locale: "en_US",
		site_name: APP_NAME,
		images: [
			{
				url: "",
				width: 1200,
				height: 630,
				alt: "",
				type: "image/png",

			}]
	},
	twitter: {
		handle: "@aztaro97",
		site: "@aztaro97",
		cardType: "summary_large_image",
	}
}