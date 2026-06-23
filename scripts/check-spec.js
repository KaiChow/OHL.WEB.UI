/**
 * OHL 规范自动检查脚本
 * 用法: node scripts/check-spec.js
 * 检查 src/views 和 src/components 下所有 .vue / .ts 文件
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const SCAN_DIRS = ['src/views', 'src/components'];
const EXTS = ['.vue', '.ts'];

// ─── 规则定义 ────────────────────────────────────────────────────────────────
// { desc, pattern, exclude?, fileFilter? }
// pattern: RegExp  exclude: RegExp（命中 exclude 则忽略该行）
const RULES = [
  // 禁止的组件
  {
    desc: '禁止 <a-table> — 必须用 vxe-table',
    pattern: /<a-table[\s>]/,
    fileFilter: /\.vue$/,
  },
  {
    desc: '禁止 <ATable> — 必须用 vxe-table',
    pattern: /<ATable[\s>]/,
    fileFilter: /\.vue$/,
  },
  {
    desc: '禁止 <a-upload> — 必须用 UppyUploader 组件',
    pattern: /<a-upload[\s>]/,
    fileFilter: /\.vue$/,
  },

  // 禁止的类名
  {
    desc: '禁止 stab-count（类名不存在，应用 stab-badge）',
    pattern: /stab-count/,
  },
  {
    desc: '禁止 freight-table（已废弃类名）',
    pattern: /freight-table/,
  },
  {
    desc: '禁止 .toolbar-left / .toolbar-right（应用 toolbar-group / toolbar-aside）',
    pattern: /["'\s](toolbar-left|toolbar-right)["'\s]/,
  },
  {
    desc: '禁止 .search-bar / .sf-label（应用 filter-card 体系）',
    pattern: /["'\s](search-bar|sf-label|\.sf\b)["'\s]/,
  },

  // 禁止裸用 a-pagination（须在 table-card-cap 结构内）
  {
    desc: '禁止在非 table-card-cap 组件内裸写 <a-pagination>',
    pattern: /<a-pagination/,
    fileFilter: /\.vue$/,
    // 允许在 TableCap 相关文件里用；SaleOrderToolbar 是历史遗留（工具栏+分页合一），待拆分
    fileExclude: /TableCap\.vue$|SaleOrderToolbar\.vue$/i,
  },

  // 禁止硬编码 hex 颜色（注释行和 CSS 变量定义除外）
  {
    desc: '禁止 hex 颜色（应用 CSS 变量，如 var(--danger-6)）',
    pattern: /:\s*#[0-9a-fA-F]{3,8}\b/,
    // 排除 CSS 变量定义行（--xxx: #yyy 是定义，不是使用）和注释
    exclude: /--[\w-]+\s*:|\/\*|\/\//,
    fileFilter: /\.(vue|css)$/,
  },

  // 禁止硬编码字号
  {
    desc: '禁止 font-size: 14px / 15px / 16px（应用 token，如 var(--dense-font-data)）',
    pattern: /font-size\s*:\s*1[456]px/,
    fileFilter: /\.(vue|css)$/,
    // 排除 global.css 中的变量定义
    fileExclude: /global\.css$/,
  },

  // 禁止 font-weight: 700
  {
    desc: '禁止 font-weight: 700（最大值 600）',
    pattern: /font-weight\s*:\s*700/,
    fileFilter: /\.(vue|css)$/,
    fileExclude: /global\.css$/,
  },

  // emoji 作为空状态图标
  {
    desc: '禁止 emoji 作为空状态图标（应用 Arco icon + state-center）',
    pattern: /暂无.*[🏭📦📋🚢✈️🏗️]/u,
    fileFilter: /\.vue$/,
  },
];

// ─── 文件扫描 ─────────────────────────────────────────────────────────────────
function collectFiles(dir) {
  const abs = join(ROOT, dir);
  const results = [];
  try {
    for (const name of readdirSync(abs)) {
      const full = join(abs, name);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results.push(...collectFiles(join(dir, name)));
      } else if (EXTS.includes(extname(name))) {
        results.push(full);
      }
    }
  } catch {
    // 目录不存在时静默跳过
  }
  return results;
}

// ─── 主检查逻辑 ───────────────────────────────────────────────────────────────
const files = SCAN_DIRS.flatMap(collectFiles);
const violations = [];

for (const file of files) {
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const lines = readFileSync(file, 'utf8').split('\n');

  for (const rule of RULES) {
    if (rule.fileFilter && !rule.fileFilter.test(file)) continue;
    if (rule.fileExclude && rule.fileExclude.test(file)) continue;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!rule.pattern.test(line)) continue;
      if (rule.exclude && rule.exclude.test(line)) continue;

      violations.push({
        rule: rule.desc,
        file: relPath,
        line: i + 1,
        content: line.trim().slice(0, 120),
      });
    }
  }
}

// ─── 输出结果 ─────────────────────────────────────────────────────────────────
if (violations.length === 0) {
  console.log('\n✅ 所有规范检查通过\n');
  process.exit(0);
}

// 按规则分组输出
const grouped = {};
for (const v of violations) {
  (grouped[v.rule] ??= []).push(v);
}

console.log('\n');
for (const [rule, items] of Object.entries(grouped)) {
  console.log(`❌ ${rule}`);
  for (const v of items) {
    console.log(`   ${v.file}:${v.line}`);
    console.log(`   ${v.content}`);
  }
  console.log('');
}

console.log(`共发现 ${violations.length} 处违规，请修复后再提交\n`);
process.exit(1);
