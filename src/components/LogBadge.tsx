'use client'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { useSupabase } from '~/app/supabase-provider'
import { Log } from '~/types'

export const revalidate = 0

export default function LogBadge(props: { log: Log }) {
  const { supabase } = useSupabase()
  const { log } = props
  
  const handleDelete = async (log: Log) => {
    const { error } = await supabase
      .from('logs')
      .delete()
      .eq('id', `${log.id}`)

    if (error) {
      console.error(error)
    } else {
      window.location.href = '/sequences'
    }
  }

  return (
    <div className="border p-2 rounded flex flex-col gap-4 w-full">
      <div className='flex justify-between'>
        <div className="inline-flex flex-row gap-2">
          <div className="truncate text-sm min-w-64">
            <Link
              href={`/logs/${log.id}`}
              className='font-bold'
            >
              {log.subject}
            </Link>
          </div>
        </div>

        <div className="flex flex-row gap-4 items-center text-sm">
          <div className="text-sm">
            { log.created_at && formatDistance(new Date(log.created_at), new Date(), { addSuffix: true }) }
          </div>
          
          <Popover.Root>
            <Popover.Trigger asChild>
              <button 
                className="w-[35px] h-[35px] inline-flex items-center justify-center text-violet11 hover:cursor-pointer cursor-default outline-none"
                aria-label="Update dimensions"
              >
                <DotsVerticalIcon className="w-4 h-4" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="rounded p-1 border min-w-[170px] bg-white will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
                sideOffset={5}
              >
                <div className="flex flex-col gap-2 text-sm">
                  <Link 
                    href={`#`}
                    className='text-red-500 rounded hover:bg-slate-50 p-2'
                    onClick={(e) => {
                      e.preventDefault()
                      if (confirm('Are you sure you want to delete this log?')) {
                        handleDelete(log)
                      }
                    }}
                  >
                    Delete
                  </Link>
                </div>
                {/* <Popover.Arrow className="fill-white" /> */}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

        </div>
      </div>

      <div>
        {log.status}
      </div>
      
      <div className="">
        <div className="flex flex-row gap-2 text-sm">
          <div className="font-bold">to: </div><div>{log.to?.map((to) => to!.address).join(', ')}</div>
        </div>
        <div className="flex flex-row gap-2 text-sm">
          <div className="font-bold">from: </div><div>{log.from && log.from.address}</div>
        </div>
        <div className="flex flex-row gap-2 text-sm">
          <div className="font-bold">subject: </div><div>{log.subject}</div>
        </div>
      </div>
    </div>
  )
}
