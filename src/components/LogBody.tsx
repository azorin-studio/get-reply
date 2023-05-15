'use client'

import { formatDistance } from 'date-fns'
import { Log } from '~/types'
import UnpureStep from './UnpureStep'

export default function LogBody(props: { log: Log }) {
  const { log } = props

  return (
    <div className="p-2 flex flex-col">
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          subject: 
        </div>
        <div>
          {log.subject}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          status: 
        </div>
        <div>
          {log.status}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          date: 
        </div>
        <div>
          { log.created_at && formatDistance(new Date(log.created_at), new Date(), { addSuffix: true }) }
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          to: 
        </div>
        <div>
          {log.to?.map((to) => to!.address).join(', ')}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          cc: 
        </div>
        <div>
          {log.cc?.map((cc) => cc!.address).join(', ')}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          bcc: 
        </div>
        <div>
          {log.bcc?.map((bcc) => bcc!.address).join(', ')}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-slate-400 w-24 text-right">
          from: 
        </div>
        <div>
          {log.from && log.from!.address}
        </div>
      </div>
      
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
            generation={log.generations![index]}
          />
        ))}
      </div>      
    </div>
  )
}
