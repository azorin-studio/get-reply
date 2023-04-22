import { generateFollowUpEmails } from "~/lib/generate-follow-ups"
import supabaseAdminClient from "~/lib/supabase-admin-client"
import { createGmailDraftAndNotify } from "~/lib/providers/google"

export const processEmail = async (to: string[], from: string, subject: string, email: string) => {
  const { data: profiles } = await supabaseAdminClient()
    .from('profiles')
    .select("*")
    .eq('email', from)
    .limit(1)

  if (!profiles || profiles.length === 0) {
    return { error: 'No profile found' }
  }
  
  const profile = profiles[0]

  const sampleConstraints: string[] = []

  const result = await generateFollowUpEmails(email, sampleConstraints, 0)

  await createGmailDraftAndNotify(profile, to, subject, result.followUpEmail1)
  await createGmailDraftAndNotify(profile, to, subject, result.followUpEmail2)

  return result
}

