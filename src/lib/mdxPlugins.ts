import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code"


export const mdxPlugins = {
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