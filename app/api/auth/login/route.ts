import { type NextRequest, NextResponse } from "next/server"
import { readSheetData } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    const { role, accountNo, password } = await request.json()

    if (!role || !accountNo || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID
    if (!spreadsheetId) {
      return NextResponse.json({ message: "Google Sheets configuration missing" }, { status: 500 })
    }

    const sheetName = role === "Owner" ? "Owners" : "Employees"
    const users = await readSheetData(spreadsheetId, `${sheetName}!A:D`)

    const user = users.find((u) => u["Account Number"] === accountNo && u["Password"] === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid account number or password" }, { status: 401 })
    }

    const session = {
      userId: user["Account Number"],
      name: user["Name"],
      role,
      email: user["Email"],
      loginTime: new Date().toISOString(),
    }

    // Set session cookie
    const response = NextResponse.json({ session }, { status: 200 })
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 24)

    response.cookies.set("truckflow_session", JSON.stringify({
      ...session,
      lastActivityTime: new Date().toISOString(),
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiryDate,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}
