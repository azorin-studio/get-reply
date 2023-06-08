'use client'

import { format, formatDistance } from 'date-fns'
import { Log } from '~/db-admin/types'
import { useSupabase } from '~/hooks/use-supabase'
import StatusBadge from './StatusBadge'
import UnpureAction from './UnpureAction'
import classNames from 'classnames'
import { useState } from 'react'

export default function LogBody(props: { log: Log }) {
  const { log } = props

  const [showAll, setShowAll] = useState(false)

  return (
    <div className="w-full p-2 flex flex-col gap-4">
      
      <div className='border rounded-sm divide-y'>
        <div className="w-full p-2 flex flex-row items-center justify-between bg-slate-50 group-hover:bg-slate-100">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col text-sm">
              <div className="font-bold">
                {log.subject}
              </div>
              <div className="text-gray-600">
                to {' '}{log.to?.map((to) => to!.address).join(', ')}
              </div>
            </div>
          </div>

          <div className='flex flex-row gap-4 items-center'>
            {log.status && <StatusBadge status={log.status} />}
            <div className="text-gray-600 text-sm">
              { log.created_at && 
                <span>
                  {format(new Date(log.created_at), 'dd LLL, h:MM a')}
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


        <div className="flex flex-col gap-2 p-2">
          <div
            className={classNames(
              "whitespace-pre-wrap text-sm max-w-full truncate",
              showAll ? 'line-clamp-none' : 'line-clamp-3',
            )}
          >
            {log.text?.trim()}
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
