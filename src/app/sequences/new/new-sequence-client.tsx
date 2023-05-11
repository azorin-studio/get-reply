"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import slugify from "slugify"
import { useSupabase } from "~/app/supabase-provider"
import Step from "~/components/Step"
import usePrompts from "~/hooks/use-prompts"

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
    <main className="flex-grow h-full grid grid-cols-3 gap-4 rounded">
      <div></div>
      
      <div>
        <div>
          <input 
            type="text"
            className='border p-1 rounded'
            placeholder='Name sequence'
            onChange={(e) => {
              setName(slugify(e.target.value))
            }}
          />
          <div className="text-sm">Sequence will be available at: {name}@getreply.app</div>
        </div>
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
            onRemoveStep={(e) => {
              const newSteps = [...steps].filter(function(s) {
                return s.id !== step.id
              })
              setSteps(newSteps)
            }}
          />
        ))}
        <button
          className='border p-1 rounded'
          onClick={(e) => {
            setSteps([...steps, {
              id: Math.random().toString(36).substring(7),
              prompt_id: prompts && prompts[0].id,
              delay: 0,
            }])
          }}
        >
          Add step
        </button>

        <button
          className='border p-1 rounded'
          onClick={(e) => {
            saveSequence()
          }}
        >
          Save sequence
        </button>
        <div>{error}</div>
      </div>
    </main>
  )
}
