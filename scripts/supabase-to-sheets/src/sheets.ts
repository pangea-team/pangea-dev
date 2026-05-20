import { google } from 'googleapis';
import { config } from './config';
import type { Row } from './supabase';

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: config.sheets.serviceAccountKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function toValues(headers: string[], rows: Row[]): string[][] {
  return rows.map((row) =>
    headers.map((h) => {
      const v = row[h];
      if (v === null || v === undefined) return '';
      if (typeof v === 'object') return JSON.stringify(v);
      return String(v);
    }),
  );
}

export async function overwrite(sheetName: string, headers: string[], rows: Row[]): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // 기존 내용 전체 삭제
  await sheets.spreadsheets.values.clear({
    spreadsheetId: config.sheets.sheetId,
    range: sheetName,
  });

  // 헤더 + 데이터 한 번에 쓰기
  const values = [headers, ...toValues(headers, rows)];
  await sheets.spreadsheets.values.update({
    spreadsheetId: config.sheets.sheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

export async function append(sheetName: string, headers: string[], rows: Row[]): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // 시트가 비어 있으면 헤더 먼저 추가
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: config.sheets.sheetId,
    range: `${sheetName}!A1:A1`,
  });
  const isEmpty = !existing.data.values?.length;

  const values = isEmpty ? [headers, ...toValues(headers, rows)] : toValues(headers, rows);

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.sheets.sheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values },
  });
}
