"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import classNames from 'classnames'
import { Database } from '~/lib/database.types'
import MicrosoftLogo from './Microsoft-Logo'

export default function AzureAuth() {
  const supabase = createClientComponentClient<Database>()

  async function signInWithAzure() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        },
        scopes: 'email offline_access',
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`
      }
    })

  }

  return (
    <button
      onClick={signInWithAzure}
      className={classNames(
        "inline-flex flex-row gap-2 border items-center ",
        "hover:bg-blue-50 focus:bg-slate-200 ",
        "text-sm font-semibold text-[#3c4043] rounded px-3 py-2"
      )}
    >
      <MicrosoftLogo />
      Sign in with Microsoft
    </button>
  )
}
