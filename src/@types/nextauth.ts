// nextauth.d.ts
import { DefaultUser, DefaultSession, Profile } from "next-auth";
import { FortyTwoProfile } from "next-auth/providers/42-school";

import { IUserImage } from "@/@types/types"
// Define a role enum
export enum Role {
	user = "user",
	admin = "admin",
}


// common interface for JWT and Session
export interface IUser extends DefaultUser {
	role?: Role;
	user_id?: string;
	login?: string;
	loginId?: number;
	email: string;
	image?: IUserImage;
	emailVerified?: boolean;
	accessToken?: string;
}

export interface IFortyTwoProfile extends FortyTwoProfile {
	loginId: number;
	image: IUserImage;
}

declare module "next-auth" {
	interface User extends IUser {
		image?: IUserImage;
		loginId?: number;
	}
	interface Session {
		accessToken?: string;
		sessionToken?: string;
		user?: IUser;
		userId?: string;
	}

	interface Profile extends IUser {
		id: number;
		login?: string;
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

// Extends FortyTwoProfile 
declare module "next-auth/providers" {

	interface FortyTwoProfile extends IFortyTwoProfile {
	}


}
