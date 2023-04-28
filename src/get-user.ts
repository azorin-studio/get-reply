import { createClient } from '@supabase/supabase-js'

import TEST_EMAIL from '~/data/test-email.json'

const getUser = async () => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select("*")
    .eq('email', TEST_EMAIL.from.address)
    .limit(1)


  return { profile: profiles![0] }
}

export default getUser