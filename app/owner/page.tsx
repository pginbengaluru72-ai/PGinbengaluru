import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Bed, Users } from "lucide-react"

async function getDashboardData() {
  const res = await fetch('https://hsrpg-api.pginbengaluru72.workers.dev/owner/dashboard', { next: { revalidate: 60 } })
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard data')
  }
  return res.json()
}

export default async function DashboardOverview() {
  const data = await getDashboardData()

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
