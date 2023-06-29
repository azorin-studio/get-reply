import getActions from '~/supabase/get-actions'
import supabaseAdminClient from '~/supabase/supabase-admin-client'

export const revalidate = 0

export default async function Page() {
  const allActions = await getActions(supabaseAdminClient)
  
  const now = new Date()
  const allPastActions = allActions.filter(action => new Date(action.run_date!) < now)
  /**
   * Now get todays actions by created_at
   */
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayActions = allPastActions.filter(action => new Date(action.created_at!) > today)


  /**
   * Count all the allPastActions that are sent
   */
  const allSentActions = allPastActions.filter(action => action.status === 'sent')
  const allSentActionsCount = allSentActions.length

  const todaySentActions = todayActions.filter(action => action.status === 'sent')
  const todaySentActionsCount = todaySentActions.length

  return (
    <main className="p-2 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Admin
      </h1>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">
          Today
        </h2>
        <p>
          Sent: {todaySentActionsCount}. Total: {todayActions.length}.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">
          All time
        </h2>
        <p>
          Sent: {allSentActionsCount}. Total: {allPastActions.length}.
        </p>
      </div>
    </main>
  )
}
