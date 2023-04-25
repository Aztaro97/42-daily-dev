import cloudinary from "@/lib/cloudinary";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";



// Delete Image
export const deleteImage = async (image: string) => {
	try {
		const deleteImageResponse = await cloudinary.v2.uploader.destroy(image);
		return deleteImageResponse;

	} catch (error) {
		console.log(error)
	}
}


export const blogRouter = createTRPCRouter({
	uploadEditorImage: publicProcedure.input(
		z.object({
			file: z.any()
		})
	).mutation(async ({ ctx, input }) => {
		try {
			const { file: base64Image } = input;

			const uploadImageResponse = await cloudinary.v2.uploader.upload(base64Image, { resource_type: 'image' });
			console.log("uploadImageResponse :", uploadImageResponse);

			return {
				url: uploadImageResponse.secure_url,
			};

		} catch (error) {
			console.log(error)
		}
	}),
	deleteEditorImage: publicProcedure.input( z.object({public_id: z.string()})).mutation(async ({ ctx, input }) => {
		try {
			const {public_id} = input;
			const deleteImageResponse = await cloudinary.v2.uploader.destroy(public_id);
			return deleteImageResponse;
	
		} catch (error) {
			console.log(error)
		}
	})
})