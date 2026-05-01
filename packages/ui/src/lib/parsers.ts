import Papa from 'papaparse';
import * as XLSX from 'xlsx';
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
  const wb = XLSX.read(buf, { type: 'array' });
  const out: Record<string, unknown[]> = {};
  for (const name of wb.SheetNames) {
    out[name] = XLSX.utils.sheet_to_json(wb.Sheets[name]!);
  }
  return out;
}

export function exportExcel<T extends Record<string, unknown>>(
  sheets: Record<string, T[]>,
  filename: string
): void {
  const wb = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) {
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, name);
  }
  XLSX.writeFile(wb, filename);
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
