import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPublicApi } from '@/lib/apiClient'
import PropertyDetailClient from './PropertyDetailClient'

export const runtime = 'edge';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const data = await fetchPublicApi<any>(`/api/public/properties/${slug}`)
    if (!data?.property) return { title: 'PG Not Found' }

    const pg = data.property
    return {
      title: `${pg.name} — ${pg.type} PG in ${pg.locality}, ${pg.city}`,
      description: pg.description || `Verified ${pg.type} PG in ${pg.locality} starting at ₹${pg.startingPrice}/month. Zero brokerage.`,
      openGraph: {
        title: `${pg.name} | Verified PG in ${pg.locality}`,
        description: `Verified ${pg.type} PG in ${pg.locality} starting at ₹${pg.startingPrice}/month. Zero brokerage.`,
        images: data.photos?.[0] ? [{ url: `https://hsrpg-images.pginbengaluru72.workers.dev/${data.photos[0].r2Key}` }] : [],
      }
    }
  } catch (e) {
    return { title: 'StaySure Property' }
  }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let data = null

  try {
    data = await fetchPublicApi<any>(`/api/public/properties/${slug}`)
  } catch (e) {
    notFound()
  }

  if (!data?.property) {
    notFound()
  }

  return <PropertyDetailClient initialData={data} />
}
