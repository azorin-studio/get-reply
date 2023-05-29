'use client'

import { Prompt } from "~/db-admin/types"


export default function PromptBody(props: { prompt: Prompt }) {
  const { prompt } = props

  return (
    <div className="p-2 flex flex-col">
      <div className="flex flex-col gap-4">
      <div className="prose flex flex-col">
        <div className="font-bold">prompt: </div>
        <div className="whitespace-pre-wrap">
          {prompt.prompt?.trim()}
        </div>
      </div>
      </div>
    </div>
  )
}
