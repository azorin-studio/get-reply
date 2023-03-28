import Head from 'next/head'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import hero from "../../public/hero.svg"
import Image from 'next/image'
import Examples from '~/components/Examples'

import EXAMPLES from '~/data/examples'
import { useState } from 'react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {

  const [activeExample, setActiveExample] = useState<string>('sales')

  return (
    <>
      <Head>
        <title>Get Reply</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-4 lg:px=2">
            <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
              <Image src={hero} width={250} alt="Hero image" priority />
              <div className="mx-auto flex flex-col items-start gap-4 lg:w-[52rem]">
                <h1 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl">
                  Streamline your email follow-ups with GetReply
                </h1>
                <p className="max-w-[42rem] leading-normal text-slate-700 sm:text-xl sm:leading-8">
                  Say goodbye to the hassle of scheduling and writing follow-up emails. GetReply simplifies the process with one-click scheduling and tailored ultra-polite emails written by Chat GPT.
                </p>
              </div>
              <div className="flex gap-4">
                <Link 
                  href="https://github.com/azorin-studio/get-reply/issues/1" 
                  className="inline-flex items-center align-items rounded-md bg-slate-800 py-3 px-5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Join the beta
                  <span className="-mr-0.5 ml-2 h-5 w-5"><ArrowRight  /></span>
                </Link>
                <Link 
                  href="https://github.com/azorin-studio" 
                  className="inline-flex items-center align-items rounded-md py-3 px-8 text-sm font-semibold border hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Github
                </Link>
            </div>
            </section>
            
            <hr className="border-slate-200" />
            
            <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24">
              <div className="mx-auto flex flex-col gap-4 md:max-w-[52rem]">
                <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
                  How it works
                </h2>
                <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                  GetReply is a plugin for Gmail using Chat GPT. GetReply writes short, polite follow-up emails that are automatically sent after 3 and 6 days to ensure you get a response to your outbound emails.
                </p>
              </div>

              <div className="sm:block">
                <nav className="lg:-mb-px flex flex-col lg:flex-row lg:space-x-8">
                  {Object.entries(EXAMPLES).map(([key, tab]) => (
                    <a
                      key={key}
                      href="#"
                      onClick={(e: any) => {
                        e.preventDefault()
                        setActiveExample(key)
                      }}
                      className={classNames(
                        key === activeExample
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                      )}
                      aria-current={key === activeExample ? 'page' : undefined}
                    >
                      {tab.label}
                    </a>
                  ))}
                </nav>
              </div>

              <Examples 
                {...EXAMPLES[activeExample as keyof typeof EXAMPLES]}
              />

            </section>

            <hr className="border-slate-200" />

            <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24">
              <div className="mx-auto flex flex-col gap-4 md:max-w-[52rem]">
                <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
                  Frequently asked questions
                </h2>
                <h3 className="mt-8 text-xl font-bold leading-[1.1] tracking-tighter sm:text-xl md:text-xl">
                  How does GetReply differ from other offerings?
                </h3>
                <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                  What sets GetReply apart is its simplicity. GetReply is a one-button solution that leverages the power of Chat GPT to write short and polite follow-up emails, making it a hassle-free option for busy professionals who need to follow up on a high volume of emails.
                </p>
                <h3 className="mt-4 text-xl font-bold leading-[1.1] tracking-tighter sm:text-xl md:text-xl">
                  Whats the stage of the product?
                </h3>
                <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                  It&apos;s just an idea for now, but we intend to start building after we gather a few motivated beta testers.
                </p>
                <h3 className="text-xl font-bold leading-[1.1] tracking-tighter sm:text-xl md:text-xl">
                  How much will you charge?
                </h3>
                <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                  We are thinking $5 per month per user.
                </p>
                <h3 className="text-xl font-bold leading-[1.1] tracking-tighter sm:text-xl md:text-xl">
                  Can I self host?
                </h3>
                <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                  Yes we will release everything open source, so you can self host for free, or pay $5 per month to use our hosted service.
                </p>
                <h3 className="text-xl font-bold leading-[1.1] tracking-tighter sm:text-xl md:text-xl">
                  Whose behind GetReply?
                </h3>
                <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                  <a className="underline" href="https://azorin.studio">Azorin Studios</a>, we are a small product studio based in Valencia, Spain.
                </p>
              </div>
            </section>

            <hr className="border-slate-200" />

            <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-24">
              <div className="mx-auto flex flex-col gap-4 md:max-w-[52rem]">
                <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
                  Proudly Open Source
                </h2>
                <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
                  GetReply is open source and powered by open source software. The code will be available on{" "}
                  
                  <Link
                    href='https://github.com/azorin-studio/get-reply'
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    GitHub
                  </Link>
                  .
                </p>
              </div>
            </section>

          </main>
          <Footer/>
        </div>
      </div>
    </>
  )
}
