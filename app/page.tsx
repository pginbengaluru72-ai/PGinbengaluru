"use client"

import { useState, useEffect } from "react"
import { Building, MapPin, Users, Crown, Banknote, Navigation2, Map } from "lucide-react"
import { PropertyCard } from "@/components/PropertyCard"
import { publicApi } from "@/lib/apiClient"

const CATEGORIES = [
  { id: 'all', name: 'All Spaces', icon: Map },
  { id: 'boys', name: 'Boys PG', icon: Users },
  { id: 'girls', name: 'Girls PG', icon: Users },
  { id: 'coliving', name: 'Co-Living', icon: Building },
  { id: 'premium', name: 'Premium', icon: Crown },
  { id: 'budget', name: 'Budget', icon: Banknote },
  { id: 'hsr', name: 'HSR Layout', icon: MapPin },
  { id: 'kora', name: 'Koramangala', icon: MapPin },
]

export default function Home() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    publicApi.searchProperties()
      .then(res => setProperties(res.properties))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-10">
      
      {/* Categories Bar */}
      <div className="sticky top-20 z-40 bg-white border-b border-slate-100 shadow-[0_4px_6px_-6px_rgba(0,0,0,0.1)]">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4 pt-5">
            {CATEGORIES.map(cat => (
              <div 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center gap-2 cursor-pointer shrink-0 transition ${
                  activeCategory === cat.id 
                    ? 'text-slate-900 border-b-2 border-slate-900 pb-2' 
                    : 'text-slate-500 hover:text-slate-800 pb-2.5 border-b-2 border-transparent'
                }`}
              >
                <cat.icon className="w-6 h-6" />
                <span className="text-xs font-semibold whitespace-nowrap">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 aspect-square md:aspect-[4/3] rounded-2xl mb-3"></div>
                <div className="bg-slate-200 h-4 w-3/4 mb-2 rounded"></div>
                <div className="bg-slate-200 h-4 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {properties.map(p => (
                <PropertyCard
                  key={p.id}
                  slug={p.slug || p.publicId}
                  name={p.name}
                  type={p.type}
                  locality={p.locality}
                  city={p.city}
                  startingPrice={p.startingPrice}
                  availableBeds={p.availableBeds}
                  totalBeds={p.totalBeds}
                  primaryPhoto={p.primaryPhoto}
                  verified={true}
                />
              ))}
            </div>

            {/* Map Toggle Button (Floating at bottom center) */}
            <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-50">
              <button className="bg-slate-900 text-white px-5 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                Show map <Navigation2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  )
}
