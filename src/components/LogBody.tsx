
import { format } from 'date-fns'
import { Log, Sequence } from '~/supabase/types'
import { statusColors } from './status-colors'
import EmailBody from './EmailBody'
import StatusBadge from './StatusBadge'
import StepBody from './StepBody'

export default function LogBody(props: { log: Log, sequence: Sequence }) {
  const { log, sequence } = props

  const statusColor = (log.status && statusColors[log.status]) || 'blue'

  return (
    <div className="w-full flex flex-col gap-4">
      <div className='border rounded-sm divide-y'>
        <div className="w-full p-2 flex flex-row items-center justify-between bg-slate-50 group-hover:bg-slate-100">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col text-sm">
              <div className="font-bold">
                {log.subject}
              </div>
              <div className="text-gray-600">
                to{' '}{log.to?.map((to) => to.address).join(', ')}
                {/* Dont tidy this, otherwise it causes a weird hydration bug  */}
                {log.cc && ', '}
                {log.cc && `, ${log.cc.map((cc) => cc.address).join(', ')}`}
                {log.bcc && ', '}
                {log.bcc && log.bcc.map((bcc) => bcc.address).join(', ')}
              </div>
            </div>
          </div>

          <div className='flex flex-row gap-4 items-center'>
            {log.status && <StatusBadge status={log.status} />}
            <div className="text-gray-600 text-sm">
              { log.created_at && 
                <span>
                  {format(new Date(log.created_at), 'dd LLL, HH:mm')}
                </span>
              }
            </div>
          </div>
        </div>

        {log.errorMessage &&
          <div className={`bg-${statusColor}-50 p-2 text-xs font-medium text-${statusColor}-500`}>
            {log.errorMessage}
          </div>
        }

        {log.text && <EmailBody text={log.text} />}
      </div>

      <div
        className='ml-8'
      >
        {log.action_ids?.map((action_id, index) => (
          <StepBody
            key={index}
            action_id={action_id}
            log_id={log.id!}
            logText={log.text}
            status={log.status}
          />
        ))}
      </div>

    </div>
  )
}
