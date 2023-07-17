import { APP_DESCRIPTION, APP_NAME, APP_TWITTER, SEO_IMG_ALT_DEFAULT, SEO_IMG_DEFAULT, SEO_IMG_HEIGHT_DEFAULT, SEO_IMG_TYPE_DEFAULT, SEO_IMG_WIDTH_DEFAULT } from "@/constants/constants";
import { env } from "@/env.mjs";

export const NEXT_SEO_DEFAULT = {
	title: APP_NAME,
	titleTemplate: "%s",
	description: APP_DESCRIPTION,
	additionalLinkTags: [{ rel: 'icon', href: '/favicon.ico' }],
	additionalMetaTags: [
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ name: 'google-site-verification', content: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION! },
	],
	openGraph: {
		type: "website",
		locale: "en_US",
		site_name: APP_NAME,
		images: [
			{
				url: SEO_IMG_DEFAULT,
				width: SEO_IMG_WIDTH_DEFAULT,
				height: SEO_IMG_HEIGHT_DEFAULT,
				alt: SEO_IMG_ALT_DEFAULT,
				type: SEO_IMG_TYPE_DEFAULT,

			}]
	},
	twitter: {
		handle: APP_TWITTER,
		site: APP_TWITTER,
		cardType: "summary_large_image",
	}
}