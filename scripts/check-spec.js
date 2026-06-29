/**
 * OHL 规范自动检查脚本
 * 用法: node scripts/check-spec.js
 * 检查页面、组件和 UI skill 样式下所有 .vue / .ts / .css 文件
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, sep } from 'path';

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
  // 结构型规则在下方单独检查，避免只按文件名放行导致 table-card-cap 内误报。

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
  {
    desc: '下拉菜单分隔线禁止内联 style（应用 action-menu__divider）',
    pattern: /<a-divider\b[^>]*\bstyle=/,
    fileFilter: /\.vue$/,
  },
  {
    desc: '下拉触发按钮禁止内联 icon margin（由 toolbar-group 统一控制 trailing icon 间距）',
    pattern: /<icon-down\b[^>]*\bstyle=/,
    fileFilter: /\.vue$/,
  },
  {
    desc: 'a-dropdown 禁止使用无效 popup-class（Arco Dropdown 应使用 content-class）',
    pattern: /<a-dropdown\b[^>]*\bpopup-class=/,
    fileFilter: /\.vue$/,
  },
  {
    desc: '下拉菜单分隔线应用 action-menu__divider（row-action-menu__divider 仅兼容旧代码）',
    pattern: /row-action-menu__divider/,
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
const modulePatterns = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/module-patterns.md'), 'utf8');
const aiGenerationContract = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/ai-generation-contract.md'), 'utf8');
const checklist = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/checklist.md'), 'utf8');
const visualSystem = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/visual-system.md'), 'utf8');
const filterLayout = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/filter-layout.md'), 'utf8');
const actionsReference = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/actions.md'), 'utf8');

if (!modulePatterns.includes('Specification Granularity Rule')) {
  violations.push({
    rule: 'UI 规范必须定义 Specification Granularity Rule，防止按单页面/单字段写规则',
    file: 'ui-skill/freight-arco-ui/references/module-patterns.md',
    line: 1,
    content: 'missing Specification Granularity Rule',
  });
}
if (!aiGenerationContract.includes('Specification Granularity')) {
  violations.push({
    rule: 'AI 生成契约必须包含规范粒度要求：先槽位/表面，再填业务字段示例',
    file: 'ui-skill/freight-arco-ui/references/ai-generation-contract.md',
    line: 1,
    content: 'missing Specification Granularity',
  });
}
if (!checklist.includes('New or changed rules are written for a reusable surface/class of problem')) {
  violations.push({
    rule: '交付清单必须检查规范粒度，禁止把截图或单模块字段写成全局规范',
    file: 'ui-skill/freight-arco-ui/references/checklist.md',
    line: 1,
    content: 'missing reusable surface/class of problem checklist',
  });
}
if (!checklist.includes('Operational Workbench Gate')) {
  violations.push({
    rule: '交付清单必须包含生产作业台门槛，避免把高频办公系统误做成展示型 SaaS',
    file: 'ui-skill/freight-arco-ui/references/checklist.md',
    line: 1,
    content: 'missing Operational Workbench Gate',
  });
}
if (!visualSystem.includes('Deep-Sea Neutral Color Contract')) {
  violations.push({
    rule: '视觉规范必须定义 Deep-Sea Neutral Color Contract，统一货代作业台配色边界',
    file: 'ui-skill/freight-arco-ui/references/visual-system.md',
    line: 1,
    content: 'missing Deep-Sea Neutral Color Contract',
  });
}
if (!filterLayout.includes('group navigation should be anchors')) {
  violations.push({
    rule: '50+ 查询工作区必须使用分组锚点标准，避免条件模块互斥隐藏',
    file: 'ui-skill/freight-arco-ui/references/filter-layout.md',
    line: 1,
    content: 'missing group anchor standard for 50+ query workspace',
  });
}
if (!filterLayout.includes('filter-combo` is a connected control')) {
  violations.push({
    rule: '组合查询控件必须定义 connected control 规则，避免 select + input 连接处双圆角',
    file: 'ui-skill/freight-arco-ui/references/filter-layout.md',
    line: 1,
    content: 'missing connected control standard for filter-combo',
  });
}
if (!filterLayout.includes('Alignment contract:') || !filterLayout.includes('--query-ws-pad-x')) {
  violations.push({
    rule: '50+ 查询工作区必须定义对齐与间距契约，避免三栏抽屉 padding/gap 随意漂移',
    file: 'ui-skill/freight-arco-ui/references/filter-layout.md',
    line: 1,
    content: 'missing saved query workspace alignment contract',
  });
}
if (!actionsReference.includes('生产作业台的高频可逆动作可以超过 3')) {
  violations.push({
    rule: '动作规范必须允许生产作业台高频可逆动作可见，禁止机械套用三个按钮上限',
    file: 'ui-skill/freight-arco-ui/references/actions.md',
    line: 1,
    content: 'missing operational workbench visible action rule',
  });
}

if (
  !/\.arco-form-size-small\s+\.arco-form-item-label-col\s*>\s*\.arco-form-item-label[\s\S]*--dense-font-field/.test(globalCss)
) {
  violations.push({
    rule: '§ Arco Form Controls 必须覆盖 Arco size="small" form label 14px 默认，统一为 --dense-font-field 12px',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .arco-form-size-small .arco-form-item-label-col > .arco-form-item-label with --dense-font-field',
  });
}
if (!/--dense-row-h-detail-edit\s*:\s*38px/.test(globalCss)) {
  violations.push({
    rule: 'detail-mini-vxe 可编辑表格行高必须通过 --dense-row-h-detail-edit: 38px token 定义',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-row-h-detail-edit: 38px',
  });
}
if (!/--dense-row-h-detail-read\s*:\s*34px/.test(globalCss)) {
  violations.push({
    rule: 'detail-mini-vxe 只读表格行高必须通过 --dense-row-h-detail-read: 34px token 定义',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-row-h-detail-read: 34px',
  });
}
if (!/--dense-row-h-summary\s*:\s*32px/.test(globalCss)) {
  violations.push({
    rule: 'summary mini table 行高必须通过 --dense-row-h-summary: 32px token 定义',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-row-h-summary: 32px',
  });
}
if (!/--dense-col-w-seq\s*:\s*52px/.test(globalCss)) {
  violations.push({
    rule: 'VXE 序号列必须有统一宽度 token：--dense-col-w-seq: 52px',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-col-w-seq: 52px',
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
if (!/--dense-gap-label\s*:\s*4px/.test(globalCss)) {
  violations.push({
    rule: '字段节奏缺失：label 与控件的名/值关系需要 --dense-gap-label token 承载',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-gap-label: 4px',
  });
}
if (!/\.filter-card__slim-row\s+\.filter-field\s*\{[\s\S]*?gap\s*:\s*5px/.test(globalCss)) {
  violations.push({
    rule: '查询字段节奏缺失：filter-field 需要 5px gap 维持字段名/输入面的可扫读分组',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .filter-card__slim-row .filter-field { gap: 5px }',
  });
}
if (!/\.filter-field \.filter-combo\s*>\s*\*\s*\+\s*\*\s*\{[\s\S]*?margin-left:\s*-1px/.test(globalCss)
  || !/\.filter-field \.filter-combo\s*>\s*\*:not\(:last-child\)[\s\S]*?border-top-right-radius:\s*0/.test(globalCss)
  || !/\.filter-field \.filter-combo\s*>\s*\*:not\(:first-child\)[\s\S]*?border-top-left-radius:\s*0/.test(globalCss)) {
  violations.push({
    rule: 'filter-combo 必须是连接控件：相邻控件共享边框，连接处内侧圆角为 0',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing connected filter-combo radius contract',
  });
}
if (!globalCss.includes('.filter-card--two-row') || !globalCss.includes('.filter-grid--two-row')) {
  violations.push({
    rule: '全局 CSS 须含 filter-card--two-row 结构；双行可见筛选用 matrix + filter-grid（4列），禁止多个 slim-row 堆叠',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .filter-card--two-row or .filter-grid--two-row',
  });
}
if (!globalCss.includes('.query-filter-drawer--wide') || !globalCss.includes('.query-filter-drawer__nav')) {
  violations.push({
    rule: '30+/40+ 查询项必须有宽抽屉与分组导航样式，禁止平铺表单墙',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .query-filter-drawer--wide or .query-filter-drawer__nav',
  });
}
if (!globalCss.includes('.saved-query-workspace')) {
  violations.push({
    rule: '50+ 查询项必须有 saved-query-workspace 查询工作区样式，不能继续放大抽屉',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .saved-query-workspace',
  });
}
if (!globalCss.includes('--query-ws-pad-x') || !globalCss.includes('--query-ws-side-w') || !globalCss.includes('--query-ws-nav-w')) {
  violations.push({
    rule: '50+ 查询工作区必须使用 query-ws spacing/width tokens，禁止各栏手写不一致 padding',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --query-ws-* alignment tokens',
  });
}
if (!globalCss.includes('--dense-surface-head') || !globalCss.includes('--dense-surface-section') || !globalCss.includes('--dense-surface-rail')) {
  violations.push({
    rule: '全局视觉层级必须定义 surface head/section/rail token，禁止详情/列表退回大片灰底',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-surface-head / --dense-surface-section / --dense-surface-rail',
  });
}
if (!globalCss.includes('--dense-brand-surface') || !globalCss.includes('--dense-brand-line')) {
  violations.push({
    rule: '主体 token 必须定义 brand-neutral 锚点，避免从蓝色模板退化成灰色 ERP',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-brand-surface / --dense-brand-line',
  });
}
if (!/--dense-page-bg\s*:\s*#F2F5F8/.test(globalCss)) {
  violations.push({
    rule: '主体页面背景必须采用深海中性工作面 --dense-page-bg: #F2F5F8，禁止纯灰或蓝色渐变底',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing brand-neutral --dense-page-bg: #F2F5F8',
  });
}
if (/--dense-page-bg\s*:[^;]*gradient/i.test(globalCss) || /--dense-table-header-bg\s*:[^;]*gradient/i.test(globalCss)) {
  violations.push({
    rule: '主体标准禁止页面背景和表格表头使用蓝色/装饰渐变',
    file: 'src/styles/global.css',
    line: 1,
    content: 'remove gradient from --dense-page-bg / --dense-table-header-bg',
  });
}
if (!/--dense-zone-top-border\s*:\s*var\(--dense-brand-line\)/.test(globalCss)) {
  violations.push({
    rule: '列表区块顶边界必须使用 brand-neutral hairline，避免整页灰白无品牌锚点',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-zone-top-border: var(--dense-brand-line)',
  });
}
if (!/--dense-table-header-bg\s*:\s*#FAFBFC/.test(globalCss)) {
  violations.push({
    rule: 'workbench 表头必须采用近白中性冷白 --dense-table-header-bg: #FAFBFC，禁止灰表头或浅蓝模板表头',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing brand-neutral --dense-table-header-bg: #FAFBFC',
  });
}
if (!/--dense-row-stripe\s*:\s*#FFFFFF/.test(globalCss)) {
  violations.push({
    rule: 'workbench 默认斑马纹必须接近白色，避免整张表灰化；需要显性斑马纹必须写模块例外',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-row-stripe: #FFFFFF',
  });
}
if (!/--dense-table-col-border\s*:\s*transparent/.test(globalCss)) {
  violations.push({
    rule: 'workbench 表格竖线默认必须关闭或近透明，避免 Excel/ERP 网格感',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-table-col-border: transparent',
  });
}
if (/rgba\(143,\s*184,\s*255/.test(globalCss)) {
  violations.push({
    rule: '主体标准禁止蓝色表格列分隔线 rgba(143,184,255,...)，应用 --dense-table-col-border',
    file: 'src/styles/global.css',
    line: 1,
    content: 'remove hard-coded blue table column border',
  });
}
const moduleScopedClassPattern = /\.[\w-]+--(?:order|finance|sale|business|shipment|customs|warehouse)(?:-|$|[\s,{.:#[])/g;
for (const match of globalCss.matchAll(moduleScopedClassPattern)) {
  const line = globalCss.slice(0, match.index).split('\n').length;
  violations.push({
    rule: 'global.css 禁止业务模块前缀修饰符（如 --order-*），应合并到结构槽位类（如 --compact / --trailing）',
    file: 'src/styles/global.css',
    line,
    content: match[0].trim().slice(0, 120),
  });
}
if (!/--dense-page-bottom-space\s*:\s*(?:8|9|10|11|12)px/.test(globalCss)) {
  violations.push({
    rule: '列表页必须定义 --dense-page-bottom-space: 8-12px，表格不能贴到视口底部',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-page-bottom-space: 8-12px',
  });
}
if (!/\.page-root--dense\s*\{[\s\S]*?padding:\s*8px 10px var\(--dense-page-bottom-space\)/.test(globalCss)) {
  violations.push({
    rule: 'page-root--dense 必须用 --dense-page-bottom-space 作为底部 padding，禁止列表页贴底',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing page-root--dense bottom padding token',
  });
}
if (/\.detail-section::before\s*\{(?=[\s\S]*?background:\s*var\(--dense-primary-6\))(?!(?=[\s\S]*?content:\s*none))[\s\S]*?\}/.test(globalCss)) {
  violations.push({
    rule: 'detail-section 禁止使用全高主色左 rail；顶层模块只用 title 短锚点，避免左侧小块混乱',
    file: 'src/styles/global.css',
    line: 1,
    content: 'remove full-height .detail-section::before primary rail',
  });
}
if (!/\.detail-section__title::before\s*\{[\s\S]*?background:\s*var\(--dense-primary-6\)/.test(globalCss)) {
  violations.push({
    rule: 'detail-section 顶层锚点必须在 detail-section__title::before，不能散落在多个左侧 rail',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .detail-section__title::before primary marker',
  });
}
if (!/\.detail-section__head\s*\{[\s\S]*?background:\s*var\(--dense-surface-head\)/.test(globalCss)) {
  violations.push({
    rule: 'detail-section__head 必须使用 --dense-surface-head，禁止灰色 divider 头部',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing detail-section__head --dense-surface-head',
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
if (!/\.detail-mini-vxe\.vxe-table\s*\{[\s\S]*--vxe-ui-table-row-height-small:\s*var\(--detail-mini-row-h\)/.test(globalCss)) {
  violations.push({
    rule: 'detail-mini-vxe 的 VXE 行高变量必须引用 --detail-mini-row-h，禁止散落硬编码行高',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --vxe-ui-table-row-height-small: var(--detail-mini-row-h)',
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
if (!globalCss.includes('§ Arco Form Controls') || !globalCss.includes('--dense-control-h-form')) {
  violations.push({
    rule: 'global.css 必须定义 § Arco Form Controls 与 --dense-control-h-form',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing § Arco Form Controls or --dense-control-h-form',
  });
} else if (
  !/\.arco-picker-size-small[\s\S]*--dense-control-h-form/.test(globalCss)
) {
  violations.push({
    rule: '§ Arco Form Controls 必须覆盖 picker 组件高度',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .arco-picker-size-small height in § Arco Form Controls',
  });
}
if (!globalCss.includes('--dense-vxe-surface-hover-bg') || !globalCss.includes('--dense-table-header-bg')) {
  violations.push({
    rule: '全项目 VXE 表必须定义共用 surface token（--dense-vxe-surface-hover-bg + --dense-table-header-bg）',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-vxe-surface-hover-bg or --dense-table-header-bg',
  });
}

if (!/\.detail-mini-vxe\.vxe-table \.vxe-header--column[\s\S]*--dense-table-header-bg/.test(globalCss)) {
  violations.push({
    rule: 'detail-mini-vxe 表头必须与 workbench-table 共用 --dense-table-header-bg',
    file: 'src/styles/global.css',
    line: 1,
    content: 'detail-mini-vxe header must use --dense-table-header-bg',
  });
}

if (!/\.detail-mini-vxe\.vxe-table[\s\S]*--dense-vxe-surface-hover-bg/.test(globalCss)) {
  violations.push({
    rule: 'detail-mini-vxe hover 必须与列表共用 --dense-vxe-surface-hover-bg',
    file: 'src/styles/global.css',
    line: 1,
    content: 'detail-mini-vxe hover must use --dense-vxe-surface-hover-bg',
  });
}

const miniHeaderAlias = /--dense-mini-vxe-header-bg:\s*var\(--dense-table-header-bg\)/.test(globalCss);
if (!miniHeaderAlias) {
  violations.push({
    rule: 'detail-mini-vxe 表头 token 必须别名到 --dense-table-header-bg',
    file: 'src/styles/global.css',
    line: 1,
    content: '--dense-mini-vxe-header-bg must alias --dense-table-header-bg',
  });
}

if (!/\.detail-mini-vxe\.vxe-table \.vxe-table--header-wrapper\s*\{[^}]*border-bottom:\s*none/.test(globalCss)) {
  violations.push({
    rule: 'detail-mini-vxe 禁止 vxe-table--header-wrapper 底边蓝线（靠背景分层即可）',
    file: 'src/styles/global.css',
    line: 1,
    content: 'detail-mini-vxe header-wrapper must use border-bottom: none',
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

if (!/@media\s*\(max-width:\s*1279px\)/.test(globalCss) || !globalCss.includes('.merged-bar')) {
  violations.push({
    rule: '运营列表必须提供 1280 小屏断点，merged-bar/status/filter 不能在小屏硬挤溢出',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing @media (max-width: 1279px) responsive merged-bar rules',
  });
}

if (!/\.stat-tab-group\s*\{[\s\S]*flex:\s*1 1 auto[\s\S]*min-width:\s*0/.test(globalCss)) {
  violations.push({
    rule: 'stat-tab-group 必须 flex: 1 1 auto 且 min-width: 0，状态组应内部滚动而不是撑爆页面',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .stat-tab-group flex/min-width responsive contract',
  });
}

if (!globalCss.includes('.form-subgroup__head') || !globalCss.includes('.form-subgroup__title')) {
  violations.push({
    rule: '详情小模块必须提供 form-subgroup 结构样式，禁止只靠裸 subgroup label 分隔',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .form-subgroup__head or .form-subgroup__title',
  });
}

if (!globalCss.includes('.vxe-table .row-action-btn.arco-btn-status-danger')) {
  violations.push({
    rule: '行内删除必须保留 danger 红色语义，禁止被默认 row-action 灰/蓝覆盖',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .vxe-table .row-action-btn.arco-btn-status-danger',
  });
}

if (!globalCss.includes('.detail-drawer-footer__cluster')) {
  violations.push({
    rule: '详情吸底业务按钮必须收入 detail-drawer-footer__cluster 操作组',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .detail-drawer-footer__cluster',
  });
}

if (!globalCss.includes('.arco-popconfirm-footer .arco-btn') || !globalCss.includes('.arco-select-dropdown .arco-select-option')) {
  violations.push({
    rule: '浮层字号必须在 global.css 统一（popconfirm 按钮 + select 下拉项）',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing overlay typography overrides',
  });
}

if (!/--dense-drawer-w-complex-max:\s*1200px/.test(globalCss)
  || !/\.detail-drawer\.arco-drawer\s*\{[^}]*width:\s*min\(var\(--dense-drawer-w-complex-max\)/.test(globalCss)
  || !/\.detail-drawer--standard\.arco-drawer/.test(globalCss)) {
  violations.push({
    rule: '抽屉宽度须在 global.css 用 token 分档（detail-drawer / detail-drawer--standard）',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing drawer width tokens or detail-drawer--standard',
  });
}

if (!/--dense-modal-w-max:\s*860px/.test(globalCss)) {
  violations.push({
    rule: 'Modal 最大宽度 token --dense-modal-w-max 必须为 860px',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-modal-w-max: 860px',
  });
}

if (!globalCss.includes('.md-layout') || !globalCss.includes('.perm-layout') || !globalCss.includes('.db-wrap') || !globalCss.includes('.xf-wrap')) {
  violations.push({
    rule: '多域布局类须在 global.css 提供：md-layout / perm-layout / db-wrap / xf-wrap',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing multi-domain layout classes',
  });
}
if (!globalCss.includes('--dense-font-overlay') || !/\.arco-modal-title\s*\{[^}]*font-size:\s*var\(--dense-font-overlay\)/.test(globalCss)) {
  violations.push({
    rule: 'Modal 标题必须使用 F0 --dense-font-overlay（14px），且大于表单正文 12px',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .arco-modal-title { font-size: var(--dense-font-overlay) }',
  });
}

if (!/--dense-font-title:\s*13px/.test(globalCss)) {
  violations.push({
    rule: '结构标题 F3 --dense-font-title 必须为 13px（与表格数据同字号，靠字重区分）',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-font-title: 13px',
  });
}

if (!globalCss.includes('--dense-action-menu-max-w') || !/\.action-menu,\s*\n\.row-action-menu,[\s\S]*?width:\s*max-content/.test(globalCss)) {
  violations.push({
    rule: 'action-menu 必须使用内容自适应宽度，并用 --dense-action-menu-max-w 约束国际化长文案',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing action-menu width: max-content or --dense-action-menu-max-w',
  });
}

if (!globalCss.includes('--dense-zone-top-border') || !/\.zone-l2-filter-card\s*\{[\s\S]*?border-top:\s*(?:1|2)px solid var\(--dense-zone-top-border\)/.test(globalCss) || !/\.zone-l3-action,\s*\n\.zone-card--stack\s*\{[\s\S]*?border-top:\s*(?:1|2)px solid var\(--dense-zone-top-border\)/.test(globalCss) || !/\.zone-l4-table-card\s*\{[\s\S]*?border-top:\s*(?:1|2)px solid var\(--dense-zone-top-border\)/.test(globalCss)) {
  violations.push({
    rule: '列表 L2/L3/L4 模块顶边界必须统一使用 --dense-zone-top-border，禁止有的主色线有的灰线',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing unified --dense-zone-top-border usage on list zones',
  });
}

if (!/\.action-menu--toolbar \.arco-dropdown-option\s*\{[^}]*height:\s*32px/.test(globalCss)) {
  violations.push({
    rule: '工具栏 action-menu 选项热区必须为 32px，保持可点击且不突兀',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing .action-menu--toolbar .arco-dropdown-option { height: 32px }',
  });
}

if (!/\.action-menu[\s\S]*?\.row-action-menu[\s\S]*?\{[\s\S]*?overflow-x:\s*hidden/.test(globalCss)) {
  violations.push({
    rule: 'action-menu 浮层必须禁止横向滚动，长文案应用省略而不是撑出滚动条',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing action-menu overflow-x: hidden',
  });
}

if (!/\.arco-btn-size-mini\s*\{[^}]*font-size:\s*var\(--dense-font-control\)/.test(globalCss)) {
  violations.push({
    rule: 'arco-btn-size-mini 必须使用 F4 Control 12px，禁止 10px',
    file: 'src/styles/global.css',
    line: 1,
    content: 'arco-btn-size-mini must use --dense-font-control',
  });
}

// 业务页禁止 Arco size="medium" | "large" | "mini"
for (const file of files) {
  if (!file.includes(`${sep}src${sep}views${sep}`) || !file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + sep, '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/size="(medium|large|mini)"/.test(line)) continue;
    violations.push({
      rule: '业务页 Arco 组件禁止 size="medium|large|mini"，统一 size="small"（见 component-size.md）',
      file: relPath,
      line: i + 1,
      content: line.trim().slice(0, 140),
    });
  }
}

// 业务列禁止固定 width（仅 checkbox / seq / 操作列允许）
function isStructuralVxeColumn(attrs) {
  if (/type="checkbox"/.test(attrs) || /type="seq"/.test(attrs)) return true;
  if (/title="操作"/.test(attrs) && /fixed="right"/.test(attrs)) return true;
  return false;
}

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

function collectReferenceFiles(dir) {
  const abs = join(ROOT, dir);
  const results = [];
  try {
    for (const name of readdirSync(abs)) {
      if (name === 'legacy-design-manual.md' || name === 'domain-language.md') continue;
      const full = join(abs, name);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results.push(...collectReferenceFiles(join(dir, name)));
      } else if (extname(name) === '.md') {
        results.push(full);
      }
    }
  } catch {
    // 目录不存在时静默跳过
  }
  return results;
}

function isExampleOrCodeLine(line) {
  return /```|`|<[^>]+>|\bExample\b|\bexamples\b|示例|例如|Examples?:|such as|e\.g\.|Good:|Bad:|Object examples|universal detail rule|base pattern|app route\/nav|^\s*\||^\s*[-*]\s/.test(line);
}

// active UI 规范必须写成“槽位/表面/状态”粒度，不能把单个业务字段写成全局强制规则。
const referenceFiles = collectReferenceFiles('ui-skill/freight-arco-ui/references');
const hardCodedDomainRule = /(必须|禁止|Required|Do not|Generate).*(业务单|订单详情|货物信息|提单信息|客户委托|航线订舱|箱型柜量|ETD|ETA|HBL|MBL|route|carrier|vessel|voyage|cargo)/i;
const allowedGranularityFiles = /module-patterns\.md|ai-generation-contract\.md|checklist\.md|modal\.md|form-rules\.md/;
for (const file of referenceFiles) {
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  if (allowedGranularityFiles.test(relPath)) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!hardCodedDomainRule.test(line)) continue;
    if (isExampleOrCodeLine(line) || isExampleOrCodeLine(lines[i - 1] ?? '') || isExampleOrCodeLine(lines[i - 2] ?? '')) continue;
    violations.push({
      rule: 'active UI 规范粒度过细：禁止把单个业务字段/模块名写成全局强规则，应改为槽位 + 表面 + token/state + 示例',
      file: relPath,
      line: i + 1,
      content: line.trim().slice(0, 160),
    });
  }
}

function getOpenDivClassStack(content, index) {
  const before = content.slice(0, index);
  const stack = [];
  for (const match of before.matchAll(/<\/div>|<div\b[^>]*>/g)) {
    const tag = match[0];
    if (tag.startsWith('</div')) {
      stack.pop();
      continue;
    }
    const classMatch = tag.match(/\bclass=(["'])(.*?)\1/);
    stack.push(classMatch ? classMatch[2] : '');
  }
  return stack;
}

function hasOpenAncestorClass(content, index, className) {
  return getOpenDivClassStack(content, index)
    .some((classAttr) => classAttr.split(/\s+/).includes(className));
}

// a-pagination 必须位于 table-card-cap 打开的结构内，而不是按文件名特批。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(/<a-pagination\b/g)) {
    if (hasOpenAncestorClass(content, match.index, 'table-card-cap')) continue;
    violations.push({
      rule: '禁止在非 table-card-cap 结构内裸写 <a-pagination>',
      file: relPath,
      line: getLineNumber(content, match.index),
      content: content.slice(match.index, content.indexOf('\n', match.index)).trim().slice(0, 120),
    });
  }
}

// 展开筛选区必须使用 filter-grid / 分组承载低频字段，禁止继续用 slim-row 做多行平铺。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(/class="filter-card__slim-row"/g)) {
    if (!hasOpenAncestorClass(content, match.index, 'filter-card__advanced-inner')) continue;
    violations.push({
      rule: '筛选展开区禁止使用 filter-card__slim-row 平铺，应用 filter-grid filter-grid--advanced 分组',
      file: relPath,
      line: getLineNumber(content, match.index),
      content: content.slice(match.index, content.indexOf('\n', match.index)).trim().slice(0, 140),
    });
  }
}

// S2 页内展开：须 filter-expand-link--panel + filter-grid--advanced；禁止 advanced-inner 内 slim-row。
// S3 或旧式灰墙：无 expand link 的 filter-card__advanced 仍禁止。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('zone-l2-filter-card')) continue;
  if (!content.includes('class="filter-card__advanced"')) continue;

  const isS2Expand =
    content.includes('filter-expand-link--panel') &&
    /filter-grid--advanced/.test(content) &&
    !/filter-card__advanced-inner[\s\S]*?filter-card__slim-row/.test(content);

  if (isS2Expand) continue;

  for (const match of content.matchAll(/class="filter-card__advanced"/g)) {
    violations.push({
      rule:
        '列表查询区禁止旧式 filter-card__advanced 灰墙；S2 须 filter-expand-link--panel + filter-grid--advanced；S3 用 query-filter-drawer',
      file: relPath,
      line: getLineNumber(content, match.index),
      content: content.slice(match.index, content.indexOf('\n', match.index)).trim().slice(0, 140),
    });
  }
}

// L1 页面模式切换必须使用 segmented control，不复用 scope/status 的 .stab chip。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('zone-l1-transport')) continue;
  const zonePattern = /<div\b[^>]*class=(["'])[^"']*\bzone-l1-transport\b[^"']*\1[^>]*>[\s\S]*?<\/div>/g;
  for (const match of content.matchAll(zonePattern)) {
    if (!/\bclass=(["'])[^"']*\bstab\b/.test(match[0])) continue;
    violations.push({
      rule: 'L1 页面模式切换应用 seg-btn，不能复用 scope/status 的 stab chip',
      file: relPath,
      line: getLineNumber(content, match.index),
      content: match[0].split('\n').slice(0, 3).join(' ').trim().slice(0, 140),
    });
  }
}

// 查询抽屉必须是分组筛选工作面，不能退化成白底平铺表单。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('query-filter-drawer')) continue;
  const required = [
    'query-filter-drawer__shell',
    'query-filter-drawer__body',
    'query-filter-drawer__group',
    'query-filter-drawer__group-head',
  ];
  for (const className of required) {
    if (content.includes(className)) continue;
    violations.push({
      rule: `查询筛选抽屉缺少 ${className}，应使用分组筛选工作面`,
      file: relPath,
      line: getLineNumber(content, content.indexOf('query-filter-drawer')),
      content: 'class="query-filter-drawer"',
    });
  }
  if (content.includes('query-filter-drawer__summary')) {
    violations.push({
      rule: '查询筛选抽屉禁止说明性 summary 文案，层级应由标题、分组、字段和底部动作表达',
      file: relPath,
      line: getLineNumber(content, content.indexOf('query-filter-drawer__summary')),
      content: content.slice(content.indexOf('query-filter-drawer__summary'), content.indexOf('\n', content.indexOf('query-filter-drawer__summary'))).trim().slice(0, 140),
    });
  }
}

// VXE 操作列必须使用 row-actions dock，避免 icon 直接漂浮在固定列背景上。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('title="操作"')) continue;
  const opColumnPattern = /<vxe-column\b[^>]*title="操作"[^>]*>[\s\S]*?<\/vxe-column>/g;
  const isWorkbenchList = content.includes('workbench-table');
  for (const match of content.matchAll(opColumnPattern)) {
    const block = match[0];
    if (!block.includes('class="row-actions"')) {
      violations.push({
        rule: 'VXE 操作列必须使用 row-actions dock 承载行级按钮',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: block.split('\n').slice(0, 3).join(' ').trim().slice(0, 140),
      });
      continue;
    }
    if (!isWorkbenchList) continue;
    const widthMatch = block.match(/\bwidth="(\d+)"/);
    if (widthMatch && Number(widthMatch[1]) > 88) {
      violations.push({
        rule: '列表操作列 width 不得超过 88（见 table.md Row Actions 矩阵）',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: block.split('\n')[0].trim().slice(0, 140),
      });
    }
    const directBtnCount = (block.match(/class="[^"]*\brow-action-btn\b(?![^"]*--more)[^"]*"/g) || []).length;
    const hasMoreMenu = block.includes('row-action-btn--more') || block.includes('action-menu--row');
    if (directBtnCount >= 3) {
      violations.push({
        rule: '列表操作列禁止 3 个及以上直出 icon；N≥3 须主操作 + ···（table.md Row Actions）',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: `直出 ${directBtnCount} 个 row-action-btn`,
      });
    }
    if (directBtnCount >= 2 && !hasMoreMenu && /status="danger"/.test(block)) {
      violations.push({
        rule: '列表操作列含危险动作时禁止双 icon 直出；危险项须收入 ···',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: block.split('\n').slice(0, 5).join(' ').trim().slice(0, 140),
      });
    }
    if (/class="[^"]*row-action-btn[^"]*"[^>]*status="danger"/.test(block) ||
        /status="danger"[^>]*class="[^"]*row-action-btn/.test(block)) {
      violations.push({
        rule: '列表主表操作列禁止直出 status="danger" 删除 icon；须进 action-menu--row + danger-opt',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: block.split('\n').slice(0, 6).join(' ').trim().slice(0, 140),
      });
    }
  }
}

// 工具栏下拉菜单必须使用有效 content-class 绑定 action-menu--toolbar，不能复用行操作菜单命名。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('toolbar-group') || !content.includes('<a-dropdown')) continue;
  const toolbarPattern = /<div\b[^>]*class=(["'])[^"']*\btoolbar-group\b[^"']*\1[^>]*>[\s\S]*?<\/div>/g;
  for (const match of content.matchAll(toolbarPattern)) {
    for (const dropdown of match[0].matchAll(/<a-dropdown\b[^>]*>/g)) {
      const tag = dropdown[0];
      if (/content-class=(["'])[^"']*\baction-menu\b[^"']*\baction-menu--toolbar\b[^"']*\1/.test(tag)) continue;
      violations.push({
        rule: '工具栏 dropdown 必须使用 content-class="action-menu action-menu--toolbar"，不能使用无效 popup-class',
        file: relPath,
        line: getLineNumber(content, match.index + dropdown.index),
        content: tag.trim().slice(0, 140),
      });
    }
  }
}

// 详情吸底 footer 的 dropdown 必须使用 footer 语义菜单，避免套用 toolbar 菜单导致弹层过宽、脱离底部操作区。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('detail-drawer-footer') || !content.includes('<a-dropdown')) continue;
  const footerPattern = /<div\b[^>]*class=(["'])[^"']*\bdetail-drawer-footer\b[^"']*\1[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
  for (const match of content.matchAll(footerPattern)) {
    for (const dropdown of match[0].matchAll(/<a-dropdown\b[^>]*>/g)) {
      const tag = dropdown[0];
      if (/content-class=(["'])[^"']*\baction-menu\b[^"']*\baction-menu--footer\b[^"']*\1/.test(tag)) continue;
      violations.push({
        rule: '详情吸底 footer 的 dropdown 必须使用 content-class="action-menu action-menu--footer"，不能复用 toolbar 菜单样式',
        file: relPath,
        line: getLineNumber(content, match.index + dropdown.index),
        content: tag.trim().slice(0, 140),
      });
    }
  }
}

// 详情小模块禁止使用连续裸 label 形成左侧蓝竖线噪声；新代码应使用 form-subgroup block。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('form-subgroup-label')) continue;
  for (const match of content.matchAll(/class=(["'])[^"']*\bform-subgroup-label\b[^"']*\1/g)) {
    violations.push({
      rule: '详情小模块禁止使用裸 form-subgroup-label；应使用 form-subgroup + form-subgroup__head + detail-form-grid',
      file: relPath,
      line: getLineNumber(content, match.index),
      content: content.slice(match.index, content.indexOf('\n', match.index)).trim().slice(0, 140),
    });
  }
}

// 下拉菜单项默认纯文本，禁止为了装饰给每个业务动作强配图标。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('<a-doption') || !content.includes('#icon')) continue;
  const optionPattern = /<a-doption\b[\s\S]*?<\/a-doption>/g;
  for (const match of content.matchAll(optionPattern)) {
    if (!match[0].includes('#icon')) continue;
    violations.push({
      rule: '下拉菜单项默认文本优先，a-doption 禁止强配图标；只有触发按钮/行内图标按钮承担图标语义',
      file: relPath,
      line: getLineNumber(content, match.index),
      content: match[0].split('\n').slice(0, 3).join(' ').trim().slice(0, 140),
    });
  }
}

// 复杂下单详情禁止大蓝箭头步骤和顶层 KPI 报表条，避免详情页退化成流程/KPI 看板。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('detail-drawer')) continue;
  const arrowStepIndex = content.search(/<a-steps\b[^>]*\btype=(["'])arrow\1/);
  if (arrowStepIndex >= 0) {
    violations.push({
      rule: '复杂订单详情禁止 a-steps type="arrow"，应使用轻量 dds-milestone-bar',
      file: relPath,
      line: getLineNumber(content, arrowStepIndex),
      content: content.slice(arrowStepIndex, content.indexOf('\n', arrowStepIndex)).trim().slice(0, 140),
    });
  }
  if (content.includes('detail-overview-kpi')) {
    violations.push({
      rule: '复杂订单详情禁止顶层 detail-overview-kpi 报表条，货量/费用统计应进入所属模块 summary',
      file: relPath,
      line: getLineNumber(content, content.indexOf('detail-overview-kpi')),
      content: 'detail-overview-kpi',
    });
  }
}

// 父子嵌套 repeated module 不能只画大白框：必须具备 summary、child identity、child metrics、child body、child-owned table。
// 这类结构是视觉质量门槛，仅查结构槽位，不绑定具体字段名。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('detail-module__subitem')) continue;
  const repeatedModuleRules = [
    {
      className: 'detail-module-summary--inline',
      rule: '父子嵌套 repeated module 必须有模块 summary 行，统计不能散落成宽屏报表空白',
    },
    {
      className: 'detail-cargo-block__meta',
      rule: '父子嵌套 repeated module 的 child head 必须有 identity/meta 槽位，不能只有孤立标题',
    },
    {
      className: 'detail-data-stats',
      rule: '父子嵌套 repeated module 的 child head 必须有紧凑 metrics chips，不能把子项统计铺成松散大栏',
    },
    {
      className: 'detail-cargo-block__body',
      rule: '父子嵌套 repeated module 必须有 child body 承载子项字段和明细，不能把内层卡片直接堆在父模块下',
    },
    {
      className: 'detail-child-pane--compact',
      rule: '父子嵌套 repeated module 的内部 pane 必须使用紧凑 pane，避免卡片套卡片套表格',
    },
    {
      className: 'detail-child-pane__table',
      rule: '父子嵌套 repeated module 的 line table 必须归属到 child-owned table 容器',
    },
  ];
  for (const item of repeatedModuleRules) {
    if (content.includes(item.className)) continue;
    violations.push({
      rule: item.rule,
      file: relPath,
      line: getLineNumber(content, content.indexOf('detail-module__subitem')),
      content: `missing ${item.className}`,
    });
  }
}

// VXE 表格行高与结构列宽必须显式匹配设计 token：主列表 36，详情按职责分 38/34/32，序号列 52。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  const blocks = content.match(/<vxe-table[\s\S]*?<\/vxe-table>/g) || [];
  for (const block of blocks) {
    const blockIndex = content.indexOf(block);
    const firstLine = block.split('\n').slice(0, 10).join(' ');
    if (/class=(["'])[^"']*\bworkbench-table\b[^"']*\1/.test(firstLine) && !/\bborder=(["'])none\1/.test(block)) {
      violations.push({
        rule: 'workbench-table 必须使用 border="none"（无全网格线，仅弱横线分隔行）',
        file: relPath,
        line: getLineNumber(content, blockIndex),
        content: firstLine.trim().slice(0, 140),
      });
    }
    if (/\bdetail-mini-vxe\b/.test(firstLine) && !/\bborder=(["'])none\1/.test(block)) {
      violations.push({
        rule: 'detail-mini-vxe 必须使用 border="none"（与列表表同一边框策略）',
        file: relPath,
        line: getLineNumber(content, blockIndex),
        content: firstLine.trim().slice(0, 140),
      });
    }
    if (/class=(["'])[^"']*\bworkbench-table\b[^"']*\1/.test(firstLine) && !/:row-config=(["'])[\s\S]*?height:\s*36[\s\S]*?\1/.test(block)) {
      violations.push({
        rule: 'workbench-table 必须显式设置 row-config.height = 36，避免 VXE small 默认 40px 泄漏',
        file: relPath,
        line: getLineNumber(content, blockIndex),
        content: firstLine.trim().slice(0, 140),
      });
    }
    if (/\bdetail-mini-vxe\b/.test(firstLine) && !/\bdetail-mini-vxe--(editable|readonly|summary)\b/.test(firstLine)) {
      violations.push({
        rule: 'detail-mini-vxe 必须声明密度 modifier：editable / readonly / summary',
        file: relPath,
        line: getLineNumber(content, blockIndex),
        content: firstLine.trim().slice(0, 140),
      });
    }
    const detailDensity = firstLine.includes('detail-mini-vxe--editable')
      ? { height: 38, rule: 'detail-mini-vxe--editable 必须显式设置 row-config.height = 38，承载 28px 表单控件' }
      : firstLine.includes('detail-mini-vxe--readonly')
        ? { height: 34, rule: 'detail-mini-vxe--readonly 必须显式设置 row-config.height = 34，只读资料/状态行保持紧凑' }
        : firstLine.includes('detail-mini-vxe--summary')
          ? { height: 32, rule: 'detail-mini-vxe--summary 必须显式设置 row-config.height = 32，摘要小表保持紧凑' }
          : null;
    if (detailDensity && !new RegExp(`row-config=(["'])\\{[^"']*height:\\s*${detailDensity.height}`).test(firstLine)) {
      violations.push({
        rule: detailDensity.rule,
        file: relPath,
        line: getLineNumber(content, blockIndex),
        content: firstLine.trim().slice(0, 140),
      });
    }
    for (const column of block.matchAll(/<vxe-column\b[^>]*\btype=(["'])seq\1[^>]*>/g)) {
      const tag = column[0];
      if (/\bwidth=(["'])52\1/.test(tag)) continue;
      violations.push({
        rule: 'VXE 序号列统一使用 width="52"，避免主表/详情行号宽度漂移',
        file: relPath,
        line: getLineNumber(content, blockIndex + column.index),
        content: tag.trim().slice(0, 140),
      });
    }
  }
}

for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('<vxe-column')) continue;
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes('<vxe-column')) continue;
    const tag = line.trim();
    if (!/(?<![a-z-])width="/.test(tag)) continue;
    if (isStructuralVxeColumn(tag)) continue;
    violations.push({
      rule: 'VXE 业务列必须用 min-width，禁止 width（仅 checkbox/序号/操作列可用 width）',
      file: relPath,
      line: i + 1,
      content: tag.slice(0, 140),
    });
  }
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
