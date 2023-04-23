import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from "next/headers"
import { Database } from '~/lib/supabase/database.types'

import LogoutClientPage from './logout-client'

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  return (
    <LogoutClientPage />
  )
}
