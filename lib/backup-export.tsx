import { readSheetData } from "@/lib/google-sheets"

export interface BackupData {
  timestamp: string
  sheets: {
    [key: string]: Array<Record<string, string>>
  }
}

const SHEETS_TO_BACKUP = ["Transactions", "Expenses", "Trucks", "Materials", "Owners", "Employees"]

export async function generateBackup(spreadsheetId: string): Promise<BackupData> {
  const backup: BackupData = {
    timestamp: new Date().toISOString(),
    sheets: {},
  }

  for (const sheetName of SHEETS_TO_BACKUP) {
    try {
      const data = await readSheetData(spreadsheetId, `${sheetName}!A:Z`)
      backup.sheets[sheetName] = data
    } catch (error) {
      console.error(`Failed to backup sheet ${sheetName}:`, error)
      backup.sheets[sheetName] = []
    }
  }

  return backup
}

export function convertToCSV(data: Array<Record<string, string>>): string {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0])
  const csvHeaders = headers.map((h) => `"${h}"`).join(",")

  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header] || ""
        return `"${value.toString().replace(/"/g, '""')}"`
      })
      .join(",")
  })

  return [csvHeaders, ...csvRows].join("\n")
}

export function downloadFile(content: string, filename: string, mimeType = "text/plain"): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateExcelContent(backup: BackupData): string {
  // Generate HTML table format that Excel can read
  let html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #4338ca; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>TruckFlow Backup - ${new Date(backup.timestamp).toLocaleString()}</h2>
  `

  for (const [sheetName, data] of Object.entries(backup.sheets)) {
    if (data.length === 0) continue

    html += `<h3>${sheetName}</h3><table>`
    const headers = Object.keys(data[0])
    html += `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`

    for (const row of data) {
      html += `<tr>${headers.map((h) => `<td>${row[h] || ""}</td>`).join("")}</tr>`
    }

    html += `</table><br>`
  }

  html += `
      </body>
    </html>
  `

  return html
}
