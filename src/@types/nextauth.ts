// nextauth.d.ts
import { DefaultUser, DefaultSession } from "next-auth";
// Define a role enum
export enum Role {
	user = "user",
	admin = "admin",
}
// common interface for JWT and Session
interface IUser extends DefaultUser {
	role?: Role;
	user_id?: string;
	login?: string;
	email: string;
	image?: string;
	emailVerified?: boolean;
	accessToken?: string;
}

declare module "next-auth" {
	interface User extends IUser {
		role?: Role;
		user_id?: string;
		login?: string;
		email: string;
		image?: string;
		emailVerified?: boolean;
		accessToken?: string;

	}
	interface Session {
		accessToken?: string;
		userId?: string;
		sessionToken?: string;
		user?: IUser;
	}
}
declare module "next-auth/jwt" {
	interface JWT extends IUser {
		accessToken?: string;
		userId?: string;
		sessionToken?: string;
		user?: IUser;
	}
}