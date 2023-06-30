import CopyToClipboardBadge from "./CopyToClipboardBadge";

export default function PromptsWelcomeMessage () {
  return (
    <div className="text-slate-500 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-slate-900">
        Getting started
      </h1>
      <div>
        <span className="font-bold text-slate-700">Sending an Email with Automatic Follow-Up:</span> When you 
        compose an email that you would like to have a follow-up sent for, simply cc or bcc 
        <CopyToClipboardBadge className="mx-1 text-sm" text="followup@getreply.app" /> in the email. 
      </div>
      <div>
        <span className="font-bold text-slate-700">Customize Delay Period:</span> By default, GetReply sends the 
        follow-up email 3 days after your initial email. However, you can customize this by using 
        tags in the CC field. For example, if you want the follow-up sent after 1 day, bcc 
        <CopyToClipboardBadge className="mx-1 text-sm" text="followup+1day@getreply.app" /> instead. 
        If you want the follow-up sent after 5 hours, bcc <CopyToClipboardBadge className="mx-1 text-sm" text="followup+5hours@getreply.app" /> 
        instead. You can specify a time delay using &quot;seconds, minutes, hours, days&quot;.
      </div>
      <div>
        <span className="text-slate-400">This message will disappear when GetReply recieves its first email from you!</span>
      </div>

    </div>
  )
}