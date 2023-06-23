import GoogleAuth from '~/components/GoogleAuth'

export const revalidate = 0

export default async function Page() {
  return (
    <main className="p-2 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Admin
      </h1>

      <div className="flex flex-col gap-2">
        <p>
        Login with your Google account. 
        </p>

        <GoogleAuth admin={true} />
        <p 
          className="font-bold"
        >
          Note: this button requests advanced permissions for testing purposes.
        </p> 
      </div>
    </main>
  )
}
