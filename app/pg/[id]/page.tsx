"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Bed, CheckCircle, ShieldCheck, Wifi, Snowflake, Coffee, Tv, MessageCircle, ChevronLeft, X, Send } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Turnstile } from "@marsidev/react-turnstile"

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!turnstileToken) {
      alert("Please complete the security check.")
      return
    }
    
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => setIsModalOpen(false), 2000)
    }, 1500)
  }
  
  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between">
        <Link href="/search?q=HSR" className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 h-10 w-10 transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="font-bold text-lg text-slate-900 tracking-tight">Sunrise Premium PG</div>
        <div className="w-10"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-[40vh] md:h-[60vh] flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {[1, 2, 3].map((img) => (
          <div key={img} className="w-full shrink-0 snap-center relative">
            <img 
              src={`https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop`} 
              alt="Room view" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        ))}
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-white"
        >
          
          <div className="flex flex-col md:flex-row md:justify-between items-start gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-bold">
                  <ShieldCheck className="h-4 w-4" /> Physically Verified
                </Badge>
                <Badge variant="outline" className="text-slate-600 border-slate-200 py-1.5 px-3 rounded-xl font-bold">Boys Only</Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Sunrise Premium PG</h1>
              <div className="flex items-center text-slate-500 font-medium mt-3 text-lg">
                <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                Sector 2, HSR Layout, Bengaluru
              </div>
            </div>
            <div className="text-left md:text-right bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none w-full md:w-auto">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider block mb-1">Starts at</span>
              <span className="font-black text-4xl text-slate-900">₹8,500<span className="text-lg font-medium text-slate-500">/mo</span></span>
            </div>
          </div>

          <div className="my-10 border-t border-slate-100"></div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Premium Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <div className="bg-white p-2 rounded-xl shadow-sm"><Wifi className="h-5 w-5 text-indigo-600" /></div>
                <span className="text-sm font-bold text-slate-700">High-Speed WiFi</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <div className="bg-white p-2 rounded-xl shadow-sm"><Snowflake className="h-5 w-5 text-blue-600" /></div>
                <span className="text-sm font-bold text-slate-700">AC Rooms</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                <div className="bg-white p-2 rounded-xl shadow-sm"><Coffee className="h-5 w-5 text-amber-600" /></div>
                <span className="text-sm font-bold text-slate-700">3 Meals/Day</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                <div className="bg-white p-2 rounded-xl shadow-sm"><Tv className="h-5 w-5 text-rose-600" /></div>
                <span className="text-sm font-bold text-slate-700">Common TV</span>
              </div>
            </div>
          </motion.div>

          <div className="my-10 border-t border-slate-100"></div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">Live Availability</h2>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Live Sync</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Card className="border-indigo-200 shadow-md bg-indigo-50/30 rounded-3xl overflow-hidden">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-extrabold text-xl text-slate-900">Double Sharing (AC)</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Attached bathroom, individual wardrobe.</p>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <span className="block text-3xl font-black text-slate-900">₹10,500</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">per month</span>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-2xl border border-emerald-200 shadow-sm shrink-0 min-w-[4rem]">
                      <span className="block text-2xl font-black text-emerald-700 text-center">2</span>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest text-center block">Left</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden opacity-75">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">Triple Sharing (Non-AC)</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Spacious room, great ventilation.</p>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <span className="block text-3xl font-black text-slate-900">₹8,500</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">per month</span>
                    </div>
                    <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 shrink-0 min-w-[4rem]">
                      <span className="block text-2xl font-black text-slate-400 text-center">0</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">Sold</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 left-0 right-0 px-6 z-40 pointer-events-none"
      >
        <div className="max-w-2xl mx-auto bg-slate-900/90 backdrop-blur-xl p-3 rounded-full shadow-2xl shadow-slate-900/50 border border-slate-800 flex items-center justify-between gap-4 pointer-events-auto">
          <div className="hidden sm:block pl-6">
            <p className="text-sm font-medium text-slate-400">Direct Owner Contact</p>
            <p className="font-bold text-white text-lg">0% Brokerage</p>
          </div>
          <Button 
            size="lg" 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white rounded-full h-14 px-8 text-lg font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-105"
          >
            <MessageCircle className="mr-2 h-6 w-6" />
            Contact Owner Now
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-xl text-slate-900">Send Inquiry</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Directly to the property owner.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              
              <div className="p-6">
                {isSuccess ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="font-black text-2xl text-slate-900">Inquiry Sent!</h3>
                    <p className="font-medium text-slate-500">The owner will contact you shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Your Name</label>
                      <input required type="text" className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">WhatsApp Number</label>
                      <input required type="tel" className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium" placeholder="+91 98765 43210" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Message (Optional)</label>
                      <textarea className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium resize-none h-24" placeholder="I am interested in the Double Sharing AC room..." />
                    </div>
                    
                    <div className="flex justify-center py-2">
                      <Turnstile 
                        siteKey="1x00000000000000000000AA"
                        onSuccess={(token) => setTurnstileToken(token)}
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isSubmitting || !turnstileToken}
                      className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center"><span className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span> Sending...</span>
                      ) : (
                        <span className="flex items-center"><Send className="mr-2 h-5 w-5" /> Send to Owner</span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
