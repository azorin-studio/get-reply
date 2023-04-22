import { generateFollowUpEmails } from "~/lib/generate-follow-ups"
import supabaseAdminClient from "~/lib/supabase-admin-client"
import { createGmailDraftAndNotify } from "~/lib/providers/google"

export interface Email {
  headers:     Header[];
  from:        From;
  to:          From[];
  bcc:         From[];
  subject:     string;
  messageId:   string;
  date:        Date;
  html:        string;
  text:        string;
  attachments: any[];
}

export interface From {
    address: string;
    name:    string;
}

export interface Header {
    key:   string;
    value: string;
}

export const processEmail = async (email: Email) => {
  const { from, subject } = email
  const { data: profiles } = await supabaseAdminClient()
    .from('profiles')
    .select("*")
    .eq('email', from.address)
    .limit(1)

  if (!profiles || profiles.length === 0) {
    console.log('No profile found')
    return { error: 'No profile found' }
  }
  
  const profile = profiles[0]
  const sampleConstraints: string[] = []
  
  console.log('generating follow up emails')
  const result = await generateFollowUpEmails(email.text, sampleConstraints, 0)
  console.log('generated follow up emails')
  const to = email.to.map(t => t.address)
  console.log('creating gmail drafts')
  await createGmailDraftAndNotify(profile, to, subject, result.followUpEmail1, email)
  await createGmailDraftAndNotify(profile, to, subject, result.followUpEmail2, email)
  return result
}

