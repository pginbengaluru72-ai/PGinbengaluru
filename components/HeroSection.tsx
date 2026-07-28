"use client"

import { motion } from "framer-motion"
import { Search, MapPin, Building, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/search?q=HSR')
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-950 to-purple-950 opacity-90" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
      
      {/* Decorative Orbs */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30" 
      />
      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30" 
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            100% Physically Verified PGs in Bengaluru
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Find Your Perfect <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Co-Living Space.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Zero brokers. Real photos. Live bed availability. Currently dominating HSR, Koramangala, BTM, and more.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-8">
            <div className="flex flex-col md:flex-row gap-3 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-full shadow-2xl">
              <div className="relative flex-1 flex items-center">
                <MapPin className="absolute left-4 text-slate-400 h-5 w-5" />
                <Input 
                  type="text" 
                  placeholder="Search 'HSR Layout' or 'BTM Layout'" 
                  className="w-full pl-12 h-14 bg-transparent border-none text-white placeholder:text-slate-400 focus-visible:ring-0 text-lg"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl md:rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition-all hover:scale-105 active:scale-95">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </form>

          <div className="pt-12 flex flex-wrap justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              <span>Verified Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-indigo-400" />
              <span>Direct Owner Contact</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
