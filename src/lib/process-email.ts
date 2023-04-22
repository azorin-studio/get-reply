// import { generateFollowUpEmails } from "~/lib/generate-follow-ups"
// import supabaseAdminClient from "~/lib/supabase-admin-client"
// import { createGmailDraftAndNotify } from "~/lib/providers/google"

export const processEmail = async (from: string, subject: string, email: string) => {
  return 1
  // const { data: profiles } = await supabaseAdminClient()
  //   .from('profiles')
  //   .select("*")
  //   .eq('email', from)
  //   .limit(1)

  //   console.log(3)

  // return 1

  // if (!profiles || profiles.length === 0) {
  //   return { error: 'No profile found' }
  // }
  
  // const profile = profiles[0]

  // const sampleConstraints: string[] = []
  // const result = await generateFollowUpEmails(email, sampleConstraints, 0)
  
  // console.log(4)
  
  // await createGmailDraftAndNotify(profile, subject, result.followUpEmail1)

  // console.log(5)
  // return result
}

