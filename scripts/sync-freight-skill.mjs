/** Sync the Codex freight skill source to the Cursor mirror. */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, '.agents', 'skills', 'freight-arco-ui');
const target = join(root, '.cursor', 'skills', 'freight-arco-ui');

if (!existsSync(join(source, 'SKILL.md'))) {
  console.error('Freight skill source not found:', source);
  process.exit(1);
}

if (existsSync(target)) rmSync(target, { recursive: true, force: true });
mkdirSync(dirname(target), { recursive: true });
cpSync(source, target, { recursive: true });
console.log(`Synced ${relative(root, source)} -> ${relative(root, target)}`);
