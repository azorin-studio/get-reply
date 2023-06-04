import * as Popover from '@radix-ui/react-popover'
import { ChevronDown } from "lucide-react"
import { Prompt } from "~/db-admin/types"

export default function PromptSelector(props: { prompts: Prompt[], activePrompt: Prompt | null }) {
  const { prompts, activePrompt } = props
  return (
    <Popover.Root>
      <Popover.Trigger 
        className="flex flex-row items-center gap-2 text-sm border p-2 rounded hover:bg-slate-100"
      >
        {activePrompt?.name || 'Choose a prompt'} <ChevronDown width={16} />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="flex flex-col bg-white border rounded divide-y outline-none focus:outline-none w-44 ml-12"
        >
          {prompts.map((prompt: any) => (
            <a
              className="text-sm px-4 py-2 hover:bg-slate-50 hover:underline"
              href={`/prompts/${prompt.id}`}
              key={prompt.id}
            >
              {prompt.name}
            </a>
          ))}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

  )
}