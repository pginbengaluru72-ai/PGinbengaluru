"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Building, Plus, MapPin, X, CheckCircle2, Phone, Bed, Trash2, ExternalLink } from "lucide-react"

const DEFAULT_PROPERTIES = [
  {
    id: "prop-1",
    name: "Sunrise Luxury PG for Men",
    type: "boys",
    locality: "Sector 2",
    city: "HSR Layout, Bengaluru",
    isVerified: true,
    whatsappNumber: "+91 98765 43210",
    totalRooms: 12,
    availableBeds: 5,
    media: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" }]
  },
  {
    id: "prop-2",
    name: "Emerald Stay PG for Women",
    type: "girls",
    locality: "Sector 7",
    city: "HSR Layout, Bengaluru",
    isVerified: true,
    whatsappNumber: "+91 99887 76655",
    totalRooms: 8,
    availableBeds: 2,
    media: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop" }]
  }
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>(DEFAULT_PROPERTIES)
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)

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
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Properties</h2>
          <p className="text-muted-foreground text-sm">Manage your PG properties and listings.</p>
        </div>
        <Link href="/owner/properties/new" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-5 shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property: any) => (
          <Card key={property.id} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">{property.name}</CardTitle>
                <CardDescription className="flex items-center mt-1 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-500 shrink-0" />
                  {property.locality}, {property.city}
                </CardDescription>
              </div>
              <div className="p-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 rounded-xl shrink-0">
                <Building className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              {property.media && property.media.length > 0 && (
                <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
                  <img src={property.media[0].url} alt={property.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <span className="text-slate-500">Category:</span>
                <span className="capitalize px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">{property.type}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Verification Status:</span>
                <span className={`px-2.5 py-0.5 rounded-md ${property.isVerified ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold' : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold'}`}>
                  {property.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              <div className="pt-3">
                <Button 
                  onClick={() => setSelectedProperty(property)}
                  variant="outline" 
                  className="w-full rounded-xl border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 font-bold text-slate-700 dark:text-slate-300"
                >
                  Manage Property
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Details & Manage Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{selectedProperty.name}</h3>
                <p className="text-xs text-slate-500">{selectedProperty.locality}, {selectedProperty.city}</p>
              </div>
              <button onClick={() => setSelectedProperty(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 block">Category</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 capitalize">{selectedProperty.type} PG</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 block">WhatsApp Line</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedProperty.whatsappNumber || "+91 98765 43210"}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 block">Total Rooms</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedProperty.totalRooms || 12} Rooms</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 block">Available Beds</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedProperty.availableBeds || 5} Beds</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link href={`/pg/1`} className="w-full">
                  <Button variant="outline" className="w-full rounded-xl h-11 font-bold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800">
                    <ExternalLink className="w-4 h-4 mr-2 text-indigo-500" /> View Public Tenant Listing Page
                  </Button>
                </Link>
                <Link href="/owner/rooms" className="w-full">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-bold shadow-md">
                    <Bed className="w-4 h-4 mr-2" /> Manage Rooms & Bed Inventory
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
