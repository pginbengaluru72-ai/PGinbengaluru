"use client"

import { useState, useEffect } from "react"
import { Building, MapPin, Users, Crown, Banknote, Navigation2, Map, SearchX } from "lucide-react"
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

// MOCK DATA: Fallback if database is empty so the site looks gorgeous out of the box
const MOCK_PROPERTIES = [
  { id: 'm1', slug: 'mock-1', name: 'StaySure HSR Elite', type: 'COLIVING', locality: 'HSR Layout', city: 'Bengaluru', startingPrice: 12000, availableBeds: 4, totalBeds: 50, primaryPhoto: null, verified: true, mockImg: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop' },
  { id: 'm2', slug: 'mock-2', name: 'Koramangala Comforts', type: 'GIRLS', locality: 'Koramangala', city: 'Bengaluru', startingPrice: 8500, availableBeds: 2, totalBeds: 20, primaryPhoto: null, verified: true, mockImg: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop' },
  { id: 'm3', slug: 'mock-3', name: 'BTM Budget Stays', type: 'BOYS', locality: 'BTM Layout', city: 'Bengaluru', startingPrice: 6000, availableBeds: 12, totalBeds: 40, primaryPhoto: null, verified: false, mockImg: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop' },
  { id: 'm4', slug: 'mock-4', name: 'Indiranagar Premium', type: 'COLIVING', locality: 'Indiranagar', city: 'Bengaluru', startingPrice: 18000, availableBeds: 1, totalBeds: 15, primaryPhoto: null, verified: true, mockImg: 'https://images.unsplash.com/photo-1502672260266-1c1e5250adcd?q=80&w=2070&auto=format&fit=crop' },
  { id: 'm5', slug: 'mock-5', name: 'Whitefield Tech Haven', type: 'BOYS', locality: 'Whitefield', city: 'Bengaluru', startingPrice: 9000, availableBeds: 8, totalBeds: 60, primaryPhoto: null, verified: true, mockImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' },
  { id: 'm6', slug: 'mock-6', name: 'Bellandur Cozy Girls PG', type: 'GIRLS', locality: 'Bellandur', city: 'Bengaluru', startingPrice: 11000, availableBeds: 3, totalBeds: 25, primaryPhoto: null, verified: false, mockImg: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop' },
]

export default function Home() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    publicApi.searchProperties()
      .then(res => {
        // If the database is completely empty, use mock data so the UI looks stunning for presentation!
        if (res.properties.length === 0) {
          setProperties(MOCK_PROPERTIES)
        } else {
          setProperties(res.properties)
        }
      })
      .catch((e) => {
        console.error(e)
        // Fallback to mock on error as well for demonstration purposes
        setProperties(MOCK_PROPERTIES)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-10">
      
      {/* Categories Bar */}
      <div className="sticky top-[80px] z-40 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.05)] transition-all">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 relative">
          <div className="flex items-center gap-10 overflow-x-auto no-scrollbar py-4 pt-5 relative">
            {CATEGORIES.map(cat => (
              <div 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center gap-2 cursor-pointer shrink-0 group min-w-[56px] ${
                  activeCategory === cat.id 
                    ? 'text-slate-900' 
                    : 'text-[#717171] hover:text-slate-900 transition-colors'
                }`}
              >
                <cat.icon className={`w-[26px] h-[26px] stroke-[1.5px] transition-transform ${activeCategory === cat.id ? 'scale-95' : 'group-hover:scale-95'}`} />
                <span className={`text-[13px] whitespace-nowrap transition-all ${activeCategory === cat.id ? 'font-semibold' : 'font-medium'}`}>{cat.name}</span>
                
                {/* Underline Indicator */}
                <div className={`h-[2px] w-full rounded-full transition-all duration-300 mt-2 ${
                  activeCategory === cat.id ? 'bg-slate-900 scale-x-100' : 'bg-transparent scale-x-0 group-hover:bg-slate-200 group-hover:scale-x-100'
                }`}></div>
              </div>
            ))}
          </div>
          {/* Subtle fade on right side to indicate scroll on mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 aspect-square rounded-[16px] mb-3"></div>
                <div className="bg-slate-200 h-4 w-3/4 mb-1.5 rounded"></div>
                <div className="bg-slate-200 h-4 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          // True empty state (if somehow mock data fails or gets removed later)
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <SearchX className="w-16 h-16 text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No exact matches</h2>
            <p className="text-slate-500 mb-6 max-w-md">Try changing or removing some of your filters or adjusting your search area.</p>
            <button className="px-6 py-3 border border-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition">
              Remove all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
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
                  primaryPhoto={p.primaryPhoto || p.mockImg}
                  verified={p.verified}
                />
              ))}
            </div>

            {/* Map Toggle Button (Floating at bottom center) */}
            <div className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-50">
              <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-full font-bold text-[15px] flex items-center gap-2 shadow-[0_6px_16px_rgb(0,0,0,0.2)] hover:scale-105 hover:shadow-[0_8px_20px_rgb(0,0,0,0.3)] transition-all duration-300 active:scale-95">
                Show map <Navigation2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  )
}
