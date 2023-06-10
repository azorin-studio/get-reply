"use client"
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { redirect } from 'next/navigation'
import { useState } from 'react'
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
          <Auth 
            supabaseClient={supabase} 
            appearance={{ theme: ThemeSupa }}
            providers={['google']}
            redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/callback/google`}
            queryParams={{
              access_type: 'offline',
              prompt: 'consent',
              scopes: 'https://www.googleapis.com/auth/gmail.readonly  https://www.googleapis.com/auth/gmail.modify  https://www.googleapis.com/auth/gmail.compose'
            }}
            onlyThirdPartyProviders={true}
          />
          {/* <button 
            onClick={handleLogin}                
            className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
          >
            <svg 
              role="img" 
              width={24}
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>
                Google
              </title>
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
            Login with Google
          </button> */}
        </div>
      </div>
    </main>
  )
}
