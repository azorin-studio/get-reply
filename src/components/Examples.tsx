
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
          <p>GetReply will prepare two polite follow ups in case there is no response. You can edit the follow ups if you like.</p> 
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
          <p className="font-bold">[3 days later] If there is no response.</p> 
          <p>GetReply will send an automatic email tailored to your previous exchange.</p>
        </div>
        <div className="basis-1/2 border rounded p-2 prose-sm whitespace-pre-wrap">
          {emails[1]}
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-24">
        <div className="basis-1/2">
          <p className="text-6xl">3.</p>
          <p className="font-bold">[3 days later] One last try.</p> 
          <p>GetReply will send one last email to optimise your chances of a response.</p>
        </div>
        <div className="basis-1/2 border rounded p-2 prose-sm whitespace-pre-wrap">           
          {emails[2]}
        </div>
      </div>
    </div>
  )
}
