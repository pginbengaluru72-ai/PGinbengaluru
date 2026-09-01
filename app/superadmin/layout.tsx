"use client"

import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Home, ShieldCheck, CreditCard, AlertTriangle, Activity, Settings, MapPin } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/apiClient"
import PageTransition from "@/components/PageTransition"

export default function SuperAdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [authState, setAuthState] = useState<"loading" | "authorized" | "rejected">("loading")

  useEffect(() => {
    authApi.getMe()
      .then((res) => {
        // Backend stores role as SUPER_ADMIN
        if (res?.user && (res.user.role === 'SUPER_ADMIN' || res.user.role === 'SUPERADMIN')) {
          setAuthState("authorized")
        } else {
          window.location.replace('/auth')
        }
      })
      .catch(() => {
        window.location.replace('/auth')
      })
  }, [])

  if (authState !== "authorized") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-slate-500 text-sm">Verifying admin session...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <div className="dark h-full">
          <Sidebar variant="inset" className="border-r border-white/10 backdrop-blur-xl bg-slate-950/95 text-slate-300">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xl font-extrabold text-white px-4 py-8 tracking-tight">
                  StaySure <span className="text-indigo-400">Command</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-2 px-2">
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/superadmin" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Home className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Platform Overview</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/superadmin/verifications" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <ShieldCheck className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">KYC & Approvals</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/superadmin/subscriptions" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <CreditCard className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">SaaS Revenue</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/superadmin/reports" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <AlertTriangle className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Reports & Bans</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/superadmin/localities" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <MapPin className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Manage Localities</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/superadmin/broadcast" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Activity className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Global Broadcast</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/superadmin/settings" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Settings className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">System Settings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>
        <main className="flex-1 overflow-auto bg-transparent">
          <header className="flex h-16 items-center gap-4 border-b border-slate-200/50 bg-white/30 backdrop-blur-2xl dark:border-slate-800/50 dark:bg-slate-950/30 px-8 sticky top-0 z-10">
            <SidebarTrigger className="hover:bg-slate-200/50 rounded-xl" />
            <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Super Admin Portal</h1>
          </header>
          <div className="p-8">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>

        {/* FLOATING BOTTOM NAVIGATION PILL BAR */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md md:hidden">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-full shadow-2xl p-2 flex items-center justify-around relative">
            
            <Link 
              href="/superadmin" 
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                pathname === '/superadmin' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </Link>

            <Link 
              href="/superadmin/localities" 
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                pathname === '/superadmin/localities' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px]">Regions</span>
            </Link>

            <Link 
              href="/superadmin/settings" 
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                pathname === '/superadmin/settings' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[10px]">Config</span>
            </Link>
          </div>
        </div>

      </div>
    </SidebarProvider>
  )
}
