import { type NextRequest, NextResponse } from "next/server"
import { appendSheetData } from "@/lib/google-sheets"
import { validateTransaction, formatTransactionForSheet, generateTxnId } from "@/lib/transactions"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, transaction } = await request.json()

    if (!spreadsheetId || !transaction) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 })
    }

    const validation = validateTransaction(transaction)
    if (!validation.valid) {
      return NextResponse.json({ message: "Validation failed", errors: validation.errors }, { status: 400 })
    }

    const txnId = generateTxnId()
    const formattedTransaction = formatTransactionForSheet({ ...transaction, txnId })
    await appendSheetData(spreadsheetId, "Transactions!A:K", [formattedTransaction])

    return NextResponse.json({ message: "Transaction recorded successfully", txnId }, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ message: "Failed to record transaction" }, { status: 500 })
  }
}
