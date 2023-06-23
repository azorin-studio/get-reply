"use client"
import { LuMailPlus } from 'react-icons/lu'
import Link from 'next/link'
import GoogleAuth from './GoogleAuth'
import AzureAuth from './AzureAuth'

export default function Header(props: { user?: object | null }) {
  const { user = null } = props
  return (
    <header className="w-full sticky top-0 z-40 bg-white mx-auto">
      <div className="flex h-16 items-center justify-between border-b border-b-slate-200 p-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="items-center space-x-2 flex">
            <LuMailPlus />
            <span className="font-bold sm:inline-block">
              Get Reply (ALPHA)
            </span>
          </Link>
        </div>
        <nav className="flex flex-row gap-4 items-center">
          {user && (
            <>
              <Link
                href="/sequences"
                className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
              >
                Sequences
              </Link>
              <Link
                href="/prompts"
                className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
              >
                Prompts
              </Link>
              
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
