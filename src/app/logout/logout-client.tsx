"use client"

import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { useSupabase } from "~/app/supabase-provider"

export default function LogoutPage() {
  const { supabase } = useSupabase()
  const [redirectURL, setRedirectURL] = useState('')

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    console.log(error)
    setRedirectURL('/login')
  }

  useEffect(() => {
    handleLogout()
  })

  if (redirectURL) {
    redirect(redirectURL)
  }

  return (
    <main className="flex-1 px-4 lg:px=2">
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Logging you out
          </h2>
        </div>

      </div>
    </main>
  )
}