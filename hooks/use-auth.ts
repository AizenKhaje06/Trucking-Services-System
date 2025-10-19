"use client"

import { useEffect, useState, useCallback, useRef } from "react"

interface Session {
  userId: string
  name: string
  role: "Owner" | "Employee"
  email: string
  loginTime: string
  lastActivityTime: string
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [idleWarning, setIdleWarning] = useState(false)
  const [idleTimeRemaining, setIdleTimeRemaining] = useState(0)
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const idleCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const IDLE_TIMEOUT_MINUTES = 30
  const WARNING_BEFORE_LOGOUT_MINUTES = 5

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()
      setSession(data.session)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch session")
      setSession(null)
    }
  }, [])

  const updateActivity = useCallback(async () => {
    try {
      await fetch("/api/auth/activity", { method: "POST" })
      setIdleWarning(false)
      setIdleTimeRemaining(0)
    } catch (err) {
      console.error("Failed to update activity:", err)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Clear all timers
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current)
      if (idleCheckIntervalRef.current) clearInterval(idleCheckIntervalRef.current)

      // Call logout API
      await fetch("/api/auth/logout", { method: "POST" })

      // Clear session state
      setSession(null)
      setIdleWarning(false)
      setIdleTimeRemaining(0)

      // Redirect to login
      window.location.href = "/"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout")
    }
  }, [])

  const extendSession = useCallback(async () => {
    await updateActivity()
    await fetchSession()
  }, [updateActivity, fetchSession])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  useEffect(() => {
    if (!session) return

    // Set up activity tracking
    const handleActivity = () => {
      updateActivity()
    }

    // Listen for user activity
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"]
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    // Check idle status every minute
    idleCheckIntervalRef.current = setInterval(() => {
      fetchSession()
    }, 60000)

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
      if (idleCheckIntervalRef.current) clearInterval(idleCheckIntervalRef.current)
    }
  }, [session, updateActivity, fetchSession])

  useEffect(() => {
    if (!session) return

    const lastActivityTime = new Date(session.lastActivityTime)
    const now = new Date()
    const minutesDiff = (now.getTime() - lastActivityTime.getTime()) / (1000 * 60)
    const warningThreshold = IDLE_TIMEOUT_MINUTES - WARNING_BEFORE_LOGOUT_MINUTES

    if (minutesDiff >= warningThreshold && minutesDiff < IDLE_TIMEOUT_MINUTES) {
      setIdleWarning(true)
      setIdleTimeRemaining(Math.ceil(IDLE_TIMEOUT_MINUTES - minutesDiff))
    } else if (minutesDiff >= IDLE_TIMEOUT_MINUTES) {
      logout()
    } else {
      setIdleWarning(false)
    }
  }, [session, logout])

  return {
    session,
    loading,
    error,
    logout,
    extendSession,
    idleWarning,
    idleTimeRemaining,
  }
}
