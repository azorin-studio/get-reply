export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      actions: {
        Row: {
          created_at: string | null
          delay: number | null
          delay_unit: string
          errorMessage: string | null
          fullPrompt: string | null
          generation: string | null
          id: string
          log_id: string | null
          profile_id: string | null
          prompt_id: string | null
          run_date: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          delay?: number | null
          delay_unit?: string
          errorMessage?: string | null
          fullPrompt?: string | null
          generation?: string | null
          id?: string
          log_id?: string | null
          profile_id?: string | null
          prompt_id?: string | null
          run_date?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          delay?: number | null
          delay_unit?: string
          errorMessage?: string | null
          fullPrompt?: string | null
          generation?: string | null
          id?: string
          log_id?: string | null
          profile_id?: string | null
          prompt_id?: string | null
          run_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_log_id_fkey"
            columns: ["log_id"]
            referencedRelation: "logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_prompt_id_fkey"
            columns: ["prompt_id"]
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          }
        ]
      }
      logs: {
        Row: {
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
          profile_id: string | null
          references: string | null
          status: string | null
          subject: string | null
          text: string | null
          to: Json[] | null
        }
        Insert: {
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
          profile_id?: string | null
          references?: string | null
          status?: string | null
          subject?: string | null
          text?: string | null
          to?: Json[] | null
        }
        Update: {
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
          profile_id?: string | null
          references?: string | null
          status?: string | null
          subject?: string | null
          text?: string | null
          to?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          email: string | null
          id: string
          provider: string | null
          refresh_token: string | null
          user_constraints: string[] | null
        }
        Insert: {
          email?: string | null
          id: string
          provider?: string | null
          refresh_token?: string | null
          user_constraints?: string[] | null
        }
        Update: {
          email?: string | null
          id?: string
          provider?: string | null
          refresh_token?: string | null
          user_constraints?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prompts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string | null
          profile_id: string | null
          prompt: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          profile_id?: string | null
          prompt?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          profile_id?: string | null
          prompt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
