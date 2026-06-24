/**
 * 将 ui-skill/freight-arco-ui 同步到各 AI 工具的 skill 目录。
 * 用法: node scripts/sync-ui-skill.mjs
 * 源码目录: ui-skill/freight-arco-ui/
 */

import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'ui-skill', 'freight-arco-ui');

/** @type {{ label: string; path: string }[]} */
const TARGETS = [
  { label: 'Cursor', path: join(ROOT, '.cursor', 'skills', 'freight-arco-ui') },
  { label: 'Codex', path: join(ROOT, '.agents', 'skills', 'freight-arco-ui') },
  { label: 'Claude Code', path: join(ROOT, '.claude', 'skills', 'freight-arco-ui') },
];

function syncSkill() {
  if (!existsSync(join(SOURCE, 'SKILL.md'))) {
    console.error('Source skill not found:', SOURCE);
    process.exit(1);
  }

  console.log('Source:', relative(ROOT, SOURCE));
  console.log('');

  for (const { label, path } of TARGETS) {
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
    }
    mkdirSync(dirname(path), { recursive: true });
    cpSync(SOURCE, path, { recursive: true });
    console.log(`[${label}] → ${relative(ROOT, path)}`);
  }

  console.log('');
  console.log('Done. Skill synced to Cursor, Codex (.agents/skills), and Claude Code.');
}

syncSkill();
