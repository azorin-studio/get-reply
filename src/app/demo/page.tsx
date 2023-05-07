import supabaseAdminClient from '~/supabase'
import DemoPage from './demo-client'

export default async function Page() {
  // get prompts from supabase
  const { data: prompts, error } = await supabaseAdminClient
    .from('prompts')
    .select('*')
    .order('id', { ascending: true })
    .limit(10)

  console.log(prompts)


  return (<DemoPage prompts={prompts} />)
}
