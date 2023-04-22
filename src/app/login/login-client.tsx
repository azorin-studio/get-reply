"use client"
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { useSupabase } from "~/app/supabase-provider"

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
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 border sm:rounded-lg sm:px-10">
            <div>
              <div>
                {/* <div>
                  <button 
                    onClick={handleSignUp}
                    className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                  >
                    Sign up
                  </button>
                </div> */}

                <div>
                  <button 
                    onClick={handleLogin}                
                    className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                  >
                    Login with Google
                  </button>
                </div>

                {/* <div>
                  <button 
                    onClick={handleLogout}
                    className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                  >
                    Logout
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
