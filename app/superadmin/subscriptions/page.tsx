"use client"

import { useState } from "react"
import PageTransition from "@/components/PageTransition"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, DollarSign, TrendingUp, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react"

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState([
    { id: "p1", name: "Owner Starter", price: "₹499/mo", activeOwners: 42, status: "Active" },
    { id: "p2", name: "Owner Pro (Multi-PG)", price: "₹1,499/mo", activeOwners: 18, status: "Active" },
    { id: "p3", name: "Enterprise Franchise", price: "₹3,999/mo", activeOwners: 5, status: "Active" }
  ])

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">SaaS Revenue & Subscriptions</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage Owner SaaS plan pricing, recurring revenue, and active subscriptions.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border-white dark:border-slate-800 shadow-xl rounded-3xl p-6">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Recurring Revenue (MRR)</span>
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">₹67,935</p>
            <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
            </p>
          </Card>

          <Card className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border-white dark:border-slate-800 shadow-xl rounded-3xl p-6">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Paid Owners</span>
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">65 Owners</p>
            <p className="text-xs text-indigo-600 font-bold mt-2">Zero churn rate</p>
          </Card>

          <Card className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border-white dark:border-slate-800 shadow-xl rounded-3xl p-6">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Revenue Per User</span>
              <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">₹1,045 / mo</p>
            <p className="text-xs text-purple-600 font-bold mt-2">Owner Pro top tier</p>
          </Card>
        </div>

        {/* Subscription Plans List */}
        <Card className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl border-white dark:border-slate-800 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xl font-bold">Active SaaS Plans</CardTitle>
            <CardDescription>Owner subscription Tiers configured across Bengaluru.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
            {plans.map((plan) => (
              <div key={plan.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{plan.price}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold text-slate-500">{plan.activeOwners} Owners Subscribed</span>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-0 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active Plan
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
