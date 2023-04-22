
import "~/styles/globals.css"
import SupabaseProvider from "./supabase-provider"
import { headers, cookies } from "next/headers"
import Header from "~/components/Header"
import Footer from "~/components/Footer"
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "~/lib/database.types"

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <SupabaseProvider>
          <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
            <div className="flex min-h-screen flex-col">
              <Header 
                user={session && session.user || null}
              />
              <div className="max-w-screen-lg mx-auto flex-grow">
                {children}
              </div>
              <Footer/>
            </div>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  )
}