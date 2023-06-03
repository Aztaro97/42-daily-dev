import React, { FC } from "react"
import Head from "next/head"
import { DefaultSeo, NextSeo } from "next-seo"
import { NEXT_SEO_DEFAULT } from "next-seo.config"
import { OpenGraph } from "next-seo/lib/types"

interface props {
  title: string
  description: string
  openGraph: OpenGraph
}

const NextSeoWrapper: FC<props> = ({ description, openGraph, title }) => {
  return (
    <NextSeo
      {...NEXT_SEO_DEFAULT}
      title={title}
      description={description}
      openGraph={openGraph}
    />
  )
}

export default NextSeoWrapper
