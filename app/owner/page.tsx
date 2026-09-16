"use client"

import { useState, useEffect } from "react"
import { Building, Bed, PieChart, Users, ArrowRight, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ownerApi } from "@/lib/apiClient"
import Link from "next/link"

export default function OwnerDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ownerApi.getDashboardStats()
      .then(res => setStats(res))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>)}
      </div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1 text-sm">Welcome back. Here's what's happening with your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Properties</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats?.totalProperties || 0}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center">
                <Building className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leads</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats?.totalLeads || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupancy Rate</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats?.occupancyRate || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Beds</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats?.availableBeds || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center">
                <Bed className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between items-start">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
          <div className="relative z-10 mb-6">
            <h3 className="text-xl font-extrabold mb-2">Add New Property</h3>
            <p className="text-indigo-100 text-sm max-w-sm">List another PG to start getting verified leads directly on WhatsApp.</p>
          </div>
          <Link href="/owner/properties/new" className="relative z-10">
            <Button className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-full">
              List Property <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col justify-between items-start">
          <div className="mb-6">
            <h3 className="text-xl font-extrabold mb-2">View Recent Leads</h3>
            <p className="text-slate-400 text-sm max-w-sm">Check who has contacted you for your available beds recently.</p>
          </div>
          <Link href="/owner/leads">
            <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 font-bold rounded-full">
              View Leads <UserPlus className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

    </div>
  )
}
