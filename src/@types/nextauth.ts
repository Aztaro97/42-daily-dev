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
	image: IUserImage;
	role: Role;
	login: string;
	loginId?: number;
	emailVerified?: boolean;
	accessToken?: string;
}

interface Profile42 {
	id: number
	email: string
	login: string
	first_name: string
	last_name: string
	usual_full_name: null | string
	usual_first_name: null | string
	url: string
	phone: "hidden" | string | null
	displayname: string
	image_url: string | null
	"staff?": boolean
	correction_point: number
	pool_month: string | null
	pool_year: string | null
	location: string | null
	wallet: number
	anonymize_date: string
	created_at: string
	updated_at: string | null
	alumni: boolean
}

export interface IFortyTwoProfile extends Profile42 {
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
		user: IUser;
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
