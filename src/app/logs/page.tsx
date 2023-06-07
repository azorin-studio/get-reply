import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogBadge from '~/components/LogBadge'
import { Database } from '~/db-admin/database.types'
import { Log } from '~/db-admin/types'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log('My Account: session does not exist, redirecting to /login')
    return redirect('/login') 
  }

  const { data } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })

  const logs: Log[] = data || []

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Logs</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the logs in your account.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {logs.length === 0 && (
              <div className="mt-4 text-slate-600">
                No logs yet.
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* <div className="table-header-group">
                <div className='table-row'>
                  <div className="table-cell px-2 py-2 text-left text-sm font-semibold text-gray-900">
                    To
                  </div>
                  <div className="table-cell px-3 py-2 text-left text-sm font-semibold text-gray-900">
                    Subject
                  </div>
                  <div className="table-cell px-3 py-2 text-left text-sm font-semibold text-gray-900">
                    Status
                  </div>
                  <div className="table-cell px-3 py-2 text-left text-sm font-semibold text-gray-900">
                    Created
                  </div>
                  <div className="table-cell relative pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </div>
                </div>
              </div> */}
              {/* <div className="table-row-group"> */}
                {logs.map((log) => (
                  <LogBadge key={log.id} log={log} />
                ))}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
