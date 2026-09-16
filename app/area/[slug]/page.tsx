import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPublicApi } from '@/lib/apiClient'
import { PropertyCard } from '@/components/PropertyCard'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const data = await fetchPublicApi<any>(`/api/public/localities/${slug}`)
    if (!data?.locality) return { title: 'Locality Not Found' }
    return {
      title: `Verified PGs in ${data.locality.name}, ${data.locality.area}`,
      description: `Find the best Boys PG, Girls PG, and Co-living spaces in ${data.locality.name}. Zero brokerage, real photos, verified owners.`,
      openGraph: {
        title: `Verified PGs in ${data.locality.name}`,
        description: `Find the best Boys PG, Girls PG, and Co-living spaces in ${data.locality.name}. Zero brokerage, real photos, verified owners.`,
      }
    }
  } catch (e) {
    return { title: 'Area Not Found' }
  }
}

export default async function LocalityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let data = null

  try {
    data = await fetchPublicApi<any>(`/api/public/localities/${slug}`)
  } catch (e) {
    notFound()
  }

  if (!data?.locality) notFound()

  const { locality, properties } = data

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* Hero Header */}
      <div className="bg-indigo-600 text-white pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            PGs in {locality.name}, {locality.area}
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Browse through {properties.length} verified PG accommodations in {locality.name}. Zero brokerage, direct owner contact.
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white">Bengaluru</span>
        <span>/</span>
        <span className="text-slate-900 dark:text-white">{locality.name}</span>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No PGs listed here yet</h3>
            <p className="text-slate-500 mb-6">We're expanding rapidly. Check back soon for properties in this area.</p>
            <Link href="/search">
              <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                Browse All Areas <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((pg: any) => (
              <PropertyCard
                key={pg.id}
                slug={pg.slug || pg.publicId}
                name={pg.name}
                type={pg.type}
                locality={pg.locality}
                city={pg.city}
                startingPrice={pg.startingPrice}
                availableBeds={pg.availableBeds}
                totalBeds={pg.totalBeds}
                amenities={pg.amenities}
                primaryPhoto={pg.primaryPhoto}
                verified={true}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
