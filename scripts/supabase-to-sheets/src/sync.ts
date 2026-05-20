import { config } from './config';
import { append, overwrite } from './sheets';
import { fetchRows } from './supabase';

async function syncOne(tableName: string, sheetTab: string, columns: string[]): Promise<number> {
  const { headers, rows } = await fetchRows(tableName, columns);
  const rowCount = rows.length;

  if (rowCount === 0) {
    console.log(`  (no data — skipping sheet update)`);
    return 0;
  }

  if (config.sync.mode === 'append') {
    await append(sheetTab, headers, rows);
  } else {
    await overwrite(sheetTab, headers, rows);
  }

  return rowCount;
}

async function runMulti(): Promise<void> {
  const targets = config.sync.targets;
  const total = targets.length;
  let succeeded = 0;

  console.log(`[sync] mode=${config.sync.mode}  targets=${total}`);

  for (let i = 0; i < total; i++) {
    const { tableName, sheetTab, columns } = targets[i];
    console.log(`[${i + 1}/${total}] Syncing ${tableName} → ${sheetTab} tab...`);
    try {
      const rowCount = await syncOne(tableName, sheetTab, columns);
      console.log(`✓ ${tableName}: ${rowCount} rows synced`);
      succeeded++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`✗ ${tableName}: failed - ${message}`);
    }
  }

  const failed = total - succeeded;
  if (failed === 0) {
    console.log(`\n${succeeded}/${total} succeeded`);
  } else {
    console.log(`\n${succeeded}/${total} succeeded, ${failed} failed`);
    process.exit(1);
  }
}

async function runSingle(): Promise<void> {
  const { tableName, columns } = config.sync;
  const sheetTab = config.sheets.sheetName;

  console.log(`[sync] mode=${config.sync.mode}  table=${tableName}`);

  try {
    const rowCount = await syncOne(tableName, sheetTab, columns);
    if (rowCount === 0) {
      console.log('[sync] no data to write — skipping sheet update');
      return;
    }
    console.log(`[sync] done  rows=${rowCount}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[sync] FAILED: ${message}`);
    process.exit(1);
  }
}

async function main() {
  const startedAt = Date.now();

  if (config.sync.targets.length > 0) {
    await runMulti();
  } else {
    await runSingle();
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(2);
  console.log(`elapsed=${elapsed}s`);
}

main();
