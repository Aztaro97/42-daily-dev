import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings";


/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
	slug: {
	  type: "string",
	  resolve: (doc) => `/${doc._raw.flattenedPath}`,
	},
	slugAsParams: {
	  type: "string",
	  resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
	},
  }

export const Post = defineDocumentType(() => ({
	name: 'Post',
	filePathPattern: `blog/**/*.mdx`,
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
	documentTypes: [Post, Docs],
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypePrettyCode,
				{
					theme: "github-dark",
					onVisitLine(node) {
						// Prevent lines from collapsing in `display: grid` mode, and allow empty
						// lines to be copy/pasted
						if (node.children.length === 0) {
							node.children = [{ type: "text", value: " " }]
						}
					},
					onVisitHighlightedLine(node) {
						node.properties.className.push("line--highlighted")
					},
					onVisitHighlightedWord(node) {
						node.properties.className = ["word--highlighted"]
					},
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className: ["subheading-anchor"],
						ariaLabel: "Link to section",
					},
				},
			],
		]
	}
})