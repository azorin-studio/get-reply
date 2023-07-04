'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "~/supabase/database.types"
import { useRouter } from 'next/navigation'
import { Log } from "~/supabase/types"
import { cancelLogAndActionByLogId } from "~/supabase/supabase"

export default function LogActionBar({ log }: { log: Log }) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  return (
    <div className="flex flex-row gap-2">
      {log.status !== 'cancelled' && log.status !== 'complete' && (
        <button 
          onClick={async () => {
            await cancelLogAndActionByLogId(supabase, log.id!)
            router.refresh()
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Cancel
        </button>
      )}

      {log.status === 'cancelled' && (
        <button 
          onClick={async () => {
            // TODO
            await supabase
              .from('logs')
              .update({ status: 'scheduled' })
              .eq('id', log.id)
              router.refresh()
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Resume
        </button>
      )}
    </div>
  )
}