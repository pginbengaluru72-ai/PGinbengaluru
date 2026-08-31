"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Users, Bed, LayoutGrid, Bell, TrendingUp, ShieldAlert, Sparkles, ChevronRight, Trophy, PieChart, Plus, Wrench, CheckCircle2, ArrowDownRight, ArrowUpRight } from "lucide-react"
import { ownerApi, authApi } from "@/lib/apiClient"
import Link from "next/link"

export default function DashboardOverview() {
  const [stats, setStats] = useState({ totalProperties: 0, totalBeds: 0, availableBeds: 0, occupiedBeds: 0, occupancyRate: 0 })
  const [applications, setApplications] = useState<any[]>([])
  const [userName, setUserName] = useState("Owner")

  const syncState = async () => {
    try {
      const authRes = await authApi.getMe()
      if (authRes?.user?.name) setUserName(authRes.user.name)

      const dbStats = await ownerApi.getDashboardStats()
      if (dbStats) setStats(dbStats)

      const appsRes = await ownerApi.getApplications()
      if (appsRes?.applications) setApplications(appsRes.applications)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    syncState()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-28 space-y-5">
      
      {/* ELECTRIC BLUE TOP HEADER HERO CARD */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white p-5 pt-7 pb-8 rounded-b-3xl shadow-xl space-y-5 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 font-black text-white flex items-center justify-center text-lg shadow-inner">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium">Good Evening 🌙</p>
              <h1 className="text-2xl font-black tracking-tight">{userName}</h1>
            </div>
          </div>
          <button className="p-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <Bell className="w-5 h-5" />
            <span className="w-2.5 h-2.5 bg-red-400 border-2 border-blue-700 rounded-full absolute top-1 right-1" />
          </button>
        </div>

        {/* 4 CORE METRICS PILLS ROW */}
        <div className="grid grid-cols-4 gap-2 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mx-auto text-white">
              <Building className="w-4 h-4" />
            </div>
            <p className="text-lg font-black">{stats.totalProperties}</p>
            <p className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Properties</p>
          </div>

          <div className="space-y-1 border-l border-white/15">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mx-auto text-white">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-lg font-black">{stats.occupiedBeds}</p>
            <p className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Tenants</p>
          </div>

          <div className="space-y-1 border-l border-white/15">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mx-auto text-white">
              <Bed className="w-4 h-4" />
            </div>
            <p className="text-lg font-black">{stats.totalBeds}</p>
            <p className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Beds</p>
          </div>

          <div className="space-y-1 border-l border-white/15">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mx-auto text-white">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <p className="text-lg font-black">{stats.totalProperties > 0 ? stats.totalProperties * 4 : 0}</p>
            <p className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Rooms</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-5">
        
        {/* SYSTEM ANNOUNCEMENT (Mocked for now) */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-start gap-3 shadow-sm">
          <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">System Announcement</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Welcome to the new StaySure Owner Platform.</p>
          </div>
        </div>

        {/* FINANCIAL OVERVIEW CARD */}
        <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Financial Overview</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">Jul 2026</span>
            </div>

            {/* Net Profit Banner */}
            <div className="p-4 bg-emerald-500 text-white rounded-2xl flex items-center justify-between shadow-md shadow-emerald-500/20">
              <div>
                <p className="text-xs font-medium text-emerald-100">Net Profit</p>
                <p className="text-2xl font-black mt-0.5">+₹42,500</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>

            {/* Income vs Expenses Stats */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Income
                </span>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-1">₹65,000</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Expenses
                </span>
                <p className="text-lg font-black text-red-600 dark:text-red-400 mt-1">₹22,500</p>
              </div>
            </div>

            {/* Pending Deposits Button Pill */}
            <Link href="/owner/billing" className="block">
              <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900 flex items-center justify-between hover:bg-purple-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-xs font-bold text-purple-900 dark:text-purple-200">Pending Deposits & Charges</p>
                    <p className="text-[11px] text-purple-600 dark:text-purple-400">Security deposits & extra maintenance dues</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-500" />
              </div>
            </Link>
          </div>
        </Card>

        {/* TRUST BANNER: India's #1 PG Manager */}
        <div className="p-5 bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-3xl shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-black tracking-tight">India's #1 PG Manager</span>
            </div>
            <p className="text-xs text-teal-100 font-medium">Trusted by 500+ PG owners across India</p>
            <div className="flex items-center gap-3 text-[11px] font-bold pt-1 text-teal-100">
              <span>★ 4.8 Rating</span>
              <span>•</span>
              <span>📥 1000+ Downloads</span>
            </div>
          </div>
        </div>

        {/* OCCUPANCY DONUT & STATS CARD */}
        <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Occupancy Status</h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
              {stats.occupancyRate >= 70 ? 'High' : 'Moderate'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            {/* Donut percentage indicator */}
            <div className="w-28 h-28 rounded-full border-8 border-emerald-500 border-t-slate-200 dark:border-t-slate-800 flex items-center justify-center">
              <span className="text-xl font-black text-slate-900 dark:text-white">{stats.occupancyRate}%</span>
            </div>

            <div className="space-y-2.5 text-xs font-bold w-1/2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Occupied
                </span>
                <span className="text-slate-900 dark:text-white font-black">{stats.occupiedBeds} Beds</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" /> Vacant
                </span>
                <span className="text-slate-900 dark:text-white font-black">{stats.availableBeds} Beds</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Total Beds
                </span>
                <span className="text-slate-900 dark:text-white font-black">{stats.totalBeds} Beds</span>
              </div>
            </div>
          </div>
        </Card>

        {/* TENANT MAINTENANCE QUEUE */}
        <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" /> Pending Applications
            </h2>
            <span className="text-xs font-bold text-slate-500">{applications.length} Active</span>
          </div>

          <div className="space-y-2">
            {applications.length === 0 && <p className="text-xs text-slate-500">No pending applications.</p>}
            {applications.map((app) => (
              <div key={app.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{app.customerName}</p>
                  <p className="text-[11px] text-slate-500">{app.propertyName}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* FLOATING AI ASSISTANT BUTTON */}
      <button className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-purple-600 text-white shadow-xl shadow-purple-500/40 flex items-center justify-center hover:scale-110 transition-transform">
        <Sparkles className="w-6 h-6" />
      </button>

    </div>
  )
}
