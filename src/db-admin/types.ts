
import { Database, Json as JsonType } from "./database.types";

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

// export type Log = Database['public']['Tables']['logs']['Insert']
export type Log = Omit<
    Database['public']['Tables']['logs']['Insert'], 
    'from' | 'to' | 'bcc' | 'cc'
  > & {
  from: any;
  to: any[] | null;
  bcc: any[] | null;
  cc: any[] | null;
  sequence?: Sequence | null;
  action_ids: string[] | null | undefined
}

export type IncomingEmail = Pick<Log, 'bcc' | 'cc' | 'date' | 'from' | 'headers' | 'html' | 'messageId' | 'subject' | 'text' | 'to' > & {
  from: Contact;
  to: Contact[];
  bcc: Contact[];
  attachments?: any[];
}

export type Json = JsonType

export type Action = Database['public']['Tables']['actions']['Insert']

export type Profile = Database['public']['Tables']['profiles']['Row']

export type Prompt = Database['public']['Tables']['prompts']['Insert']

export type Sequence = Omit<
  Database['public']['Tables']['sequences']['Insert'],
  'steps'
> & {
  // steps?: {
  //   prompt_id: string;
  //   delay:    number;
  // }[] | null
  steps?: any[] | null
}