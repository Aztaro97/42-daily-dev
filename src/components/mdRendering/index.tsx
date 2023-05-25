import React, { FC } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface props {
  data: any
}

const MdRendering: FC<props> = ({ data }) => {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{data}</ReactMarkdown>
}

export default MdRendering
