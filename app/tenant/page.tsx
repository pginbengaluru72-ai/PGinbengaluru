"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, MapPin, CheckCircle, Clock, Bell, Wrench, CreditCard, MessageSquare, Heart, Flame, CalendarDays } from "lucide-react"
import { customerApi, authApi } from "@/lib/apiClient"
import Link from "next/link"
import { motion } from "framer-motion"

export default function TenantDashboardOverview() {
  const [applications, setApplications] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [broadcast, setBroadcast] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const syncState = async () => {
    try {
      const [appsRes, ticketsRes, favsRes, broadcastRes] = await Promise.all([
        customerApi.getMyApplications().catch(() => null),
        customerApi.getTickets().catch(() => null),
        customerApi.getMyFavorites().catch(() => null),
        authApi.getBroadcast().catch(() => null)
      ])
      
      if (appsRes?.applications) setApplications(appsRes.applications)
      if (ticketsRes?.tickets) setTickets(ticketsRes.tickets)
      if (favsRes?.favorites) setFavorites(favsRes.favorites)
      if (broadcastRes?.broadcast) setBroadcast(broadcastRes.broadcast)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    syncState()
  }, [])

  const activeStay = applications.find(a => a.status === 'ACCEPTED')
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length
  const inProgressTickets = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Stay & Dashboard</h2>
        <p className="text-muted-foreground text-sm">Welcome back! Manage your room, track maintenance requests, and review saved properties.</p>
      </div>

      {/* Super Admin Broadcast Banner */}
      {broadcast && (broadcast.target === 'all' || broadcast.target === 'tenants') && (
        <motion.div whileHover={{ scale: 1.01 }} className={`p-4 border rounded-2xl flex items-start gap-3 shadow-sm transition-all ${broadcast.level === 'warning' ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800' : 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800'}`}>
          <Bell className={`w-5 h-5 mt-0.5 shrink-0 animate-bounce ${broadcast.level === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${broadcast.level === 'warning' ? 'text-amber-700 dark:text-amber-300' : 'text-indigo-700 dark:text-indigo-300'}`}>HSRPG Platform Notice</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{broadcast.message}</p>
          </div>
        </motion.div>
      )}

      {/* Active Stay Card */}
      {activeStay ? (
        <Card className="border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/30 dark:to-slate-900 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Current Occupant
              </span>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2">{activeStay.propertyName}</CardTitle>
            <CardDescription className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {activeStay.propertyLocality}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 pt-2">
              <Link href="/tenant/tickets">
                <Button variant="outline" className="h-10 rounded-xl font-bold text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-all shadow-sm">
                  <Wrench className="w-4 h-4 mr-2" /> Raise Maintenance Request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-indigo-200 dark:border-indigo-900 bg-slate-50 dark:bg-slate-900/50 shadow-sm p-8 text-center transition-all hover:shadow-md">
          <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Active Stay</h3>
          <p className="text-sm text-slate-500 mb-4">You do not have any accepted applications for a PG.</p>
          <Link href="/search">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">Find a PG</Button>
          </Link>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/tenant/tickets" className="block">
          <Card className="h-full border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Maintenance Tickets</CardTitle>
              <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-md"><Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{tickets.length}</div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {resolvedTickets} Resolved • {inProgressTickets} Open
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Gamified Rent Streak Card */}
        <Card className="border-orange-200 dark:border-orange-900 shadow-sm bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-900 dark:to-orange-950/30 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Rent Streak</CardTitle>
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-md"><Flame className="h-4 w-4 text-orange-600 dark:text-orange-400 animate-pulse" /></div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100">8</div>
              <div className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-1">Months</div>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-orange-500 rounded-full" transition={{ duration: 1, delay: 0.2 }} />
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-2">2 months until Gold Tier</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Tenant KYC Verification</CardTitle>
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-md"><CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Verified</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Aadhaar & Police KYC Complete</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Saved PGs</CardTitle>
            <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 rounded-md"><Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{favorites.length}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Properties bookmarked</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
