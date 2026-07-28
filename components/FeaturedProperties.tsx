"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, CheckCircle } from "lucide-react"
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export function FeaturedProperties() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-12"
      >
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Featured Spaces in HSR Layout</h2>
          <p className="text-muted-foreground mt-2 text-lg">Physically verified and ready to move in today.</p>
        </div>
        <Link href="/search?q=HSR" className="hidden md:flex items-center text-indigo-600 font-bold hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100">
          View all →
        </Link>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {[1, 2, 3].map((i) => (
          <motion.div variants={item} key={i}>
            <Link href={`/pg/${i}`} className="group block h-full">
              <Card className="h-full overflow-hidden border-0 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 rounded-3xl bg-white/60 backdrop-blur-xl">
                <div className="relative h-72 overflow-hidden bg-slate-200">
                  <img 
                    src={`https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop`} 
                    alt="PG Room" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-white/95 text-indigo-700 hover:bg-white flex items-center gap-1.5 backdrop-blur-md shadow-lg shadow-black/10 py-1.5 px-3 rounded-xl border-0 font-bold">
                      <CheckCircle className="h-4 w-4 text-emerald-500" /> Verified
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-black/40 text-white backdrop-blur-md border border-white/20 py-1.5 px-3 rounded-xl font-semibold">
                      Boys
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-extrabold text-2xl text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">Sunrise Premium Stay</h3>
                    <div className="text-right shrink-0 ml-4">
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-0.5">Starts at</span>
                      <span className="font-black text-2xl text-slate-900">₹8,500</span>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-500 font-medium mb-6">
                    <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
                    Sector 2, HSR Layout
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="flex items-center text-sm text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg">
                      <Bed className="h-4 w-4 mr-2" />
                      3 Beds Available
                    </div>
                    <span className="text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                      View Details →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 text-center md:hidden">
        <Link href="/search?q=HSR" className="inline-flex items-center justify-center w-full text-indigo-600 font-bold transition-colors bg-indigo-50 px-6 py-4 rounded-2xl hover:bg-indigo-100">
          View all properties
        </Link>
      </div>
    </section>
  )
}
