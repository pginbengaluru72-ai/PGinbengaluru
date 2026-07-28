import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Home, Building, Users, Bed, CreditCard, Settings } from "lucide-react"
import Link from "next/link"
import PageTransition from "@/components/PageTransition"

export const runtime = 'edge'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <div className="dark h-full">
          <Sidebar variant="inset" className="border-r border-white/10 backdrop-blur-xl bg-slate-950/95 text-slate-300">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xl font-extrabold text-white px-4 py-8 tracking-tight">
                  HSRPG <span className="text-indigo-400">Owner</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-2 px-2">
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
<Home className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Overview</span>
</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner/properties" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
<Building className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Properties</span>
</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner/rooms" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
<Bed className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Rooms & Beds</span>
</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner/tenants" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
<Users className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Tenants</span>
</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner/billing" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
<CreditCard className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Billing</span>
</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<Link href="/owner/settings" />} className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
<Settings className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Settings</span>
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
            <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Owner Portal</h1>
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
