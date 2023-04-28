'use client'

import LogBadge from '~/components/LogBadge'
import { Log } from '~/types'
import { useSupabase } from '~/app/supabase-provider'
import { useEffect, useState } from 'react'

export const revalidate = 0

const UnpureLogsList = () => {
  const { supabase } = useSupabase()
  const [logs, setLogs] = useState<Log[] | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
      setLogs(data as Log[])
    }

    fetchLogs()
  }, [])

  return (      
    <div className="flex flex-col gap-4">
      <div className="font-bold">
        Logs
      </div>
      {logs && logs.map((log) => (<LogBadge key={log.id} log={log} />))}
    </div>
  )
}

export default UnpureLogsList