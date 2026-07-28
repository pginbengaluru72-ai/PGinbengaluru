"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, MapPin, CheckCircle, Clock, Bell, Wrench, CreditCard, MessageSquare } from "lucide-react"
import { AppState, BroadcastItem, MaintenanceTicket } from "@/lib/appState"
import Link from "next/link"

export default function TenantDashboardOverview() {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([])
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([])

  const syncState = () => {
    setBroadcasts(AppState.getBroadcasts().filter(b => b.target === "all" || b.target === "tenants"))
    setTickets(AppState.getTickets().filter(t => t.tenantName === "Rahul Sharma"))
  }

  useEffect(() => {
    syncState()
    window.addEventListener("hsrpg_state_change", syncState)
    return () => window.removeEventListener("hsrpg_state_change", syncState)
  }, [])

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Stay & Dashboard</h2>
        <p className="text-muted-foreground text-sm">Welcome back! Manage your room, pay rent, and track maintenance requests.</p>
      </div>

      {/* Super Admin Broadcast Banner */}
      {broadcasts.length > 0 && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 rounded-2xl flex items-start gap-3 shadow-sm">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">HSRPG Platform Notice</span>
              <span className="text-[10px] text-indigo-500">• {broadcasts[0].createdAt}</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{broadcasts[0].message}</p>
          </div>
        </div>
      )}

      {/* Active Stay Card */}
      <Card className="border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/30 dark:to-slate-900 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
              Current Occupant
            </span>
            <span className="text-xs font-medium text-slate-500">Joined 01 Jan 2026</span>
          </div>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2">Sunrise Luxury PG for Men</CardTitle>
          <CardDescription className="text-xs text-slate-500">Sector 2, HSR Layout, Bengaluru</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white/80 dark:bg-slate-950/80 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Allocated Bed</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">Room 101 - Bed 2</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-950/80 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Monthly Rent</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100">₹10,500</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-950/80 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Rent Status</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Paid (July 2026)</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-950/80 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Owner Contact</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">+91 98765 43210</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <a 
              href="https://wa.me/919876543210?text=Hi%20Owner,%20I%20have%20a%20query%20regarding%20Room%20101."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Chat with PG Owner
            </a>
            <Link href="/tenant/tickets">
              <Button variant="outline" className="h-10 rounded-xl font-bold text-xs border-slate-200">
                <Wrench className="w-4 h-4 mr-2 text-amber-500" /> Raise Maintenance Request
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Maintenance Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{tickets.length}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {tickets.filter(t => t.status === "Resolved").length} Resolved • {tickets.filter(t => t.status !== "Resolved").length} In Progress
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
