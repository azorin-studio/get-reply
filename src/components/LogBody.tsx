'use client'

import { formatDistance } from 'date-fns'
import { Log } from '~/types'
import UnpureStep from './UnpureStep'

export default function LogBody(props: { log: Log }) {
  const { log } = props

  let bgColor = 'bg-gray-200'
  if (log.status === "error") {
    bgColor = 'bg-red-400'
  } else if (log.status === "pending") {
    bgColor = 'bg-yellow-100'
  } else if (log.status === "verified") {
    bgColor = 'bg-yellow-300'
  } else if (log.status === "generated") {
    bgColor = 'bg-yellow-500'
  } else if (log.status === "drafted") {
    bgColor = 'bg-green-300'
  }

  return (
    <div className="p-2 flex flex-col">
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          subject
        </div>
        <div>
          {log.subject}
        </div>
      </div>
 
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          date 
        </div>
        <div>
          { log.created_at && formatDistance(new Date(log.created_at), new Date(), { addSuffix: true }) }
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          to 
        </div>
        <div>
          {log.to?.map((to) => to!.address).join(', ')}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          cc 
        </div>
        <div>
          {log.cc?.map((cc) => cc!.address).join(', ')}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          bcc 
        </div>
        <div>
          {log.bcc?.map((bcc) => bcc!.address).join(', ')}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          from
        </div>
        <div>
          {log.from && log.from!.address}
        </div>
      </div>

      {log.errorMessage &&
        <>
          <div className="flex flex-row gap-2 mt-12">
            <div className="text-slate-400 w-24 text-right">
              status
            </div>
            <div
              className='flex flex-row gap-2 items-center w-24'
            >
              <div 
                className={`mt-0 rounded-full p-1 items-center ${bgColor}`}
              >
              </div>
              <div className='items-center capitalize'>
                {log.status}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="text-slate-400 w-24 text-right">
              error 
            </div>
            <div className='text-red-500'>
              {log.errorMessage}
            </div>
          </div>
        </>
      }

      {!log.errorMessage &&
        <>
          <div className="flex flex-row gap-2 mt-12">
            <div className="flex-none text-slate-400 w-24 text-right">
              email body
            </div>
            <div className='border p-2 grow rounded whitespace-pre-wrap'>
              {log.text?.trim()}
            </div>
          </div>

          <div className="mt-12">
            {log.sequence?.steps?.map((step, index) => (
              <UnpureStep
                status={log.status}
                created_at={log.created_at}
                key={`gen${index}`} 
                delay={step!.delay}
                prompt_id={step!.prompt_id}
                generation={log.generations && log.generations[index]}
              />
            ))}
          </div>      
        </>
      }
    </div>
  )
}
