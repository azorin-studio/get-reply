'use client'

import LogBadge from '~/components/LogBadge'
import { Log } from '~/types'
import { useSupabase } from '~/app/supabase-provider'
import { useEffect, useState } from 'react'
import LogBody from './LogBody'

export const revalidate = 0

const UnpureLogItem = (props: { id: string }) => {
  const id = props.id
  const { supabase } = useSupabase()
  const [log, setLog] = useState<Log | null>(null)

  useEffect(() => {
    const fetchLog = async () => {
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
    }

    fetchLog()
  }, [])

  if (!log) return <div></div>

  return (      
    <div className="flex flex-col gap-4">
      <LogBadge 
        log={log} 
      />
      <LogBody
        log={log} 
      />
    </div>
  )
}

export default UnpureLogItem