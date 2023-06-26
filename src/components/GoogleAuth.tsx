"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import classNames from 'classnames'
import { Database } from '~/supabase/database.types'

export default function GoogleAuth({ admin = false }: { admin?: boolean }) {
  const supabase = createClientComponentClient<Database>()

  let scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'

  if (admin) {
    // this next scopes are only for the automation account for e2e tests
    scopes = 'https://www.googleapis.com/auth/gmail.readonly  https://www.googleapis.com/auth/gmail.modify  https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/documents'
  }

  return (
    <Auth 
      supabaseClient={supabase} 
      showLinks={false}
      providers={['google']}
      redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/callback`}
      queryParams={{
        access_type: 'offline',
        prompt: 'consent',
        scopes,
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
