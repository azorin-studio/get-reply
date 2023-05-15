'use client'
import { Log } from '~/types'

export default function LogBody(props: { log: Log }) {
  const { log } = props

  return (
    <div className="p-2 flex flex-col">
      <div className="prose flex flex-row gap-2">
        <div className="font-bold">to: </div><div>{log.to?.map((to) => to!.address).join(', ')}</div>
      </div>
      <div className="prose flex flex-row gap-2">
        <div className="font-bold">cc: </div><div>{log.cc?.map((cc) => cc!.address).join(', ')}</div>
      </div>
      <div className="prose flex flex-row gap-2">
        <div className="font-bold">bcc: </div><div>{log.bcc?.map((bcc) => bcc!.address).join(', ')}</div>
      </div>
      <div className="prose flex flex-row gap-2">
        <div className="font-bold">from: </div><div>{log.from && log.from!.address}</div>
      </div>
      <div className="prose flex flex-row gap-2">
        <div className="font-bold">subject: </div><div>{log.subject}</div>
      </div>

      <div className="flex flex-col gap-4">
      <div className="prose flex flex-col">
        <div className="font-bold">body: </div>
        <div className="whitespace-pre-wrap">
          {log.text?.trim()}
        </div>
      </div>
        <div className="prose flex flex-col">
          {log.generations?.map((generation, index) => (
            <div key={`gen${index}`}>
              <div className="font-bold">prompt {index + 1}: </div>
              <div className="font-bold">generation {index + 1}: </div>
              <div className="whitespace-pre-wrap">
                {generation?.trim()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
