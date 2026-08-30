"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, IndianRupee, Users, Building2, MapPin, CheckCircle2, Clock } from "lucide-react"
import { adminApi } from "@/lib/apiClient"
import Link from "next/link"

export default function SuperAdminDashboardOverview() {
  const [stats, setStats] = useState({ 
    totalUsers: 0, totalOwners: 0, totalCustomers: 0,
    totalProperties: 0, verifiedProperties: 0, pendingProperties: 0,
    totalBeds: 0, occupiedBeds: 0, availableBeds: 0, occupancyRate: 0 
  })
  const [unverifiedProps, setUnverifiedProps] = useState<any[]>([])

  const syncState = async () => {
    try {
      const overview = await adminApi.getOverview()
      if (overview) setStats(overview)

      const verifs = await adminApi.getVerifications()
      if (verifs?.properties) setUnverifiedProps(verifs.properties)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    syncState()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await adminApi.verifyProperty(id)
      syncState()
    } catch (e: any) {
      alert(e.message || "Failed to verify property")
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Platform Overview</h2>
        <p className="text-muted-foreground text-sm">Global metrics and real-time operational controls across HSRPG.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-100 dark:border-emerald-950 bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Total SaaS Revenue (MRR)</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">₹42,500</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">+12% from owner platform subscriptions</p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 dark:border-amber-950 bg-gradient-to-br from-white to-amber-50/40 dark:from-slate-900 dark:to-amber-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Pending PG Approvals</CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.pendingProperties}</div>
            <p className="text-xs text-amber-600 font-medium mt-1">PG listings awaiting physical verification</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 dark:border-indigo-950 bg-gradient-to-br from-white to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.totalCustomers}</div>
            <p className="text-xs text-indigo-600 font-medium mt-1">Across all verified properties</p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-100 dark:border-purple-950 bg-gradient-to-br from-white to-purple-50/40 dark:from-slate-900 dark:to-purple-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">Total PGs Listed</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.totalProperties}</div>
            <p className="text-xs text-purple-600 font-medium mt-1">{stats.verifiedProperties} Verified Live</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Verification Queue</CardTitle>
              <CardDescription className="text-xs">Owners have submitted these properties for Super Admin approval.</CardDescription>
            </div>
            <Link href="/superadmin/verifications">
              <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl border-slate-200">
                View All ({stats.pendingProperties})
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {unverifiedProps.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                All owner property listings are verified & active!
              </div>
            ) : (
              <div className="space-y-3">
                {unverifiedProps.map((prop) => (
                  <div key={prop.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100/50 transition-colors">
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {prop.name}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Pending Approval
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-indigo-500" /> {prop.locality}, {prop.city}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleApprove(prop.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl h-9 shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Approve Listing
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            <CardDescription className="text-xs">Super admin administrative controls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/superadmin/broadcast" className="block">
              <div className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors group cursor-pointer">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">📢 Send System-Wide Broadcast</p>
                <p className="text-xs text-slate-500 mt-0.5">Push alerts directly to all Owner and Tenant dashboards.</p>
              </div>
            </Link>

            <Link href="/superadmin/localities" className="block">
              <div className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors group cursor-pointer">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">📍 Manage City Coverage Zones</p>
                <p className="text-xs text-slate-500 mt-0.5">Enable or pause areas in Bangalore for property listings.</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
