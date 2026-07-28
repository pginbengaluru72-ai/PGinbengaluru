"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MapPin, Bed, CheckCircle, Search, Filter, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AppState, PropertyItem, LocalityItem } from "@/lib/appState"

const container: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [localities, setLocalities] = useState<LocalityItem[]>([])
  const [properties, setProperties] = useState<PropertyItem[]>([])

  const syncState = () => {
    setLocalities(AppState.getLocalities().filter(l => l.isActive))
    setProperties(AppState.getProperties())
  }

  useEffect(() => {
    syncState()
    window.addEventListener("hsrpg_state_change", syncState)
    return () => window.removeEventListener("hsrpg_state_change", syncState)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-20 relative overflow-hidden">
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
          <p className="text-muted-foreground mt-2 text-lg font-medium">Found {properties.length} PG properties across active Bangalore localities.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Smart Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-72 shrink-0 space-y-6"
          >
            <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white dark:border-slate-800 space-y-8 sticky top-24">
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                  <Filter className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Active Areas</h3>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Super Admin Coverage</Label>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {localities.map((loc) => (
                    <label key={loc.id} className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-indigo-600 transition-colors">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" />
                      {loc.name} ({loc.city.split(',')[0]})
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category Filter</Label>
                <div className="space-y-2 text-xs font-bold">
                  {['Boys PG', 'Girls PG', 'Co-live / Unisex'].map((type) => (
                    <label key={type} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 cursor-pointer hover:text-indigo-600">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
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
              {properties.map((prop, idx) => (
                <motion.div variants={item} key={prop.id}>
                  <Link href={`/pg/1`} className="group block h-full">
                    <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col border border-slate-200/60 dark:border-slate-800">
                      <div className="relative h-52 overflow-hidden bg-slate-200 shrink-0">
                        <img 
                          src={prop.media && prop.media.length > 0 ? prop.media[0].url : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"} 
                          alt={prop.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className={`flex items-center gap-1.5 backdrop-blur-md shadow-md py-1.5 px-3 rounded-xl border-0 font-bold ${
                            prop.isVerified ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                          }`}>
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {prop.isVerified ? 'Super Admin Verified' : 'Pending Verification'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 z-10">
                          <Badge className="bg-black/60 text-white backdrop-blur-md border border-white/20 py-1 px-2.5 rounded-lg font-bold capitalize text-xs">
                            {prop.type} PG
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {prop.name}
                          </h3>
                        </div>
                        <div className="flex items-center text-slate-500 font-medium text-xs mb-4">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-indigo-500 shrink-0" />
                          <span className="line-clamp-1">{prop.locality}, {prop.city}</span>
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                            <Bed className="h-3.5 w-3.5 mr-1" />
                            {prop.availableBeds} Beds left
                          </div>
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
                            View PG →
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

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading Search...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
