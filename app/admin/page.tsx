"use client"

import { useState, useEffect } from "react"
import { Building, ShieldCheck, Users, List, PieChart, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/apiClient"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getOverview()
      .then(res => setStats(res))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-8 text-slate-500">Loading admin dashboard...</div>
  }

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Overview</h1>
        <p className="text-slate-500 mt-1 text-sm">Platform-wide statistics and pending actions.</p>
      </div>

      {/* Action Alerts */}
      {stats?.pendingProperties > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 text-amber-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-300">Action Required</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">There are {stats.pendingProperties} properties waiting for physical verification.</p>
            </div>
          </div>
          <Link href="/admin/verifications">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg">Review Now</Button>
          </Link>
        </div>
      )}

      {/* High-level metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Properties</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.totalProperties || 0}</p>
                  <span className="text-xs font-bold text-emerald-500">{stats?.verifiedProperties || 0} verified</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center shrink-0">
                <Building className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Owners</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats?.totalOwners || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Leads</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats?.totalLeads || 0}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Beds</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.totalBeds || 0}</p>
                  <span className="text-xs font-bold text-slate-500">{stats?.occupancyRate || 0}% full</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center shrink-0">
                <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/verifications" className="group">
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white h-full flex flex-col justify-between transition-transform group-hover:-translate-y-1">
            <div className="mb-6">
              <ShieldCheck className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-extrabold mb-2">Property Verifications</h3>
              <p className="text-slate-400 text-sm max-w-sm">Review newly listed properties and mark them as verified to show them on the public website.</p>
            </div>
            <span className="text-indigo-400 font-bold text-sm inline-flex items-center">
              Review Queue →
            </span>
          </div>
        </Link>

        <Link href="/admin/owners" className="group">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between transition-transform group-hover:-translate-y-1">
            <div className="mb-6">
              <Users className="w-8 h-8 text-slate-400 mb-4" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Owner Management</h3>
              <p className="text-slate-500 text-sm max-w-sm">Create new owner accounts manually or manage existing owner profiles and their access.</p>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm inline-flex items-center">
              Manage Owners →
            </span>
          </div>
        </Link>
      </div>

    </div>
  )
}
