import React from "react"
import Link from "next/link"
import { allDocs } from "contentlayer/generated"
import { useMDXComponent } from "next-contentlayer/hooks"

import Layout from "@/components/layout"

// import { getTableOfContent } from "@/lib/toc";

// export async function getStaticPaths() {
// 	const paths = allDocs.map((post) => post.slug)
// 	return {
// 	  paths,
// 	  fallback: false,
// 	}
//   }

// export function getStaticProps() {
//   const doc = allDocs.find(
//     (post) => post._raw.sourceFilePath == "document/privacy-policy-02.mdx",
//   )
//   // const doc = allDocs.find((post) => post._raw.flattenedPath)
//   // const doc = allDocs.map((post) => post)
//   return {
//     props: {
//       doc,
//     },
//   }
// }

export default function PolicyPage({ doc }: { doc: any }) {
  //   const tableOfContent = getTableOfContent(doc.body.raw);
//   const MdxContent = useMDXComponent(doc.body.code)
  //   console.log("tableOfContent", tableOfContent)
//   console.log("doc", doc)
  return (
    <Layout>
      <div className="text-lg">Hello Privacy Policy</div>
      {/* <div dangerouslySetInnerHTML={{ __html: doc.body.code }} /> */}
    </Layout>
  )
}
