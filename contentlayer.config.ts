import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import { mdxPlugins } from "@/lib/mdxPlugins"

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
	slug: {
		type: "string",
		resolve: (doc: any) => `/${doc._raw.flattenedPath}`,
	},
	slugAsParams: {
		type: "string",
		resolve: (doc: any) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
	},
}

// export const Post = defineDocumentType(() => ({
// 	name: 'Post',
// 	filePathPattern: `blog/**/*.mdx`,
// 	contentType: "mdx",
// 	fields: {
// 		title: {
// 			type: 'string',
// 			description: 'The title of the post',
// 			required: true,
// 		},
// 		date: {
// 			type: 'date',
// 			description: 'The date of the post',
// 			required: true,
// 		},
// 	},
// 	computedFields
// }))

export const Docs = defineDocumentType(() => ({
	name: 'Docs',
	filePathPattern: `document/**/*.mdx`,
	contentType: "mdx",
	fields: {
		title: {
			type: 'string',
			description: 'The title of the post',
			required: true,
		},
		date: {
			type: 'date',
			description: 'The date of the post',
			required: true,
		},
		


	},
	computedFields
}))

export default makeSource({
	contentDirPath: './src/contents',
	documentTypes: [Docs],
	mdx: mdxPlugins
})