"use client"
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import classNames from 'classnames'
import { MailPlus } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Database } from '~/db-admin/database.types'

export default function Header(props: { user?: object | null }) {
  const supabase = createClientComponentClient<Database>()

  const { user = null } = props
  return (
    <header className="w-full sticky top-0 z-40 bg-white mx-auto">
      <div className="flex h-16 items-center justify-between border-b border-b-slate-200 p-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="items-center space-x-2 flex">
            <MailPlus />
            <span className="font-bold sm:inline-block">
              Get Reply
            </span>
          </Link>
        </div>
        <nav className="flex flex-row gap-4 items-center">
          {user && (
            <>
              <Link
                href="/logs"
                className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
              >
                Logs
              </Link>
              <Link
                href="/prompts"
                className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
              >
                Prompts
              </Link>
              <Link
                href="/sequences"
                className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
              >
                Sequences
              </Link>
              <Link
                href="/logout"
                className="items-center space-x-2 flex font-bold sm:inline-block hover:underline text-red-600"
              >
                Logout
              </Link>
            </>
          )}
          {!user && (
            // <Link
            //   href="/login"
            //   className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
            // >
            //   Login
            // </Link>
            <Auth 
              supabaseClient={supabase} 
              showLinks={false}
              providers={['google']}
              redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/callback/google`}
              queryParams={{
                access_type: 'offline',
                prompt: 'consent',
                scopes: 'https://www.googleapis.com/auth/gmail.readonly  https://www.googleapis.com/auth/gmail.modify  https://www.googleapis.com/auth/gmail.compose'
              }}
              onlyThirdPartyProviders={true}
              appearance={{
                extend: false, // necessary in order to not render default styles
                className: {
                  button: classNames(
                    "inline-flex flex-row gap-2 border items-center ",
                    "hover:bg-blue-50 focus:bg-slate-200 ",
                    "text-sm font-semibold text-[#3c4043] rounded px-3 py-2"
                  ),
                }
              }}
            />
          )}
        </nav>
      </div>
    </header>
    )
}
