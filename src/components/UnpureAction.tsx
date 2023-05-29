'use client'

import { add, format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Action } from '~/db-admin/types'
import { useSupabase } from "~/hooks/use-supabase"

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
    <div className="flex flex-col gap-2 ml-24 pl-2">
      <div className="flex flex-col gap-2">
        <div className="flex-none text-slate-400">
          Action
        </div>
        <div>
          Name: {action.name}
        </div>
        <div>
          Status: {action.status}
        </div>
        <div>
          Date to run: {format(new Date(action.run_date), 'yyyy-MM-dd HH:mm:ss')}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {action.generation}
      </div>
    </div>
  )
}

export default UnpureAction