"use client"

import classNames from "classnames"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import slugify from "slugify"
import CopyToClipboardBadge from "~/components/CopyToClipboardBadge"
import StepForm from "~/components/StepForm"
import usePrompts from "~/hooks/use-prompts"
import { useSupabase } from '~/hooks/use-supabase'

export default function DemoPage(props: any) {
  const { supabase } = useSupabase()
  const prompts = usePrompts()
  const [steps, setSteps] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<null | string>(null)

  const defaultSaveButtonText = `${props.params?.id ? 'Update' : 'Save'} sequence`

  const [saveButtonText, setSaveButtonText] = useState<null | string>(defaultSaveButtonText)
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const router = useRouter()

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
      if (sequence.description) setDescription(sequence.description)
      if (sequence.steps) setSteps(sequence.steps)
    }

    fetchSequence()
  }, [props.params?.id])

  const saveSequence = async () => {
    setError(null)
    setSaveButtonText(props.params?.id ? 'Updating...' : 'Saving...')

    if (!name) {
      setError("Name is required")
      setSaveButtonText(defaultSaveButtonText)
      return
    }

    if (!user) {
      setError("User is required")
      setSaveButtonText(defaultSaveButtonText)
      return
    }

    if (!steps || steps.length === 0) {
      setError("Steps are required")
      setSaveButtonText(defaultSaveButtonText)
      return
    }

    const { data: sequences, error } = await supabase
      .from("sequences")
      .upsert({
        id: props.params?.id,
        name,
        description,
        steps: steps.map(({ id, ...item }) => ({
          ...item,
        })),
        user_id: user.id,
      })
      .select()

    if (error || !sequences || sequences.length === 0) {
      setError(error?.message || "Error saving sequence")
      throw error
    } 

    setSaveButtonText(defaultSaveButtonText)

    router.replace(`/sequences/${sequences[0].id}`)
  }

  return (
    <main className="p-2 flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">
          {!props.params || !props.params.id ? 'New' : 'Update'} Sequence
        </h1>
        <CopyToClipboardBadge text={`${name}@getreply.app`} />
      </div>
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
        <input 
          type="text"
          className='border p-1 rounded'
          placeholder='Description'
          defaultValue={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        />

        <div className="flex flex-col gap-8 py-8">
          {steps.map((step) => (
            <StepForm
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
        
        <div className="flex flex-row justify-end">
          <button
            className={classNames(
              'text-sm border px-2.5 py-1.5',
              'bg-slate-100 border-slate-200 rounded border flex flex-row gap-2 items-center',
              'hover:bg-slate-200'
            )}
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

        <div className="flex flex-row justify-end">
          <button
            className={classNames(
              'text-sm border px-2.5 py-1.5',
              'bg-blue-500 border-blue-600 text-white rounded border flex flex-row gap-2 items-center',
              'hover:bg-blue-600'
            )}
            
            onClick={(e) => {
              saveSequence()
            }}
          >
            {saveButtonText}
          </button>
        </div>
        <div>{error}</div>
      </div>
    </main>
  )
}
