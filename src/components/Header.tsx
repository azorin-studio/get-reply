"use client"
import Link from 'next/link'
import GoogleAuth from './GoogleAuth'
import AzureAuth from './AzureAuth'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'

export default function Header(props: { user?: object | null }) {
  const { user = null } = props
  return (
    <header className="w-full h-auto">
      <div className="flex bg-slate-100 sm:flex-row flex-col   sm:items-center justify-between border-b border-b-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-6 md:gap-10">
          <Link href="/" className="items-center space-x-2 flex">
            <EnvelopeClosedIcon />
            <span className="font-bold sm:inline-block">
              Get Reply (ALPHA)
            </span>
          </Link>
        </div>
        <nav className="flex sm:flex-row flex-col gap-4 sm:items-center">
          {user && (
            <>
              {/* <Link
                href="/prompts"
                className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
              >
                Prompts
              </Link> */}
              
              <Link
                href="/logs"
                className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
              >
                Logs
              </Link>
              <Link
                href="/logout"
                className="items-center space-x-2 flex font-bold sm:inline-block hover:underline text-red-600"
              >
                Logout ({(user as any).email})
              </Link> 
            </>
          )}
          {!user && (
            <div className="flex flex-row gap-2">
              <GoogleAuth />
              <AzureAuth />
            </div>
          )}
        </nav>
      </div>
    </header>
    )
}
