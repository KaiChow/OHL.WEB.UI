/**
 * OHL 规范自动检查脚本
 * 用法: node scripts/check-spec.js
 * 检查页面、组件和 UI skill 样式下所有 .vue / .ts / .css 文件
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const SCAN_DIRS = ['src/views', 'src/components', 'ui-skill'];
const EXTS = ['.vue', '.ts', '.css'];

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

  {
    desc: '禁止业务 CSS 直接组合主题通道色（应用 global.css 的 --dense-* 语义变量）',
    pattern: /(rgba?\(var\(--(primary|warning|success|danger)-\d+\)|rgb\(var\(--(primary|warning|success|danger)-\d+\)\))/,
    fileFilter: /\.(vue|css)$/,
    exclude: /node_modules|references|\/\*|\/\//,
  },

  {
    desc: '禁止黑色/当前色边框或焦点（应用 --dense-primary-* 或 --dense-border*）',
    pattern: /(border(?:-color)?\s*:\s*(black|#000|#111|#121314|currentColor|var\(--color-text-1\))|outline\s*:\s*[^;]*(ButtonText|currentColor|black|#000))/,
    fileFilter: /\.(vue|css)$/,
    exclude: /\/\*|\/\//,
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
  {
    desc: '禁止在页面中使用 btn-muted-warn（业务操作用 type="outline"）',
    pattern: /btn-muted-warn/,
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

const globalCss = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');
if (!globalCss.includes('.detail-form .arco-form-item-label-col > .arco-form-item-label')) {
  violations.push({
    rule: '详情表单必须覆盖 Arco label 结构，防止默认 14px 泄漏',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .detail-form .arco-form-item-label-col > .arco-form-item-label',
  });
}
if (!globalCss.includes('--vxe-ui-table-row-height-small: 38px')) {
  violations.push({
    rule: 'detail-mini-vxe 可编辑表格行高必须匹配 28px 控件，防止输入内容截断',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --vxe-ui-table-row-height-small: 38px',
  });
}
if (!globalCss.includes('.detail-mini-vxe.vxe-table .arco-picker-size-small')) {
  violations.push({
    rule: 'detail-mini-vxe 必须覆盖 date picker small 控件高度，防止日期内容截断',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .detail-mini-vxe.vxe-table .arco-picker-size-small',
  });
}
if (!globalCss.includes('.detail-section__body--table')) {
  violations.push({
    rule: '详情分区内嵌表格必须使用 detail-section__body--table 全局类',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .detail-section__body--table',
  });
}
if (!globalCss.includes('.detail-mini-vxe.vxe-table .vxe-body--row')) {
  violations.push({
    rule: 'detail-mini-vxe 必须显式覆盖 body 行高，防止列表页 vxe 全局规则污染',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .detail-mini-vxe.vxe-table .vxe-body--row',
  });
}
if (!globalCss.includes('col--ellipsis') || !globalCss.includes('.detail-mini-vxe.vxe-table')) {
  violations.push({
    rule: 'detail-mini-vxe 必须覆盖 col--ellipsis，防止 show-overflow 裁切与列错位',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing detail-mini-vxe col--ellipsis cell override',
  });
} else if (!/\.detail-mini-vxe\.vxe-table[\s\S]*col--ellipsis[\s\S]*\.vxe-cell/.test(globalCss)) {
  violations.push({
    rule: 'detail-mini-vxe 必须覆盖 col--ellipsis，防止 show-overflow 裁切与列错位',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing detail-mini-vxe col--ellipsis cell override',
  });
}
if (!globalCss.includes('.detail-drawer .arco-picker-size-small')) {
  violations.push({
    rule: 'detail-drawer 必须覆盖 date picker 28px 控件高度',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .detail-drawer .arco-picker-size-small',
  });
}
if (!globalCss.includes('--dense-mini-vxe-header-bg') || !globalCss.includes('--dense-mini-vxe-hover-bg')) {
  violations.push({
    rule: 'detail-mini-vxe 表头与 hover 必须使用独立 token，禁止同色',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-mini-vxe-header-bg or --dense-mini-vxe-hover-bg',
  });
}

if (!globalCss.includes('--dense-workbench-hover-bg')) {
  violations.push({
    rule: 'workbench-table 表头与 hover 必须使用独立 token，避免全灰质感',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-workbench-hover-bg',
  });
}

if (!globalCss.includes('.detail-drawer-footer__start') || !globalCss.includes('.detail-drawer-footer__end')) {
  violations.push({
    rule: 'detail-drawer-footer 必须提供 __start / __end 左右分区类',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing detail-drawer-footer__start or detail-drawer-footer__end',
  });
}

if (!globalCss.includes('.detail-form .detail-combo')) {
  violations.push({
    rule: '详情表单组合输入必须使用 detail-combo 全局类',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .detail-form .detail-combo',
  });
}

// detail-mini-vxe 禁止 show-overflow（整块匹配，避免表头表体错位）
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  const blocks = content.match(/<vxe-table[\s\S]*?<\/vxe-table>/g) || [];
  for (const block of blocks) {
    if (!/class="[^"]*detail-mini-vxe/.test(block)) continue;
    if (!/show-(?:header-)?overflow/.test(block)) continue;
    violations.push({
      rule: 'detail-mini-vxe 禁止 show-overflow / show-header-overflow',
      file: relPath,
      line: 1,
      content: block.split('\n').find((l) => /show-(?:header-)?overflow/.test(l))?.trim().slice(0, 120) ?? '<vxe-table ...>',
    });
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
