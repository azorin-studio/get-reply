'use client'

import { format, formatDistance } from 'date-fns'
import { useEffect, useState } from 'react'
import { Action } from '~/db-admin/types'
import { useSupabase } from "~/hooks/use-supabase"
import StatusBadge from './StatusBadge'

export const revalidate = 0

const UnpureAction = (props: { 
  action_id: string
}) => {
  const { action_id } = props
  const { supabase } = useSupabase()
  const [action, setAction] = useState<Action | null>(null)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  useEffect(() => {
    const fetchAction = async () => {
      setRefreshing(true)
      const { data } = await supabase
        .from('actions')
        .select('*')
        .eq('id', action_id)
        .limit(1)
        let action = null
        if (data && data.length > 0) {
          action = data[0] as Action
        }

      setAction(action)
      setRefreshing(false)
    }
    fetchAction()
  }, [])

  const retryAction = async (action_id: string) => {
    setRefreshing(true)
    await fetch(`/api/retry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action_id
      })
    })
    setRefreshing(false)
  }

  if (!action) {
    return (
      <div className="flex flex-col gap-2 ml-24 pl-2">
        <div className="flex flex-col gap-2">
          <div className="flex-none text-slate-400">
            Action
          </div>
          <div className='border p-2 grow rounded whitespace-pre-wrap'>
            Loading...
          </div>
        </div>
      </div>
    )
  }

  return (      
    <div className="w-full flex flex-col border rounded divide-y">
      <div className="w-full p-2 flex flex-row items-center justify-between bg-slate-50">
        <div className="flex flex-col">
          <div className="text-sm">
            Will <span className="font-bold">{action.name}</span> on { action.created_at && 
              <span>
                {format(new Date(action.created_at as string), 'LLLL dd, yyyy, h:MM a')}  ({formatDistance(new Date(action.run_date as string), new Date(), { addSuffix: true })})          
              </span>
            }
          </div>
        </div>
        <div className='flex flex-row gap-4 items-center'>
          {action.status && <StatusBadge status={action.status} />}
          {action!.errorMessage && (
            <button
              className={`flex-none text-slate-400 hover:text-slate-500 text-sm`}
              onClick={() => retryAction(action.id!)}
            >
              {refreshing ? 'Refreshing...' : 'Retry'}
            </button>
          )}
        </div>

      </div>

      {action!.errorMessage &&
        <div className={`bg-red-50 p-2 text-xs font-medium text-red-500`}>
          {action.errorMessage}
        </div>
      }

      <div className="w-full p-2 flex flex-row items-center justify-between text-sm whitespace-pre-wrap">
        {action?.generation?.trim()}
      </div>
    </div>
  )
}

export default UnpureAction