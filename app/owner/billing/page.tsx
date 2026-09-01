"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, ArrowDown, ArrowUp, TrendingUp, Clock, Plus, X, ChevronDown, CheckCircle2, Printer, MessageCircle, FileText } from "lucide-react"
import { ownerApi } from "@/lib/apiClient"

export default function BillingPage() {
  const [bills, setBills] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [selectedBill, setSelectedBill] = useState<any>(null)

  const [newBill, setNewBill] = useState({
    propertyId: "",
    tenantId: "",
    amount: "",
    description: "",
    dueDate: ""
  })

  const syncState = async () => {
    try {
      setLoading(true)
      const [billsRes, propsRes, tenantsRes] = await Promise.all([
        ownerApi.getBills().catch(() => null),
        ownerApi.getProperties().catch(() => null),
        ownerApi.getTenants().catch(() => null)
      ])
      
      if (billsRes?.bills) setBills(billsRes.bills)
      if (propsRes?.properties) setProperties(propsRes.properties)
      if (tenantsRes?.tenants) setTenants(tenantsRes.tenants)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    syncState()
  }, [])

  const totalCollected = bills.filter(b => b.status === "PAID").reduce((sum, b) => sum + b.amount, 0)
  const totalPending = bills.filter(b => b.status === "PENDING").reduce((sum, b) => sum + b.amount, 0)

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await ownerApi.createBill(newBill)
      setIsCreateModalOpen(false)
      setNewBill({ propertyId: "", tenantId: "", amount: "", description: "", dueDate: "" })
      syncState()
    } catch (err: any) {
      alert(err.message || "Failed to create bill")
    }
  }

  const markAsPaid = async (publicId: string) => {
    if (!confirm("Confirm marking this bill as PAID?")) return
    try {
      await ownerApi.markBillPaid(publicId)
      syncState()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleWhatsApp = (bill: any) => {
    const text = `Hello ${bill.tenantName},\n\nYour StaySure invoice for ₹${bill.amount} is due.\nDescription: ${bill.description}\n\nPlease check your tenant dashboard to view the full bill. Thanks!`
    const url = `https://wa.me/${bill.tenantPhone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const openPrint = (bill: any) => {
    setSelectedBill(bill)
    setIsPrintModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-28">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-5 space-y-4 print:hidden">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Billing & Invoices</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Generate and manage tenant bills on StaySure</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg">
            <Plus className="mr-1.5 h-4 w-4" /> Create Bill
          </Button>
        </div>

        {/* METRIC TILES */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-4 bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900 rounded-3xl space-y-2 shadow-sm">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Total Collected</p>
            <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">₹{totalCollected.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 bg-amber-100/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900 rounded-3xl space-y-2 shadow-sm">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Total Pending</p>
            <p className="text-2xl font-black text-amber-900 dark:text-amber-100">₹{totalPending.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* BILLS LIST */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5 print:hidden">
        <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="p-8 text-center text-slate-500 font-bold">Loading bills...</div>
          ) : bills.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium">No bills generated yet.</div>
          ) : (
            bills.map(bill => (
              <div key={bill.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${bill.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {bill.tenantName} 
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${bill.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {bill.status}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{bill.description}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">{bill.propertyName} • ID: {bill.publicId}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto w-full border-t sm:border-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <p className="text-lg font-black text-slate-900 dark:text-white sm:mr-4">
                    ₹{bill.amount.toLocaleString('en-IN')}
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => handleWhatsApp(bill)} size="icon" variant="outline" className="rounded-xl border-slate-200 hover:bg-green-50 hover:text-green-600 text-slate-500">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => openPrint(bill)} size="icon" variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-500">
                      <Printer className="w-4 h-4" />
                    </Button>
                    {bill.status === 'PENDING' && (
                      <Button onClick={() => markAsPaid(bill.publicId)} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow">
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>

      {/* Create Bill Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm print:hidden">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Create New Bill</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateBill} className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Property</Label>
                <select 
                  required
                  value={newBill.propertyId}
                  onChange={e => setNewBill({...newBill, propertyId: e.target.value})}
                  className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-sm font-medium"
                >
                  <option value="">Select Property</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Tenant</Label>
                <select 
                  required
                  value={newBill.tenantId}
                  onChange={e => setNewBill({...newBill, tenantId: e.target.value})}
                  className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-sm font-medium"
                >
                  <option value="">Select Tenant</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Amount (₹)</Label>
                <Input 
                  type="number"
                  required
                  value={newBill.amount}
                  onChange={e => setNewBill({...newBill, amount: e.target.value})}
                  placeholder="e.g. 15000" 
                  className="h-11 rounded-2xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Description</Label>
                <Input 
                  required
                  value={newBill.description}
                  onChange={e => setNewBill({...newBill, description: e.target.value})}
                  placeholder="e.g. September Rent & Maintenance" 
                  className="h-11 rounded-2xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Due Date (Optional)</Label>
                <Input 
                  type="date"
                  value={newBill.dueDate}
                  onChange={e => setNewBill({...newBill, dueDate: e.target.value})}
                  className="h-11 rounded-2xl text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-2xl h-11 font-bold">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 font-bold shadow-md">Generate Bill</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL (Full Screen Invoice) */}
      {isPrintModalOpen && selectedBill && (
        <div className="fixed inset-0 z-[100] bg-slate-100 dark:bg-slate-900 overflow-y-auto">
          {/* Print Action Bar */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center print:hidden sticky top-0 z-10">
            <div className="font-bold">Invoice Preview</div>
            <div className="flex gap-3">
              <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 font-bold rounded-xl">
                <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
              </Button>
              <Button variant="outline" onClick={() => setIsPrintModalOpen(false)} className="text-slate-900 font-bold rounded-xl">
                Close
              </Button>
            </div>
          </div>

          {/* Actual Invoice Template */}
          <div className="max-w-3xl mx-auto my-10 bg-white p-12 shadow-2xl rounded-sm text-slate-900 print:shadow-none print:m-0 print:p-0">
            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
              <div>
                <h1 className="text-4xl font-black text-indigo-600 tracking-tighter">StaySure</h1>
                <p className="text-slate-500 font-medium mt-1">Professional PG Management</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-widest">Invoice</h2>
                <p className="font-bold text-slate-800 mt-2">{selectedBill.publicId}</p>
                <p className="text-sm text-slate-500">Date: {new Date(selectedBill.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-between mb-12">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
                <p className="font-bold text-lg">{selectedBill.tenantName}</p>
                <p className="text-slate-600">{selectedBill.tenantPhone || 'No phone provided'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Property</p>
                <p className="font-bold text-lg">{selectedBill.propertyName}</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-12">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-3 font-bold uppercase tracking-wider text-sm text-slate-500">Description</th>
                  <th className="py-3 font-bold uppercase tracking-wider text-sm text-slate-500 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-5 font-medium">{selectedBill.description}</td>
                  <td className="py-5 font-bold text-right text-lg">₹{selectedBill.amount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end mb-12">
              <div className="w-64">
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="font-bold text-slate-500">Subtotal</span>
                  <span className="font-bold">₹{selectedBill.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-4 text-xl">
                  <span className="font-black text-slate-900">Total</span>
                  <span className="font-black text-indigo-600">₹{selectedBill.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-slate-200 pt-8 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Status</p>
                <p className={`text-xl font-black ${selectedBill.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {selectedBill.status}
                </p>
              </div>
              <p className="text-sm font-medium text-slate-500 italic">
                Thank you for using StaySure.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
