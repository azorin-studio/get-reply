import supabaseAdminClient from "~/db-admin/server-admin-client"

export default async function getPromptById (id: string) {
  const { error, data: prompts } = await supabaseAdminClient
    .from('prompts')
    .select()
    .eq('id', id)

  if (error) {
    throw error
  }

  if (!prompts || prompts.length === 0) {
    return null
  }

  const prompt = prompts[0]
  return prompt
}
