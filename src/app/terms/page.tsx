import Header from '~/components/Header'
import Footer from '~/components/Footer'
import { Metadata } from 'next'

const terms = `
Terms and Conditions:
By accessing and using our demo website, you agree to be bound by the following terms and conditions:

Content:
All content provided on our demo website is for demonstration purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.

Intellectual Property:
All intellectual property rights in our demo website, including but not limited to copyright, trademarks, and logos, belong to us or our licensors. You may not use or reproduce any of our intellectual property without our prior written consent.

User Conduct:
By using our demo website, you agree to use it only for lawful purposes and in a way that does not infringe on the rights of others. You may not use our demo website to transmit or upload any material that is defamatory, obscene, or otherwise objectionable.

Disclaimer:
We do not warrant that our demo website will be uninterrupted or error-free, or that defects will be corrected. We do not warrant that our demo website or any of its contents will meet your requirements.

Limitation of Liability:
We shall not be liable for any damages arising out of or in connection with the use or inability to use our demo website.

Changes to These Terms:
We reserve the right to modify these terms and conditions at any time, and any changes will be effective immediately upon posting.
`

 
export const metadata: Metadata = {
  title: 'GetReply - Terms',
}
 

export default function TermsPage() {
  return (
    <>
      <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-4 lg:px=2">
            <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
              <div className="mx-auto flex flex-col items-start gap-4 lg:w-[52rem]">
                <h1 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl">
                  Terms
                </h1>
                <div className="p-2 prose prose-sm whitespace-pre-wrap">
                  {terms}
                </div>
              </div>
            </section>
            

          </main>
          <Footer/>
        </div>
      </div>
    </>
  )
}
