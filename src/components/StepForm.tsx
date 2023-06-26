import classNames from "classnames"
import { useState } from "react"
import usePrompts from "~/hooks/use-prompts"

export default function StepForm(props: { 
  step: any, 
  onRemoveStep: any,
  onChange: any,
}) {
  const { onRemoveStep, onChange } = props
  const [step, setStep] = useState(props.step)
  const prompts = usePrompts()
  
  return (
    <div key={step.id} className='flex flex-row gap-2 items-center justify-between'>
      <div className="flex flex-row gap-4">
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
      <div>will send a reminder with a follow up after</div>

      <input
        id="prompt-inputor"
        name="prompt-inputor"
        className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 text-sm"
        type="number"
        value={step.delay}
        onChange={(e) => {
          const newStep = {
            ...step,
            delay: e.target.value,
          }
          setStep(newStep)
          onChange(newStep)
        }}
      />
        {/* {[0, 1,2,3,4,5,6,7,8,9,10, 11, 12,13,14,15,16,17,18,19,20,21,22,23,24].map((delay) => (
          <option key={delay} value={delay}>
            {delay}
          </option>
        ))}
      </input> */}
      <select
        id="prompt-selector"
        name="prompt-selector"
        className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 text-sm"
        value={step.delayUnit || 'days'}
        onChange={(e) => {
          const newStep = {
            ...step,
            delayUnit: e.target.value,
          }
          setStep(newStep)
          onChange(newStep)
        }}
      >
        {['seconds', 'minutes', 'hours', 'days'].map((delayUnit) => (
          <option key={delayUnit} value={delayUnit}>
            {delayUnit}
          </option>
        ))}
      </select>
      </div>
      <button
        className={classNames(
          'text-sm border px-2.5 py-1.5',
          'bg-red-500 border-red-600 text-white rounded border flex flex-row gap-2 items-center',
          'hover:bg-red-600'
        )}
        
        onClick={() => {onRemoveStep(step)}}
      >
        Remove
      </button>
    </div>
  )
}
