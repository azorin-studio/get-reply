import { MailPlus } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full sticky top-0 z-40 bg-white mx-autos text-slate-700 text-xs">
      <div className="flex flex-col items-center justify-between p-4 gap-4 border-t border-t-slate-200 md:h-12 md:flex-row ">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <MailPlus />
          <p className="text-center leading-loose md:text-left">
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
            </a> with assistance from Chat GPT. 
            Illustrations by {" "}
            <a
              href="https://popsy.co/illustrations"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Popsy
            </a>. 
          </p>
        </div>
        <p className="text-center md:text-left">
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
