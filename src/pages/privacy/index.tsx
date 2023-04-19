import React from 'react';
import { compareDesc, format, parseISO } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import Link from 'next/link';
import Layout from '@/components/layout';
import { getTableOfContent } from '@/lib/toc';


// export async function getStaticPaths() {
// 	const paths = allPosts.map((post) => post.slug)
// 	return {
// 	  paths,
// 	  fallback: false,
// 	}
//   }
  

// export function getStaticProps() {
// 	const docs = allPosts.find((post) => post._raw.sourceFilePath == "document/privacy-policy-02.mdx")
// 	// const docs = allPosts.find((post) => post._raw.flattenedPath)
// 	// const docs = allPosts.map((post) => post)
// 	return {
// 		props: {
// 			data: docs as any,
// 		}
// 	}
// }

export default function PolicyPage({data}: {data:any}) {
	// const tableOfContent = getTableOfContent(data.body.raw);
	// console.log("tableOfContent", tableOfContent)
  return (
	<Layout>
      <div className="text-lg">
        Hello Privacy Policy
      </div>
	  </Layout>
  )
}
