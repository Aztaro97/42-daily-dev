/** @type {import("prettier").Config & { [key:string]: any }} */

const config = {
  arrowParens: "always",
  endOfLine: "lf",
  semi: false,
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  tailwindConfig: "./tailwind.config.ts",
  importOrder: [
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/utils/(.*)$",
    "^@/lib/(.*)$",
    "^@/components/(.*)$",
    "^@/store/(.*)$",
    "^@/styles/(.*)$",
    "^@/types/(.*)$",
    "^@/schema/(.*)$",
    "^@/contents/(.*)$",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
}

module.exports = config
