import { MailPlus } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="container sticky top-0 z-40 bg-white mx-auto px-2">
      <div className="flex  flex-col items-center justify-between gap-4 border-t border-t-slate-200 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <MailPlus />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href={'https://azorin.studio'}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Azorin Studios
            </a>
            .{" "}
            Website based on {" "}
            <a
              href="https://github.com/shadcn/taxonomy"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Taxonomy
            </a>.
          </p>
        </div>
        <p className="text-center text-sm md:text-left">
          The source code is available on{" "}
          <a
            href={'https://github.com/azorin-studio/get-reply'}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
