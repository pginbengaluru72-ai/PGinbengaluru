"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, DollarSign, ArrowUpRight, Plus, Download, CheckCircle2, Clock, X } from "lucide-react"

type Transaction = {
  id: string
  tenantName: string
  room: string
  amount: number
  date: string
  method: "UPI" | "Cash" | "Bank Transfer"
  status: "Completed" | "Pending"
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-101",
    tenantName: "Rahul Sharma",
    room: "Room 101",
    amount: 10500,
    date: "28 Jul 2026",
    method: "UPI",
    status: "Completed"
  },
  {
    id: "tx-102",
    tenantName: "Anjali Sharma",
    room: "Room 201",
    amount: 14000,
    date: "25 Jul 2026",
    method: "UPI",
    status: "Completed"
  },
  {
    id: "tx-103",
    tenantName: "Amit Kumar",
    room: "Room 102",
    amount: 8500,
    date: "01 Jul 2026",
    method: "Cash",
    status: "Pending"
  }
]

export default function BillingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTx, setNewTx] = useState({
    tenantName: "",
    room: "",
    amount: "",
    method: "UPI" as "UPI" | "Cash" | "Bank Transfer"
  })

  const totalCollected = transactions
    .filter(t => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalPending = transactions
    .filter(t => t.status === "Pending")
    .reduce((sum, t) => sum + t.amount, 0)

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTx.tenantName || !newTx.amount) return

    const created: Transaction = {
      id: `tx-${Date.now()}`,
      tenantName: newTx.tenantName,
      room: newTx.room || "Room 101",
      amount: parseInt(newTx.amount) || 0,
      date: "Today",
      method: newTx.method,
      status: "Completed"
    }

    setTransactions([created, ...transactions])
    setIsModalOpen(false)
    setNewTx({ tenantName: "", room: "", amount: "", method: "UPI" })
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Billing & Collections</h2>
          <p className="text-muted-foreground text-sm">Monitor monthly rent revenue, collect payments, and manage invoices.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Total Collected (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100">₹{totalCollected.toLocaleString('en-IN')}</div>
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% Direct Bank / UPI Collection
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-100 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Pending Dues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100">₹{totalPending.toLocaleString('en-IN')}</div>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-1">1 tenant pending payment</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">Security Deposits Held</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100">₹65,000</div>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1">Refundable upon tenant exit</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
          <CardDescription>All recorded rent receipts and offline transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">Tenant & Room</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-colors">
                    <td className="py-3.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{tx.tenantName}</p>
                      <p className="text-xs text-slate-500">{tx.room}</p>
                    </td>
                    <td className="py-3.5 font-extrabold text-slate-900 dark:text-slate-100">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 text-xs text-slate-600 dark:text-slate-400">{tx.date}</td>
                    <td className="py-3.5">
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
                        {tx.method}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        tx.status === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {tx.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Record Rent Payment</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleRecordPayment} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="tName" className="text-xs font-bold">Tenant Name</Label>
                <Input 
                  id="tName" 
                  required
                  value={newTx.tenantName}
                  onChange={e => setNewTx({...newTx, tenantName: e.target.value})}
                  placeholder="e.g. Rahul Sharma" 
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tRoom" className="text-xs font-bold">Room Number</Label>
                  <Input 
                    id="tRoom"
                    value={newTx.room}
                    onChange={e => setNewTx({...newTx, room: e.target.value})}
                    placeholder="Room 101" 
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tAmount" className="text-xs font-bold">Amount Paid (₹)</Label>
                  <Input 
                    id="tAmount"
                    type="number"
                    required
                    value={newTx.amount}
                    onChange={e => setNewTx({...newTx, amount: e.target.value})}
                    placeholder="10500" 
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tMethod" className="text-xs font-bold">Payment Mode</Label>
                <select 
                  id="tMethod"
                  value={newTx.method}
                  onChange={e => setNewTx({...newTx, method: e.target.value as any})}
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="UPI">Google Pay / PhonePe / UPI</option>
                  <option value="Cash">Cash Handover</option>
                  <option value="Bank Transfer">Bank NEFT / IMPS</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl h-10 font-bold text-xs">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 font-bold text-xs shadow-md">Record Transaction</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
