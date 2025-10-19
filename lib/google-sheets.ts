import { google } from "googleapis"

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GOOGLE_CERT_URL,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({ version: "v4", auth })

export interface SheetData {
  [key: string]: string | number | boolean | null
}

export async function readSheetData(spreadsheetId: string, range: string): Promise<SheetData[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })

    const rows = response.data.values || []
    if (rows.length === 0) return []

    const headers = rows[0]
    const data: SheetData[] = rows.slice(1).map((row) => {
      const obj: SheetData = {}
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || null
      })
      return obj
    })

    return data
  } catch (error) {
    console.error("Error reading sheet data:", error)
    throw error
  }
}

export async function writeSheetData(
  spreadsheetId: string,
  range: string,
  values: (string | number | boolean | null)[][],
): Promise<void> {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    })
  } catch (error) {
    console.error("Error writing sheet data:", error)
    throw error
  }
}

export async function appendSheetData(
  spreadsheetId: string,
  range: string,
  values: (string | number | boolean | null)[][],
): Promise<void> {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    })
  } catch (error) {
    console.error("Error appending sheet data:", error)
    throw error
  }
}

export async function clearSheetData(spreadsheetId: string, range: string): Promise<void> {
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    })
  } catch (error) {
    console.error("Error clearing sheet data:", error)
    throw error
  }
}
