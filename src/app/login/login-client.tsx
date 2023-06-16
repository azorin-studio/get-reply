"use client"
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import AzureAuth from '~/components/AzureAuth'
import GoogleAuth from '~/components/GoogleAuth'
import { useSupabase } from '~/hooks/use-supabase'

export default function LoginPage() {
  const { supabase } = useSupabase()
  const [redirectURL, setRedirectURL] = useState('')

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback/google`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          scopes: 'https://www.googleapis.com/auth/gmail.readonly  https://www.googleapis.com/auth/gmail.modify  https://www.googleapis.com/auth/gmail.compose'
        },
      },
    })
    
    setRedirectURL('/callback/google')
  }

  if (redirectURL) {
    redirect(redirectURL)
  }

  return (
    <main className="flex-1 px-4 lg:px=2">
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Log in to your account</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <GoogleAuth />
          <AzureAuth />
        </div>
      </div>
    </main>
  )
}
