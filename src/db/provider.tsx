"use client"

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { createContext, useEffect, useState } from "react"

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "./database.types"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

export const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      console.log('SupabaseProvider: auth state changed, refreshing router')
      router.refresh()
    })

    return () => {
      console.log('SupabaseProvider: unsubscribing from auth state change')
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <Context.Provider value={{ supabase }}>
      <>{children}</>
    </Context.Provider>
  )
}
