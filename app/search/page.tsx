"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MapPin, Search, Filter, SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { publicApi } from "@/lib/apiClient"
import { PropertyCard } from "@/components/PropertyCard"

const PG_TYPES = [
  { label: 'Boys PG', value: 'BOYS' },
  { label: 'Girls PG', value: 'GIRLS' },
  { label: 'Co-Living', value: 'COLIVING' },
]

const PRICE_RANGES = [
  { label: 'Under ₹5,000', min: '0', max: '5000' },
  { label: '₹5,000 - ₹8,000', min: '5000', max: '8000' },
  { label: '₹8,000 - ₹12,000', min: '8000', max: '12000' },
  { label: '₹12,000 - ₹18,000', min: '12000', max: '18000' },
  { label: '₹18,000+', min: '18000', max: '' },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  const initialLocality = searchParams.get('locality') || ''

  const [query, setQuery] = useState(initialQuery)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState<{ min: string; max: string } | null>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [localities, setLocalities] = useState<any[]>([])
  const [selectedLocality, setSelectedLocality] = useState(initialLocality)

  useEffect(() => {
    publicApi.getLocalities().then(res => setLocalities(res?.localities || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const params: Record<string, string> = {}
        if (query) params.q = query
        if (selectedTypes.length > 0) params.type = selectedTypes.join(',')
        if (selectedPrice?.min) params.minPrice = selectedPrice.min
        if (selectedPrice?.max) params.maxPrice = selectedPrice.max
        if (selectedLocality) params.locality = selectedLocality

        const res = await publicApi.searchProperties(params)
        setProperties(res?.properties || [])
        setTotal(res?.pagination?.total || 0)
      } catch {
        setProperties([])
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [query, selectedTypes, selectedPrice, selectedLocality])

  const toggleType = (val: string) => {
    setSelectedTypes(prev => prev.includes(val) ? prev.filter(t => t !== val) : [...prev, val])
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedPrice(null)
    setSelectedLocality('')
    setQuery('')
  }

  const hasActiveFilters = selectedTypes.length > 0 || selectedPrice || selectedLocality

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {query ? `PGs matching "${query}"` : selectedLocality ? `PGs in ${selectedLocality}` : 'All Verified PGs'}
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            {loading ? 'Searching...' : `${total} properties found`}
          </p>
        </div>

        {/* Search Bar + Filter Toggle */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or locality..."
              className="pl-10 h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-xl h-11 px-4 ${hasActiveFilters ? 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-950' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters {hasActiveFilters && '•'}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-indigo-600 font-semibold hover:underline">
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PG Type */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">PG Type</Label>
                <div className="flex flex-wrap gap-2">
                  {PG_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => toggleType(type.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedTypes.includes(type.value)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Price Range</Label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map(range => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPrice(selectedPrice?.min === range.min ? null : range)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedPrice?.min === range.min
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locality */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Locality</Label>
                <select
                  value={selectedLocality}
                  onChange={e => setSelectedLocality(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm px-3 text-slate-700 dark:text-slate-300"
                >
                  <option value="">All Localities</option>
                  {localities.map((loc: any) => (
                    <option key={loc.id} value={loc.area}>{loc.area} — {loc.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No PGs found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4 rounded-full">
                Clear Filters
              </Button>
            )}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  )
}
