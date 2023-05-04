import withBundleAnalyzer from "@next/bundle-analyzer"
import { withAxiom } from "next-axiom"
import withPlugins from "next-compose-plugins"
import { withContentlayer } from "next-contentlayer"

import withTwin from "./withTwin.cjs"

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"))

/** @type {import("next").NextConfig} */
const Config = withPlugins(
  [
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === "true",
    }),
    withAxiom,
    withTwin,
    withContentlayer,
  ],
  {
    reactStrictMode: true,
    images: {
      domains: [
        "i.pravatar.cc",
        "daily-now-res.cloudinary.com",
        "res.cloudinary.com",
        "cdn.intra.42.fr",
      ],
    },
    swcMinify: true,
    webpack: (config) => {
      // Unset client-side javascript that only works server-side
      config.resolve.fallback = { fs: false, module: false, path: false }
      return config
    },
  },
)

// const contentLayer = withContentlayer({
//   nextConfig,
// })
// const twin = withTwin(nextConfig)
// const bundleAnalyzer = withBundleAnalyzer({
//   enabled: process.env.ANALYZE === "true",
// })(nextConfig)

// const axiom = withAxiom(nextConfig)

// export default withPlugins(
//   [contentLayer, twin, axiom],
//   nextConfig,
// )

// export default withTwin(withContentlayer(nextConfig))

export default Config
