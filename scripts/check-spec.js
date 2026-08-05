/**
 * OHL 规范自动检查脚本
 * 用法: node scripts/check-spec.js
 * 检查页面和组件下的 .vue / .ts / .css 文件，并调用 arco-vxe-ui skill validator
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, extname, join, relative, resolve, sep } from 'path';
import ts from 'typescript';
import { validateUiSkill } from '../.agents/skills/arco-vxe-ui/scripts/validate-skill.mjs';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const SCAN_DIRS = ['src/views', 'src/components', 'src/layouts'];
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
    desc: '禁止直接使用 <a-upload> — 业务上传必须走已实现的共享上传契约',
    pattern: /<a-upload[\s>]/,
    fileFilter: /\.vue$/,
  },
  {
    desc: 'Action menu options must execute a declared interaction; remove placeholder doptions',
    pattern: /<a-doption\b(?![^>]*@click)[^>]*>/,
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

  {
    desc: '禁止业务页直接用 toISOString 生成本地审计时间（应用 formatLocalMinute）',
    pattern: /new Date\(\)\.toISOString\(\)\.slice\(0,\s*16\)/,
    fileFilter: /src[\\/]views[\\/].*\.(vue|ts)$/,
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
    desc: '下拉菜单分隔线禁止内联 style（使用 Arco Divider 默认间距）',
    pattern: /<a-divider\b[^>]*\bstyle=/,
    fileFilter: /\.vue$/,
  },
  {
    desc: '下拉触发按钮禁止内联 icon margin（使用 Arco Space/gap 或局部布局类统一间距）',
    pattern: /<icon-down\b[^>]*\bstyle=/,
    fileFilter: /\.vue$/,
  },
  {
    desc: 'a-dropdown 禁止使用无效 popup-class（Arco Dropdown 应使用 content-class）',
    pattern: /<a-dropdown\b[^>]*\bpopup-class=/,
    fileFilter: /\.vue$/,
  },
  {
    desc: '禁止在 a-dropdown 内嵌 a-popconfirm（菜单销毁会导致确认浮层失效；使用独立 Modal）',
    pattern: /<a-dropdown\b(?:(?!<\/a-dropdown>)[\s\S])*<a-popconfirm\b(?:(?!<\/a-dropdown>)[\s\S])*<\/a-dropdown>/,
    fileFilter: /\.vue$/,
  },
  {
    desc: '含表单的 a-modal 禁止用 @ok 提交（校验失败仍会关闭；使用 :on-before-ok 并返回 false）',
    pattern: /<a-modal\b(?=[^>]*@ok=)[^>]*>(?:(?!<\/a-modal>)[\s\S])*<a-form\b(?:(?!<\/a-modal>)[\s\S])*<\/a-modal>/,
    fileFilter: /\.vue$/,
  },
  {
    desc: 'IconPark 图标禁止使用 filled/two-tone/multi-color 主题，统一 outline',
    pattern: /\btheme="(filled|two-tone|multi-color)"/,
    fileFilter: /\.vue$/,
  },
  {
    desc: '业务页面禁止 scoped/deep 重绘 Arco Drawer chrome',
    pattern: /:deep\(\.arco-drawer-(header|title|body|footer)\)/,
    fileFilter: /\.vue$/,
  },
  {
    desc: '禁止 VXE 使用 height="auto"（抽屉/详情会形成父子高度反馈；短表省略 height，长表声明唯一有界滚动区）',
    pattern: /height="auto"/,
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
const toRelativePath = (file) => relative(ROOT, file).replace(/\\/g, '/');

function getObjectProperty(objectNode, name) {
  return objectNode?.properties.find((property) => ts.isPropertyAssignment(property)
    && ((ts.isIdentifier(property.name) && property.name.text === name)
      || (ts.isStringLiteral(property.name) && property.name.text === name)));
}

function getObjectLiteralProperty(objectNode, name) {
  const property = getObjectProperty(objectNode, name);
  return property && ts.isObjectLiteralExpression(property.initializer) ? property.initializer : undefined;
}

function getStringProperty(objectNode, name) {
  const property = getObjectProperty(objectNode, name);
  return property && ts.isStringLiteralLike(property.initializer) ? property.initializer.text : undefined;
}

function getStringArrayProperty(objectNode, name) {
  const property = getObjectProperty(objectNode, name);
  if (!property || !ts.isArrayLiteralExpression(property.initializer)) return undefined;
  return property.initializer.elements
    .filter(ts.isStringLiteralLike)
    .map((element) => element.text);
}

function getObjectArrayProperty(objectNode, name) {
  const property = getObjectProperty(objectNode, name);
  if (!property || !ts.isArrayLiteralExpression(property.initializer)) return undefined;
  return property.initializer.elements.filter(ts.isObjectLiteralExpression);
}

function findCallObject(sourceFile, helperName) {
  let result;
  const visit = (node) => {
    if (result) return;
    if (ts.isCallExpression(node)
      && ts.isIdentifier(node.expression)
      && node.expression.text === helperName
      && node.arguments[0]
      && ts.isObjectLiteralExpression(node.arguments[0])) {
      result = node.arguments[0];
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return result;
}

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

for (const file of files.filter((file) => file.endsWith('.vue'))) {
  const source = readFileSync(file, 'utf8');
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  for (const match of source.matchAll(/<a-form\b[^>]*\blayout=["']vertical["'][^>]*>/g)) {
    if (/:label-col-style=/.test(match[0])) continue;
    violations.push({
      rule: '垂直 Arco Form 必须使用共享 label-col-style，统一 label 到控件的语义间距',
      file: relPath,
      line: source.slice(0, match.index).split('\n').length,
      content: match[0].replace(/\s+/g, ' ').slice(0, 120),
    });
  }
  for (const match of source.matchAll(/<div\b[^>]*data-workbench-scope[^>]*>[\s\S]*?<a-radio-group\b([^>]*)>/g)) {
    if (/\baria-label=/.test(match[1])) continue;
    violations.push({
      rule: '工作台范围选择即使省略可见组名，也必须保留业务 aria-label',
      file: relPath,
      line: source.slice(0, match.index).split('\n').length,
      content: match[0].replace(/\s+/g, ' ').slice(0, 120),
    });
  }
  const hasAdvancedFilterDrawer = /<a-drawer\b[\s\S]*?data-ui-surface=["']advanced-filter(?:-wide)?["']/.test(source);
  for (const ruleMatch of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = ruleMatch[1];
    const declarations = ruleMatch[2];
    const line = source.slice(0, ruleMatch.index).split('\n').length;
    const isOverlayFooter = /(drawer|filter)[^{}]*(footer)|footer[^{}]*(drawer|filter)/i.test(selector);
    if (isOverlayFooter
      && /width\s*:\s*100%/.test(declarations)
      && /padding(?:-inline)?\s*:/.test(declarations)
      && !/box-sizing\s*:\s*border-box/.test(declarations)) {
      violations.push({
        rule: 'Overlay footer 使用 width:100% 和水平 padding 时必须 border-box，禁止制造固有横向溢出',
        file: relPath,
        line,
        content: selector.trim().replace(/\s+/g, ' ').slice(0, 120),
      });
    }
    if (hasAdvancedFilterDrawer
      && /(drawer|filter)/i.test(selector)
      && /height\s*:\s*100%/.test(declarations)
      && /overflow-y\s*:\s*(auto|scroll)/.test(declarations)) {
      violations.push({
        rule: '标准高级筛选禁止页面自建 height:100% + overflow-y 嵌套滚动容器',
        file: relPath,
        line,
        content: selector.trim().replace(/\s+/g, ' ').slice(0, 120),
      });
    }
  }
  for (const match of source.matchAll(/<a-drawer\b[\s\S]*?>/g)) {
    const tag = match[0];
    const isLegacyAdvanced = /class=["'][^"']*query-filter-drawer/.test(tag);
    const isAdvanced = /data-ui-surface=["']advanced-filter(?:-wide)?["']/.test(tag);
    if (!isAdvanced && !isLegacyAdvanced) continue;

    const line = source.slice(0, match.index).split('\n').length;
    if (!isAdvanced) {
      violations.push({
        rule: '高级筛选 Drawer 必须提供 data-ui-surface 审计证据，禁止仅靠历史样式类识别',
        file: relPath,
        line,
        content: tag.replace(/\s+/g, ' ').slice(0, 120),
      });
    }
    if (/\bplacement=["']top["']/.test(tag)
      || !/\b(?:width|:width)=["'][^"']*min\([^"']*100vw/.test(tag)) {
      violations.push({
        rule: '高级筛选 Drawer 必须从右侧打开，并由 width prop 直接声明带 viewport inset 的响应式 min(...)',
        file: relPath,
        line,
        content: tag.replace(/\s+/g, ' ').slice(0, 120),
      });
    }
  }
}

const globalCss = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');
const packageJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const mainTs = readFileSync(join(ROOT, 'src/main.ts'), 'utf8');
const routerFiles = collectFiles('src/router').filter((file) => file.endsWith('.ts'));
const routedViewFiles = new Set();
for (const routerFile of routerFiles) {
  const source = readFileSync(routerFile, 'utf8');
  for (const match of source.matchAll(/component\s*:\s*\(\)\s*=>\s*import\((['"])([^'"]+\.vue)\1\)/g)) {
    const routeView = resolve(dirname(routerFile), match[2]);
    if (toRelativePath(routeView).startsWith('src/views/')) routedViewFiles.add(routeView);
  }
}

const pageSpecFiles = files.filter((file) => /[\\/]pageSpec\.ts$/.test(file));
const featureContractFiles = files.filter((file) => /[\\/]featureContracts\.ts$/.test(file));
const featureContractIds = new Map();
const pageSpecIds = new Map();
const skillReferenceNames = new Set(
  readdirSync(join(ROOT, '.agents/skills/arco-vxe-ui/references'))
    .filter((name) => name.endsWith('.md')),
);

if (!/^[~^]?0\.0\.58$/.test(packageJson.dependencies?.['@arco-themes/vue-gi-demo'] || '')) {
  violations.push({
    rule: '项目 dependencies 必须声明 @arco-themes/vue-gi-demo 0.0.58 兼容版本作为唯一 Arco 主题 baseline',
    file: 'package.json',
    line: 1,
    content: 'missing or unexpected @arco-themes/vue-gi-demo dependency',
  });
}
if (!packageJson.dependencies?.['@arco-design/web-vue']) {
  violations.push({
    rule: '项目 dependencies 必须声明 @arco-design/web-vue；组件实现版本需满足 GI 主题 peer dependency',
    file: 'package.json',
    line: 1,
    content: 'missing @arco-design/web-vue dependency',
  });
}
const giThemeIndex = mainTs.indexOf("@arco-themes/vue-gi-demo/css/arco.css");
const globalCssIndex = mainTs.indexOf("./styles/global.css");
if (giThemeIndex < 0 || globalCssIndex < giThemeIndex) {
  violations.push({
    rule: '主题导入顺序必须是 GI baseline → global.css',
    file: 'src/main.ts',
    line: 1,
    content: 'invalid theme import order',
  });
}
if (mainTs.includes('@arco-design/web-vue/dist/arco.css')) {
  violations.push({
    rule: '使用 GI 主题时禁止同时导入 Arco 默认 CSS',
    file: 'src/main.ts',
    line: 1,
    content: 'duplicate Arco baseline stylesheet',
  });
}
if (mainTs.includes('./styles/theme.css') || existsSync(join(ROOT, 'src/styles/theme.css'))) {
  violations.push({
    rule: '当前项目由 GI 单独拥有 palette，禁止保留或导入 src/styles/theme.css 适配层',
    file: 'src/styles/theme.css',
    line: 1,
    content: 'project theme adapter detected',
  });
}
const globalVxeSetup = mainTs.match(/VXETable\.setup\(\{([\s\S]*?)\}\);/)?.[1] || '';
for (const [setting, pattern] of [
  ['border: true', /\bborder\s*:\s*true\b/],
  ['stripe: true', /\bstripe\s*:\s*true\b/],
  ["size: 'mini'", /\bsize\s*:\s*['"]mini['"]/],
]) {
  if (pattern.test(globalVxeSetup)) continue;
  violations.push({
    rule: 'VXE 全局工作台基线必须包含 border、stripe 与 mini；详情行带仅允许按 typed rowBanding 使用公共属性覆盖',
    file: 'src/main.ts',
    line: 1,
    content: `missing ${setting}`,
  });
}
const officialTokensInGlobal = globalCss.match(/^\s*--(?:primary-\d+|color-(?:bg|fill|text|border)-\d+)\s*:/gm) || [];
if (officialTokensInGlobal.length) {
  violations.push({
    rule: 'Arco 官方主题变量由 GI 单独拥有，global.css 仅保留直接 --dense-* 语义 alias',
    file: 'src/styles/global.css',
    line: 1,
    content: officialTokensInGlobal.slice(0, 3).join(', '),
  });
}
const rootBlocks = [...globalCss.matchAll(/:root\s*\{([\s\S]*?)\}/g)].map((match) => match[1]).join('\n');
const bodyThemeAliases = globalCss.match(/(?:^|\n)body\s*\{([\s\S]*?)\}/)?.[1] || '';
const bodyScopedThemeRefInRoot = rootBlocks.match(/--[\w-]+\s*:[^;]*var\(--(?:(?:primary|warning|success|danger)-\d+|color-(?:bg|fill|text|border)-\d+|border-radius-[\w-]+)\)/g) || [];
if (bodyScopedThemeRefInRoot.length) {
  violations.push({
    rule: 'GI 官方主题变量在 body 生效，依赖它们的 --dense-* alias 禁止声明在 :root',
    file: 'src/styles/global.css',
    line: 1,
    content: bodyScopedThemeRefInRoot.slice(0, 3).join(', '),
  });
}
for (const alias of ['--dense-primary-6:', '--dense-card-border:', '--dense-radius:']) {
  if (bodyThemeAliases.includes(alias)) continue;
  violations.push({
    rule: 'theme-dependent semantic aliases 必须声明在 body，确保 GI token 可计算',
    file: 'src/styles/global.css',
    line: 1,
    content: `missing body-scoped ${alias}`,
  });
}
if (existsSync(join(ROOT, 'CLAUDE.md')) || existsSync(join(ROOT, '.claude'))) {
  violations.push({
    rule: '项目已停用 Claude，禁止保留 CLAUDE.md 或 .claude 目录',
    file: '.',
    line: 1,
    content: 'Claude configuration detected',
  });
}
for (const error of validateUiSkill()) {
  violations.push({
    rule: 'arco-vxe-ui skill 必须保持单一权威、契约可追溯和无冲突生成链',
    file: '.agents/skills/arco-vxe-ui',
    line: 1,
    content: error,
  });
}
if (existsSync(join(ROOT, '.cursor/rules/ui-spec.mdc'))) {
  violations.push({
    rule: '禁止恢复旧 ui-spec.mdc；完整 UI 规则只维护在 canonical skill，Cursor rule 仅保留流程门禁',
    file: '.cursor/rules/ui-spec.mdc',
    line: 1,
    content: 'duplicate always-on UI specification detected',
  });
}
for (const routeView of routedViewFiles) {
  const specFile = join(dirname(routeView), 'pageSpec.ts');
  if (existsSync(specFile)) continue;
  violations.push({
    rule: '每个 src/views 业务路由必须同目录提供 typed pageSpec.ts',
    file: toRelativePath(routeView),
    line: 1,
    content: `missing ${toRelativePath(specFile)}`,
  });
}

for (const contractFile of featureContractFiles) {
  const relPath = toRelativePath(contractFile);
  const source = readFileSync(contractFile, 'utf8');
  const sourceFile = ts.createSourceFile(contractFile, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  if (!source.includes('defineFeatureContracts')) {
    violations.push({
      rule: '项目功能契约文件必须通过 defineFeatureContracts 使用共享完整契约类型',
      file: relPath,
      line: 1,
      content: 'missing defineFeatureContracts',
    });
  }

  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const id = getStringProperty(node, 'id');
      if (id) {
        const requiredFields = [
          'actorRoles',
          'visibleWhen',
          'enabledWhen',
          'request',
          'successResult',
          'errorResult',
          'refreshScope',
        ];
        const missing = requiredFields.filter((field) => !getObjectProperty(node, field));
        if (missing.length) {
          violations.push({
            rule: '每个业务交互必须声明最小完整功能契约',
            file: relPath,
            line: source.slice(0, node.pos).split('\n').length,
            content: `${id}: missing ${missing.join(', ')}`,
          });
        }
        if (featureContractIds.has(id)) {
          violations.push({
            rule: '功能契约 id 必须在项目内唯一',
            file: relPath,
            line: source.slice(0, node.pos).split('\n').length,
            content: `${id} duplicates ${featureContractIds.get(id)}`,
          });
        } else {
          featureContractIds.set(id, relPath);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

const pesdpDimensions = ['professional', 'efficient', 'structured', 'dense', 'premium'];
for (const specFile of pageSpecFiles) {
  const relPath = toRelativePath(specFile);
  const source = readFileSync(specFile, 'utf8');
  const sourceFile = ts.createSourceFile(specFile, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const spec = findCallObject(sourceFile, 'definePesdpPageSpec');
  if (!spec) {
    violations.push({
      rule: 'pageSpec.ts 必须通过 definePesdpPageSpec 声明 typed 页面契约',
      file: relPath,
      line: 1,
      content: 'missing definePesdpPageSpec({...})',
    });
    continue;
  }

  const routeView = [...routedViewFiles].find((file) => dirname(file) === dirname(specFile));
  if (!routeView) {
    violations.push({
      rule: 'pageSpec.ts 必须绑定同目录真实业务路由，禁止孤立规范自证',
      file: relPath,
      line: 1,
      content: 'no colocated routed Vue page',
    });
  }

  const pageId = getStringProperty(spec, 'id');
  if (!pageId) {
    violations.push({
      rule: '每个 typed pageSpec.ts 必须声明稳定页面 id',
      file: relPath,
      line: 1,
      content: 'missing page id',
    });
  } else if (pageSpecIds.has(pageId)) {
    violations.push({
      rule: 'pageSpec id 必须在项目内唯一',
      file: relPath,
      line: 1,
      content: `${pageId} duplicates ${pageSpecIds.get(pageId)}`,
    });
  } else {
    pageSpecIds.set(pageId, relPath);
  }
  if (pageId && routeView) {
    const routeSource = readFileSync(routeView, 'utf8');
    const binding = new RegExp(`data-pesdp-page=["']${pageId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`);
    if (!binding.test(routeSource)) {
      violations.push({
        rule: '真实业务路由必须用 pageSpec id 声明 data-pesdp-page 绑定',
        file: toRelativePath(routeView),
        line: 1,
        content: `missing data-pesdp-page="${pageId}"`,
      });
    }
  }

  const pesdp = getObjectLiteralProperty(spec, 'pesdp');
  for (const dimension of pesdpDimensions) {
    const trace = getObjectLiteralProperty(pesdp, dimension);
    if ((getStringArrayProperty(trace, 'decisions')?.length ?? 0) > 0
      && (getStringArrayProperty(trace, 'acceptance')?.length ?? 0) > 0) continue;
    violations.push({
      rule: '每个 typed pageSpec.ts 必须为 PESDP 五个维度声明非空决策与可测验收条件',
      file: relPath,
      line: 1,
      content: `missing trace for ${dimension}`,
    });
  }

  const accessibility = getObjectLiteralProperty(spec, 'accessibility');
  if ((getStringArrayProperty(accessibility, 'keyboard')?.length ?? 0) === 0
    || (getStringArrayProperty(accessibility, 'naming')?.length ?? 0) === 0
    || getStringProperty(accessibility, 'zoom') !== '200%') {
    violations.push({
      rule: '每个 typed pageSpec.ts 必须声明键盘、可访问名称和 200% 缩放验收',
      file: relPath,
      line: 1,
      content: 'incomplete accessibility contract',
    });
  }

  const states = getStringArrayProperty(spec, 'states') ?? [];
  const missingBaseStates = ['loading', 'empty', 'no-permission'].filter((state) => !states.includes(state));
  if (missingBaseStates.length || !states.some((state) => /error|failure/.test(state))) {
    violations.push({
      rule: '每个 typed pageSpec.ts 必须覆盖 loading、empty、no-permission 和至少一种可恢复失败状态',
      file: relPath,
      line: 1,
      content: `missing=${missingBaseStates.join(',') || '-'}, recoverable-failure=${states.some((state) => /error|failure/.test(state))}`,
    });
  }

  const authorities = getStringArrayProperty(spec, 'authorities') ?? [];
  const missingAuthorities = authorities.filter((name) => !skillReferenceNames.has(name));
  if (!authorities.length || missingAuthorities.length) {
    violations.push({
      rule: 'pageSpec authorities 必须引用 arco-vxe-ui 中真实存在的项目级规范',
      file: relPath,
      line: 1,
      content: missingAuthorities.length ? `missing ${missingAuthorities.join(', ')}` : 'empty authorities',
    });
  }

  if (/\bgoal\s*:|\bevidence\s*:/.test(source)) {
    violations.push({
      rule: 'typed pageSpec.ts 只能声明 target + acceptance，禁止在源码中自证质量',
      file: relPath,
      line: 1,
      content: 'invalid page quality declaration',
    });
  }
  for (const match of source.matchAll(/<a-button\b[^>]*>[\s\S]*?<\/a-button>/g)) {
    const buttonBody = match[0].replace(/^<a-button\b[^>]*>/, '').replace(/<\/a-button>$/, '');
    if (!/批量/.test(buttonBody) || !/\{\{\s*(?:selectedCount|selectedRows\.length)\s*\}\}/.test(buttonBody)) continue;
    violations.push({
      rule: '批量操作按钮只表达动作，禁止重复拼接已选数量；已选数量与清空由相邻选择上下文唯一承载',
      file: relPath,
      line: source.slice(0, match.index).split('\n').length,
      content: match[0].replace(/\s+/g, ' ').slice(0, 120),
    });
  }

  const archetype = getStringProperty(spec, 'archetype');
  const input = getObjectLiteralProperty(spec, 'input');
  const inputPath = getStringProperty(input, 'path');
  const inputArtifacts = getStringArrayProperty(input, 'artifacts');
  const unresolvedBusinessDecisions = getStringArrayProperty(input, 'unresolvedBusinessDecisions');
  const inputRecommendations = getStringArrayProperty(input, 'recommendations');
  if (!['artifact', 'requirement'].includes(inputPath)
    || inputArtifacts === undefined
    || unresolvedBusinessDecisions === undefined
    || inputRecommendations === undefined
    || (inputPath === 'artifact' && inputArtifacts.length === 0)
    || (unresolvedBusinessDecisions.length > 0 && inputRecommendations.length === 0)) {
    violations.push({
      rule: 'pageSpec 必须记录 artifact/requirement 输入路径、证据、未决业务问题和建议默认值',
      file: relPath,
      line: 1,
      content: `input=${inputPath ?? '(empty)'}, artifacts=${inputArtifacts?.length ?? '-'}, unresolved=${unresolvedBusinessDecisions?.length ?? '-'}, recommendations=${inputRecommendations?.length ?? '-'}`,
    });
  }
  const list = getObjectLiteralProperty(spec, 'list');
  const listProfile = getStringProperty(list, 'profile');
  const listArchetypeProfiles = {
    'list-query': 'simple-query',
    'list-management': 'management',
    'list-workbench': 'operations-workbench',
  };
  const expectedListProfile = listArchetypeProfiles[archetype];
  if (expectedListProfile && !list) {
    violations.push({
      rule: '列表 pageSpec 必须声明 list 原型，明确命令区、表格顶栏、选择、范围与队列行为',
      file: relPath,
      line: 1,
      content: `missing list for ${archetype}`,
    });
  }
  if (!expectedListProfile && list) {
    violations.push({
      rule: '非列表 pageSpec 不得声明 list 原型，避免把列表行为复制到详情或表单',
      file: relPath,
      line: 1,
      content: `unexpected list for ${archetype ?? '(empty)'}`,
    });
  }
  if (list) {
    const frame = getStringProperty(list, 'frame');
    const commandSurface = getStringProperty(list, 'commandSurface');
    const tableTop = getStringProperty(list, 'tableTop');
    const selection = getStringProperty(list, 'selection');
    const workScope = getStringProperty(list, 'workScope');
    const statusQueues = getStringProperty(list, 'statusQueues');
    const views = getObjectLiteralProperty(list, 'views');
    const pageMode = getStringProperty(views, 'pageMode');
    const pageModeCount = Number(getObjectProperty(views, 'pageModeCount')?.initializer?.text);
    const workflowState = getStringProperty(views, 'workflowState');
    const workflowStateCount = Number(getObjectProperty(views, 'workflowStateCount')?.initializer?.text);
    const workflowStatePlacement = getStringProperty(views, 'workflowStatePlacement');
    const workflowStateOverflow = getStringProperty(views, 'workflowStateOverflow');
    if (frame !== 'standard-list-v1') {
      violations.push({
        rule: '列表 pageSpec 必须使用 standard-list-v1 共享 UI/UX 框架，禁止页面另起一套列表风格',
        file: relPath,
        line: 1,
        content: `frame=${frame ?? '(empty)'}`,
      });
    }
    if (listProfile !== expectedListProfile) {
      violations.push({
        rule: '列表 archetype 与 list profile 必须一一对应，禁止用工作台模板伪装轻量查询页',
        file: relPath,
        line: 1,
        content: `archetype=${archetype}, profile=${listProfile ?? '(empty)'}`,
      });
    }
    const invalidSimpleQuery = listProfile === 'simple-query' && (
      commandSurface === 'workbench'
      || tableTop === 'workbench-toolbar'
      || selection !== 'none'
      || workScope !== 'none'
      || statusQueues !== 'none'
    );
    const invalidManagement = listProfile === 'management' && (
      commandSurface === 'workbench'
      || tableTop === 'workbench-toolbar'
      || workScope !== 'none'
      || statusQueues !== 'none'
    );
    const invalidWorkbench = listProfile === 'operations-workbench' && (
      commandSurface !== 'workbench' || tableTop !== 'workbench-toolbar'
    );
    if (invalidSimpleQuery || invalidManagement || invalidWorkbench) {
      violations.push({
        rule: '列表原型与其命令、表格顶栏、选择、范围和状态队列边界不一致',
        file: relPath,
        line: 1,
        content: `profile=${listProfile}; command=${commandSurface}; top=${tableTop}; selection=${selection}; scope=${workScope}; queues=${statusQueues}`,
      });
    }
    const invalidPageMode = !Number.isInteger(pageModeCount)
      || (pageMode === 'none' && pageModeCount !== 0)
      || (pageMode !== 'none' && pageModeCount < 2)
      || ((pageMode === 'tabs' || pageMode === 'segmented') && pageModeCount > 5);
    const invalidWorkflowState = !Number.isInteger(workflowStateCount)
      || (workflowState === 'none' && (workflowStateCount !== 0 || workflowStatePlacement !== 'none' || workflowStateOverflow !== 'none'))
      || (workflowState !== 'none' && (workflowStateCount < 2 || workflowStatePlacement === 'none'))
      || (workflowState === 'line-tabs' && workflowStateCount > 12)
      || (workflowState === 'line-tabs' && workflowStateCount > 8 && workflowStateOverflow !== 'local-scroll')
      || (workflowState === 'line-tabs' && workflowStateCount <= 8 && workflowStateOverflow !== 'none')
      || (workflowState === 'select' && workflowStateOverflow !== 'none')
      || (statusQueues === 'none' && workflowState !== 'none')
      || (statusQueues !== 'none' && workflowState === 'none');
    if (invalidPageMode || invalidWorkflowState) {
      violations.push({
        rule: '列表 pageSpec 必须区分页面模式与工作流状态选择，并声明状态控件、数量、层级和溢出策略',
        file: relPath,
        line: 1,
        content: `mode=${pageMode}/${pageModeCount}; workflowState=${workflowState}/${workflowStateCount}/${workflowStatePlacement}/${workflowStateOverflow}; queues=${statusQueues}`,
      });
    }
  }

  const detail = getObjectLiteralProperty(spec, 'detail');
  const detailMode = getStringProperty(detail, 'mode');
  const detailModules = getObjectArrayProperty(detail, 'modules');
  if (detailMode === 'none' && detailModules !== undefined) {
    violations.push({
      rule: '无详情页面不得声明模块清单，避免把隐藏详情当成已实现能力',
      file: relPath,
      line: 1,
      content: 'detail.mode=none with modules',
    });
  }
  if (detailMode && detailMode !== 'none') {
    const workspace = getObjectLiteralProperty(detail, 'workspace');
    const workspaceArchetype = getStringProperty(workspace, 'archetype');
    const identityBand = getObjectLiteralProperty(workspace, 'identityBand');
    const identity = getStringArrayProperty(identityBand, 'identity');
    const keyFacts = getStringArrayProperty(identityBand, 'keyFacts');
    const decision = getStringArrayProperty(identityBand, 'decision');
    const actionOwner = getStringProperty(identityBand, 'actionOwner');
    const navigation = getObjectLiteralProperty(workspace, 'navigation');
    const navigationMode = getStringProperty(navigation, 'mode');
    const navigationItemState = getStringProperty(navigation, 'itemState');
    const usability = getObjectLiteralProperty(workspace, 'usability');
    const usabilityTasks = ['identify', 'locateIssue', 'completeFrequentAction']
      .map((task) => getStringArrayProperty(usability, task));
    if (!['operational-workspace', 'reference-workspace', 'review-workspace'].includes(workspaceArchetype)
      || !identity?.length || !keyFacts?.length || decision === undefined
      || !['header', 'page-footer', 'drawer-footer', 'none'].includes(actionOwner)
      || !['none', 'conditional-section-index'].includes(navigationMode)
      || !['active-only', 'contract-derived'].includes(navigationItemState)
      || (navigationMode === 'none' && navigationItemState !== 'active-only')
      || usabilityTasks.some((tasks) => !tasks?.length)) {
      violations.push({
        rule: '详情 pageSpec 必须声明工作台类型、身份决策带、条件导航和 identify/locate/act 可测任务',
        file: relPath,
        line: 1,
        content: `workspace=${workspaceArchetype ?? '-'}/${actionOwner ?? '-'}, navigation=${navigationMode ?? '-'}/${navigationItemState ?? '-'}`,
      });
    }
    const scroll = getObjectLiteralProperty(detail, 'scroll');
    const verticalOwner = getStringProperty(scroll, 'verticalOwner');
    const horizontalOverflow = getStringProperty(scroll, 'horizontalOverflow');
    const stickyActionOwner = getStringProperty(scroll, 'stickyActionOwner');
    if (!['page', 'drawer-body', 'overlay-body'].includes(verticalOwner)
      || horizontalOverflow !== 'table-only'
      || !['none', 'page-footer', 'drawer-footer'].includes(stickyActionOwner)
      || (['page-footer', 'drawer-footer'].includes(actionOwner) && stickyActionOwner !== actionOwner)
      || (['page-footer', 'drawer-footer'].includes(stickyActionOwner) && actionOwner !== stickyActionOwner)) {
      violations.push({
        rule: '详情 pageSpec 必须声明唯一纵向滚动所有者、table-only 横向溢出和粘性动作所有者',
        file: relPath,
        line: 1,
        content: `scroll=${verticalOwner ?? '-'}/${horizontalOverflow ?? '-'}/${stickyActionOwner ?? '-'}`,
      });
    }
    if (!detailModules?.length) {
      violations.push({
        rule: '非 none 详情必须声明 typed 模块清单，禁止只用 focus 文本代替结构契约',
        file: relPath,
        line: 1,
        content: `detail.mode=${detailMode}, modules=0`,
      });
    } else {
      const declaredActionIds = new Set((getObjectArrayProperty(spec, 'actions') ?? []).map((action) => getStringProperty(action, 'id')));
      const moduleIds = new Set();
      const metricIds = new Set();
      for (const module of detailModules) {
        const moduleId = getStringProperty(module, 'id');
        const owns = getStringArrayProperty(module, 'owns');
        const metrics = getObjectArrayProperty(module, 'metrics');
        const moduleActionScopes = getObjectLiteralProperty(module, 'actions');
        const moduleActions = moduleActionScopes
          ? ['module', 'table', 'row'].flatMap((scope) => getStringArrayProperty(moduleActionScopes, scope) ?? [])
          : undefined;
        const children = getObjectLiteralProperty(module, 'children');
        if (!moduleId || moduleIds.has(moduleId) || !owns?.length || metrics === undefined || moduleActions === undefined
          || ['module', 'table', 'row'].some((scope) => getStringArrayProperty(moduleActionScopes, scope) === undefined)
          || !children) {
          violations.push({
            rule: '每个详情模块必须有唯一 id、非空 owns，并显式声明 metrics、actions 和 children',
            file: relPath,
            line: 1,
            content: `module=${moduleId ?? '(empty)'}`,
          });
        }
        if (moduleId) moduleIds.add(moduleId);
        const childKind = getStringProperty(children, 'kind');
        const childMetrics = childKind === 'repeated' ? getObjectArrayProperty(children, 'metrics') : [];
        const childActionScopes = childKind === 'repeated' ? getObjectLiteralProperty(children, 'actions') : undefined;
        const childActions = childKind === 'repeated' && childActionScopes
          ? ['child', 'table', 'row'].flatMap((scope) => getStringArrayProperty(childActionScopes, scope) ?? [])
          : (childKind === 'repeated' ? undefined : []);
        if (!['none', 'repeated'].includes(childKind)
          || (childKind === 'repeated' && (!(getStringArrayProperty(children, 'identity')?.length)
            || !(getStringArrayProperty(children, 'body')?.length)
            || childMetrics === undefined
            || childActions === undefined
            || ['child', 'table', 'row'].some((scope) => getStringArrayProperty(childActionScopes, scope) === undefined)))) {
          violations.push({
            rule: '模块 children 必须显式为 none，或声明有身份、正文、统计与动作的 bounded repeated contract',
            file: relPath,
            line: 1,
            content: `module=${moduleId ?? '(empty)'}, children=${childKind ?? '(empty)'}`,
          });
        }
        for (const metric of [...(metrics ?? []), ...(childMetrics ?? [])]) {
          const metricId = getStringProperty(metric, 'id');
          const complete = metricId
            && getStringProperty(metric, 'kind')
            && getStringProperty(metric, 'source')
            && getStringProperty(metric, 'aggregation')
            && getStringProperty(metric, 'format')
            && getStringProperty(metric, 'placement');
          if (!complete || metricIds.has(metricId)) {
            violations.push({
              rule: '详情统计必须有唯一 id，并声明 kind、source、aggregation、format 与单一 placement',
              file: relPath,
              line: 1,
              content: `metric=${metricId ?? '(empty)'}`,
            });
          }
          if (metricId) metricIds.add(metricId);
        }
        for (const actionId of [...(moduleActions ?? []), ...(childActions ?? [])]) {
          if (declaredActionIds.has(actionId)) continue;
          violations.push({
            rule: '模块和子模块动作必须引用同一 pageSpec 中的完整业务 action',
            file: relPath,
            line: 1,
            content: `module=${moduleId ?? '(empty)'}, action=${actionId}`,
          });
        }
      }
    }
  }

  const query = getObjectLiteralProperty(spec, 'query');
  const declaredTotal = Number(getObjectProperty(query, 'totalFields')?.initializer?.text);
  const declaredVisible = getStringArrayProperty(query, 'visibleFields') ?? [];
  const declaredAdvanced = getStringArrayProperty(query, 'advancedFields') ?? [];
  const queryStrategy = getStringProperty(query, 'strategy');
  const queryLayout = getStringProperty(query, 'layout');
  const visibleFieldLayout = getObjectArrayProperty(query, 'visibleFieldLayout') ?? [];
  const visibleLayoutFields = visibleFieldLayout.map((entry) => getStringProperty(entry, 'field'));
  const visibleLayoutRoles = visibleFieldLayout.map((entry) => getStringProperty(entry, 'width'));
  const declaredQueryFields = [...declaredVisible, ...declaredAdvanced];
  if (!Number.isInteger(declaredTotal) || declaredTotal !== declaredVisible.length + declaredAdvanced.length) {
    violations.push({
      rule: 'pageSpec 查询 totalFields 必须等于 visibleFields 与 advancedFields 的字段总数',
      file: relPath,
      line: 1,
      content: `declared=${declaredTotal}, fields=${declaredVisible.length + declaredAdvanced.length}`,
    });
  }
  if (new Set(declaredQueryFields).size !== declaredQueryFields.length) {
    violations.push({
      rule: 'pageSpec 查询字段不得在 visibleFields / advancedFields 中重复',
      file: relPath,
      line: 1,
      content: 'duplicate query field declaration',
    });
  }
  const allowedQueryWidthRoles = new Set(['compact', 'standard', 'wide', 'composite', 'range']);
  const invalidQueryLayout = (declaredTotal === 0 && (queryLayout !== 'none' || visibleFieldLayout.length > 0))
    || (declaredTotal > 0 && queryLayout !== 'semantic-grid-v1')
    || visibleFieldLayout.length !== declaredVisible.length
    || new Set(visibleLayoutFields).size !== visibleLayoutFields.length
    || declaredVisible.some((field) => !visibleLayoutFields.includes(field))
    || visibleLayoutFields.some((field) => !declaredVisible.includes(field))
    || visibleLayoutRoles.some((role) => !allowedQueryWidthRoles.has(role));
  if (invalidQueryLayout) {
    violations.push({
      rule: 'pageSpec 可见查询字段必须逐项声明 semantic-grid-v1 语义宽度角色，禁止页面自由配置栅格跨度',
      file: relPath,
      line: 1,
      content: `layout=${queryLayout}; visible=${declaredVisible.join(',')}; widthFields=${visibleLayoutFields.join(',')}; roles=${visibleLayoutRoles.join(',')}`,
    });
  }
  if (declaredVisible.length > 0 && routeView) {
    const routeSource = readFileSync(routeView, 'utf8');
    if (!/<QueryFieldGrid\b/.test(routeSource) || !/<QueryFieldCol\b/.test(routeSource)) {
      violations.push({
        rule: '可见查询区必须使用共享 QueryFieldGrid/QueryFieldCol 渲染语义宽度，禁止路由页自建另一套断点跨度',
        file: toRelativePath(routeView),
        line: 1,
        content: 'missing shared semantic query grid',
      });
    }
  }
  const invalidQueryStrategy = (declaredTotal === 0 && queryStrategy !== 'none')
    || (declaredTotal > 0 && queryStrategy === 'none')
    || (queryStrategy === 's1-inline' && (declaredTotal > 8 || declaredAdvanced.length > 0))
    || (queryStrategy === 's2-expand' && (declaredTotal < 9 || declaredTotal > 20))
    || (queryStrategy === 's3-drawer' && (declaredTotal <= 8 || declaredTotal >= 50))
    || (queryStrategy === 's4-drawer-fallback' && declaredTotal < 50)
    || (queryStrategy === 's4-workspace' && declaredTotal < 50);
  if (invalidQueryStrategy) {
    violations.push({
      rule: 'pageSpec 查询策略必须与项目级字段规模边界自洽；边界例外只能在允许区间内选择',
      file: relPath,
      line: 1,
      content: `strategy=${queryStrategy}, total=${declaredTotal}, advanced=${declaredAdvanced.length}`,
    });
  }
  const invalidSimpleQueryFields = listProfile === 'simple-query' && (
    (declaredTotal > 0 && queryStrategy !== 's1-inline')
    || declaredTotal > 8
    || declaredAdvanced.length > 0
  );
  if (invalidSimpleQueryFields) {
    violations.push({
      rule: '轻量查询列表默认只能使用 1-8 个 S1 内联查询项；复杂条件必须升级为管理或运营工作台原型',
      file: relPath,
      line: 1,
      content: `strategy=${queryStrategy}, total=${declaredTotal}, advanced=${declaredAdvanced.length}`,
    });
  }

  const table = getObjectLiteralProperty(spec, 'table');
  const tableKind = getStringProperty(table, 'kind');
  if (routeView) {
    const routeSource = readFileSync(routeView, 'utf8');
    const sequenceColumn = /<vxe-column(?=[^>]*\btype=["']seq["'])(?=[^>]*(?:\btitle=["']序号["']|:title=["'][^>]*common\.sequence))(?=[^>]*\bwidth=["']52["'])(?=[^>]*\balign=["']center["'])[^>]*>/.test(routeSource);
    if (!sequenceColumn) {
      violations.push({
        rule: '分页业务列表必须使用 VXE 内建连续序号列：title="序号"、width="52"、align="center"',
        file: toRelativePath(routeView),
        line: 1,
        content: 'missing standard sequence column',
      });
    }
  }
  const expectedTableKinds = {
    'simple-query': 'query-list',
    management: 'management-list',
    'operations-workbench': 'workbench',
  };
  if (listProfile && tableKind !== expectedTableKinds[listProfile]) {
    violations.push({
      rule: '列表原型必须声明匹配的 table.kind，避免轻量查询、管理维护与运营工作台共用含混表格语义',
      file: relPath,
      line: 1,
      content: `profile=${listProfile}, table.kind=${tableKind ?? '(empty)'}`,
    });
  }
  if (list && routeView && !/<vxe-table\b/.test(readFileSync(routeView, 'utf8'))) {
    violations.push({
      rule: '标准列表框架必须以 vxe-table 承载主数据面，禁止页面改用另一套表格语言',
      file: toRelativePath(routeView),
      line: 1,
      content: 'missing vxe-table for declared list page',
    });
  }

  const surfacesProperty = getObjectProperty(spec, 'surfaces');
  const surfaces = surfacesProperty && ts.isArrayLiteralExpression(surfacesProperty.initializer)
    ? surfacesProperty.initializer.elements.filter(ts.isObjectLiteralExpression)
    : [];
  const surfaceIds = surfaces.map((surface) => getStringProperty(surface, 'id')).filter(Boolean);
  if (new Set(surfaceIds).size !== surfaceIds.length) {
    violations.push({
      rule: 'typed pageSpec.ts 的 surface id 必须在页面内唯一',
      file: relPath,
      line: 1,
      content: 'duplicate surface id',
    });
  }
  for (const surface of surfaces) {
    const implementation = getStringProperty(surface, 'implementation');
    const reason = getStringProperty(surface, 'whyArcoNotEnough');
    if ((implementation === 'page-local' || implementation === 'shared-pattern') && !reason) {
      violations.push({
        rule: '非 Arco 原生 surface 必须说明 whyArcoNotEnough，禁止把自定义结构当默认方案',
        file: relPath,
        line: source.slice(0, surface.pos).split('\n').length,
        content: `${getStringProperty(surface, 'id') ?? '(unknown surface)'} missing whyArcoNotEnough`,
      });
    }
  }

  const actionsProperty = getObjectProperty(spec, 'actions');
  const actions = actionsProperty && ts.isArrayLiteralExpression(actionsProperty.initializer)
    ? actionsProperty.initializer.elements.filter(ts.isObjectLiteralExpression)
    : [];
  const actionIds = actions.map((action) => getStringProperty(action, 'id')).filter(Boolean);
  if (new Set(actionIds).size !== actionIds.length) {
    violations.push({
      rule: 'typed pageSpec.ts 的 action id 必须在页面内唯一',
      file: relPath,
      line: 1,
      content: 'duplicate action id',
    });
  }
  const primaryScopes = new Map();
  for (const action of actions) {
    const contractId = getStringProperty(action, 'contract');
    if (!contractId || !featureContractIds.has(contractId)) {
      violations.push({
        rule: 'typed pageSpec.ts 的每个动作必须引用项目内真实完整功能契约',
        file: relPath,
        line: source.slice(0, action.pos).split('\n').length,
        content: `missing feature contract ${contractId ?? '(empty)'}`,
      });
    }
    if (getStringProperty(action, 'presentation') === 'primary') {
      const scope = getStringProperty(action, 'scope') ?? '(empty)';
      if (primaryScopes.has(scope)) {
        violations.push({
          rule: '同一 pageSpec action scope 最多声明一个 primary',
          file: relPath,
          line: source.slice(0, action.pos).split('\n').length,
          content: `${scope}: ${primaryScopes.get(scope)} and ${getStringProperty(action, 'id')}`,
        });
      } else {
        primaryScopes.set(scope, getStringProperty(action, 'id'));
      }
    }
  }

  if (actions.length && routeView
    && !/from\s+['"][^'"]*featureContracts['"]/.test(readFileSync(routeView, 'utf8'))) {
    violations.push({
      rule: '声明业务动作的路由页面必须复用对应 featureContracts，禁止页面内另写一套交互状态',
      file: toRelativePath(routeView),
      line: 1,
      content: 'missing featureContracts import',
    });
  }
}
if (!mainTs.includes("@icon-park/vue-next/styles/index.css")) {
  violations.push({
    rule: '引入 IconPark 后，src/main.ts 必须全局引入 @icon-park/vue-next 样式',
    file: 'src/main.ts',
    line: 1,
    content: 'missing @icon-park/vue-next/styles/index.css import',
  });
}
// Arco-first: global.css is framework-neutral.
const arcoOverrideRules = (globalCss.match(/[^,{]*\.arco-[^,{]*\{/g) || []).length;
if (arcoOverrideRules > 0) {
  violations.push({
    rule: 'Arco-first: global.css 禁止 .arco-* 框架内部规则（当前 ' + arcoOverrideRules + ' 条）',
    file: 'src/styles/global.css',
    line: 1,
    content: 'use Arco props/slots and scoped layout CSS',
  });
}
const forbiddenLayoutPatterns = ['.filter-card', '.page-root', '.detail-section', '.toolbar-group', '.zone-l2-filter-card'];
for (const pattern of forbiddenLayoutPatterns) {
  if (globalCss.includes(pattern)) {
    violations.push({
      rule: 'Arco-first: 布局 archetype 不应在 global.css（' + pattern + '）；页面用 Arco 结构 + scoped CSS',
      file: 'src/styles/global.css',
      line: 1,
      content: 'remove layout pattern from global.css',
    });
  }
}
if (!rootBlocks.includes('--dense-row-h:') || !bodyThemeAliases.includes('--dense-primary-6:')) {
  violations.push({
    rule: 'global.css 须把布局密度 token 放 :root，把依赖 GI 的语义 alias 放 body',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing --dense-* tokens',
  });
}
if (!globalCss.includes('.s-pill[data-s="wait"]')) {
  violations.push({
    rule: 'global.css 须保留货代状态 .s-pill[data-s]',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing s-pill freight semantics',
  });
}
// 控件密度两层规则：表外 Arco 控件继承 App ConfigProvider 的 small；vxe-table 块内（行内操作/可编辑单元格）必须 mini（mini 行内容盒 24px，small 28px 会裁切）。
const operationalComponentPattern = /<a-(input-number|tree-select|date-picker|time-picker|pagination|textarea|cascader|button|input|select|tabs|steps)(?![\w-])[\s\S]*?>/g;
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = toRelativePath(file);
  const content = readFileSync(file, 'utf8');
  const vxeColumnBlocks = (content.match(/<vxe-column\b(?![^>]*\/>)[\s\S]*?<\/vxe-column>/g) || [])
    .map((block) => ({ start: content.indexOf(block), end: content.indexOf(block) + block.length }));
  const isInsideVxeTable = (index) => vxeColumnBlocks.some(({ start, end }) => index >= start && index <= end);
  for (const match of content.matchAll(operationalComponentPattern)) {
    const tag = match[0];
    if (isInsideVxeTable(match.index)) {
      if (/\bsize=(['"])mini\1/.test(tag)) continue;
      violations.push({
        rule: '表格行内 Arco 控件必须显式声明 size="mini"（mini 行内容盒 24px，small 会裁切）',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: tag.replace(/\s+/g, ' ').slice(0, 140),
      });
      continue;
    }
  }

  for (const match of content.matchAll(/<a-button\b([^>]*)>([\s\S]*?)<\/a-button>/g)) {
    const attributes = match[1];
    const body = match[2];
    const visibleText = body
      .replace(/<[^>]+>/g, '')
      .replace(/\{\{[\s\S]*?\}\}/g, 'dynamic-text')
      .trim();
    const isIconOnly = !visibleText && /<(?:template\b[^>]*#icon|icon-[\w-]+\b)/.test(body);
    if (!isIconOnly) continue;
    if (!/(?:\baria-label|:aria-label)=(['"])[^>]+\1/.test(attributes)) {
      violations.push({
        rule: 'icon-only 按钮必须提供业务含义明确的 aria-label；Tooltip 不能替代可访问名称',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: match[0].replace(/\s+/g, ' ').slice(0, 140),
      });
    }
    const tooltipOpen = content.lastIndexOf('<a-tooltip', match.index);
    const tooltipCloseBefore = content.lastIndexOf('</a-tooltip>', match.index);
    const tooltipCloseAfter = content.indexOf('</a-tooltip>', match.index + match[0].length);
    if (tooltipOpen > tooltipCloseBefore && tooltipCloseAfter >= 0) continue;
    violations.push({
      rule: 'icon-only 按钮必须由 a-tooltip 提供可见说明，title 不能替代 Tooltip',
      file: relPath,
      line: getLineNumber(content, match.index),
      content: match[0].replace(/\s+/g, ' ').slice(0, 140),
    });
  }
}

// 业务页的 14-16px 视觉层级必须来自共享 typography token，避免页面自建字号体系。
for (const file of files) {
  if (!file.includes(`${sep}src${sep}views${sep}`) || !file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + sep, '').replace(/\\/g, '/');
  const lines = readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/font-size\s*:\s*(14|15|16)px\b/.test(lines[i])) continue;
    violations.push({
      rule: '业务页禁止硬编码 14/15/16px 字号；对象主标识使用 --dense-font-hero，其余使用 F0-F6 token',
      file: relPath,
      line: i + 1,
      content: lines[i].trim().slice(0, 140),
    });
  }
}

// 业务列禁止固定 width（仅 checkbox / seq / 操作列允许）
function isStructuralVxeColumn(attrs) {
  if (/type="checkbox"/.test(attrs) || /type="seq"/.test(attrs)) return true;
  if (/(?:title="操作"|:title="[^"]*common\.operations[^"]*")/.test(attrs) && /fixed="right"/.test(attrs)) return true;
  return false;
}

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

// VXE 操作列必须使用稳定、左对齐的 row-actions 容器，避免条件动作使按钮在行间漂移。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!/(?:title="操作"|common\.operations)/.test(content)) continue;
  const opColumnPattern = /<vxe-column\b[^>]*(?:title="操作"|:title="[^"]*common\.operations[^"]*")[^>]*>[\s\S]*?<\/vxe-column>/g;
  const isWorkbenchList = /<vxe-table\b[\s\S]*?\bshow-overflow=(['"])title\1/.test(content);
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
    const columnTag = block.match(/^<vxe-column\b[^>]*>/)?.[0] || '';
    if (!/\balign="left"/.test(columnTag)) {
      violations.push({
        rule: '列表操作单元格必须 align="left"；条件动作缺失时不得重新居中剩余按钮',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: block.split('\n')[0].trim().slice(0, 140),
      });
    }
    const centeredRowActions = /\.row-actions\s*\{[^}]*justify-content\s*:\s*center/s.exec(content);
    if (centeredRowActions) {
      violations.push({
        rule: 'row-actions 禁止页面局部 justify-content:center；使用 VXE 左对齐 + Arco Space 保持行间起点一致',
        file: relPath,
        line: getLineNumber(content, centeredRowActions.index),
        content: centeredRowActions[0].replace(/\s+/g, ' ').slice(0, 140),
      });
    }
    if (/class="[^"]*row-action-btn[^"]*"[^>]*status="danger"/.test(block) ||
        /status="danger"[^>]*class="[^"]*row-action-btn/.test(block)) {
      violations.push({
        rule: '列表主表操作列禁止直出 status="danger" 删除 icon；须进入行级 More 菜单并确认',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: block.split('\n').slice(0, 6).join(' ').trim().slice(0, 140),
      });
    }
    if (block.includes('aria-label="更多操作"') && !/class="[^"]*row-action-btn--more[^"]*"/.test(block)) {
      violations.push({
        rule: '列表 More 触发器必须使用共享 row-action-btn--more 中性语义，禁止与核心动作同权全蓝',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: block.split('\n').slice(0, 8).join(' ').trim().slice(0, 140),
      });
    }
    for (const divider of block.matchAll(/<a-divider\b(?![^>]*\bdirection=)[^>]*>/g)) {
      if (/\b(?::)?margin=/.test(divider[0])) continue;
      violations.push({
        rule: '列表 More 菜单的横向 Divider 必须通过公开 margin 属性适配紧凑菜单节奏，禁止继承页面分区间距',
        file: relPath,
        line: getLineNumber(content, match.index + divider.index),
        content: divider[0].replace(/\s+/g, ' ').slice(0, 140),
      });
    }
  }
}

// 列设置必须有可见配置面板并实际驱动 VXE 列状态，禁止空按钮或不存在的可选 API。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('<vxe-table') || !content.includes('title="列设置"')) continue;
  if (content.includes('openCustom?.')) {
    violations.push({
      rule: '列设置禁止调用不存在的 openCustom 可选 API；必须提供真实配置面板',
      file: relPath,
      line: getLineNumber(content, content.indexOf('openCustom?.')),
      content: 'openCustom?.()',
    });
  }
  const hasBuiltInCustomToolbar = /<vxe-toolbar\b[^>]*\bcustom/.test(content);
  const hasOwnedSettingsSurface = content.includes('column-settings-modal')
    && content.includes('.showColumn(')
    && content.includes('.hideColumn(');
  if (hasBuiltInCustomToolbar || hasOwnedSettingsSurface) continue;
  violations.push({
    rule: '工作台列设置按钮必须连接 VXE 内置工具栏或项目自有配置面板，并真实显示/隐藏列',
    file: relPath,
    line: getLineNumber(content, content.indexOf('title="列设置"')),
    content: 'missing functional column settings surface',
  });
}

// 详情小模块禁止使用已废弃的裸 label；新代码应使用一个有明确归属的字段分组。
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

// 对象详情禁止装饰性箭头步骤和顶层 KPI 报表条，避免详情页退化成流程/KPI 看板。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('detail-drawer')) continue;
  const arrowStepIndex = content.search(/<a-steps\b[^>]*\btype=(["'])arrow\1/);
  if (arrowStepIndex >= 0) {
    violations.push({
      rule: '对象详情禁止装饰性 a-steps type="arrow"；进度应采用与真实阶段契约匹配的轻量状态节点或时间线',
      file: relPath,
      line: getLineNumber(content, arrowStepIndex),
      content: content.slice(arrowStepIndex, content.indexOf('\n', arrowStepIndex)).trim().slice(0, 140),
    });
  }
  if (content.includes('detail-overview-kpi')) {
    violations.push({
      rule: '对象详情禁止顶层 detail-overview-kpi 报表条；统计必须进入其业务归属模块',
      file: relPath,
      line: getLineNumber(content, content.indexOf('detail-overview-kpi')),
      content: 'detail-overview-kpi',
    });
  }
}

// VXE 外观：主题统一边框/颜色/行高；工作台继承 stripe，typed plain 详情可用公共属性关闭行带。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  let specDir = dirname(file);
  let nearestPageSpec = '';
  const viewsRoot = join(ROOT, 'src/views');
  while (specDir.startsWith(viewsRoot)) {
    const candidate = join(specDir, 'pageSpec.ts');
    if (existsSync(candidate)) {
      nearestPageSpec = readFileSync(candidate, 'utf8');
      break;
    }
    const parent = dirname(specDir);
    if (parent === specDir) break;
    specDir = parent;
  }
  const allowsPlainRowBanding = /\browBanding\s*:\s*['"]plain['"]/.test(nearestPageSpec);
  const blocks = content.match(/<vxe-table[\s\S]*?<\/vxe-table>/g) || [];
  for (const block of blocks) {
    const blockIndex = content.indexOf(block);
    const firstLine = block.split('\n').slice(0, 10).join(' ');
    if (/\bborder=(["'])none\1/.test(block)) {
      violations.push({
        rule: '表格边框由全局主题统一，页面禁止设置 border="none"',
        file: relPath,
        line: getLineNumber(content, blockIndex),
        content: firstLine.trim().slice(0, 140),
      });
    }
    if (/(?:^|\s):?stripe=(["'])false\1/.test(block) && !allowsPlainRowBanding) {
      violations.push({
        rule: '仅 typed pageSpec 声明 rowBanding: plain 的详情/汇总表可通过 VXE 公共属性关闭 stripe',
        file: relPath,
        line: getLineNumber(content, blockIndex),
        content: firstLine.trim().slice(0, 140),
      });
    }
    if (/:row-config=(["'])[\s\S]*?height\s*:\s*\d/.test(block)) {
      violations.push({
        rule: '表格行高由全局主题 size 档位统一（默认 mini），禁止页面用 row-config.height 建立第二套密度',
        file: relPath,
        line: getLineNumber(content, blockIndex),
        content: firstLine.trim().slice(0, 140),
      });
    }
    if (/\bshow-overflow=(['"])title\1/.test(block)) {
      for (const genericComposite of block.matchAll(/class=(["'])[^"']*\bcell-two-line\b[^"']*\1/g)) {
        violations.push({
          rule: '主列表禁止通用 cell-two-line；复合单元格必须声明合法角色与直接依赖证据',
          file: relPath,
          line: getLineNumber(content, blockIndex + genericComposite.index),
          content: genericComposite[0].trim().slice(0, 140),
        });
      }

      for (const composite of block.matchAll(/<[^>]+\bclass=(["'])[^"']*\b(?:identity-metadata-cell|decision-cell|value-unit-cell)\b[^"']*\1[^>]*>/g)) {
        if (/\bdata-cell-role=(["'])(?:identity-metadata|decision-context|value-unit)\1/.test(composite[0])) continue;
        violations.push({
          rule: '主列表复合单元格必须声明 data-cell-role，明确 identity-metadata / decision-context / value-unit',
          file: relPath,
          line: getLineNumber(content, blockIndex + composite.index),
          content: composite[0].trim().slice(0, 140),
        });
      }

      for (const joinedHeader of block.matchAll(/<vxe-column\b[^>]*\btitle=(["'])[^"']*\s\/\s[^"']*\1[^>]*>/g)) {
        violations.push({
          rule: '主列表禁止用斜杠拼接独立字段表头；应拆列并通过列设置管理次要字段',
          file: relPath,
          line: getLineNumber(content, blockIndex + joinedHeader.index),
          content: joinedHeader[0].trim().slice(0, 140),
        });
      }

      const defaultVisibleFieldsMatch = content.match(/const\s+DEFAULT_VISIBLE_COLUMN_FIELDS[^=]*=\s*\[([\s\S]*?)\];/);
      const defaultVisibleFields = new Set(
        [...(defaultVisibleFieldsMatch?.[1] ?? '').matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]),
      );
      const isVisibleByDefault = (tag) => {
        if (/:?visible="false"/.test(tag)) return false;
        const dynamicVisible = tag.match(/:visible="isColumnVisible\('([^']+)'\)"/);
        return dynamicVisible ? defaultVisibleFields.has(dynamicVisible[1]) : true;
      };
      const columnTags = [...block.matchAll(/<vxe-column\b[^>]*>/g)].map((match) => match[0]);
      const businessColumns = columnTags.filter((tag) => !isStructuralVxeColumn(tag));
      const visibleBusinessColumns = businessColumns.filter(isVisibleByDefault);
      const hiddenBusinessColumns = businessColumns.length - visibleBusinessColumns.length;
      if (businessColumns.length > 12) {
        if (visibleBusinessColumns.length < 8 || visibleBusinessColumns.length > 12) {
          violations.push({
            rule: '主列表超过 12 个业务列时，默认可见业务列必须控制在 8–12 个',
            file: relPath,
            line: getLineNumber(content, blockIndex),
            content: `业务列 ${businessColumns.length}，默认可见 ${visibleBusinessColumns.length}`,
          });
        }
        if (hiddenBusinessColumns === 0 || !/:custom-config=/.test(block)) {
          violations.push({
            rule: '主列表超过 12 个业务列时，必须提供默认隐藏列与 VXE 列设置',
            file: relPath,
            line: getLineNumber(content, blockIndex),
            content: `隐藏列 ${hiddenBusinessColumns}，列设置 ${/:custom-config=/.test(block) ? '已配置' : '未配置'}`,
          });
        }
      }
    }
    if (/:custom-config=/.test(block) && !/\bid=(['"])[^'"]+\1/.test(firstLine)) {
      violations.push({
        rule: '启用 VXE custom-config 的表格必须提供稳定 id，避免偏好持久化与运行时警告失效',
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

// 全局样式只允许基础重置、token 和框架无关的业务语义，禁止形成第二套框架皮肤。
const globalCssFile = join(ROOT, 'src/styles/global.css');
if (existsSync(globalCssFile)) {
  const globalCssLines = readFileSync(globalCssFile, 'utf8').split('\n');
  for (let i = 0; i < globalCssLines.length; i++) {
    const line = globalCssLines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;
    if (!/\.arco-|\.vxe-|\[data-vxe|--vxe-(?:ui-)?/.test(line)) continue;
    violations.push({
      rule: 'global.css 禁止覆盖 Arco/VXE 内部选择器或 VXE 主题变量',
      file: toRelativePath(globalCssFile),
      line: i + 1,
      content: trimmed.slice(0, 140),
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
