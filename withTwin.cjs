// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// The folders containing files importing twin.macro
const includedDirs = [path.resolve(__dirname, "src")];

module.exports = function withTwin(
  /** @type {{ reactStrictMode?: boolean; i18n?: { locales: string[]; defaultLocale: string; }; webpack?: any; }} */ nextConfig
) {
  return {
    ...nextConfig,
    /**
     * @param {{ module: { rules?: any; }; resolve: { fallback: any; }; }} config
     * @param {{ defaultLoaders?: any; dev?: any; isServer?: any; }} options
     */
    webpack(config, options) {
      const { dev, isServer } = options;
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];

      // Make the loader work with the new app directory
      // https://github.com/ben-rogerson/twin.macro/issues/788
      const patchedDefaultLoaders = options.defaultLoaders.babel;
      patchedDefaultLoaders.options.hasServerComponents = false;

      config.module.rules.push({
        test: /\.(tsx|ts)$/,
        include: includedDirs,
        use: [
          patchedDefaultLoaders,
          {
            loader: "babel-loader",
            options: {
              sourceMaps: dev,
              presets: [
                [
                  "@babel/preset-react",
                  { runtime: "automatic", importSource: "@emotion/react" },
                ],
              ],
              plugins: [
                require.resolve("babel-plugin-macros"),
                require.resolve("@emotion/babel-plugin"),
                [
                  require.resolve("@babel/plugin-syntax-typescript"),
                  { isTSX: true },
                ],
              ],
            },
          },
        ],
      });

      if (!isServer) {
        config.resolve.fallback = {
          ...(config.resolve.fallback || {}),
          fs: false,
          module: false,
          path: false,
          os: false,
          crypto: false,
        };
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      } else {
        return config;
      }
    },
  };
};
