"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import classNames from "classnames"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import slugify from "slugify"
import CopyToClipboardBadge from "~/components/CopyToClipboardBadge"
import StepForm from "~/components/StepForm"
import VisibilityToggle from '~/components/VisibilityToggle'
import { Database } from '~/lib/database.types'
import { Sequence } from "~/lib/types"

export default function DemoPage(props: any) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase.auth])

  const [sequence, setSequence] = useState<Sequence>({
    name: '',
    description: '',
    steps: [],
  })
  const [error, setError] = useState<null | string>(null)
  const defaultSaveButtonText = `${props.params?.id ? 'Update' : 'Save'} sequence`
  const [saveButtonText, setSaveButtonText] = useState<null | string>(defaultSaveButtonText)
  
  useEffect(() => {
    const fetchSequence = async () => {
      if (!props.params || !props.params.id || !user) {
        return
      }

      const { data: sequences, error } = await supabase
        .from("sequences")
        .select("*")
        .eq("id", props.params.id)
        .eq("user_id", user.id)
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

      const sequence: Sequence = sequences[0]
      if (sequence) setSequence(sequence)
    }

    fetchSequence()
  }, [user, supabase, props.params])

  const saveSequence = async () => {
    setError(null)
    setSaveButtonText(props.params?.id ? 'Updating...' : 'Saving...')

    if (!user) {
      setError("User is required")
      setSaveButtonText(defaultSaveButtonText)
      return
    }

    if (!sequence.name) {
      setError("Name is required")
      setSaveButtonText(defaultSaveButtonText)
      return
    }

    if (!sequence.steps || sequence.steps.length === 0) {
      setError("Steps are required")
      setSaveButtonText(defaultSaveButtonText)
      return
    }

    const { data: sequences, error } = await supabase
      .from("sequences")
      .upsert({
        ...sequence,
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

  console.log(sequence.visibility === 'public')

  return (
    <main className="p-2 flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">
          {!props.params || !props.params.id ? 'New' : 'Update'} Sequence
        </h1>

        <div className="flex flex-row gap-2 rounded">      
          <CopyToClipboardBadge text={`${sequence.name}@getreply.app`} />
        </div>
      </div>

      <div className="flex flex-col gap-4">      
        <input 
          type="text"
          className='border p-1 rounded'
          placeholder='Name sequence'
          defaultValue={sequence.name || ''}
          onChange={(e) => {
            setSequence({
              ...sequence,
              name: slugify(e.target.value)
            })
          }}
        />
        
        <textarea 
          className='border p-1 rounded'
          placeholder='Description'
          defaultValue={sequence.description || ''}
          onChange={(e) => {
            setSequence({
              ...sequence,
              description: e.target.value
            })
          }}
        />

        <VisibilityToggle 
          isPublic={sequence.visibility === 'public'}
          onChange={(isPublic: boolean) => {
            setSequence({
              ...sequence,
              visibility: isPublic ? 'public' : 'private',
            })
          }}
        />

        <div className="flex flex-col gap-4">
          {sequence.steps?.map((step, index) => (
            <StepForm
              key={step.id}
              step={step}
              onChange={(step: any) => {
                setSequence({
                  ...sequence,
                  steps: [
                    ...sequence.steps.slice(0, index),
                    step,
                    ...sequence.steps.slice(index + 1),
                  ],
                })

              }}
              onRemoveStep={() => {
                setSequence({
                  ...sequence,
                  steps: [
                    ...sequence.steps.slice(0, index),
                    ...sequence.steps.slice(index + 1),
                  ],
                })
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
              setSequence({
                ...sequence,
                steps: [
                  ...sequence.steps,
                  {
                    prompt_id: null,
                    prompt_name: null,
                    delay: 0,
                    delayUnit: 'days',
                  }
                ]
              })
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
