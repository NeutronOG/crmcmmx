/**
 * Generic CSV export utility.
 * Converts an array of objects to CSV and triggers a browser download.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToCSV(
  data: any[],
  columns: { key: string; label: string }[],
  filename: string
) {
  if (data.length === 0) return

  const header = columns.map(c => `"${c.label}"`).join(",")
  const rows = data.map(row =>
    columns.map(c => {
      const val = row[c.key]
      if (val === null || val === undefined) return '""'
      if (Array.isArray(val)) return `"${val.join(", ")}"`
      const str = String(val).replace(/"/g, '""')
      return `"${str}"`
    }).join(",")
  )

  const csv = "\uFEFF" + [header, ...rows].join("\n") // BOM for Excel UTF-8
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
