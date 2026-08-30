"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, User, Loader2, Home } from "lucide-react"
import { authApi } from "@/lib/apiClient"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup State
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupRole, setSignupRole] = useState<"tenant" | "owner">("tenant")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const data = await authApi.login({
        email: loginEmail,
        password: loginPassword,
      });
      
      // Successful login, redirect based on role
      const user = data?.user;
      if (user?.role === "OWNER") {
        router.push("/owner")
      } else if (user?.role === "SUPER_ADMIN") {
        router.push("/superadmin")
      } else {
        router.push("/tenant")
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authApi.register({
        email: signupEmail,
        password: signupPassword,
        name: signupName,
        role: signupRole === "owner" ? "OWNER" : "CUSTOMER",
      });

      alert("Account created successfully! You are now logged in.");
      if (signupRole === "owner") {
        router.push("/owner");
      } else {
        router.push("/tenant");
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl shadow-indigo-100 mb-4 transition-transform hover:scale-105">
            <Home className="w-8 h-8 text-indigo-600" />
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">HSRPG Platform</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your spaces</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border-white shadow-2xl shadow-indigo-100/50">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 p-1 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Register</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="login" className="mt-0 space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-white/50 border-slate-200 focus-visible:ring-indigo-500 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Link href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                    </div>
                    <Input 
                      id="login-password" 
                      type="password" 
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-white/50 border-slate-200 focus-visible:ring-indigo-500 h-11"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-0 space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name" 
                      placeholder="John Doe" 
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="bg-white/50 border-slate-200 focus-visible:ring-indigo-500 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="bg-white/50 border-slate-200 focus-visible:ring-indigo-500 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="bg-white/50 border-slate-200 focus-visible:ring-indigo-500 h-11"
                    />
                  </div>
                  <div className="space-y-3 pt-2">
                    <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">I am a...</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        onClick={() => setSignupRole("tenant")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${signupRole === 'tenant' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'}`}
                      >
                        <User className={`w-5 h-5 mb-1 ${signupRole === 'tenant' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-sm font-medium">Tenant</span>
                      </div>
                      <div 
                        onClick={() => setSignupRole("owner")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${signupRole === 'owner' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'}`}
                      >
                        <Building className={`w-5 h-5 mb-1 ${signupRole === 'owner' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-sm font-medium">PG Owner</span>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl mt-4">
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
