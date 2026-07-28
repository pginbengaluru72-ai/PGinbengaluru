import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Bed, Users } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  try {
    const res = await fetch('https://hsrpg-api.pginbengaluru72.workers.dev/api/owner/dashboard', { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function DashboardOverview() {
  const data = await getDashboardData()

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Building className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium">Loading Dashboard...</h3>
        <p className="text-sm text-muted-foreground mt-1">Unable to connect to the API. Please refresh the page.</p>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Here is what's happening with your properties today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProperties}</div>
            <p className="text-xs text-muted-foreground">Active in your account</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.availableBeds}</div>
            <p className="text-xs text-muted-foreground">Out of {data.totalBeds} total beds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTenants}</div>
            <p className="text-xs text-muted-foreground">Current active tenants</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>You have {data.recentActivity.length} new activities today.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {data.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="ml-auto font-medium">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
