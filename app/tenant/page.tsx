"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, MapPin, CheckCircle, Clock, Bell, Wrench, CreditCard, MessageSquare } from "lucide-react"
import { customerApi } from "@/lib/apiClient"
import Link from "next/link"

export default function TenantDashboardOverview() {
  const [applications, setApplications] = useState<any[]>([])

  const syncState = async () => {
    try {
      const apps = await customerApi.getMyApplications()
      if (apps?.applications) {
        setApplications(apps.applications)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    syncState()
  }, [])

  const activeStay = applications.find(a => a.status === 'ACCEPTED')

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Stay & Dashboard</h2>
        <p className="text-muted-foreground text-sm">Welcome back! Manage your room, pay rent, and track maintenance requests.</p>
      </div>

      {/* Super Admin Broadcast Banner (Mocked) */}
      <div className="p-4 bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 rounded-2xl flex items-start gap-3 shadow-sm">
        <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">HSRPG Platform Notice</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Welcome to your new tenant portal.</p>
        </div>
      </div>

      {/* Active Stay Card */}
      {activeStay ? (
        <Card className="border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/30 dark:to-slate-900 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                Current Occupant
              </span>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2">{activeStay.propertyName}</CardTitle>
            <CardDescription className="text-xs text-slate-500">Your approved stay at this property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 pt-2">
              <Link href="/tenant/tickets">
                <Button variant="outline" className="h-10 rounded-xl font-bold text-xs border-slate-200">
                  <Wrench className="w-4 h-4 mr-2 text-amber-500" /> Raise Maintenance Request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-indigo-200 dark:border-indigo-900 bg-slate-50 shadow-sm p-8 text-center">
          <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Active Stay</h3>
          <p className="text-sm text-slate-500 mb-4">You do not have any accepted applications for a PG.</p>
          <Link href="/search">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Find a PG</Button>
          </Link>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Maintenance Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              0 Resolved • 0 In Progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Tenant KYC Verification</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Verified</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Aadhaar & Police KYC Complete</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Saved PGs</CardTitle>
            <Building className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">4</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Bookmarked in HSR Layout</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
