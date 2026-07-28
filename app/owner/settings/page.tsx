"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Edit2, Gem, User, Lock, Users, Shield, HelpCircle, Share2, FileText, ChevronRight, Phone, Mail, MessageSquare, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Abhishek",
    email: "abhishekholagunditrading@gmail.com",
    phone: "9019465897"
  })

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-28">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
        
        {/* USER PROFILE HEADER CARD */}
        <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center gap-4">
            {/* Avatar with Camera Overlay */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 font-black text-white text-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                AB
              </div>
              <button className="w-6 h-6 rounded-full bg-blue-600 text-white border-2 border-white dark:border-slate-900 flex items-center justify-center absolute -bottom-1 -right-1 shadow">
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 space-y-0.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{profile.name}</h2>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Mail className="w-3 h-3" /> {profile.email}
              </p>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" /> {profile.phone}
              </p>
            </div>

            <button className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* GO PREMIUM VIBRANT PURPLE BANNER */}
        <Link href="#" className="block">
          <div className="p-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white rounded-3xl shadow-lg shadow-purple-500/20 flex items-center justify-between group hover:scale-[1.01] transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-300">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">Remove Ads · Go Premium</p>
                <p className="text-xs text-purple-200 font-semibold">Only ₹99/month</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* ACTION ITEMS MENU LIST */}
        <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
          
          {/* Get Premium */}
          <Link href="#" className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                <Gem className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Get Premium</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Edit Profile */}
          <Link href="#" className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Change Password */}
          <Link href="#" className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Change Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Staff Management */}
          <Link href="/owner/team" className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Staff Management</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Manage Team */}
          <Link href="/owner/team" className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Manage Team</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Help & Support with Quick Contact Buttons */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Help & Support</span>
            </div>

            {/* WhatsApp, Call, Email icons */}
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/919019465897"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a 
                href="tel:9019465897"
                className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a 
                href="mailto:support@hsrpg.in"
                className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 border border-red-200 dark:bg-red-950 dark:border-red-800 dark:text-red-400 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Share App */}
          <Link href="#" className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Share App</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Terms of Service */}
          <Link href="#" className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Terms of Service</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

        </Card>

      </div>
    </div>
  )
}
