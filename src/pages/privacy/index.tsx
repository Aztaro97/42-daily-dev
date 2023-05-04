import React from "react"
import Link from "next/link"
import { allDocs } from "contentlayer/generated"
import { useMDXComponent } from "next-contentlayer/hooks"

// import { getTableOfContent } from "@/lib/toc"
import Layout from "@/components/layout"

export default function PrivacyPage({ doc }: { doc: any }) {
  //   const tableOfContent = getTableOfContent(doc.body.raw);
  //   const MdxContent = useMDXComponent(doc.body.code)
  //   console.log("tableOfContent", tableOfContent)
  console.log("doc", allDocs)
  return (
    <Layout>
      <div className="text-lg">Hello Privacy Policy</div>
      {/* <MdxContent  /> */}
      {/* <div dangerouslySetInnerHTML={{ __html: doc.body.code }} /> */}
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = allDocs.map((doc) => doc.slug)
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params: { slug } }) {
  console.log("slug--", slug)
  const doc = allDocs.find((post) => post._raw.flattenedPath === slug)

  console.log("doc--", doc)
  return {
    props: {
      doc,
    },
  }
}
