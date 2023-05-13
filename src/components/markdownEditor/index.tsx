import React, { FC, useCallback } from "react"
import dynamic from "next/dynamic"
import * as DOMPurify from "dompurify"
import hljs from "highlight.js"
import { marked } from "marked"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import "highlight.js/styles/atom-one-dark.css"
import "react-markdown-editor-lite/lib/index.css"
import styled from "@emotion/styled"
import tw from "twin.macro"

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
})

export type FieldType = ControllerRenderProps<FieldValues, string>

const enabledPlugins = [
  "header",
  "font-bold",
  "font-italic",
  "font-strikethrough",
  "image",
  "list-unordered",
  "list-ordered",
  "block-quote",
  "block-wrap",
  "block-code-inline",
  "block-code-block",
  "table",
  "link",
  "clear",
  "logger",
  "mode-toggle",
  // "full-screen",
]

const MarkdownEditor: FC<FieldType> = ({ value, ...rest }) => {
  const mdParser = marked.setOptions({
    smartypants: true,
    langPrefix: "hljs language-", // highlight.js css expects a top-level 'hljs' class.
    renderer: new marked.Renderer(),
    // purify html
    sanitizer(html) {
      return DOMPurify.sanitize(html)
    },
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext"
      return hljs.highlight(code, { language }).value
    },
  })

  const handleChange = useCallback(
    (data: FieldType) =>
      ({ text }: { text: string; html: string }) => {
        if (typeof text === "string") {
          return data.onChange(text)
        }
      },
    [],
  )

  return (
    <MdEditorStyled
      {...rest}
      plugins={enabledPlugins}
      style={{ height: "500px" }}
      defaultValue={value}
      placeholder="Write your content here..."
      onChange={handleChange(rest as FieldType)}
      renderHTML={(text) => mdParser.parse(text)}
      shortcuts
      htmlClass="html_section"
      config={{
        view: {
          menu: true,
          md: true,
          html: true,
          fullScreen: true,
          hideMenu: true,
        },
        table: {
          maxRow: 5,
          maxCol: 6,
        },
        imageUrl: "https://octodex.github.com/images/minion.png",
        syncScrollMode: ["leftFollowRight", "rightFollowLeft"],
      }}
    />
  )
}

const MdEditorStyled = styled(MdEditor)`
  ${tw`border-none !bg-transparent mb-5`}
  .html_section {
    ${tw`prose prose-emerald dark:prose-invert `}
  }

  & .rc-md-navigation {
    ${tw`border-none bg-slate-800 text-zinc-100 !rounded-tl-lg !rounded-tr-lg`}
  }

  & .editor-container {
    & .sec-md {
      ${tw`border-r border-neutral-800`}
    }

    & .sec-md textarea {
      ${tw`!bg-slate-950 !text-neutral-100`}
    }

    & .sec-html {
      ${tw`border-l border-neutral-800 bg-slate-950 text-neutral-100`}
    }
  }
`

export default MarkdownEditor
