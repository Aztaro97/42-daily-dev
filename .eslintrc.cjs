// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path")

/** @type {import("eslint").Linter.Config} */
const config = {
  $schema: "https://json.schemastore.org/eslintrc",
  root: true,
  overrides: [
    {
      //   extends: [
      //     "plugin:@typescript-eslint/recommended-requiring-type-checking",
      //   ],
      parser: "@typescript-eslint/parser",
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  plugins: ["tailwindcss"],
  extends: ["next/core-web-vitals", "plugin:tailwindcss/recommended"],
  rules: {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off",
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/classnames-order": "warn",
  },
}

module.exports = config
