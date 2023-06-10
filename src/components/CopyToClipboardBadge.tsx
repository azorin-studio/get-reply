"use client"
import classNames from 'classnames'
import { Copy, CopyCheck } from 'lucide-react'
import React from 'react'

const CopyToClipboardBadge = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false)
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true)
  }

  const iconOpts = {
    size: 16, 
    className: classNames('inline-flex')
  }

  return (
    <button
      className={classNames("bg-slate-100 p-1 border rounded inline-flex flex-row gap-2 items-center")} 
      onClick={copyToClipboard}
    >
      <span>
        {text}
      </span>

      <span className='text-xs text-slate-500'>
      {!copied && (
        <Copy {...iconOpts} />
      )}
      {copied && (
        <CopyCheck {...iconOpts} />
      )}
      </span>
      <span className='text-xs text-slate-500'>
        {!copied ? 'Copy' : 'Copied'}
      </span>

    </button>
  );
}

export default CopyToClipboardBadge

