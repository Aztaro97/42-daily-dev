import { type GetServerSidePropsContext } from "next";
import {
	getServerSession,
	type NextAuthOptions,
	type DefaultSession,
} from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt from "jsonwebtoken";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import { JWT } from "next-auth/jwt";


export const authOptions: NextAuthOptions = {
	callbacks: {
		jwt({ token, profile, account }) {
			console.log("profile", profile)
			/* Step 1: update the token based on the user object */
			if (profile && account) {
				token._id = profile.sub;
				token.email = profile.email;
				token.image = profile.image as string;
				token.accessToken = account.access_token;
			}
			return token;
		},
		session({ session, token }) {
			if (token && session.user) {
				session.user._id = token._id || token.sub;
				session.user.username = token.username;
				session.user.email = token.email;
				session.user.image = token.image;
				session.user.email_verified = token.email_verified;
				session.user.accessToken = token.accessToken;
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
	// session: {
	// 	strategy: "jwt",
	// 	maxAge: 30 * 24 * 60 * 60, // 30 days
	// 	updateAge: 24 * 60 * 60, // 24 hours
	// },
	// jwt: {
	// 	secret: process.env.NEXTAUTH_JWT_SECRET,
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
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
};


export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
