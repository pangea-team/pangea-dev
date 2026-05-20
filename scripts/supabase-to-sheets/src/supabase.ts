import { createClient } from '@supabase/supabase-js';
import { config } from './config';

const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
  auth: { persistSession: false },
});

export type Row = Record<string, unknown>;

function toRow(raw: unknown): Row {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`Unexpected non-object row from Supabase: ${JSON.stringify(raw)}`);
  }
  return raw as Row;
}

export async function fetchRows(
  tableName: string,
  columns: string[],
): Promise<{ headers: string[]; rows: Row[] }> {
  const selectExpr = columns[0] === '*' ? '*' : columns.join(', ');

  const { data, error } = await supabase.from(tableName).select(selectExpr);

  if (error) {
    throw new Error(`Supabase query failed: ${error.message} (${error.code})`);
  }
  if (!data || data.length === 0) {
    return { headers: [], rows: [] };
  }

  const rows = data.map(toRow);
  const headers = Object.keys(rows[0]);
  return { headers, rows };
}
