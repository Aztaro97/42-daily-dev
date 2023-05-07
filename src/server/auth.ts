// @ts-nocheck

import { type GetServerSidePropsContext } from "next";
import {
	Awaitable,
	getServerSession,
	type NextAuthOptions,
} from "next-auth";
import FortyTwoProvider, { FortyTwoProfile } from "next-auth/providers/42-school";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import { IFortyTwoProfile, IUser } from "@/@types/nextauth";
import { IUserImage } from "@/@types/types";
import { User } from "next-auth";

export const authOptions: NextAuthOptions = {
	callbacks: {
		// signIn({ profile, user }) {
		// 	if (!profile || !user) return false

		// 	// Set the User Login ID to the Student ID
		// 	user.loginId = profile.id

		// 	return user
		// },
		jwt({ token, profile, account, user }) {
			/* Step 1: update the token based on the user object */
			if (profile && account) {
				token.userId = user.id
				token.loginId = profile.id;
				token.email = profile.email;
				token.login = profile.login;
				token.accessToken = account.access_token;
				// @ts-ignore
				token.image = profile.image;

			}
			return token;
		},
		session({ session, token }) {
			if (token && session.user) {
				session.user.login = token.login;
				session.user.email = token.email;
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
			profile: (profile: IFortyTwoProfile): Promise<IUser> => {
				console.log("**:, profile", profile)
				return {
					id: profile.id.toString(),
					loginId: profile.id,
					login: profile.login,
					name: profile.usual_full_name,
					email: profile.email,
					image: profile.image,
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
