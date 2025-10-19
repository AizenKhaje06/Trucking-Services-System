import { type NextRequest, NextResponse } from "next/server"
import { appendSheetData } from "@/lib/google-sheets"
import { generateExpId, validateExpense, formatExpenseForSheet } from "@/lib/expenses"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, truckId, description, amount, category } = await request.json()

    if (!spreadsheetId) {
      return NextResponse.json({ message: "Missing spreadsheetId" }, { status: 400 })
    }

    const validation = validateExpense({ truckId, description, amount, category })
    if (!validation.valid) {
      return NextResponse.json({ message: "Validation failed", errors: validation.errors }, { status: 400 })
    }

    const expId = generateExpId()
    const expenseData = {
      expId,
      truckId,
      description,
      amount: Number(amount),
      category,
    }

    const row = formatExpenseForSheet(expenseData)
    await appendSheetData(spreadsheetId, "Expenses!A:F", [row])

    return NextResponse.json({ success: true, expense: expenseData }, { status: 201 })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ message: "Failed to create expense" }, { status: 500 })
  }
}
