"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MapPin, Bed, CheckCircle, Search, Filter } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

type Locality = {
  id: string
  name: string
  city: string
  isActive: boolean
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [localities, setLocalities] = useState<Locality[]>([])
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(true)

  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        const res = await fetch("https://hsrpg-api.pginbengaluru72.workers.dev/api/superadmin/localities")
        if (res.ok) {
          const data = await res.json()
          setLocalities(data.filter((l: Locality) => l.isActive))
        }
      } catch (error) {
        console.error("Failed to fetch localities", error)
      } finally {
        setIsLoadingLocalities(false)
      }
    }
    fetchLocalities()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-50/50 dark:from-indigo-900/20 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Search Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Search Results {query ? `for "${query}"` : ''}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">Found 24 physically verified PGs matching your criteria.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Smart Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-72 shrink-0 space-y-6"
          >
            <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 space-y-8 sticky top-24">
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                  <Filter className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Smart Filters</h3>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Locality</Label>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {isLoadingLocalities ? (
                    <div className="text-sm text-muted-foreground animate-pulse">Loading areas...</div>
                  ) : localities.length > 0 ? (
                    localities.map((loc) => (
                      <label key={loc.id} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <input type="checkbox" className="rounded-md border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" />
                        {loc.name}
                      </label>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No active areas found.</div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Budget Range</Label>
                <div className="flex items-center gap-3">
                  <Input type="number" placeholder="Min" className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                  <span className="text-slate-400 font-medium">-</span>
                  <Input type="number" placeholder="Max" className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Property Type</Label>
                <div className="space-y-3">
                  {['Boys Only', 'Girls Only', 'Co-live'].map((type) => (
                    <label key={type} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <input type="checkbox" className="rounded-md border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 dark:shadow-none transition-all hover:-translate-y-1">
                Apply Filters
              </Button>
            </div>
          </motion.div>

          {/* Results Grid */}
          <div className="flex-1">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div variants={item} key={i}>
                  <Link href={`/pg/${i}`} className="group block h-full">
                    <Card className="h-full overflow-hidden border-0 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10 transition-all duration-500 rounded-3xl bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col border border-transparent dark:border-slate-800">
                      <div className="relative h-56 overflow-hidden bg-slate-200 shrink-0">
                        <img 
                          src={`https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop`} 
                          alt="PG Room" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className="bg-white/95 dark:bg-slate-900/95 text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 backdrop-blur-md shadow-md py-1.5 px-3 rounded-xl border-0 font-bold">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Verified
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 z-10">
                          <Badge className="bg-black/50 text-white backdrop-blur-md border border-white/20 py-1.5 px-3 rounded-xl font-semibold">
                            {i % 2 === 0 ? "Food Included" : "AC Room"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                            HSR Premium Stay #{i}
                          </h3>
                          <div className="text-right shrink-0 ml-2">
                            <span className="font-black text-lg text-slate-900 dark:text-white">₹{8000 + i * 500}</span>
                            <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">/ mo</span>
                          </div>
                        </div>
                        <div className="flex items-center text-slate-500 font-medium text-sm mb-5">
                          <MapPin className="h-4 w-4 mr-1.5 text-slate-400 shrink-0" />
                          <span className="line-clamp-1">Sector {i % 4 + 1}, HSR Layout</span>
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg">
                            <Bed className="h-4 w-4 mr-1.5" />
                            {i} Beds left
                          </div>
                          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
                            View →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}
