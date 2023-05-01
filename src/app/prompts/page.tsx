import UnpurePromptsList from '~/components/UnpurePromptsList'

export const revalidate = 0

export default async function Page() {
  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-row bg-white font-sans text-slate-800 antialiased">
      <main className="flex flex-col gap-8 p-4 mx-auto">
        <h1 className="text-2xl font-bold">
          Prompts
        </h1>
                
        <UnpurePromptsList />

      </main>
    </div>
  )
}
