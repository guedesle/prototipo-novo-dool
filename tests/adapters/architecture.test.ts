import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('adapter architectural boundary', () => {
  it('passes the runtime boundary audit', () => {
    expect(() => execFileSync(process.execPath, ['scripts/audit-adapter-boundary.mjs'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe',
    })).not.toThrow();
  });

  it('runs the adapter boundary audit in CI after build/manifest verification', async () => {
    const workflow = await readFile('.github/workflows/ci.yml', 'utf8');
    expect(workflow).toContain('node scripts/audit-adapter-boundary.mjs');
  });
});
