"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldCheck, UploadCloud, User, FileText, CheckCircle2 } from "lucide-react"

export default function TenantSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile & KYC</h2>
        <p className="text-muted-foreground mt-1 text-lg">Manage your personal details and upload verification documents.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="col-span-1 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" /> Personal Details
            </CardTitle>
            <CardDescription className="text-sm">Your basic contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue="Abhishek Kumar" className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input defaultValue="abhishek@valantra.in" disabled className="rounded-xl h-11 bg-slate-50 dark:bg-slate-800/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input defaultValue="+91 9876543210" className="rounded-xl h-11" />
            </div>
            <div className="pt-2">
              <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 rounded-xl h-11">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="h-5 w-5" /> KYC Verification
            </CardTitle>
            <CardDescription className="text-sm">Mandatory for booking verified PGs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm">Aadhaar Verified</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">Your identity has been verified securely.</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center justify-between">
                Upload New Document
                <span className="text-xs text-muted-foreground">PDF, JPG up to 5MB</span>
              </label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                <UploadCloud className="h-8 w-8 text-indigo-500" />
                <span className="text-sm font-medium">Click to upload Government ID</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-medium">Uploaded Documents</h4>
              <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/40 dark:bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Aadhaar_Card_Front.jpg</p>
                    <p className="text-xs text-muted-foreground">1.2 MB • Uploaded Oct 12</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
