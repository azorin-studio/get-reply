
export default function Footer() {
  return (
    <footer className="w-full sticky top-0 z-40 bg-white mx-autos text-slate-700 text-xs">
      <div className="flex flex-col items-center justify-between p-4 gap-4 border-t border-t-slate-200 md:h-12 md:flex-row ">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
        </div>
        <div className="inline-flex gap-4 text-center md:text-left">
          <a
            href='/terms'
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Terms
          </a>
          <a
            href='/privacy'
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Privacy policy
          </a>
        </div>
      </div>
    </footer>
  )
}
