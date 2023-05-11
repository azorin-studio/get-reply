'use client'

import { Loader } from "lucide-react"
import { useEffect, useState } from 'react'
import { useSupabase } from '~/app/supabase-provider'
import LogBadge from '~/components/LogBadge'
import { Log } from '~/types'
import LogBody from './LogBody'

export const revalidate = 0

const UnpureLogItem = (props: { id: string }) => {
  const id = props.id
  const { supabase } = useSupabase()
  const [log, setLog] = useState<Log | null>(null)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  useEffect(() => {
    const fetchLog = async () => {
      setRefreshing(true)
      const { data } = await supabase
        .from('logs')
        .select('*')
        .eq('id', id)
        .limit(1)
        let log = null
        if (data && data.length > 0) {
          log = data[0] as Log
        }

      setLog(log)
      setRefreshing(false)
    }
    let interval = setInterval(fetchLog, 5000)
    fetchLog()
    return (() => {
      clearInterval(interval)
    })
  }, [])

  if (!log) return <div></div>

  return (      
    <div className="flex flex-col gap-4">
      <div className='flex justify-end'>
      {refreshing ?
        <Loader className="animate-spin ml-2 text-slate-300" />
      : <div className="inline-flex">
          <div className='opacity-0'>
            Log
          </div>
        </div>
      }
      </div>
      <LogBadge 
        log={log} 
      />
      <LogBody
        log={log} 
      />
      <div className="text-red-500">{log.errorMessage}</div>
    </div>
  )
}

export default UnpureLogItem