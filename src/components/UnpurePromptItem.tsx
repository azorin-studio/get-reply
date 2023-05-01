'use client'

import PromptBadge from '~/components/PromptBadge'
import { Loader } from "lucide-react"
import { Prompt } from '~/types'
import { useSupabase } from '~/app/supabase-provider'
import { useEffect, useState } from 'react'
import PromptBody from './PromptBody'

export const revalidate = 0

const UnpurePromptItem = (props: { id: string, compact: boolean }) => {
  const { id, compact = false } = props
  const { supabase } = useSupabase()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  useEffect(() => {
    const fetchPrompt = async () => {
      setRefreshing(true)
      const { data } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .limit(1)
        let prompt = null
        if (data && data.length > 0) {
          prompt = data[0] as Prompt
        }

      setPrompt(prompt)
      setRefreshing(false)
    }
    // let interval = setInterval(fetchPrompt, 5000)
    fetchPrompt()
    // return (() => {
    //   clearInterval(interval)
    // })
  }, [])

  if (!prompt) return <div></div>

  return (      
    <div className="flex flex-col gap-4">
      {refreshing &&
        <Loader className="animate-spin ml-2" />
      }
      <PromptBadge
        compact={compact}
        prompt={prompt} 
      />

      {!compact && 
        <PromptBody
          prompt={prompt} 
        />
      }

    </div>
  )
}

export default UnpurePromptItem