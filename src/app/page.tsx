import Image from 'next/image';
import Link from 'next/link';
import hero from "../../public/hero.svg";

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ExampleSelector from '~/components/ExampleSelector';
import NewsletterForm from '~/components/NewsletterForm';
import { Database } from '~/supabase/database.types';
import { Metadata } from 'next';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';

export const revalidate = 0

 
export const metadata: Metadata = {
  title: 'GetReply - Streamline your email follow-ups',
}
 

export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    return redirect('/logs') 
  }

  return (
    <>

      <main className="flex-1 px-4 lg:px=2">
        <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
          <Image src={hero} width={250} alt="Hero image" priority />
          <div className="mx-auto flex flex-col items-start gap-4 lg:w-[52rem]">
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl">
              Streamline your email follow-ups
            </h1>
            <p className="max-w-[42rem] leading-normal text-slate-700 sm:text-xl sm:leading-8">
              Say goodbye to the hassle of scheduling and writing follow-up emails. GetReply simplifies the process with one-click scheduling and tailored ultra-polite emails written by Chat GPT.
            </p>
          </div>
          <div className="flex gap-4">

            <NewsletterForm />

        </div>
        </section>
        
        <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex flex-col gap-4 md:max-w-[52rem]">
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
              How it works.
            </h2>
            <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
              GetReply drafts short, polite follow-ups using ChatGPT, to ensure you get a response to your outbound emails.
            </p>
          </div>

          <ExampleSelector />

          <div className="mx-auto mt-8 flex flex-col gap-8 md:max-w-[52rem]">
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
              Ready to try?
            </h2>
            <p className="max-w-[85%] leading-normal text-slate-700 sm:text-2xl sm:leading-7">
              <Link
                href="/prompts"
                className="items-center justify-center space-x-2 flex ml-2"
              > 
                <span className="font-bold sm:inline-block underline">
                Try out the demo
                </span>
                <ArrowTopRightIcon />
              </Link>
            </p>
          </div>
        </section>

        <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex flex-col gap-4 md:max-w-[52rem]">
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
              Frequently asked questions
            </h2>
            <h3 className="mt-8 text-xl font-bold leading-[1.1] tracking-tighter sm:text-xl md:text-xl">
              Does GetReply actually send emails?
            </h3>
            <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
              No. GetReply generates a draft email for you to review and customize before sending, giving you full control over the email&apos;s content and timing.
            </p>
            <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
              It marks the thread as unread, to remind you of the draft email, so you can follow up with minimal effort.
            </p>
            <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
              This approach offers you control and flexibility over your follow-ups.
            </p>
            <h3 className="mt-8 text-xl font-bold leading-[1.1] tracking-tighter sm:text-xl md:text-xl">
              How does GetReply differ from other offerings?
            </h3>
            <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
              You just bcc GetReply in your emails, eliminating the need for complex mail merge processes or custom coding. You can quickly install GetReply and start using it without the hassle of learning complicated software or hiring developers.
            </p>
            <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
              By leveraging Chat GPT, GetReply creates personalized follow-up emails that are more likely to elicit a response from recipients. This eliminates the need for you to craft your own follow ups.
            </p>
            <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
              GetReply is highly customizable and flexible, allowing you to tailor their follow-up emails. Users can customize the tone and language of their emails, and schedule emails to be crafted at different intervals. This level of customization ensures that users can create a tailored follow-up strategy.
            </p>
            <h3 className="mt-4 text-xl font-bold leading-[1.1] tracking-tighter sm:text-xl md:text-xl">
              Whats the stage of the product?
            </h3>
            <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
              GetReply is in the ideation and feedback stage, gathering feedback to shape its development.
            </p>
            <h3 className="text-xl font-bold leading-[1.1] tracking-tighter sm:text-xl md:text-xl">
              How much will you charge?
            </h3>
            <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
              GetReply is priced at $5 per month per user. This low subscription fee makes it accessible to individuals and small businesses with limited budgets, while still providing a high-quality solution that can help drive business results. Additionally, GetReply offers a 14-day free trial, giving you the opportunity to try the product before committing to a subscription.
            </p>

          </div>
        </section>

      </main>
    </>
  )
}
