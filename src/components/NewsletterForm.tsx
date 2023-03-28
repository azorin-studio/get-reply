import React from 'react'

const NewsletterForm = () => {

  return (
    <form
      action="https://buttondown.email/api/emails/embed-subscribe/amonecho"
      method="post"
      target="popupwindow"
      className="flex flex-col sm:flex-row gap-4"
      onSubmit={() => window.open('https://buttondown.email/amonecho', 'popupwindow')}
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
    </form>
  )
}

export default NewsletterForm
