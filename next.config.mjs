import withBundleAnalyzer from "@next/bundle-analyzer"
import { withAxiom } from "next-axiom"
import { withContentlayer } from "next-contentlayer"

import withTwin from "./withTwin.cjs"

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"))

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  images: {
    domains: [
      "i.pravatar.cc",
      "daily-now-res.cloudinary.com",
      "res.cloudinary.com",
      "cdn.intra.42.fr",
      "picsum.photos",
    ],
  },
}

const plugins = [
  withBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  }),
  withTwin,
  withAxiom,
  withContentlayer,
]

export default () => {
  return plugins.reduce((acc, plugin) => plugin(acc), { ...nextConfig })
}
