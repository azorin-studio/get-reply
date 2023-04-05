
export default function Examples(props: { subject: string, emails: string[], label: string, description: string }) {
  const { subject, emails, label, description } = props

  return (
    <div className="mx-auto md:max-w-[52rem]">
      <div className="">
      <h3 className="text-xl font-bold leading-[1.1] tracking-tighter sm:text-xl md:text-xl">
        {label}
      </h3>
      <p className="leading-normal text-slate-700 sm:leading-7">
        {description}
      </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 mt-8">
        <div className="basis-1/2">
          <p className="text-6xl font-bold">1.</p>
          <p className="font-bold"><span className="underline">You</span> send a first outbound email.</p> 
        </div>
        <div className="basis-1/2 border rounded">                  
          <div className="p-2 border-b">
            <p className="font-bold text-slate-500 text-sm whitespace-pre-wrap">
              Subject: {subject}
            </p>
          </div>
          <div className="p-2 prose prose-sm whitespace-pre-wrap">
            {emails[0]}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-24">
        <div className="basis-1/2">
          <p className="text-6xl">2.</p>
          <p className=""><span className="font-bold">If no response after 3 days GetReply generates a <span className="italic">draft</span> an your email account</span>.</p>
          <p className="mt-4">You can review and customize the draft email before sending, maintaining control over content and timing.</p>

        </div>
        <div className="basis-1/2 border rounded p-2 prose-sm whitespace-pre-wrap">
          {emails[1]}
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-24">
        <div className="basis-1/2">
          <p className="text-6xl">3.</p>
          <p><span className="font-bold">The same process repeats</span> after another 3 days if there is still no response.</p> 
        </div>
        <div className="basis-1/2 border rounded p-2 prose-sm whitespace-pre-wrap">           
          {emails[2]}
        </div>
      </div>
    </div>
  )
}
