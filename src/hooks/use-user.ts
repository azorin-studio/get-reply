import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { useSupabase } from "./use-supabase"

export default function useUser (): User | null {
  const { supabase } = useSupabase()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  return user 
}