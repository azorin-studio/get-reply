'use client'

import { statusColors } from "./status-colors"

export default function StatusBadge(props: { status: string }) {
  const { status } = props
  const statusColor = statusColors[status] || 'blue'

  return (
    <div 
      className={`rounded-md inline-flex bg-${statusColor}-50 px-2 py-1.5 text-xs font-medium text-${statusColor}-700 border border-${statusColor}-600`}
    >
      {status}
    </div>
  )
}
