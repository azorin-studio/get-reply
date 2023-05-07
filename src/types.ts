
import { Database, Json as JsonType } from "./database.types"

export type Status = 'pending' | 'verified' | 'generated' | 'drafted'

export interface Contact {
  address: string;
  name:    string;
}

export interface Header {
  key:   string;
  value: string;
}

export type Log = Omit<
    Database['public']['Tables']['logs']['Row'], 
    'id' | 'from' | 'to' | 'bcc' | 'cc' | 'user_id' | 'created_at'
  > & {
  id?: string;
  user_id?: string | null | undefined;

  // // this is done to stop it being a Json type, because of this issue:
  // // Property 'address' does not exist on type 'string | number | boolean | { [key: string]: Json; } | Json[]'.
  // // Property 'address' does not exist on type 'string'
  status: Status;
  from: Contact | null;
  to: Contact[] | null;
  bcc: Contact[] | null;
  cc: Contact[] | null;
}

export type IncomingEmail = Pick<Log, 'bcc' | 'cc' | 'date' | 'from' | 'headers' | 'html' | 'messageId' | 'subject' | 'text' | 'to' > & {
  from: Contact;
  to: Contact[];
  bcc: Contact[];
  attachments?: any[];
}

export type Json = JsonType

export type Profile = Database['public']['Tables']['profiles']['Row']

export type Prompt = Database['public']['Tables']['prompts']['Row']

export type Sequence = Omit<
  Database['public']['Tables']['sequences']['Row'],
  'prompt_list'
> & {
  prompt_list?: {
    prompt_id: string;
    delay:    number;
  }[] | null
}