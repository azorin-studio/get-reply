export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      logs: {
        Row: {
          bcc: Json[] | null
          cc: Json[] | null
          created_at: string | null
          date: string
          error_message: string | null
          followUpEmail1: string | null
          followUpEmail2: string | null
          from: Json
          headers: Json[]
          html: string
          id: number
          messageId: string
          prompt: string | null
          status: string
          subject: string
          text: string
          threadId: string | null
          to: Json[] | null
          user_id: string
        }
        Insert: {
          bcc?: Json[] | null
          cc?: Json[] | null
          created_at?: string | null
          date: string
          error_message?: string | null
          followUpEmail1?: string | null
          followUpEmail2?: string | null
          from: Json
          headers: Json[]
          html: string
          id?: number
          messageId: string
          prompt?: string | null
          status: string
          subject: string
          text: string
          threadId?: string | null
          to?: Json[] | null
          user_id: string
        }
        Update: {
          bcc?: Json[] | null
          cc?: Json[] | null
          created_at?: string | null
          date?: string
          error_message?: string | null
          followUpEmail1?: string | null
          followUpEmail2?: string | null
          from?: Json
          headers?: Json[]
          html?: string
          id?: number
          messageId?: string
          prompt?: string | null
          status?: string
          subject?: string
          text?: string
          threadId?: string | null
          to?: Json[] | null
          user_id?: string
        }
      }
      profiles: {
        Row: {
          email: string | null
          google_access_token: string | null
          google_refresh_token: string | null
          id: string
          userConstraints: string[] | null
        }
        Insert: {
          email?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          id: string
          userConstraints?: string[] | null
        }
        Update: {
          email?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          id?: string
          userConstraints?: string[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
