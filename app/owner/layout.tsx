import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Home, Building, Users, Bed, CreditCard, Settings } from "lucide-react"
import Link from "next/link"
import PageTransition from "@/components/PageTransition"

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
                      <SidebarMenuButton asChild className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Link href="/owner">
                          <Home className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Overview</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Link href="/owner/properties">
                          <Building className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Properties</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Link href="/owner/rooms">
                          <Bed className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Rooms & Beds</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Link href="/owner/tenants">
                          <Users className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Tenants</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Link href="/owner/billing">
                          <CreditCard className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Billing</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors rounded-xl h-11">
                        <Link href="/owner/settings">
                          <Settings className="mr-3 h-5 w-5" />
                          <span className="font-medium text-sm">Settings</span>
                        </Link>
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
