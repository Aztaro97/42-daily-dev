import withTwin from "./withTwin.cjs";
import { withContentlayer } from 'next-contentlayer'

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = withTwin({
  reactStrictMode: true,
  images: {
	domains: ["i.pravatar.cc","daily-now-res.cloudinary.com"]
  }
});

export default withContentlayer(config);
