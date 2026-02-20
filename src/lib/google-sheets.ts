import { google } from "googleapis";

/**
 * Google Sheets sync for product catalog.
 *
 * Sheet: "Old Site Products"
 * Columns:
 *   A: Product Name
 *   B: Link         (product URL on live site)
 *   C: SKU
 *   D: Variations   (sizes, e.g. "XS, S, M, L")
 *   E: Colours
 *   F: Photos       (first image URL)
 *   G: Live         (Yes / empty)
 */

const SHEET_TAB = "Old Site Products";

// ─── Auth ───────────────────────────────────────────────────

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY env vars"
    );
  }

  return new google.auth.JWT({
    email,
    key: key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetId() {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("Missing GOOGLE_SHEET_ID env var");
  return id;
}

// ─── Types ──────────────────────────────────────────────────

export interface SheetProduct {
  name: string;
  link: string;         // product URL
  sku: string;
  variations: string;   // comma-separated sizes
  colours: string;      // comma-separated colours
  photos: string;       // first image URL
  live: boolean;
}

// ─── Append a product row ───────────────────────────────────

export async function appendProductToSheet(product: SheetProduct) {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = getSheetId();

    const row = [
      product.name,
      product.link,
      product.sku,
      product.variations,
      product.colours,
      product.photos,
      product.live ? "Yes" : "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${SHEET_TAB}'!A:G`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    console.log(`[Google Sheets] Product "${product.name}" added to sheet`);
  } catch (err) {
    // Don't let sheet sync failure block product creation
    console.error("[Google Sheets] Failed to append product:", err);
  }
}

// ─── Update a product row (find by Product Name in col A) ───

export async function updateProductInSheet(
  productName: string,
  updates: Partial<SheetProduct>
) {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = getSheetId();

    // Find the row by Product Name (column A)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${SHEET_TAB}'!A:A`,
    });

    const rows = res.data.values ?? [];
    const rowIndex = rows.findIndex((r) => r[0] === productName);

    if (rowIndex === -1) {
      console.warn(
        `[Google Sheets] "${productName}" not found in sheet, skipping update`
      );
      return;
    }

    // Fetch current row to merge
    const currentRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${SHEET_TAB}'!A${rowIndex + 1}:G${rowIndex + 1}`,
    });

    const current = currentRes.data.values?.[0] ?? [];

    const updatedRow = [
      updates.name ?? current[0] ?? "",
      updates.link ?? current[1] ?? "",
      updates.sku ?? current[2] ?? "",
      updates.variations ?? current[3] ?? "",
      updates.colours ?? current[4] ?? "",
      updates.photos ?? current[5] ?? "",
      updates.live !== undefined ? (updates.live ? "Yes" : "") : current[6] ?? "",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${SHEET_TAB}'!A${rowIndex + 1}:G${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [updatedRow] },
    });

    console.log(`[Google Sheets] "${productName}" updated in sheet`);
  } catch (err) {
    console.error("[Google Sheets] Failed to update product:", err);
  }
}

// ─── Delete a product row ───────────────────────────────────

export async function deleteProductFromSheet(productName: string) {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = getSheetId();

    // Find the row by Product Name (column A)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${SHEET_TAB}'!A:A`,
    });

    const rows = res.data.values ?? [];
    const rowIndex = rows.findIndex((r) => r[0] === productName);

    if (rowIndex === -1) return;

    // Get the numeric sheet ID for this tab
    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
    const tab = sheetMeta.data.sheets?.find(
      (s) => s.properties?.title === SHEET_TAB
    );
    const sheetGid = tab?.properties?.sheetId ?? 0;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetGid,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    console.log(`[Google Sheets] "${productName}" deleted from sheet`);
  } catch (err) {
    console.error("[Google Sheets] Failed to delete product:", err);
  }
}
