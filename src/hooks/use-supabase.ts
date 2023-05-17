import { useContext } from "react"
import { Context } from '~/db/provider'

export const useSupabase = () => {
  let context = useContext(Context)

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }

  return context
}