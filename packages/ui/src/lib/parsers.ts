import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import TOML from '@iarna/toml';
import { XMLParser } from 'fast-xml-parser';

/**
 * Universal file parsers — promise-based, runtime-safe, generic typing.
 * (TIER 9)
 */

export async function parseCSV<T = Record<string, string>>(
  file: File | string,
  options?: { header?: boolean; delimiter?: string }
): Promise<{ data: T[]; errors: string[] }> {
  const text = typeof file === 'string' ? file : await file.text();
  return new Promise((resolve) => {
    Papa.parse<T>(text, {
      header: options?.header ?? true,
      delimiter: options?.delimiter,
      skipEmptyLines: true,
      complete: (res) => resolve({ data: res.data, errors: res.errors.map((e) => e.message) }),
    });
  });
}

export function exportCSV<T extends Record<string, unknown>>(rows: T[]): string {
  return Papa.unparse(rows);
}

export async function parseExcel(file: File | ArrayBuffer): Promise<Record<string, unknown[]>> {
  const buf = file instanceof File ? await file.arrayBuffer() : file;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);
  const out: Record<string, unknown[]> = {};
  wb.eachSheet((ws) => {
    const rows: Record<string, unknown>[] = [];
    let headers: string[] = [];
    ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      const values = row.values as unknown[];
      if (rowNumber === 1) {
        headers = values.slice(1).map((v) => String(v ?? ''));
      } else {
        const obj: Record<string, unknown> = {};
        headers.forEach((h, i) => {
          obj[h] = values[i + 1];
        });
        rows.push(obj);
      }
    });
    out[ws.name] = rows;
  });
  return out;
}

export async function exportExcel<T extends Record<string, unknown>>(
  sheets: Record<string, T[]>,
  filename: string
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  for (const [name, rows] of Object.entries(sheets)) {
    const ws = wb.addWorksheet(name);
    if (rows.length > 0) {
      const headers = Object.keys(rows[0]!);
      ws.columns = headers.map((h) => ({ header: h, key: h }));
      ws.addRows(rows);
    }
  }
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function parseJSON<T = unknown>(file: File | string): Promise<T> {
  const text = typeof file === 'string' ? file : await file.text();
  return JSON.parse(text) as T;
}

export async function parseTOML(file: File | string): Promise<Record<string, unknown>> {
  const text = typeof file === 'string' ? file : await file.text();
  return TOML.parse(text);
}

export async function parseXML(file: File | string): Promise<Record<string, unknown>> {
  const text = typeof file === 'string' ? file : await file.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  return parser.parse(text);
}
