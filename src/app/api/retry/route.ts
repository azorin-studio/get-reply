import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { inngest } from '~/inngest/client'

export const revalidate = 0

export async function POST (request: Request) {
  const supabase = createServerComponentClient({ cookies })
  const { data, error: err } = await supabase.auth.getUser()

  if (err) {
    return NextResponse.json({ error: err.message })
  }

  if (!data.user) {
    return NextResponse.json({ error: 'No user' })
  }

  const user = data.user
  const json = await request.json()

  if (!json) {
    return NextResponse.json({ error: 'No JSON body' })
  }

  if (!json.action_id) {
    return NextResponse.json({ error: 'No action_id' })
  }

  // check supabase permissions for the action id
  const { data: actions, error } = await supabase
    .from('actions')
    .select('*')
    .eq('id', json.action_id)
    .eq('user_id', user?.id)

  if (error) {
    return NextResponse.json({ error: error.message })
  }

  if (!actions || actions.length === 0) {
    return NextResponse.json({ error: 'Action not found' })
  }

  try {
    // set action status to retrying
    await supabase
      .from('actions')
      .update({ status: 'retrying', generation: null })
      .eq('id', json.action_id)

    await inngest.send({ 
      id: `queue/retry-generate-${json.action_id}`,
      name: 'queue/generate', 
      data: { action_id: json.action_id, log_id: json.log_id }
    })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message })
  }
}
