import { TypeOf, z } from "zod";
import { IUser } from "./nextauth";

// type IUserImage = z.infer<TypeOf>

export interface ITags {
	id: string;
	name: string;
	slug: string;
}

export interface ILike {
	postId: string;
	userId: string;
	user: IUser;
	post: IPost;
	dislike: boolean;
}

export interface IUserImage {
	link: string;
	version: {
		large: string;
		medium: string;
		small: string;
		micro: string;

	}
}

export interface IPost {
	id: string
	title: string
	content: string
	image: string
	slug: string
	published: boolean
	createdAt: Date
	updatedAt: Date
	author: IUser
	tags: ITags[]
	comments: IComment[]
	views: IView[]
	likes: ILike[]
	_count: {
		comments: number
		views: number
		tags: number
		likes: number
	}
}

export interface IComment {
	id: string
	content: string
	author: IUser
	post: IPost
	createdAt: Date
}

export interface IView {
	id: string
	post: IPost
	ipAddress: string
}

export interface IBookmark {
	id: string
	post: IPost
	user: IUser
}
