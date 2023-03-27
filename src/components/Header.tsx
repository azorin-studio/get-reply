import Link from 'next/link'
import { MailPlus } from 'lucide-react'

export default function Header() {
  return (
    <header className="container sticky top-0 z-40 bg-white mx-auto px-2">
      <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <MailPlus />
            <span className="hidden font-bold sm:inline-block">
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
          {/* <Link
            href="/login"
            // className={cn(buttonVariants({ size: "sm" }), "px-4")}
          >
            Login
          </Link> */}
        </nav>
      </div>
    </header>
    )
}
