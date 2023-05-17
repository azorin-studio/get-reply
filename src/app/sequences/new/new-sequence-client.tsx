"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import slugify from "slugify"
import Step from "~/components/Step"
import usePrompts from "~/hooks/use-prompts"
import { useSupabase } from '~/hooks/use-supabase'

export default function DemoPage(props: any) {
  const { supabase } = useSupabase()
  const prompts = usePrompts()
  const [steps, setSteps] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<null | string>(null)
  const [name, setName] = useState<string>("")
  const router = useRouter()
  const [description, setDescription] = useState<string>("")

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchSequence = async () => {
      if (!props.params || !props.params.id) {
        return
      }
      const { data: sequences, error } = await supabase
        .from("sequences")
        .select("*")
        .eq("id", props.params.id)
        .limit(1)

      if (error || !sequences) {
        console.log("error", error, sequences)
        setError(error?.message || "Error fetching sequence")
        throw error
      } 

      if (sequences.length === 0) {
        setError("Sequence not found")
        return
      }

      const sequence = sequences[0]

      if (sequence.name) setName(sequence.name)
      if (sequence.description) setDescription(sequence.description)
      if (sequence.steps) setSteps(sequence.steps)
    }

    fetchSequence()
  }, [props.params?.id])

  const saveSequence = async () => {
    setError(null)

    if (!name) {
      setError("Name is required")
      return
    }

    if (!user) {
      setError("User is required")
      return
    }

    if (!steps || steps.length === 0) {
      setError("Steps are required")
      return
    }

    const { data: sequences, error } = await supabase
      .from("sequences")
      .insert({
        name,
        description,
        steps: steps.map(({ id, ...item }) => item),
        user_id: user.id,
      })
      .select()

    if (error || !sequences || sequences.length === 0) {
      setError(error?.message || "Error saving sequence")
      throw error
    } 

    router.replace(`/sequences/${sequences[0].id}`)
  }

  return (
    <main className="max-w-2xl mx-auto p-4 flex flex-col font-sans text-slate-800 antialiased">
      <div className="flex flex-col gap-2 rounded">      
        <input 
          type="text"
          className='border p-1 rounded'
          placeholder='Name sequence'
          defaultValue={name}
          onChange={(e) => {
            setName(slugify(e.target.value))
          }}
        />

        <div className="text-sm">Sequence will be available at: {name}@getreply.app</div>

        <div className="divide-y border rounded">
          {steps.map((step) => (
            <Step
              key={step.id}
              step={step}
              onChange={(changedStep: any) => {
                const newSteps = [...steps].map(function(s) {
                  if (s.id === step.id) {
                    return changedStep
                  }
                  return s
                })
                setSteps(newSteps)
              }}
              onRemoveStep={() => {
                const newSteps = [...steps].filter(function(s) {
                  return s.id !== step.id
                })
                setSteps(newSteps)
              }}
            />
          ))}
        </div>
        
        <div>
          <button
            className='border p-1 rounded text-sm'
            onClick={(e) => {
              setSteps([...steps, {
                id: Math.random().toString(36).substring(7),
                prompt_id: prompts && prompts[0].id,
                delay: 0,
              }])
            }}
          >
            + Add step
          </button>
        </div>

        <div>
          <button
            className='border p-1 rounded mt-4 text-sm'
            onClick={(e) => {
              saveSequence()
            }}
          >
            Save sequence
          </button>
        </div>
        <div>{error}</div>
      </div>
    </main>
  )
}
