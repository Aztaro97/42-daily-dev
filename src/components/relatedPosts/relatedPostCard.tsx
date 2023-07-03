import React from "react"
import Link from "next/link"
import Skeleton from "react-loading-skeleton"

import { ITags, IUserImage } from "@/@types/types"

interface post {
  id: string
  title: string
  slug: string
  tags: ITags[]
  author: IUserImage
}

export default function RelatedPostCard({ title, tags, slug, author }: post) {
  return (
    <Link href={`/${author}/${slug}`}>
      <div className="p-2 bg-slate-800">
        <h1 className="text-lg font-medium">{title}</h1>
        <div className="flex flex-wrap items-center space-x-1 space-y-1">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-sm">
              <span className=" text-primary">#</span>
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

RelatedPostCard.Skeleton = function RelatedPostCardSkeleton() {
  return (
    <div className="p-2">
      <Skeleton className="w-full" height={20} />
      <div className="flex items-center space-x-1 space-y-1">
        {[...Array(3).keys()].map((_, index) => (
          <Skeleton key={index} width={70} height={10} />
        ))}
      </div>
    </div>
  )
}
