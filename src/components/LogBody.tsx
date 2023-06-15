'use client'

import { format } from 'date-fns'
import { Log, Sequence } from '~/db-admin/types'
import StatusBadge from './StatusBadge'
import StepBody from './StepBody'
import classNames from 'classnames'
import { useState } from 'react'
import Link from 'next/link'
import * as Popover from '@radix-ui/react-popover'
import { LuMoreVertical } from 'react-icons/lu'
import { statusColors } from './status-colors'

export default function LogBody(props: { log: Log, sequence: Sequence }) {
  const { log, sequence } = props

  const statusColor = (log.status && statusColors[log.status]) || 'blue'

  const [showAll, setShowAll] = useState(false)

  return (
    <div className="w-full flex flex-col gap-4">
      <div className='border rounded-sm divide-y'>
        <div className="w-full p-2 flex flex-row items-center justify-between bg-slate-50 group-hover:bg-slate-100">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col text-sm">
              <div className="font-bold">
                {log.subject}
              </div>
              <div className="text-gray-600">
                to{' '}{log.to?.map((to) => to.address).join(', ')}
                {/* Dont tidy this, otherwise it causes a weird hydration bug  */}
                {log.cc && ', '}
                {log.cc && `, ${log.cc.map((cc) => cc.address).join(', ')}`}
                {log.bcc && ', '}
                {log.bcc && log.bcc.map((bcc) => bcc.address).join(', ')}
              </div>
            </div>
          </div>

          <div className='flex flex-row gap-4 items-center'>
            {log.status && <StatusBadge status={log.status} />}
            <div className="text-gray-600 text-sm">
              { log.created_at && 
                <span>
                  {format(new Date(log.created_at), 'dd LLL, HH:mm')}
                </span>
              }
            </div>
            <Popover.Root>
              <Popover.Trigger 
                className={classNames(
                  'text-slate-700 hover:text-slate-500'
                )}
              >
                <LuMoreVertical />
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  className={classNames(
                    'flex flex-col bg-white border rounded',
                    'outline-none focus:outline-none  shadow',
                    'divide-y divide-gray-100 py-2'
                  )}
                >
                  <Link
                    href={`/sequences/${sequence.id}`}
                    legacyBehavior
                  >
                    <div
                      className={classNames(
                        "cursor-pointer text-sm",
                        "px-3 py-1 inline-flex hover:bg-slate-100"
                      )}
                    >
                      Open sequence (followup)
                    </div>
                  </Link>

                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>

        {log.errorMessage &&
          <div className={`bg-${statusColor}-50 p-2 text-xs font-medium text-${statusColor}-500`}>
            {log.errorMessage}
          </div>
        }

        <div className="flex flex-col gap-2 p-2">
          <div
            className={classNames(
              "whitespace-pre-wrap text-sm max-w-full truncate",
              showAll ? 'line-clamp-none' : 'line-clamp-[16]',
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
        <StepBody
          key={index}
          action_id={action_id}
          log_id={log.id!}
          logText={log.text}
          status={log.status}
        />
      ))}

    </div>
  )
}
