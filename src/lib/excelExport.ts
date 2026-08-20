import * as XLSX from 'xlsx';

export type ExportCell = string | number | boolean | Date | null | undefined;

export interface ExportSheet {
  name: string;
  rows: Array<Record<string, ExportCell>>;
}

export interface ExcelExportOptions {
  filename: string;
  sheets: ExportSheet[];
}

export function exportRowsToExcel({ filename, sheets }: ExcelExportOptions): void {
  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const worksheet = XLSX.utils.json_to_sheet(sheet.rows);
    const headers = sheet.rows.length ? Object.keys(sheet.rows[0]) : [];
    worksheet['!cols'] = headers.map((header) => ({
      wch: Math.min(32, Math.max(header.length + 2, ...sheet.rows.slice(0, 50).map((row) => String(row[header] ?? '').length + 2))),
    }));
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name.slice(0, 31));
  });

  if (!workbook.SheetNames.length) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([]), 'Export');
  }
  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}
