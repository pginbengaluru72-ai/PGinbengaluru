"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Bed, Users } from "lucide-react"

const DEFAULT_DATA = {
  totalProperties: 2,
  totalBeds: 50,
  availableBeds: 12,
  totalTenants: 38,
  recentActivity: [
    { id: 1, name: "Rahul Sharma", action: "Inquired about 2-sharing room in Sector 2", time: "10 mins ago" },
    { id: 2, name: "Priya Patel", action: "Paid rent for Room 104", time: "1 hour ago" },
    { id: 3, name: "Vikram Singh", action: "Submitted maintenance ticket for Wi-Fi", time: "3 hours ago" }
  ]
}

export default function DashboardOverview() {
  const [data, setData] = useState<any>(DEFAULT_DATA)

  useEffect(() => {
    fetch('https://hsrpg-api.pginbengaluru72.workers.dev/api/owner/dashboard')
      .then(res => res.ok ? res.json() : null)
      .then(d => {
        if (d) setData(d)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Here is what's happening with your properties today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-indigo-100 shadow-sm bg-gradient-to-br from-white to-indigo-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.totalProperties}</div>
            <p className="text-xs text-indigo-600 font-medium mt-1">Active in your account</p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-100 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
            <Bed className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.availableBeds}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Out of {data.totalBeds} total beds</p>
          </CardContent>
        </Card>

        <Card className="border-purple-100 shadow-sm bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.totalTenants}</div>
            <p className="text-xs text-purple-600 font-medium mt-1">Current active tenants</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200/80 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Real-time updates from your tenants and leads.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.recentActivity?.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{activity.name}</p>
                    <p className="text-xs text-slate-500">{activity.action}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
