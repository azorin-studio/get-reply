'use client'


import { useState } from "react";
import Examples from '~/components/Examples';
import EXAMPLES from '~/data/examples';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


export default function ExampleSelector() {
  const [activeExample, setActiveExample] = useState<string>('sales')

  return (
    <>
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
    </>
  )
}