import withPlugins from "next-compose-plugins";
import withTwin from "./withTwin.cjs";
import { withContentlayer } from "next-contentlayer";

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.pravatar.cc", "daily-now-res.cloudinary.com", "res.cloudinary.com"],
  },
  //   swcMinify: true,
  //   webpack: (config) => {
  //     // Unset client-side javascript that only works server-side
  //     config.resolve.fallback = { fs: false, module: false, path: false };
  //     return config;
  //   },
};

const contentLayer = withContentlayer({
  nextConfig
});
const twin = withTwin(nextConfig);

export default withPlugins([contentLayer, twin], nextConfig);
