"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, ArrowDown, ArrowUp, TrendingUp, Clock, Calendar, Building, Plus, CheckCircle2, X, ChevronDown, FileSpreadsheet } from "lucide-react"

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<"Overview" | "Payments" | "Occupancy">("Overview")
  const [selectedProperty, setSelectedProperty] = useState("All Properties")
  const [selectedYear, setSelectedYear] = useState("2026")
  const [selectedMonth, setSelectedMonth] = useState("Jul")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [transactions, setTransactions] = useState([
    { id: "tx-1", tenantName: "Rahul Sharma", room: "Room 101", amount: 10500, date: "28 Jul 2026", type: "Income", status: "Completed" },
    { id: "tx-2", tenantName: "Electricity Bill", room: "PG Expense", amount: 4500, date: "26 Jul 2026", type: "Expense", status: "Completed" },
    { id: "tx-3", tenantName: "Amit Kumar", room: "Room 102", amount: 8500, date: "01 Jul 2026", type: "Income", status: "Pending" }
  ])

  const [newTx, setNewTx] = useState({
    tenantName: "",
    room: "",
    amount: "",
    type: "Income" as "Income" | "Expense"
  })

  const totalIncome = transactions.filter(t => t.type === "Income" && t.status === "Completed").reduce((sum, t) => sum + t.amount, 0) || 65000
  const totalExpenses = transactions.filter(t => t.type === "Expense" && t.status === "Completed").reduce((sum, t) => sum + t.amount, 0) || 22500
  const netProfit = totalIncome - totalExpenses
  const totalPending = transactions.filter(t => t.status === "Pending").reduce((sum, t) => sum + t.amount, 0) || 8500

  const handleRecordTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTx.tenantName || !newTx.amount) return

    setTransactions([
      {
        id: `tx-${Date.now()}`,
        tenantName: newTx.tenantName,
        room: newTx.room || "General",
        amount: parseInt(newTx.amount) || 0,
        date: "Today",
        type: newTx.type,
        status: "Completed"
      },
      ...transactions
    ])
    setIsModalOpen(false)
    setNewTx({ tenantName: "", room: "", amount: "", type: "Income" })
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-28">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-5 space-y-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Track your business performance</p>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="relative">
            <select 
              value={selectedProperty} 
              onChange={e => setSelectedProperty(e.target.value)}
              className="w-full h-11 bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 text-xs font-bold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 appearance-none pr-7 truncate"
            >
              <option>🏢 All Properties</option>
              <option>Sunrise Boys PG</option>
              <option>Emerald Girls PG</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={selectedYear} 
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full h-11 bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 text-xs font-bold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 appearance-none pr-7"
            >
              <option>📅 2026</option>
              <option>📅 2025</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full h-11 bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 text-xs font-bold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 appearance-none pr-7"
            >
              <option>📅 Jul</option>
              <option>📅 Jun</option>
              <option>📅 May</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Download Excel Report Primary Blue Button */}
        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25">
          <Download className="mr-2 h-4 w-4" /> Download Excel Report
        </Button>

        {/* Sub-Tabs Pills */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          {(["Overview", "Payments", "Occupancy"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {tab === 'Overview' && '🎛️ '}
              {tab === 'Payments' && '👛 '}
              {tab === 'Occupancy' && '🛏️ '}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
        
        {/* Month Header & Collected Pill */}
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            📅 {selectedMonth === 'Jul' ? 'July 2026' : 'June 2026'}
          </h2>
          <span className="text-xs font-extrabold px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
            85% collected
          </span>
        </div>

        {/* 4 COLOR-CODED METRIC TILES */}
        <div className="grid grid-cols-2 gap-3.5">
          
          {/* INCOME TILE */}
          <div className="p-4 bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900 rounded-3xl space-y-2 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
              <ArrowDown className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Income</p>
            <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">₹{totalIncome.toLocaleString('en-IN')}</p>
          </div>

          {/* EXPENSES TILE */}
          <div className="p-4 bg-red-100/70 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900 rounded-3xl space-y-2 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
              <ArrowUp className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-red-800 dark:text-red-300">Expenses</p>
            <p className="text-2xl font-black text-red-900 dark:text-red-100">₹{totalExpenses.toLocaleString('en-IN')}</p>
          </div>

          {/* PROFIT TILE */}
          <div className="p-4 bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900 rounded-3xl space-y-2 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Profit</p>
            <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">₹{netProfit.toLocaleString('en-IN')}</p>
          </div>

          {/* PENDING TILE */}
          <div className="p-4 bg-amber-100/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900 rounded-3xl space-y-2 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shadow">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Pending</p>
            <p className="text-2xl font-black text-amber-900 dark:text-amber-100">₹{totalPending.toLocaleString('en-IN')}</p>
          </div>

        </div>

        {/* YEAR-TO-DATE (2026) SUMMARY CARD */}
        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/60 rounded-3xl p-5 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
            📊 Year-to-Date (2026)
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-blue-100 dark:border-blue-900">
            <div>
              <span className="text-[10px] font-bold text-slate-500 block">Total Income</span>
              <span className="text-sm font-black text-emerald-600">₹{(totalIncome * 7).toLocaleString('en-IN')}</span>
            </div>
            <div className="border-l border-blue-100 dark:border-blue-900">
              <span className="text-[10px] font-bold text-slate-500 block">Total Expenses</span>
              <span className="text-sm font-black text-red-600">₹{(totalExpenses * 7).toLocaleString('en-IN')}</span>
            </div>
            <div className="border-l border-blue-100 dark:border-blue-900">
              <span className="text-[10px] font-bold text-slate-500 block">Net Profit</span>
              <span className="text-sm font-black text-emerald-600">₹{(netProfit * 7).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Card>

        {/* RECORD PAYMENT ACTION & TRANSACTIONS LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Recent Transactions</h3>
            <Button onClick={() => setIsModalOpen(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Record Entry
            </Button>
          </div>

          <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map(t => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${t.type === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {t.type === 'Income' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{t.tenantName}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{t.room} • {t.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${t.type === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === 'Income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </div>

      </div>

      {/* Record Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Record Income / Expense</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleRecordTransaction} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="tType" className="text-xs font-bold">Transaction Type</Label>
                <select 
                  id="tType"
                  value={newTx.type}
                  onChange={e => setNewTx({...newTx, type: e.target.value as any})}
                  className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-bold"
                >
                  <option value="Income">Income (Rent Collection)</option>
                  <option value="Expense">Expense (Bills / Repairs)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tName" className="text-xs font-bold">Party / Description</Label>
                <Input 
                  id="tName" 
                  required
                  value={newTx.tenantName}
                  onChange={e => setNewTx({...newTx, tenantName: e.target.value})}
                  placeholder="e.g. Rahul Sharma or Electricity Bill" 
                  className="h-11 rounded-2xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tRoom" className="text-xs font-bold">Room / Tag</Label>
                  <Input 
                    id="tRoom"
                    value={newTx.room}
                    onChange={e => setNewTx({...newTx, room: e.target.value})}
                    placeholder="Room 101" 
                    className="h-11 rounded-2xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tAmount" className="text-xs font-bold">Amount (₹)</Label>
                  <Input 
                    id="tAmount"
                    type="number"
                    required
                    value={newTx.amount}
                    onChange={e => setNewTx({...newTx, amount: e.target.value})}
                    placeholder="10500" 
                    className="h-11 rounded-2xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-2xl h-11 font-bold text-xs">Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-11 font-bold text-xs shadow-md">Record Entry</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
