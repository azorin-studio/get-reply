'use client'

export default function LogActionBar(props: { id: string }) {
  const { id } = props

  const cancelAction = async () => {
    await fetch(`/api/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        log_id: id
      })
    })
    // refresh the page
    window.location.reload()
  }

  return (
    <div className="flex flex-row gap-4">
      <button
        type="submit"
        onClick={cancelAction}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Cancel
      </button>
    </div>
  )
}