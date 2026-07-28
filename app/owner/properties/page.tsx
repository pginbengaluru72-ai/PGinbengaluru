import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Building, Plus, MapPin } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getProperties() {
  try {
    const res = await fetch('https://hsrpg-api.pginbengaluru72.workers.dev/api/owner/properties', { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function PropertiesPage() {
  const properties = await getProperties()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Properties</h2>
          <p className="text-muted-foreground">Manage your PG properties and listings.</p>
        </div>
        <Link href="/owner/properties/new" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property: any) => (
          <Card key={property.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{property.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {property.locality}, {property.city}
                </CardDescription>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                <Building className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {property.media && property.media.length > 0 && (
                <div className="mb-4 w-full h-32 rounded-md overflow-hidden bg-slate-100">
                  <img src={property.media[0].url} alt={property.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium capitalize">{property.type}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-medium ${property.isVerified ? 'text-green-600' : 'text-orange-500'}`}>
                  {property.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full">Manage Property</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {properties.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-slate-50/50 border-dashed">
            <Building className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No properties found</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">You haven't listed any properties yet. Click the button above to add your first PG.</p>
          </div>
        )}
      </div>
    </div>
  )
}
