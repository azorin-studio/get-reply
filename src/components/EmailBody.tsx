'use client'

import classNames from "classnames"
import { useState } from "react"

export default function EmailBody(props: { text: string }) {
  const { text } = props
  const [showAll, setShowAll] = useState(false)

  return (
    <div className="flex flex-col gap-2 p-2">
    <div
      className={classNames(
        "whitespace-pre-wrap text-sm max-w-full truncate",
        showAll ? 'line-clamp-none' : 'line-clamp-[16]',
      )}
    >
      {text?.trim()}
    </div>
    <button
      className="text-sm font-medium text-blue-500 hover:text-blue-600"
      onClick={() => {
        setShowAll(!showAll)
      }}
    >
      {showAll ? '-' : '+'} Show {showAll ? 'less' : 'all'}
    </button>
  </div>
  )
}