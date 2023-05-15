import { useState } from "react"
import usePrompts from "~/hooks/use-prompts"

export default function Step(props: { 
  step: any, 
  onRemoveStep: any,
  onChange: any,
}) {
  const { onRemoveStep, onChange } = props
  const [step, setStep] = useState(props.step)
  const prompts = usePrompts()
  
  return (
    <div key={step.id} className='p-1 flex flex-row gap-2 items-center'>
      <select
        id="prompt-selector"
        name="prompt-selector"
        className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 text-sm"
        value={prompts.find(p=>p.id==step.prompt_id)?.name || ""}
        onChange={(e) => {
          const prompt = prompts.find((p: any) => p.name === e.target.value)
          if (prompt) {
            const newStep = {
              ...step,
              prompt_id: prompt.id,
            }
            setStep(newStep)
            onChange(newStep)
          }
          
        }}
      >
        {prompts.map((prompt: any) => (
          <option key={prompt.name} value={prompt.name}>
            {prompt.name}
          </option>
        ))}
      </select>
      <div>after</div>
      <select
        id="prompt-selector"
        name="prompt-selector"
        className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 text-sm"
        value={step.delay}
        onChange={(e) => {
          const newStep = {
            ...step,
            delay: e.target.value,
          }
          setStep(newStep)
          onChange(newStep)
        }}
      >
        {[0, 1,2,3,4,5,6,7,8,9,10].map((delay) => (
          <option key={delay} value={delay}>
            {delay}
          </option>
        ))}
      </select>
      <div>days</div>
      <button
        className='border px-2 rounded'
        onClick={() => {onRemoveStep(step)}}
      >
        x
      </button>
    </div>
  )
}
