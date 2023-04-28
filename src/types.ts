
import { Database, Json as JsonType } from "./database.types"

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
    'id' | 'from' | 'to' | 'bcc' | 'cc'
  > & {
  id?: string;

  // // this is done to stop it being a Json type, because of this issue:
  // // Property 'address' does not exist on type 'string | number | boolean | { [key: string]: Json; } | Json[]'.
  // // Property 'address' does not exist on type 'string'
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
