import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Home, Bookmark, MessageSquare, Wrench, FileText, Settings } from "lucide-react"
import Link from "next/link"
import PageTransition from "@/components/PageTransition"

export const runtime = 'edge'

export default function TenantDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <div className="dark h-full">
          <Sidebar variant="inset" className="border-r border-white/10 backdrop-blur-xl bg-slate-950/95 text-slate-300">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xl font-extrabold text-white px-4 py-8 tracking-tight">
                  HSRPG <span className="text-indigo-400">Tenant</span>
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
      </div>
    </SidebarProvider>
  )
}
