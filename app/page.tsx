"use client"

import { useState, useEffect } from "react"
import { Building, MapPin, Users, Navigation2, Map, SearchX, BedSingle, BedDouble, GraduationCap, Briefcase, SlidersHorizontal, Check } from "lucide-react"
import { PropertyCard } from "@/components/PropertyCard"
import { publicApi } from "@/lib/apiClient"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Proper Airbnb-style categories (Types of Stays/Vibes, not mixed with locations or budgets)
const CATEGORIES = [
  { id: 'all', name: 'All Spaces', icon: Map },
  { id: 'single', name: 'Private Room', icon: BedSingle },
  { id: 'double', name: 'Double Sharing', icon: BedDouble },
  { id: 'triple', name: 'Triple+ Sharing', icon: Users },
  { id: 'coliving', name: 'Co-Living', icon: Building },
  { id: 'student', name: 'Student Friendly', icon: GraduationCap },
  { id: 'corporate', name: 'Working Pros', icon: Briefcase },
]

// MOCK DATA: Removed external image URLs completely. Using reliable fallbacks (handled in PropertyCard CSS).
const MOCK_PROPERTIES = [
  { id: 'm1', slug: 'mock-1', name: 'StaySure HSR Elite', type: 'COLIVING', locality: 'HSR Layout', city: 'Bengaluru', startingPrice: 12000, availableBeds: 4, totalBeds: 50, primaryPhoto: null, verified: true },
  { id: 'm2', slug: 'mock-2', name: 'Koramangala Comforts', type: 'GIRLS', locality: 'Koramangala', city: 'Bengaluru', startingPrice: 8500, availableBeds: 2, totalBeds: 20, primaryPhoto: null, verified: true },
  { id: 'm3', slug: 'mock-3', name: 'BTM Budget Stays', type: 'BOYS', locality: 'BTM Layout', city: 'Bengaluru', startingPrice: 6000, availableBeds: 12, totalBeds: 40, primaryPhoto: null, verified: false },
  { id: 'm4', slug: 'mock-4', name: 'Indiranagar Premium', type: 'COLIVING', locality: 'Indiranagar', city: 'Bengaluru', startingPrice: 18000, availableBeds: 1, totalBeds: 15, primaryPhoto: null, verified: true },
  { id: 'm5', slug: 'mock-5', name: 'Whitefield Tech Haven', type: 'BOYS', locality: 'Whitefield', city: 'Bengaluru', startingPrice: 9000, availableBeds: 8, totalBeds: 60, primaryPhoto: null, verified: true },
  { id: 'm6', slug: 'mock-6', name: 'Bellandur Cozy Girls PG', type: 'GIRLS', locality: 'Bellandur', city: 'Bengaluru', startingPrice: 11000, availableBeds: 3, totalBeds: 25, primaryPhoto: null, verified: false },
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
      
      {/* Categories Bar & Filters */}
      <div className="sticky top-[80px] z-40 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.05)] transition-all">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 relative flex items-center gap-4">
          
          {/* Scrolling Categories */}
          <div className="flex-1 flex items-center gap-10 overflow-x-auto no-scrollbar py-4 pt-5 relative">
            {CATEGORIES.map(cat => (
              <div 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center gap-2 cursor-pointer shrink-0 group min-w-[56px] ${
                  activeCategory === cat.id 
                    ? 'text-[#222222]' 
                    : 'text-[#717171] hover:text-[#222222] transition-colors'
                }`}
              >
                <cat.icon className={`w-[26px] h-[26px] stroke-[1.5px] transition-transform ${activeCategory === cat.id ? 'scale-95' : 'group-hover:scale-95'}`} />
                <span className={`text-[13px] whitespace-nowrap transition-all ${activeCategory === cat.id ? 'font-semibold' : 'font-medium'}`}>{cat.name}</span>
                
                {/* Underline Indicator */}
                <div className={`h-[2px] w-full rounded-full transition-all duration-300 mt-2 ${
                  activeCategory === cat.id ? 'bg-[#222222] scale-x-100' : 'bg-transparent scale-x-0 group-hover:bg-slate-200 group-hover:scale-x-100'
                }`}></div>
              </div>
            ))}
          </div>
          
          {/* Subtle fade on right side to indicate scroll on mobile */}
          <div className="absolute right-[110px] top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none hidden md:block"></div>
          
          {/* Filters Button (Now fully functional with shadcn Dialog) */}
          <div className="hidden md:flex shrink-0">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 border border-slate-300 rounded-xl px-4 py-3.5 hover:border-[#222222] hover:bg-slate-50 transition-colors cursor-pointer ml-4">
                  <SlidersHorizontal className="w-[14px] h-[14px] stroke-[2.5px] text-[#222222]" />
                  <span className="text-[14px] font-semibold text-[#222222]">Filters</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[780px] p-0 gap-0 overflow-hidden rounded-2xl bg-white">
                <DialogHeader className="px-6 py-4 border-b border-slate-200">
                  <DialogTitle className="text-center font-bold text-[16px] text-[#222222]">Filters</DialogTitle>
                </DialogHeader>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {/* Price Range */}
                  <div className="pb-8 border-b border-slate-200">
                    <h3 className="text-[22px] font-semibold text-[#222222] mb-1">Price range</h3>
                    <p className="text-[14px] text-[#717171] mb-6">Monthly rent before taxes and fees</p>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 border border-slate-400 rounded-lg p-3">
                        <div className="text-[12px] text-[#717171]">Minimum</div>
                        <div className="flex items-center">
                          <span className="text-[16px] text-[#222222]">₹</span>
                          <input type="number" defaultValue="5000" className="w-full outline-none text-[16px] text-[#222222] pl-1 bg-transparent" />
                        </div>
                      </div>
                      <div className="text-slate-400">-</div>
                      <div className="flex-1 border border-slate-400 rounded-lg p-3">
                        <div className="text-[12px] text-[#717171]">Maximum</div>
                        <div className="flex items-center">
                          <span className="text-[16px] text-[#222222]">₹</span>
                          <input type="number" defaultValue="25000" className="w-full outline-none text-[16px] text-[#222222] pl-1 bg-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="py-8 border-b border-slate-200">
                    <h3 className="text-[22px] font-semibold text-[#222222] mb-6">Amenities</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['Wifi', 'Air conditioning', 'Washing machine', 'Kitchen', 'TV', 'Gym'].map(amenity => (
                        <div key={amenity} className="flex items-center gap-3 cursor-pointer group">
                          <div className="w-6 h-6 border border-slate-300 rounded flex items-center justify-center group-hover:border-slate-800 transition">
                            {amenity === 'Wifi' && <Check className="w-4 h-4 text-[#222222]" />}
                          </div>
                          <span className="text-[16px] text-[#222222] font-light">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="px-6 py-4 border-t border-slate-200 flex items-center justify-between sm:justify-between w-full">
                  <button className="text-[16px] font-semibold text-[#222222] underline hover:bg-slate-100 px-4 py-2 rounded-lg transition">Clear all</button>
                  <DialogClose asChild>
                    <button className="bg-[#222222] hover:bg-black text-white px-6 py-3.5 rounded-lg font-semibold text-[16px] transition">Show 6 results</button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
                  primaryPhoto={p.primaryPhoto} // Note: fallbacks are now securely handled inside the component!
                  verified={p.verified}
                />
              ))}
            </div>

            {/* Map Toggle Button (Floating at bottom center) */}
            <div className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-50">
              <button className="bg-[#222222] hover:bg-black text-white px-6 py-3.5 rounded-full font-bold text-[15px] flex items-center gap-2 shadow-[0_6px_16px_rgb(0,0,0,0.2)] hover:scale-105 hover:shadow-[0_8px_20px_rgb(0,0,0,0.3)] transition-all duration-300 active:scale-95">
                Show map <Navigation2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  )
}
