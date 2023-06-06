import React, { FC } from "react"
import Head from "next/head"
import { DefaultSeo, NextSeo } from "next-seo"
import { NEXT_SEO_DEFAULT, buildCanonical } from "next-seo.config"
import { OpenGraph } from "next-seo/lib/types"

import { getBrowserInfo } from "@/lib/getBrowserInfo"

interface props {
  title: string
  description: string
  openGraph: OpenGraph
}

const HeadSEO: FC<props> = ({ description, openGraph, title }) => {
  const url = getBrowserInfo().url

  return (
    <NextSeo
      {...NEXT_SEO_DEFAULT}
      title={title}
      description={description}
      canonical={url}
      openGraph={openGraph}
    />
  )
}

export default HeadSEO
