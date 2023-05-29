import { useEffect, useState } from "react"
import { Prompt } from "~/db-admin/types"
import { useSupabase } from "~/hooks/use-supabase"

export default function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const { supabase } = useSupabase()
  useEffect(() => {
    const fetchPrompts = async () => {
      const { data: prompts, error } = await supabase
        .from('prompts')
        .select('*')
        .order('id', { ascending: true })
        .limit(10)

      if (error) console.error(error)
      if (prompts) setPrompts(prompts)
    }
    fetchPrompts()
  }, [])

  return prompts
}