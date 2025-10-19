import { cookies } from "next/server"

export interface Session {
  userId: string
  name: string
  role: "Owner" | "Employee"
  email: string
  loginTime: string
  lastActivityTime: string
}

const SESSION_COOKIE_NAME = "truckflow_session"
const SESSION_EXPIRY_HOURS = 24
const IDLE_TIMEOUT_MINUTES = 30

export async function createSession(sessionData: Omit<Session, "lastActivityTime">): Promise<void> {
  const cookieStore = await cookies()
  const expiryDate = new Date()
  expiryDate.setHours(expiryDate.getHours() + SESSION_EXPIRY_HOURS)

  const sessionWithActivity: Session = {
    ...sessionData,
    lastActivityTime: new Date().toISOString(),
  }

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionWithActivity), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiryDate,
    path: "/",
  })
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value) as Session
  } catch {
    return null
  }
}

export async function updateSessionActivity(): Promise<void> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) {
    return
  }

  try {
    const session = JSON.parse(sessionCookie.value) as Session
    session.lastActivityTime = new Date().toISOString()

    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + SESSION_EXPIRY_HOURS)

    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiryDate,
      path: "/",
    })
  } catch {
    // Silently fail if session update fails
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export function validateSession(session: Session | null): boolean {
  if (!session) return false

  const loginTime = new Date(session.loginTime)
  const lastActivityTime = new Date(session.lastActivityTime)
  const now = new Date()

  // Check if session has expired (24 hours)
  const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)
  if (hoursDiff >= SESSION_EXPIRY_HOURS) {
    return false
  }

  // Check if user has been idle for too long (30 minutes)
  const minutesDiff = (now.getTime() - lastActivityTime.getTime()) / (1000 * 60)
  if (minutesDiff >= IDLE_TIMEOUT_MINUTES) {
    return false
  }

  return true
}

export function getIdleTimeRemaining(session: Session | null): number {
  if (!session) return 0

  const lastActivityTime = new Date(session.lastActivityTime)
  const now = new Date()
  const minutesDiff = (now.getTime() - lastActivityTime.getTime()) / (1000 * 60)
  const remainingMinutes = Math.max(0, IDLE_TIMEOUT_MINUTES - minutesDiff)

  return Math.ceil(remainingMinutes)
}

export function isOwner(session: Session | null): boolean {
  return session?.role === "Owner"
}

export function isEmployee(session: Session | null): boolean {
  return session?.role === "Employee"
}
