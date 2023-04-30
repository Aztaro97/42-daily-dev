// nextauth.d.ts
import { DefaultSession, Profile } from "next-auth";
import { FortyTwoProfile } from "next-auth/providers/42-school";

import { IUserImage } from "@/@types/types"
import { Prisma } from "@prisma/client";
// Define a role enum
export enum Role {
	user = "user",
	admin = "admin",
}


export interface IUser {
	id: string;
	name: string;
	email: string;
	image?: IUserImage | Prisma.JsonValue;
	role?: Role;
	user_id?: string;
	login?: string;
	loginId?: number;
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
		image: IUserImage;
	}
}

// Extends FortyTwoProfile 
declare module "next-auth/providers" {

	interface FortyTwoProfile extends IFortyTwoProfile { }


}
