"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Building, Plus, MapPin } from "lucide-react"

const DEFAULT_PROPERTIES = [
  {
    id: "prop-1",
    name: "Sunrise Luxury PG for Men",
    type: "boys",
    locality: "Sector 2",
    city: "HSR Layout, Bengaluru",
    isVerified: true,
    media: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" }]
  },
  {
    id: "prop-2",
    name: "Emerald Stay PG for Women",
    type: "girls",
    locality: "Sector 7",
    city: "HSR Layout, Bengaluru",
    isVerified: true,
    media: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop" }]
  }
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>(DEFAULT_PROPERTIES)

  useEffect(() => {
    fetch('https://hsrpg-api.pginbengaluru72.workers.dev/api/owner/properties')
      .then(res => res.ok ? res.json() : null)
      .then(d => {
        if (d && Array.isArray(d) && d.length > 0) {
          setProperties(d)
        }
      })
      .catch(() => {})
  }, [])

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
          <Card key={property.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-bold">{property.name}</CardTitle>
                <CardDescription className="flex items-center mt-1 text-xs">
                  <MapPin className="w-3 h-3 mr-1 text-indigo-500" />
                  {property.locality}, {property.city}
                </CardDescription>
              </div>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <Building className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {property.media && property.media.length > 0 && (
                <div className="my-3 w-full h-36 rounded-xl overflow-hidden bg-slate-100 relative">
                  <img src={property.media[0].url} alt={property.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Category:</span>
                <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-700">{property.type}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Status:</span>
                <span className={`px-2 py-0.5 rounded ${property.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {property.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              <div className="mt-5">
                <Button variant="outline" className="w-full rounded-xl border-slate-200 hover:bg-slate-50 font-semibold text-slate-700">Manage Property</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
