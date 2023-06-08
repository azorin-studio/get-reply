import classNames from 'classnames'
import * as Popover from '@radix-ui/react-popover'
import { ChevronDown } from "lucide-react"
import { Prompt } from "~/db-admin/types"

export default function PromptSelector(props: { prompts: Prompt[], activePrompt: Prompt | null }) {
  const { prompts, activePrompt } = props
  return (
    <Popover.Root>
      <Popover.Trigger 
        className={classNames(
          'border px-2.5 py-1.5',
          'bg-slate-100 border-slate-200 text-slate-800 rounded border flex flex-row gap-2 items-center',
          'hover:bg-slate-200 hover:border-slate-300'
        )}
      >
        {activePrompt?.name || 'Choose a prompt'} <ChevronDown width={16} />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={classNames(
            'flex flex-col bg-white border rounded outline-none focus:outline-none min-w-2xl ml-12 shadow'
          )}
        >
          {prompts.map((prompt: any) => (
            <a
              href={`/prompts/${prompt.id}`}
              key={prompt.id}
              className={classNames(
                'text-sm p-2 hover:bg-slate-50',
                'flex flex-col gap-2',
                'hover:bg-slate-100 last:rounded-b first:rounded-t min-w-64'
              )}
            >
              <div className="font-bold text-slate-800">{prompt.name}</div>
              <div className='text-sm text-slate-600'>
                {prompt.description}
              </div>
            </a>
          ))}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

  )
}