import { useEffect, useState } from "react";
import { useSupabase } from '~/app/supabase-provider'

export const useUser = () => {
  const { supabase } = useSupabase()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      setUser(data.user ?? null)
    }
    fetchUser()
  }, [supabase.auth])

  return user
}