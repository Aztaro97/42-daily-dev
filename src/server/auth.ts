import { type GetServerSidePropsContext } from "next";
import {
	getServerSession,
	type NextAuthOptions,
	type DefaultSession,
} from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt/types";


export const authOptions: NextAuthOptions = {
	callbacks: {
		signIn({ profile, user }) {
			if (!profile || !user) return false
			return user
		},
		jwt({ token, profile, account }) {
			/* Step 1: update the token based on the user object */
			if (profile && account) {
				token.user_id = profile.id;
				token.email = profile.email;
				token.login = profile.login;
				token.image = profile.image;
				token.accessToken = account.access_token;

			}
			return token;
		},
		session({ session, token }) {
			// console.log("session", session)
			if (token && session.user) {
				session.userId = token.user_id;
				session.user.login = token.login;
				session.user.email = token.email;
				session.user.image = token.image;
				session.user.emailVerified = true;
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
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	// jwt: {
	// 	secret: env.NEXTAUTH_JWT_SECRET,
	// 	maxAge: 60 * 60 * 24 * 14,
	// 	async encode(data: any) {
	// 		const { secret, token } = data;
	// 		return jwt.sign(token as JWT, secret)
	// 	},
	// 	async decode(data: any) {
	// 		const { secret, token } = data;
	// 		return jwt.verify(token as string, secret) as JWT
	// 	},

	// },
	secret: env.NEXTAUTH_SECRET,
	debug: env.NODE_ENV === "development",
};


export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
