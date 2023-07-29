
import { type GetServerSidePropsContext } from "next";
import {
	getServerSession,
	type NextAuthOptions,
} from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import { IFortyTwoProfile } from "@/@types/nextauth";

export const authOptions: NextAuthOptions = {
	callbacks: {
		jwt({ token, profile, account, user, trigger, session }) {

			// Step 1: update the token based on the user object
			if (profile && account && user) {
				token.userId = user.id
				token.accessToken = account.access_token;

			}

			// trigger when user update the session
			if (trigger === "update") {
				return {
					...token,
					...session.user,
				}
			}

			return { ...token, ...user };
		},
		session({ session, token }) {
			if (token && session.user) {
				session.user.login = token.login;
				session.user.email = token.email as string;
				session.user.image = token.image;
				session.user.emailVerified = true;
				session.user.loginId = token.loginId;
				session.userId = token.userId;
				session.accessToken = token.accessToken;
			}
			return session;
		},
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		FortyTwoProvider({
			clientId: env.FORTYTWO_CLIENT_ID,
			clientSecret: env.FORTYTWO_CLIENT_SECRET,
			// @ts-ignore
			profile: (profile: IFortyTwoProfile) => {
				return {
					id: profile.id.toString(),
					loginId: profile.id,
					login: profile.login,
					name: profile.usual_full_name,
					email: profile.email,
					image: profile.image.link,
				}
			}
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	secret: env.NEXTAUTH_SECRET,
	debug: env.NODE_ENV === "development",
};


export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
