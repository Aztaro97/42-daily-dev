import React, { FC } from "react"

interface props {
  data: any
}


const BlockEditorRendering: FC<props> = ({ data }) => {
  return (
    <div
      className={`markdown__content prose-emerald break-words dark:prose-invert dark:prose-hr:border-neutral-700`}
      dangerouslySetInnerHTML={{ __html: data || "" }}
    />
  )
}

export default BlockEditorRendering
