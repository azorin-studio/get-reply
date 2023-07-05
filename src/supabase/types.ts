import { Database } from "~/supabase/database.types"

export type Status = 
  'received' | 
  'generated' |
  'sleeping' |
  'complete' | 
  'error' |
  'cancelled' 

export type Profile = Database['public']['Tables']['profiles']['Row']

export type Prompt = Database['public']['Tables']['prompts']['Row'] & {
  profile: Profile
}

export type Log = Database['public']['Tables']['logs']['Row'] & {
  profile: Profile
}

export type Action = Database['public']['Tables']['actions']['Row'] & {
  prompt: Prompt,
  log: Log
}

export interface Contact {
  address: string
  name:    string
}

export type IncomingEmail = {
  from: Contact
  to: Contact[]
  bcc?: Contact[]
  cc?: Contact[]
  attachments?: any[],
  headers: any[],
  subject: string,
  messageId: string,
  date: string,
  text: string,
}
