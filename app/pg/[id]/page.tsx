export const runtime = 'edge'

import PropertyDetailsPage from './PropertyDetails'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PropertyDetailsPage id={id} />
}
