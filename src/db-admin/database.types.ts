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
      actions: {
        Row: {
          created_at: string | null
          errorMessage: string | null
          generation: string | null
          id: string
          log_id: string | null
          mailId: string | null
          name: string | null
          prompt_id: string | null
          run_date: string | null
          status: string | null
          threadId: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          errorMessage?: string | null
          generation?: string | null
          id?: string
          log_id?: string | null
          mailId?: string | null
          name?: string | null
          prompt_id?: string | null
          run_date?: string | null
          status?: string | null
          threadId?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          errorMessage?: string | null
          generation?: string | null
          id?: string
          log_id?: string | null
          mailId?: string | null
          name?: string | null
          prompt_id?: string | null
          run_date?: string | null
          status?: string | null
          threadId?: string | null
          user_id?: string | null
        }
      }
      logs: {
        Row: {
          actions_ids: string[] | null
          bcc: Json[] | null
          cc: Json[] | null
          created_at: string | null
          date: string | null
          errorMessage: string | null
          from: Json | null
          headers: Json[] | null
          html: string | null
          id: string
          inReplyTo: string | null
          messageId: string | null
          provider: string | null
          references: string | null
          sequence_id: string | null
          status: string | null
          subject: string | null
          text: string | null
          threadId: string | null
          to: Json[] | null
          user_id: string | null
        }
        Insert: {
          actions_ids?: string[] | null
          bcc?: Json[] | null
          cc?: Json[] | null
          created_at?: string | null
          date?: string | null
          errorMessage?: string | null
          from?: Json | null
          headers?: Json[] | null
          html?: string | null
          id?: string
          inReplyTo?: string | null
          messageId?: string | null
          provider?: string | null
          references?: string | null
          sequence_id?: string | null
          status?: string | null
          subject?: string | null
          text?: string | null
          threadId?: string | null
          to?: Json[] | null
          user_id?: string | null
        }
        Update: {
          actions_ids?: string[] | null
          bcc?: Json[] | null
          cc?: Json[] | null
          created_at?: string | null
          date?: string | null
          errorMessage?: string | null
          from?: Json | null
          headers?: Json[] | null
          html?: string | null
          id?: string
          inReplyTo?: string | null
          messageId?: string | null
          provider?: string | null
          references?: string | null
          sequence_id?: string | null
          status?: string | null
          subject?: string | null
          text?: string | null
          threadId?: string | null
          to?: Json[] | null
          user_id?: string | null
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
      prompts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string | null
          prompt: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          prompt?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          prompt?: string | null
          user_id?: string | null
        }
      }
      sequences: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string | null
          steps: Json[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          steps?: Json[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          steps?: Json[] | null
          user_id?: string | null
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
