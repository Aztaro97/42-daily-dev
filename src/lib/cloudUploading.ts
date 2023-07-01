import { TRPCError } from "@trpc/server";
import cloudinary from "./cloudinary";


export const createCloudImage = async (base64Image: string) => {
	try {
		const imageResponse = await cloudinary.v2.uploader.upload(base64Image, { resource_type: 'image' });
		return imageResponse
	} catch (error) {
		console.log(error)
		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Error Uploading Image',
		})

	}
}

export const deleteCloudImage = async (publicId: string) => {
	try {
		await cloudinary.v2.uploader.destroy(publicId)
	} catch (error) {
		console.log(error);
	}
}