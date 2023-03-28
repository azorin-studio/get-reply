import Link from 'next/link'
import { MailPlus, Github } from 'lucide-react'

export default function Header() {
  return (
    <header className="container sticky top-0 z-40 bg-white mx-auto px-2">
      <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4 px-4">
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
        <nav>
          <Link
            href="https://github.com/azorin-studio/get-reply"
            className="items-center space-x-2 flex"
          >
            <Github />
            <span className="font-bold sm:inline-block">
            Github
            </span>
          </Link>
        </nav>
      </div>
    </header>
    )
}
