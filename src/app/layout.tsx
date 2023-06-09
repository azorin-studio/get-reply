
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Analytics } from '@vercel/analytics/react'
import { cookies } from "next/headers"
import Footer from "~/components/Footer"
import Header from "~/components/Header"
import { Database } from "~/supabase/database.types"
import SupabaseProvider from "~/app/provider"
import "~/styles/globals.css"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "GetReply",
  description: "Get Reply helps you follow up on your emails.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  const user = session && session.user || null

  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <SupabaseProvider>
          <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
            <div className="flex min-h-screen flex-col">
              <Header user={user} />
              <div className="p-2 w-full max-w-4xl mx-auto grow"> 
                {children}
              </div>
              <Footer/>
            </div>
          </div>
        </SupabaseProvider>
        <Analytics />
      </body>
    </html>
  )
}