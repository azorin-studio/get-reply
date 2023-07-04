'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cancelLogAndActionByLogId } from "~/supabase/supabase"
import { Database } from "~/supabase/database.types"

export default function CancelAlert ({ id, cancel }: { id: string, cancel: boolean }) {
  'use client'
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [visible, setVisible] = useState(cancel)

  useEffect(() => {
    async function asyncFn() {
      if (cancel) {
        await cancelLogAndActionByLogId(supabase, id)
        router.replace(`/logs/${id}`)
      }
    }  
    asyncFn()
  }, [cancel, id, supabase, router])

  if (!visible) return (<div />)

  return (
    <div className="flex grow flex-row gap-2 bg-red-50 border border-red-100 rounded p-2">
      <button
        onClick={() => setVisible(false)}
      >
        [x]
      </button>
      Cancelled
    </div>
  )
}