import PropertyDetailClient from './PropertyDetailClient'

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: 'prop-1' },
    { id: 'prop-2' }
  ]
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PropertyDetailClient id={id} />
}
