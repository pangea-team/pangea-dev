import 'dotenv/config';

function require_env(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export type SyncTarget = {
  tableName: string;
  sheetTab: string;
  columns: string[];
};

function getColumnsForTable(tableName: string): string[] {
  const key = `COLUMNS_${tableName.toUpperCase()}`;
  const raw = process.env[key];
  if (!raw) return ['*'];
  return raw
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
}

function parseSyncTargets(): SyncTarget[] {
  const raw = process.env.SYNC_TARGETS!;
  return raw.split(',').map((pair, index) => {
    const trimmed = pair.trim();
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx <= 0 || colonIdx === trimmed.length - 1) {
      throw new Error(
        `SYNC_TARGETS 형식 오류 (항목 ${index + 1}): "${trimmed}"\n` +
          `올바른 형식: "테이블명:시트탭명" — 예: orders:orders`,
      );
    }
    const tableName = trimmed.slice(0, colonIdx).trim();
    const sheetTab = trimmed.slice(colonIdx + 1).trim();
    if (!tableName || !sheetTab) {
      throw new Error(
        `SYNC_TARGETS 형식 오류 (항목 ${index + 1}): "${trimmed}"\n` +
          `테이블명과 시트탭명은 비어 있으면 안 됩니다.`,
      );
    }
    return { tableName, sheetTab, columns: getColumnsForTable(tableName) };
  });
}

const isMultiMode = Boolean(process.env.SYNC_TARGETS);

export const config = {
  supabase: {
    url: require_env('SUPABASE_URL'),
    serviceRoleKey: require_env('SUPABASE_SERVICE_ROLE_KEY'),
  },
  sheets: {
    sheetId: require_env('GOOGLE_SHEET_ID'),
    serviceAccountKey: (() => {
      const raw = require_env('GOOGLE_SERVICE_ACCOUNT_KEY');
      try {
        return JSON.parse(raw);
      } catch {
        throw new Error(
          'GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON. ' +
            "Run: cat your-key.json | tr -d '\\n' and paste the output.",
        );
      }
    })(),
    // 단일 모드 전용 (다중 모드에서는 targets[].sheetTab 사용)
    sheetName: process.env.SHEET_NAME ?? 'Sheet1',
  },
  sync: {
    // CLI 인수 --mode=append 가 우선, 없으면 환경변수, 기본값 overwrite
    mode: (process.argv.find((a) => a.startsWith('--mode='))?.split('=')[1] ??
      process.env.SYNC_MODE ??
      'overwrite') as 'overwrite' | 'append',
    // 단일 모드 전용 (SYNC_TARGETS 없을 때만 사용)
    tableName: isMultiMode ? '' : require_env('TABLE_NAME'),
    columns: isMultiMode
      ? ([] as string[])
      : process.env.COLUMNS
        ? process.env.COLUMNS.split(',')
            .map((c) => c.trim())
            .filter(Boolean)
        : ['*'],
    // 다중 모드 전용 (SYNC_TARGETS 있을 때만 사용)
    targets: isMultiMode ? parseSyncTargets() : ([] as SyncTarget[]),
  },
};
