"use client"

import { useState } from "react"
import PageTransition from "@/components/PageTransition"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Shield, Bell, Database, CheckCircle2 } from "lucide-react"

export default function SuperAdminSettingsPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [settings, setSettings] = useState({
    platformName: "HSRPG Bengaluru",
    supportEmail: "admin@hsrpg.in",
    autoVerifyListings: false,
    maintenanceMode: false
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <PageTransition>
      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-2 font-medium">Configure global platform configurations, security, and verification rules.</p>
        </div>

        {isSaved && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Platform configurations saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl border-white dark:border-slate-800 shadow-xl rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">General Parameters</CardTitle>
                <CardDescription>Main system identity & notification channels.</CardDescription>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-xs">Platform Name</Label>
              <Input 
                value={settings.platformName}
                onChange={e => setSettings({...settings, platformName: e.target.value})}
                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-xs">Support Email</Label>
              <Input 
                value={settings.supportEmail}
                onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Auto-Approve Property Listings</span>
                <span className="text-[11px] text-slate-500">Bypass Super Admin verification step for new PG entries</span>
              </div>
              <input 
                type="checkbox"
                checked={settings.autoVerifyListings}
                onChange={e => setSettings({...settings, autoVerifyListings: e.target.checked})}
                className="w-5 h-5 accent-indigo-600 cursor-pointer rounded"
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200">
              Save Platform Settings
            </Button>
          </Card>
        </form>
      </div>
    </PageTransition>
  )
}
