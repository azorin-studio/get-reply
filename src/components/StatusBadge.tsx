'use client'

export default function StatusBadge(props: { status: string }) {
  const { status } = props
  let statusColor = 'blue'
  if (status === "error") {
    statusColor = 'red'
  } else if (status === "pending") {
    statusColor = 'yellow'
  } else if (status === "verified") {
    statusColor = 'yellow'
  } else if (status === "generated") {
    statusColor = 'yellow'
  } else if (status === "sent") {
    statusColor = 'green'
  }

  return (
    <div 
      className={`rounded-md inline-flex bg-${statusColor}-50 px-2 py-1.5 text-xs font-medium text-${statusColor}-700 border border-${statusColor}-600`}
    >
      {status}
    </div>
  )
}
