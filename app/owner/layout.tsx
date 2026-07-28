"use client"

import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Home, Building, Users, Bed, CreditCard, Settings, BarChart3, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import PageTransition from "@/components/PageTransition"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full relative overflow-hidden bg-slate-50/50 dark:bg-slate-950">
        
        {/* Desktop Sidebar */}
        <div className="dark h-full hidden md:block">
          <Sidebar variant="inset" className="border-r border-white/10 backdrop-blur-xl bg-slate-950/95 text-slate-300">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xl font-extrabold text-white px-4 py-8 tracking-tight">
                  HSRPG <span className="text-blue-400">Owner</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-2 px-2">
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner" />} className="hover:bg-blue-600/20 hover:text-blue-300 transition-colors rounded-xl h-11">
                        <Home className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Overview</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner/properties" />} className="hover:bg-blue-600/20 hover:text-blue-300 transition-colors rounded-xl h-11">
                        <Building className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Properties</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner/rooms" />} className="hover:bg-blue-600/20 hover:text-blue-300 transition-colors rounded-xl h-11">
                        <Bed className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Rooms & Beds</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner/tenants" />} className="hover:bg-blue-600/20 hover:text-blue-300 transition-colors rounded-xl h-11">
                        <Users className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Tenants</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner/billing" />} className="hover:bg-blue-600/20 hover:text-blue-300 transition-colors rounded-xl h-11">
                        <CreditCard className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Analytics & Billing</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner/settings" />} className="hover:bg-blue-600/20 hover:text-blue-300 transition-colors rounded-xl h-11">
                        <Settings className="mr-3 h-5 w-5" />
                        <span className="font-medium text-sm">Account & Settings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-transparent pb-24 md:pb-6">
          <header className="hidden md:flex h-16 items-center gap-4 border-b border-slate-200/50 bg-white/30 backdrop-blur-2xl dark:border-slate-800/50 dark:bg-slate-950/30 px-8 sticky top-0 z-10">
            <SidebarTrigger className="hover:bg-slate-200/50 rounded-xl" />
            <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Owner SaaS Portal</h1>
          </header>

          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {/* FLOATING BOTTOM NAVIGATION PILL BAR (FROM SCREENSHOTS) */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-full shadow-2xl p-2 flex items-center justify-around relative">
            
            {/* Home */}
            <Link 
              href="/owner" 
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                pathname === '/owner' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </Link>

            {/* Elevated Center Properties Floating Badge */}
            <Link 
              href="/owner/properties"
              className="relative -top-5 flex flex-col items-center group"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 border-4 border-slate-50 dark:border-slate-950 group-hover:scale-105 transition-transform">
                <Building className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 -mt-0.5">Properties</span>
            </Link>

            {/* Reports */}
            <Link 
              href="/owner/billing" 
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                pathname === '/owner/billing' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-[10px]">Reports</span>
            </Link>

            {/* Account */}
            <Link 
              href="/owner/settings" 
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
                pathname === '/owner/settings' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Account</span>
            </Link>

          </div>
        </div>

      </div>
    </SidebarProvider>
  )
}
