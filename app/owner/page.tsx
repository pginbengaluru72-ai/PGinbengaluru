"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Bed, Users, Bell, Wrench, CheckCircle2, Clock } from "lucide-react"
import { AppState, PropertyItem, BroadcastItem, MaintenanceTicket } from "@/lib/appState"
import Link from "next/link"

export default function DashboardOverview() {
  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([])
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([])

  const syncState = () => {
    setProperties(AppState.getProperties())
    setBroadcasts(AppState.getBroadcasts().filter(b => b.target === "all" || b.target === "owners"))
    setTickets(AppState.getTickets())
  }

  useEffect(() => {
    syncState()
    window.addEventListener("hsrpg_state_change", syncState)
    return () => window.removeEventListener("hsrpg_state_change", syncState)
  }, [])

  const totalBeds = properties.reduce((acc, p) => acc + (p.totalRooms * 2), 0) || 40
  const availableBeds = properties.reduce((acc, p) => acc + p.availableBeds, 0) || 12

  const handleUpdateTicketStatus = (id: string, newStatus: "Open" | "In Progress" | "Resolved") => {
    AppState.updateTicketStatus(id, newStatus)
    syncState()
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Owner Dashboard Overview</h2>
        <p className="text-muted-foreground text-sm">Real-time status of your PG listings, tenant maintenance requests, and platform alerts.</p>
      </div>

      {/* Super Admin Broadcast Banner */}
      {broadcasts.length > 0 && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 rounded-2xl flex items-start gap-3 shadow-sm">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Super Admin Broadcast</span>
              <span className="text-[10px] text-indigo-500">• {broadcasts[0].createdAt}</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{broadcasts[0].message}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-indigo-100 dark:border-indigo-950 shadow-sm bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">Total Listed Properties</CardTitle>
            <Building className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{properties.length}</div>
            <p className="text-xs text-indigo-600 font-medium mt-1">{properties.filter(p => p.isVerified).length} Verified by Super Admin</p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-100 dark:border-emerald-950 shadow-sm bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Available Beds</CardTitle>
            <Bed className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{availableBeds}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Ready for immediate tenant booking</p>
          </CardContent>
        </Card>

        <Card className="border-purple-100 dark:border-purple-950 shadow-sm bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-900 dark:to-purple-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">38</div>
            <p className="text-xs text-purple-600 font-medium mt-1">Occupying room beds</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100 dark:border-amber-950 shadow-sm bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900 dark:to-amber-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Tenant Maintenance Requests</CardTitle>
            <Wrench className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {tickets.filter(t => t.status !== "Resolved").length}
            </div>
            <p className="text-xs text-amber-600 font-medium mt-1">Pending maintenance issues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4 border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Tenant Maintenance Queue</CardTitle>
            <CardDescription className="text-xs">Issues reported directly by tenants in their dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <p className="text-xs text-slate-500">No maintenance tickets reported.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.tenantName} ({t.room})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                          t.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.issue}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {t.status !== "Resolved" && (
                        <Button 
                          size="sm"
                          onClick={() => handleUpdateTicketStatus(t.id, t.status === "Open" ? "In Progress" : "Resolved")}
                          className="text-xs font-bold rounded-lg h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          {t.status === "Open" ? "Mark In Progress" : "Resolve Ticket"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Property Verification Status</CardTitle>
            <CardDescription className="text-xs">Live status of your PGs submitted to Super Admin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {properties.map((p) => (
              <div key={p.id} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.locality}, {p.city}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  p.isVerified 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {p.isVerified ? 'Verified Live' : 'Pending Super Admin Approval'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
