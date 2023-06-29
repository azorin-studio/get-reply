
import { Database, Json as JsonType } from "~/supabase/database.types";

export type Status = 
  'pending' | 
  'verifying' | 'waiting-to-generate' | 
  'generating' | 'waiting-to-assign' | 
  'assigning' | 'waiting-to-draft' | 'waiting-to-reply' |
  'drafting' | 'drafted' |
  'replying' | 'replied' |
  'to-draft' | 'to-reply' | 
  'error'

export interface Contact {
  address: string;
  name:    string;
}

export interface Header {
  key:   string;
  value: string;
}

export type Log = Omit<
    Database['public']['Tables']['logs']['Insert'], 
    'from' | 'to' | 'bcc' | 'cc'
  > & {
  from: any;
  to: any[] | null;
  bcc: any[] | null;
  cc: any[] | null;
  profile: Profile;
}

export type LogRead = Omit<
    Database['public']['Tables']['logs']['Row'], 
    'from' | 'to' | 'bcc' | 'cc'
  > & {
  from: any;
  to: any[] | null;
  bcc: any[] | null;
  cc: any[] | null;
  profile: Profile;
}


export type IncomingEmail = Pick<Log, 'bcc' | 'cc' | 'date' | 'from' | 'headers' | 'html' | 'messageId' | 'subject' | 'text' | 'to' > & {
  from: Contact;
  to: Contact[];
  bcc?: Contact[];
  cc?: Contact[];
  attachments?: any[];
}

export type Json = JsonType

export type Action = Database['public']['Tables']['actions']['Insert'] & {
  prompt: Prompt,
  log: Log
}

export type Profile = Database['public']['Tables']['profiles']['Row']

export type Prompt = Database['public']['Tables']['prompts']['Insert']
