'use client'

import { format, formatDistance } from 'date-fns'
import { Log } from '~/db-admin/types'
import { useSupabase } from '~/hooks/use-supabase'
import StatusBadge from './StatusBadge'
import UnpureAction from './UnpureAction'

export default function LogBody(props: { log: Log }) {
  const { log } = props
  const { supabase } = useSupabase()

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
    <div className="w-full p-2 flex flex-col gap-4">
      
      <div className='border rounded-sm divide-y'>
        <div className="w-full p-2 flex flex-row items-center justify-between bg-slate-50">
          <div className="flex flex-col">
            <div className="text-sm font-bold">
              {log.from.address}
            </div>
            <div className="text-gray-600 text-sm">
              to{' '}{log.to?.map((to) => to!.address).join(', ')}
            </div>
          </div>

          <div className='flex flex-row gap-4 items-center'>
            {log.status && <StatusBadge status={log.status} />}
            <div className="text-gray-600 text-sm">
              { log.created_at && 
                <span>
                  {format(new Date(log.created_at), 'LLLL dd, yyyy, h:MM a')}  ({formatDistance(new Date(log.created_at), new Date(), { addSuffix: true })})
                </span>
              }
            </div>
          </div>
        </div>

        {log.errorMessage &&
          <div className={`bg-red-50 p-2 text-xs font-medium text-red-500`}>
            {log.errorMessage}
          </div>
        }

        <div className="w-full p-2 flex flex-row items-center justify-between text-sm whitespace-pre-wrap">
          {log.text?.trim()}
        </div>

      </div>

      {log.action_ids?.map((action_id, index) => (
        <UnpureAction
          key={index}
          action_id={action_id}
        />
      ))}

    </div>
  )
}
