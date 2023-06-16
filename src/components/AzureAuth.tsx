"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import classNames from 'classnames'
import { Database } from '~/db-admin/database.types'

export default function AzureAuth() {
  const supabase = createClientComponentClient<Database>()

  return (
    <Auth 
      supabaseClient={supabase} 
      showLinks={false}
      providers={['azure']}
      redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/callback`}
      queryParams={{
        access_type: 'offline',
        scopes: 'email offline_access',
        prompt: 'consent',
      }}
      onlyThirdPartyProviders={true}
      appearance={{
        extend: false,
        className: {
          button: classNames(
            "inline-flex flex-row gap-2 border items-center ",
            "hover:bg-blue-50 focus:bg-slate-200 ",
            "text-sm font-semibold text-[#3c4043] rounded px-3 py-2"
          ),
        }
      }}
    />
  )
}
