import Link from 'next/link'
import { MailPlus, Github, ArrowUpRight } from 'lucide-react'

export default function Header(props: { user?: object | null }) {
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
          
          <nav className="hidden gap-6 md:flex">
            {/* <Link
              href={"#"}
              className={"flex items-center text-lg font-semibold text-slate-600 sm:text-sm"}
            >
              Link 1
            </Link> */}
          </nav>
        </div>
        <nav className="flex flex-row gap-4">
          <Link
            href="/demo"
            className="items-center space-x-2 flex hover:underline"
          >
            <ArrowUpRight />
            <span className="font-bold sm:inline-block">
            Try the demo
            </span>
          </Link>
          {/* <Link
            href="https://github.com/azorin-studio/get-reply"
            className="items-center space-x-2 flex hover:underline"
          >
            <Github />
            <span className="font-bold sm:inline-block">
            Github
            </span>
          </Link> */}
          {user && (
            <Link
              href="/account"
              className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
            >
              My Account
            </Link>
          )}
          {/* {user && (
            <Link
              href="/logout"
              className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
            >
              Logout
            </Link>
          )} */}
          {!user && (
            <Link
              href="/login"
              className="items-center space-x-2 flex font-bold sm:inline-block hover:underline"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
    )
}
