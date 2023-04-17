import React from "react";

export default function Typography(props) {
  return (
    <div className="flex flex-col w-full items-center py-8 lg:py-12 px-6">
      <article className="prose lg:prose-xl">{props.children}</article>
    </div>
  );
}
