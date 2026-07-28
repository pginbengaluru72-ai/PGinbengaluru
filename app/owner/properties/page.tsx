import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Building, Plus } from "lucide-react"

export default function PropertiesPage() {
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
        {/* Mock Property Card */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Sunrise Boys PG</CardTitle>
              <CardDescription>Sector 1, HSR Layout</CardDescription>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <Building className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">Boys Only</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Beds:</span>
              <span className="font-medium">30</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available:</span>
              <span className="font-medium text-green-600">8</span>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">Manage Property</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
