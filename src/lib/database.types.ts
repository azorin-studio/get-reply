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
          date: string | null
          draftId: string | null
          errorMessage: string | null
          followUpEmail1: string | null
          followUpEmail2: string | null
          from: Json | null
          headers: Json[] | null
          html: string | null
          id: string
          messageId: string | null
          prompt: string | null
          provider: string | null
          status: string | null
          subject: string | null
          text: string | null
          threadId: string | null
          to: Json[] | null
          user_id: string
        }
        Insert: {
          bcc?: Json[] | null
          cc?: Json[] | null
          created_at?: string | null
          date?: string | null
          draftId?: string | null
          errorMessage?: string | null
          followUpEmail1?: string | null
          followUpEmail2?: string | null
          from?: Json | null
          headers?: Json[] | null
          html?: string | null
          id?: string
          messageId?: string | null
          prompt?: string | null
          provider?: string | null
          status?: string | null
          subject?: string | null
          text?: string | null
          threadId?: string | null
          to?: Json[] | null
          user_id: string
        }
        Update: {
          bcc?: Json[] | null
          cc?: Json[] | null
          created_at?: string | null
          date?: string | null
          draftId?: string | null
          errorMessage?: string | null
          followUpEmail1?: string | null
          followUpEmail2?: string | null
          from?: Json | null
          headers?: Json[] | null
          html?: string | null
          id?: string
          messageId?: string | null
          prompt?: string | null
          provider?: string | null
          status?: string | null
          subject?: string | null
          text?: string | null
          threadId?: string | null
          to?: Json[] | null
          user_id?: string
        }
      }
      profiles: {
        Row: {
          email: string | null
          google_refresh_token: string | null
          id: string
          user_constraints: string[] | null
        }
        Insert: {
          email?: string | null
          google_refresh_token?: string | null
          id: string
          user_constraints?: string[] | null
        }
        Update: {
          email?: string | null
          google_refresh_token?: string | null
          id?: string
          user_constraints?: string[] | null
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
