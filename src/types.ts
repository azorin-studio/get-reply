
import { Database, Json as JsonType } from "./lib/database.types"

export type Log = Omit<Database['public']['Tables']['logs']['Row'], 'id'> & {
  id?: string;
}

export type IncomingEmail = Pick<Log, 'bcc' | 'cc' | 'date' | 'from' | 'headers' | 'html' | 'messageId' | 'subject' | 'text' | 'to' > & {
  from: Contact;
  to: Contact[];
  bcc: Contact[];
}

export type Json = JsonType

export type Profile = Database['public']['Tables']['profiles']['Row']

export interface Contact {
  address: string;
  name:    string;
}

export interface Header {
  key:   string;
  value: string;
}