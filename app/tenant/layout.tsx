"use client"

import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Home, Bookmark, MessageSquare, Wrench, FileText, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/apiClient"
import PageTransition from "@/components/PageTransition"

export default function TenantDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [authState, setAuthState] = useState<"loading" | "authorized" | "rejected">("loading")

  useEffect(() => {
    authApi.getMe()
      .then((res) => {
        if (res?.user && res.user.role === 'CUSTOMER') {
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
          <p className="font-bold text-slate-500 text-sm">Verifying session...</p>
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
                  StaySure <span className="text-indigo-400">Tenant</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-2 px-2">
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/tenant" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Home className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">My Space</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/tenant/saved" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Bookmark className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Saved PGs</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/tenant/inquiries" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <MessageSquare className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Inquiries & Leads</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/tenant/tickets" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Wrench className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Maintenance</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/tenant/receipts" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <FileText className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Rent Receipts</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/tenant/settings" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Settings className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Profile & KYC</span>
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
            <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Tenant Portal</h1>
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
              href="/tenant" 
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                pathname === '/tenant' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </Link>

            <Link 
              href="/search" 
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                pathname.includes('/search') ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building className="w-5 h-5" />
              <span className="text-[10px]">Find PG</span>
            </Link>

            <Link 
              href="/tenant/tickets" 
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                pathname === '/tenant/tickets' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span className="text-[10px]">Support</span>
            </Link>

            <Link 
              href="/tenant/settings" 
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                pathname === '/tenant/settings' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
            </Link>

          </div>
        </div>

      </div>
    </SidebarProvider>
  )
}
