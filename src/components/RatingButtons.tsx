import { LuThumbsDown, LuThumbsUp } from "react-icons/lu"
import { useState } from "react"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


const RatingButtons = (props: { disabled: boolean, result: null }) => {
  const { disabled = false, result } = props

  const [voted, setVoted] = useState(false)

  const onSubmit = async (vote: string) => {
    if (!result) return
    await fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vote, result }),
    })
    setVoted(true)
  }

  if (voted) return (
    <div
      className="text-slate-600 text-xs items-center align-items"
    >
      Thanks!
    </div>
  )

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => onSubmit("up")}
        className={
          classNames(
            "inline-flex flex-row gap-2 border rounded p-2 disabled:opacity-50 bg-green-50 hover:bg-green-100",
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:hover:bg-slate-100",
            "text-slate-600 text-xs items-center align-items"
          )
        }
        disabled={disabled}
      > 
        <LuThumbsUp size={16}/>
        Good
      </button>
      <button 
        onClick={() => onSubmit("down")}
        className={
          classNames(
            "inline-flex flex-row gap-2 border rounded p-2 disabled:opacity-50 bg-red-50 hover:bg-red-100",
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:hover:bg-slate-100",
            "text-slate-600 text-xs items-center align-items"
          )   
        }
        disabled={disabled}
      >
        <LuThumbsDown size={16} />
        Bad
      </button>
    </div>
  )
}

export default RatingButtons