import UnpureLogItem from '~/components/UnpureLogItem'

export const revalidate = 0

export default async function Page(props: { params: { id: string } }) {
  const id = props.params.id

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-row antialiased">
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Log
        </h1>
        <UnpureLogItem id={id} />
      </main>
    </div>
  )
}
