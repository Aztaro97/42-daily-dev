import React from 'react';
import { compareDesc, format, parseISO } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import Link from 'next/link';
import Layout from '@/components/layout'


export function getStaticProps() {
	const docs = allPosts.sort((a, b) => {
		return compareDesc(new Date(a.date), new Date(b.date));
	})
	return {
		props: {
			data: docs as any[],
		}
	}
}

export default function TermsPage({data}) {
	console.log("data", data)

  return (
	<Layout>TermsPage</Layout>
  )
}
