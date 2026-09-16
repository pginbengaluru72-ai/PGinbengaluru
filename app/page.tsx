"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, ShieldCheck, Building, Phone, Star, ArrowRight, Sparkles, Users, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertyCard } from "@/components/PropertyCard"
import { publicApi } from "@/lib/apiClient"
import Link from "next/link"
import { useRouter } from "next/navigation"

const LOCALITIES = [
  { name: "HSR Layout", slug: "hsr-layout", emoji: "🏢", count: "50+" },
  { name: "Koramangala", slug: "koramangala", emoji: "🌆", count: "40+" },
  { name: "BTM Layout", slug: "btm-layout", emoji: "🏘️", count: "35+" },
  { name: "Marathahalli", slug: "marathahalli", emoji: "🏙️", count: "25+" },
  { name: "Electronic City", slug: "electronic-city", emoji: "💻", count: "20+" },
  { name: "Whitefield", slug: "whitefield", emoji: "🌳", count: "30+" },
]

const STATS = [
  { label: "Verified PGs", value: "200+", icon: ShieldCheck },
  { label: "Happy Tenants", value: "5,000+", icon: Users },
  { label: "Areas Covered", value: "15+", icon: MapPin },
  { label: "Zero Brokerage", value: "100%", icon: TrendingUp },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredPGs, setFeaturedPGs] = useState<any[]>([])

  useEffect(() => {
    publicApi.searchProperties({ limit: '6' })
      .then(res => setFeaturedPGs(res?.properties || []))
      .catch(() => {})
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`)
  }

  return (
    <div className="relative overflow-hidden">
      
      {/* ============== HERO SECTION ============== */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-950 to-purple-950 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-15" />
        
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-25" 
        />
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] opacity-25" 
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              100% Physically Verified PGs in Bengaluru
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Find Your Perfect <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400">
                Co-Living Space.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              Zero brokers. Real photos. Live bed availability. Starting at just ₹5,000/month in HSR, Koramangala, BTM & more.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-8">
              <div className="flex flex-col sm:flex-row gap-3 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-full shadow-2xl">
                <div className="relative flex-1 flex items-center">
                  <MapPin className="absolute left-4 text-slate-400 h-5 w-5" />
                  <Input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 'HSR Layout' or 'Koramangala'" 
                    className="w-full pl-12 h-14 bg-transparent border-none text-white placeholder:text-slate-400 focus-visible:ring-0 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 rounded-xl sm:rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition-all hover:scale-105 active:scale-95">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
            </form>

            {/* Trust Signals */}
            <div className="pt-8 flex flex-wrap justify-center gap-6 sm:gap-8 text-slate-400">
              {STATS.map(stat => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="h-5 w-5 text-indigo-400" />
                  <span className="text-white font-bold">{stat.value}</span>
                  <span className="text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== POPULAR AREAS ============== */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular Areas in Bengaluru
            </h2>
            <p className="mt-3 text-slate-500 text-lg max-w-2xl mx-auto">
              Browse verified PGs across Bengaluru&apos;s most popular tech hubs and residential areas.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {LOCALITIES.map((loc, idx) => (
              <motion.div
                key={loc.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link href={`/area/${loc.slug}`} className="block group">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl transition-all duration-300 text-center group-hover:-translate-y-1">
                    <span className="text-3xl block mb-2">{loc.emoji}</span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{loc.name}</h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{loc.count} PGs</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FEATURED PGS ============== */}
      {featuredPGs.length > 0 && (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Featured PGs
                </h2>
                <p className="mt-2 text-slate-500 text-lg">Hand-picked, verified accommodations.</p>
              </div>
              <Link href="/search" className="hidden sm:flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPGs.slice(0, 6).map((pg, idx) => (
                <motion.div
                  key={pg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <PropertyCard
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
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/search">
                <Button variant="outline" className="rounded-full px-8">
                  View All PGs <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============== CTA FOR OWNERS ============== */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-md text-sm py-1.5 px-4 rounded-full">
              <Building className="w-4 h-4 mr-1.5" /> For PG Owners
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              List Your PG for Free
            </h2>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Reach thousands of verified tenants every month. Zero commission. Real leads delivered to your WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/list-your-pg">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  Get Started — It&apos;s Free
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold text-lg px-10 py-6 rounded-full backdrop-blur-sm">
                  Owner Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How StaySure Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Search", desc: "Browse PGs by area, type, price range and amenities. Every listing has real photos." },
              { step: "02", title: "Compare", desc: "Compare room types, pricing, and amenities. Check live bed availability in real-time." },
              { step: "03", title: "Contact", desc: "Connect directly with the PG owner via WhatsApp. Zero middlemen, zero brokerage." },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
