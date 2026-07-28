import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Home, ShieldCheck, CreditCard, AlertTriangle, Activity, Settings, MapPin } from "lucide-react"
import Link from "next/link"
import PageTransition from "@/components/PageTransition"

export const runtime = 'edge'

export default function SuperAdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <div className="dark h-full">
          <Sidebar variant="inset" className="border-r border-white/10 backdrop-blur-xl bg-slate-950/95 text-slate-300">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xl font-extrabold text-white px-4 py-8 tracking-tight">
                  HSRPG <span className="text-indigo-400">Command</span>
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
      </div>
    </SidebarProvider>
  )
}
