import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bed, Plus } from "lucide-react"

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rooms & Beds</h2>
          <p className="text-muted-foreground">Manage your room inventory and live bed availability.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Mock Room Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Room 101</CardTitle>
            <CardDescription>Sunrise Boys PG - 2 Sharing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Price per bed:</span>
              <span className="font-semibold text-lg">₹8,500</span>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Beds</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <Bed className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Bed 1</p>
                      <p className="text-xs text-green-600">Available</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Mark Occupied</Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Bed className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium">Bed 2</p>
                      <p className="text-xs text-slate-500">Occupied</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Mark Available</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
