import NewPromptClient from '~/app/prompts/new-prompt-client'

export default async function Page(params: any) {
  return <NewPromptClient {...params} />
}
