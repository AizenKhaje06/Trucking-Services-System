"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, AlertCircle, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [role, setRole] = useState<string>("")
  const [accountNo, setAccountNo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!role || !accountNo || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, accountNo, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Login failed")
        setLoading(false)
        return
      }

      setSuccess("Login successful! Redirecting...")
      localStorage.setItem("session", JSON.stringify(data.session))

      setTimeout(() => {
        window.location.href = role === "Owner" ? "/owner-dashboard" : "/employee-portal"
      }, 1000)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-background to-background flex items-center justify-center p-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-accent p-3 rounded-lg">
              <Truck className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">TruckFlow</h1>
          </div>
          <p className="text-muted-foreground">Professional Trucking Management System</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Access your trucking management portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground font-semibold">
                  User Role
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="bg-input border-border">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner">
                      <span className="flex items-center gap-2">Fleet Owner</span>
                    </SelectItem>
                    <SelectItem value="Employee">
                      <span className="flex items-center gap-2">Driver/Employee</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNo" className="text-foreground font-semibold">
                  Account Number
                </Label>
                <Input
                  id="accountNo"
                  type="text"
                  placeholder="Enter your account number"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="bg-input border-border"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border"
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 h-10"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center mb-3 font-semibold">Demo Credentials</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="bg-muted/50 p-2 rounded">
                  <p>
                    <span className="font-semibold text-foreground">Fleet Owner:</span>
                  </p>
                  <p>Account: OWN001</p>
                  <p>Password: owner123</p>
                </div>
                <div className="bg-muted/50 p-2 rounded">
                  <p>
                    <span className="font-semibold text-foreground">Driver/Employee:</span>
                  </p>
                  <p>Account: EMP001</p>
                  <p>Password: emp123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">© 2025 TruckFlow. All rights reserved.</p>
      </div>
    </div>
  )
}
