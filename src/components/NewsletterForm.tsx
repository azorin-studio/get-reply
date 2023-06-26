'use client'
import Link from 'next/link'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'

const NewsletterForm = () => {

  return (
    <form
      action="https://buttondown.email/api/emails/embed-subscribe/get-reply"
      method="post"
      target="popupwindow"
      className="flex flex-col sm:flex-row gap-4"
      onSubmit={() => window.open('https://buttondown.email/get-reply', 'popupwindow')}
    >
      <label className="hidden" htmlFor="bd-email">Enter your email</label>
      <input 
        type="email" 
        name="email" 
        id="bd-email" 
        placeholder='Enter your email'
        className="block flex-1 border rounded-md bg-transparent py-3 px-5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
      />
      <input 
        type="submit" 
        value="Subscribe to beta" 
        className="inline-flex items-center align-items rounded-md bg-slate-800 py-3 px-5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      />

      <div
        className='inline-flex items-center align-items'
      >
        Or,
        <Link
          href="/prompts"
          className="items-center space-x-2 flex ml-2"
        > 
          <span className="underline font-bold sm:inline-block">
          Try out the demo
          </span>
          <ArrowTopRightIcon />
        </Link>
        </div>
    </form>
  )
}

export default NewsletterForm
