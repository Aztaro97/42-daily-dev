import React, { FC } from "react"
import Head from "next/head"
import { DefaultSeo, NextSeo } from "next-seo"
import { NEXT_SEO_DEFAULT, buildCanonical } from "next-seo.config"
import { OpenGraph } from "next-seo/lib/types"

interface props {
  title: string
  description: string
  openGraph: OpenGraph
}

const NextSeoWrapper: FC<props> = ({ description, openGraph, title }) => {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : ""

  const path =
    typeof window !== "undefined" && window.location.pathname
      ? window.location.pathname
      : ""

  return (
    <NextSeo
      {...NEXT_SEO_DEFAULT}
      title={title}
      description={description}
      canonical={buildCanonical({
        origin,
        path,
      })}
      openGraph={openGraph}
    />
  )
}

export default NextSeoWrapper
