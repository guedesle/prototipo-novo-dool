import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { describe, expect, it } from 'vitest';

describe('base UI accessibility audit', () => {
  it('passes the repository accessibility contract audit', () => {
    expect(() => execFileSync(process.execPath, ['scripts/audit-ui-accessibility.mjs'], {
      encoding: 'utf8',
      stdio: 'pipe',
    })).not.toThrow();
  });

  it('runs the accessibility audit in CI after existing technical audits', async () => {
    const workflow = await readFile('.github/workflows/ci.yml', 'utf8');
    const adapterAudit = workflow.indexOf('node scripts/audit-adapter-boundary.mjs');
    const uiAudit = workflow.indexOf('node scripts/audit-ui-accessibility.mjs');

    expect(uiAudit).toBeGreaterThan(adapterAudit);
  });
});
