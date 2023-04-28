'use client'

import LogBadge from '~/components/LogBadge'
import { Log } from '~/types'
import { useSupabase } from '~/app/supabase-provider'
import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'

export const revalidate = 0

const UnpureLogsList = () => {
  const { supabase } = useSupabase()
  const [logs, setLogs] = useState<Log[] | null>(null)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  useEffect(() => {
    const fetchLogs = async () => {
      setRefreshing(true)
      const { data } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
      setLogs(data as Log[])
      setRefreshing(false)
    }

    let interval = setInterval(fetchLogs, 5000)
    fetchLogs()
    return (() => {
      clearInterval(interval)
    })
  }, [])

  return (      
    <div className="flex flex-col gap-4">
      <div className="inline-flex">
        <div className="font-bold">
          Logs
        </div>
        {refreshing && <Loader className="animate-spin ml-2 text-slate-300" />}
      </div>
      {logs && logs.map((log) => (<LogBadge key={log.id} log={log} />))}
    </div>
  )
}

export default UnpureLogsList