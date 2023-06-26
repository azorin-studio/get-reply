"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect } from "react"

export default function LogoutPage() {
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleLogout = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        const { error } = await supabase.auth.signOut()
        if (error) alert(error?.message)  
      }

      window.location.href = '/'
      return 
    }

    handleLogout()
  })

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
