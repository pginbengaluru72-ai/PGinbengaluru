"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building, Lock, Mail, User, Phone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { authApi } from "@/lib/apiClient"
import Link from "next/link"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        const res = await authApi.login({ email: formData.email, password: formData.password })
        if (res.user.role === 'SUPER_ADMIN') {
          router.push('/admin')
        } else {
          router.push('/owner')
        }
      } else {
        await authApi.register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
        })
        router.push('/owner')
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
            <Building className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Stay<span className="text-indigo-600 dark:text-indigo-400">Sure</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isLogin ? 'Owner Login' : 'Create Owner Account'}
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          {isLogin ? 'Manage your properties and leads.' : 'List your PG and get direct leads for free.'}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
          <CardContent className="px-8 py-10">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        type="tel"
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    type="password" 
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 rounded-xl text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 mt-4"
              >
                {loading ? 'Please wait...' : isLogin ? 'Login to Dashboard' : 'Create Account'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 font-medium">
                {isLogin ? "Don't have an owner account?" : "Already have an account?"}{' '}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {isLogin ? 'Register now' : 'Log in instead'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
