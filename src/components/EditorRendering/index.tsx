import React, { FC } from "react"
import Blocks from "editorjs-blocks-react-renderer"

interface props {
  data: any
}

const blockConfig = {
  code: {
    className: "language-js",
  },
  delimiter: {
    className: "border border-2 w-16 mx-auto",
  },
  embed: {
    className: "border-l border-primary p-3",
  },
  header: {
    className: "font-bold text-2xl",
  },
  image: {
    className: "w-full max-w-screen-md",
    actionsClassNames: {
      stretched: "w-full h-80 object-cover",
      withBorder: "border border-2",
      withBackground: "p-2",
    },
  },
  list: {
    className: "list-inside",
  },
  paragraph: {
    className: "text-base text-opacity-75",
    actionsClassNames: {
      alignment: "text-{alignment}", // This is a substitution placeholder: left or center.
    },
  },
  quote: {
    className: "py-3 px-5 italic",
  },
  table: {
    className: "table-auto",
  },
}

const BlockEditorRendering: FC<props> = ({ data }) => {
  return <Blocks data={data} config={blockConfig} />
}

export default BlockEditorRendering
