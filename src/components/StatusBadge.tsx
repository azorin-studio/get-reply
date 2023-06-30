'use client'

import classNames from "classnames"
import { statusColors } from "./status-colors"

export default function StatusBadge(props: { status: string }) {
  const { status } = props
  const statusColor = statusColors[status]

  return (
    <div 
      className={classNames(
        `text-xs font-medium border rounded-md inline-flex px-2 py-1.5`,
        `text-${statusColor}-700 border-${statusColor}-600 bg-${statusColor}-200`
      )}
    >
      {status}
    </div>
  )
}
