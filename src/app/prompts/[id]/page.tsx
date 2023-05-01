import UnpurePromptItem from '~/components/UnpurePromptItem'

export const revalidate = 0

export default async function Page(props: { params: { id: string } }) {
  const id = props.params.id

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-row antialiased">
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Prompt
        </h1>
        <UnpurePromptItem id={id} />
      </main>
    </div>
  )
}
