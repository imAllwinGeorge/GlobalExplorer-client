import ExcelJS from "exceljs"

export interface ColumnConfig<T> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
}

export interface ExcelExportOptions {
  filename?: string
  sheetName?: string
}

export async function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: ColumnConfig<T>[],
  options: ExcelExportOptions = {}
): Promise<void> {
  const { filename = "report.xlsx", sheetName = "Report" } = options

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  // Define headers
  worksheet.columns = columns.map((col) => ({
    header: col.label,
    key: col.key as string,
    width: 20,
  }))

  // Style header row
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } }
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2563EB" },
  }
  headerRow.alignment = { horizontal: "center", vertical: "middle" }

  // Add data
  data.forEach((row) => worksheet.addRow(row))

  // Alternate row background
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1 && rowNumber % 2 === 0) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      }
    }
    row.alignment = { horizontal: "left", vertical: "middle" }
  })

  // Add borders
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      }
    })
  })

  // Download Excel file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
