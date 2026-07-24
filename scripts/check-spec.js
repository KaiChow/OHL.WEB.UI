/**
 * OHL 规范自动检查脚本
 * 用法: node scripts/check-spec.js
 * 检查页面和组件下的 .vue / .ts / .css 文件，并调用 freight skill validator
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, extname, join, relative, resolve, sep } from 'path';
import ts from 'typescript';
import { validateFreightUiSkill } from '../.agents/skills/freight-arco-ui/scripts/validate-skill.mjs';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const SCAN_DIRS = ['src/views', 'src/components'];
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
for (const error of validateFreightUiSkill()) {
  violations.push({
    rule: 'freight-arco-ui skill 必须保持单一权威、PESDP 可追溯和无冲突生成链',
    file: '.agents/skills/freight-arco-ui',
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

  if (/\bgoal\s*:|\bevidence\s*:/.test(source)) {
    violations.push({
      rule: 'typed pageSpec.ts 只能声明 target + acceptance，禁止在源码中自证质量',
      file: relPath,
      line: 1,
      content: 'invalid page quality declaration',
    });
  }

  const query = getObjectLiteralProperty(spec, 'query');
  const declaredTotal = Number(getObjectProperty(query, 'totalFields')?.initializer?.text);
  const declaredVisible = getStringArrayProperty(query, 'visibleFields') ?? [];
  const declaredAdvanced = getStringArrayProperty(query, 'advancedFields') ?? [];
  if (!Number.isInteger(declaredTotal) || declaredTotal !== declaredVisible.length + declaredAdvanced.length) {
    violations.push({
      rule: 'pageSpec 查询 totalFields 必须等于 visibleFields 与 advancedFields 的字段总数',
      file: relPath,
      line: 1,
      content: `declared=${declaredTotal}, fields=${declaredVisible.length + declaredAdvanced.length}`,
    });
  }

  const actionsProperty = getObjectProperty(spec, 'actions');
  const actions = actionsProperty && ts.isArrayLiteralExpression(actionsProperty.initializer)
    ? actionsProperty.initializer.elements.filter(ts.isObjectLiteralExpression)
    : [];
  for (const action of actions) {
    const contractId = getStringProperty(action, 'contract');
    if (contractId && featureContractIds.has(contractId)) continue;
    violations.push({
      rule: 'typed pageSpec.ts 的每个动作必须引用项目内真实完整功能契约',
      file: relPath,
      line: source.slice(0, action.pos).split('\n').length,
      content: `missing feature contract ${contractId ?? '(empty)'}`,
    });
  }

  if (actions.length && routeView && !readFileSync(routeView, 'utf8').includes('featureContracts')) {
    violations.push({
      rule: '声明业务动作的路由页面必须复用对应 featureContracts，禁止页面内另写一套交互状态',
      file: toRelativePath(routeView),
      line: 1,
      content: 'missing featureContracts import',
    });
  }
}

const shipmentWorkbenchPage = readFileSync(join(ROOT, 'src/views/shipment/orderWorkbench/index.vue'), 'utf8');
const shipmentWorkbenchSpec = readFileSync(join(ROOT, 'src/views/shipment/orderWorkbench/pageSpec.ts'), 'utf8');
const shipmentDetailSpec = readFileSync(join(ROOT, 'src/views/shipment/orderDetail/pageSpec.ts'), 'utf8');
const parseStringArray = (source, key) => {
  const body = source.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`))?.[1] ?? '';
  return [...body.matchAll(/'([^']+)'/g)].map((match) => match[1]);
};
const declaredQueryTotal = Number(shipmentWorkbenchSpec.match(/totalFields:\s*(\d+)/)?.[1]);
const declaredVisibleQueryFields = parseStringArray(shipmentWorkbenchSpec, 'visibleFields');
const declaredAdvancedQueryFields = parseStringArray(shipmentWorkbenchSpec, 'advancedFields');
const implementedVisibleQueryFields = [...new Set(
  [...shipmentWorkbenchPage.matchAll(/v-model="query\.([\w]+)"/g)]
    .map((match) => match[1])
    .filter((field) => field !== 'keywordType'),
)];
const implementedAdvancedQueryFields = [...new Set(
  [...shipmentWorkbenchPage.matchAll(/v-model="advancedQuery\.([\w]+)"/g)]
    .map((match) => match[1]),
)];
const implementedQueryFields = [...new Set([
  ...implementedVisibleQueryFields,
  ...implementedAdvancedQueryFields,
])];
const declaredQueryFields = [...declaredVisibleQueryFields, ...declaredAdvancedQueryFields];
const missingQueryFields = implementedQueryFields.filter((field) => !declaredQueryFields.includes(field));
const phantomQueryFields = declaredQueryFields.filter((field) => !implementedQueryFields.includes(field));
if (declaredQueryTotal !== implementedQueryFields.length
  || declaredQueryFields.length !== declaredQueryTotal
  || missingQueryFields.length
  || phantomQueryFields.length
  || (implementedQueryFields.length >= 17 && !shipmentWorkbenchSpec.includes("strategy: 's3-drawer'"))) {
  violations.push({
    rule: '订单工作台 pageSpec 查询总数、可见字段、高级字段和 S3 策略必须与真实 v-model 一致',
    file: 'src/views/shipment/orderWorkbench/pageSpec.ts',
    line: 1,
    content: `declared=${declaredQueryTotal}, implemented=${implementedQueryFields.length}, missing=${missingQueryFields.join(',') || '-'}, phantom=${phantomQueryFields.join(',') || '-'}`,
  });
}
const visibleModelMismatch = declaredVisibleQueryFields.filter((field) => !implementedVisibleQueryFields.includes(field));
const advancedModelMismatch = declaredAdvancedQueryFields.filter((field) => !implementedAdvancedQueryFields.includes(field));
const responsiveAdvancedColumnCount = [...shipmentWorkbenchPage.matchAll(/<a-col\b[^>]*>/g)]
  .map((match) => match[0])
  .filter((tag) => /:span="12"/.test(tag) && /:xs="24"/.test(tag) && /:sm="12"/.test(tag))
  .length;
const controlledAdvancedDatePopupCount = [...shipmentWorkbenchPage.matchAll(/v-model:popup-visible="advancedDatePopupVisible\.[^"]+"/g)].length;
if (visibleModelMismatch.length
  || advancedModelMismatch.length
  || !shipmentWorkbenchPage.includes('Object.assign(advancedQuery, cloneQuery(query))')
  || !shipmentWorkbenchPage.includes('@cancel="cancelAdvancedFilters"')
  || !shipmentWorkbenchPage.includes(':esc-to-close="false"')
  || !shipmentWorkbenchPage.includes('closeAdvancedDatePopups')
  || !shipmentWorkbenchPage.includes('handleAdvancedPopupEscape')
  || controlledAdvancedDatePopupCount !== 3
  || !shipmentWorkbenchPage.includes('advancedPreviewCount')
  || responsiveAdvancedColumnCount !== declaredAdvancedQueryFields.length) {
  violations.push({
    rule: 'S3 高级筛选必须使用独立草稿模型、右侧两列响应式契约与同源结果预览；取消/关闭不修改已应用查询',
    file: 'src/views/shipment/orderWorkbench/index.vue',
    line: 1,
    content: `visible-model=${visibleModelMismatch.join(',') || 'ok'}, advanced-model=${advancedModelMismatch.join(',') || 'ok'}, responsive-columns=${responsiveAdvancedColumnCount}`,
  });
}
const advancedFooterLayout = shipmentWorkbenchPage.match(/\.advanced-filter-footer\s*\{([\s\S]*?)\}/)?.[1] ?? '';
if (!advancedFooterLayout.includes('box-sizing: border-box')
  || !advancedFooterLayout.includes('flex-wrap: wrap')) {
  violations.push({
    rule: '高级筛选 footer 必须使用 border-box 并允许窄窗口换行，禁止 width+padding 横向溢出',
    file: 'src/views/shipment/orderWorkbench/index.vue',
    line: 1,
    content: 'missing border-box or flex-wrap on advanced-filter-footer',
  });
}
if (!shipmentWorkbenchPage.includes('data-pesdp-page="shipment-export-order-workbench"')
  || !shipmentWorkbenchSpec.includes("id: 'shipment-export-order-workbench'")) {
  violations.push({
    rule: '出口订单工作台必须用稳定 ID 绑定其 typed PESDP page spec',
    file: 'src/views/shipment/orderWorkbench/index.vue',
    line: 1,
    content: 'missing shipment-export-order-workbench spec binding',
  });
}
if (!shipmentWorkbenchPage.includes('data-workbench-scope')
  || !shipmentWorkbenchPage.includes('activeWorkScope')) {
  violations.push({
    rule: '出口订单工作台必须显式区分工作范围与状态队列',
    file: 'src/views/shipment/orderWorkbench/index.vue',
    line: 1,
    content: 'missing ownership scope control',
  });
}

const shipmentDetailPage = readFileSync(join(ROOT, 'src/views/shipment/orderDetail/index.vue'), 'utf8');
const shipmentOrderInfoTab = readFileSync(join(ROOT, 'src/views/shipment/orderDetail/components/OrderInfoTab.vue'), 'utf8');
const shipmentDetailWorkspaceRoles = [
  'data-pesdp-page="shipment-export-order-detail"',
  'data-detail-workspace="shipment-order"',
  'isDetailEditing',
  'detail-focus',
  'detail-milestone-bar',
  ':editable="isDetailEditing"',
];
for (const role of shipmentDetailWorkspaceRoles) {
  if (shipmentDetailPage.includes(role)) continue;
  violations.push({
    rule: '出口订单详情必须实现默认展示态、执行焦点、轻量节点与显式编辑会话',
    file: 'src/views/shipment/orderDetail/index.vue',
    line: 1,
    content: `missing ${role}`,
  });
}
if (!shipmentDetailSpec.includes("id: 'shipment-export-order-detail'")
  || (shipmentDetailPage.match(/v-if="isDetailEditing"/g) || []).length < 3
  || (shipmentDetailPage.match(/<a-descriptions\s+v-else\s+class="detail-display"/g) || []).length < 3
  || !shipmentDetailPage.includes(':editable="isDetailEditing"')) {
  violations.push({
    rule: '订单详情所有对象字段区必须绑定同一 typed spec，并统一遵守展示/编辑双态',
    file: 'src/views/shipment/orderDetail/index.vue',
    line: 1,
    content: 'missing detail spec id or display/edit split on overview and execution sections',
  });
}
if (!shipmentOrderInfoTab.includes('v-if="editable"')
  || !shipmentOrderInfoTab.includes('<a-descriptions')
  || !shipmentOrderInfoTab.includes('class="detail-display"')) {
  violations.push({
    rule: '订单概览默认必须用 Arco Descriptions 呈现可扫描展示态，只有显式编辑时渲染完整表单',
    file: 'src/views/shipment/orderDetail/components/OrderInfoTab.vue',
    line: 1,
    content: 'missing Arco detail-display / edit mode split',
  });
}
if (!mainTs.includes("@icon-park/vue-next/styles/index.css")) {
  violations.push({
    rule: '引入 IconPark 后，src/main.ts 必须全局引入 @icon-park/vue-next 样式',
    file: 'src/main.ts',
    line: 1,
    content: 'missing @icon-park/vue-next/styles/index.css import',
  });
}
// Arco-first: global.css is a thin enhancement layer only
const arcoOverrideRules = (globalCss.match(/[^,{]*\.arco-[^,{]*\{/g) || []).length;
if (arcoOverrideRules > 25) {
  violations.push({
    rule: 'Arco-first: global.css 禁止大量 .arco-* 规则（当前 ' + arcoOverrideRules + ' 条）',
    file: 'src/styles/global.css',
    line: 1,
    content: 'prefer body-scoped direct aliases; keep .arco-* to documented VXE/read-only bridges only',
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
if (!globalCss.includes('.vxe-table.workbench-table')) {
  violations.push({
    rule: 'global.css 须保留 VXE workbench-table 桥接',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing workbench-table bridge',
  });
}
if (!globalCss.includes('.detail-mini-vxe')) {
  violations.push({
    rule: 'global.css 须保留 detail-mini-vxe 桥接',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing detail-mini-vxe bridge',
  });
}
if (!globalCss.includes('.detail-mini-vxe.vxe-table .vxe-body--row')
  || !globalCss.includes('height: var(--detail-mini-row-h) !important')
  || !globalCss.includes('.detail-mini-vxe.vxe-table .vxe-body--column {\n  padding: 0 !important')) {
  violations.push({
    rule: 'global.css 必须由 detail-mini-vxe density modifier 统一承接明细表行高',
    file: 'src/styles/global.css',
    line: 1,
    content: 'missing detail-mini-vxe density row bridge',
  });
}
// 业务控件必须显式使用项目唯一密度，避免遗漏 size 后回退到 Arco medium。
const operationalComponentPattern = /<a-(input-number|tree-select|date-picker|time-picker|pagination|textarea|cascader|button|input|select|tabs|steps)(?![\w-])[\s\S]*?>/g;
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = toRelativePath(file);
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(operationalComponentPattern)) {
    const tag = match[0];
    if (/\bsize=(['"])small\1/.test(tag)) continue;
    violations.push({
      rule: '业务 Arco 控件必须显式声明 size="small"，禁止遗漏或使用其他密度',
      file: relPath,
      line: getLineNumber(content, match.index),
      content: tag.replace(/\s+/g, ' ').slice(0, 140),
    });
  }

  for (const match of content.matchAll(/<a-button\b([^>]*)>([\s\S]*?)<\/a-button>/g)) {
    const attributes = match[1];
    const body = match[2];
    const visibleText = body
      .replace(/<[^>]+>/g, '')
      .replace(/\{\{[\s\S]*?\}\}/g, 'dynamic-text')
      .trim();
    if (visibleText || !/<(?:template\b[^>]*#icon|icon-[\w-]+\b)/.test(body) || /\baria-label=(['"])[^'"]+\1/.test(attributes)) continue;
    violations.push({
      rule: 'icon-only 按钮必须提供业务含义明确的 aria-label；Tooltip 不能替代可访问名称',
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
  if (/title="操作"/.test(attrs) && /fixed="right"/.test(attrs)) return true;
  return false;
}

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
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
    const hasMoreMenu = block.includes('row-action-btn--more') || block.includes('<a-dropdown');
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
        rule: '列表主表操作列禁止直出 status="danger" 删除 icon；须进入行级 More 菜单并确认',
        file: relPath,
        line: getLineNumber(content, match.index),
        content: block.split('\n').slice(0, 6).join(' ').trim().slice(0, 140),
      });
    }
  }
}

// 列设置必须有可见配置面板并实际驱动 VXE 列状态，禁止空按钮或不存在的可选 API。
for (const file of files) {
  if (!file.endsWith('.vue')) continue;
  const relPath = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
  const content = readFileSync(file, 'utf8');
  if (!content.includes('workbench-table') || !content.includes('title="列设置"')) continue;
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

// VXE 行高：主列表 compact=36（可提供 44 舒适档）；详情由 density modifier + CSS token 控制，避免 VXE 4.5 row-config.height 警告。
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
    const hasStaticCompactRowHeight = /:row-config=(["'])[\s\S]*?height:\s*36[\s\S]*?\1/.test(block);
    const hasDensityRowConfig = /:row-config=(["'])tableRowConfig\1/.test(block)
      && /const\s+tableRowConfig\s*=\s*computed[\s\S]*?compact[\s\S]*?36[\s\S]*?44/.test(content);
    if (/class=(["'])[^"']*\bworkbench-table\b[^"']*\1/.test(firstLine) && !hasStaticCompactRowHeight && !hasDensityRowConfig) {
      violations.push({
        rule: 'workbench-table 必须声明 compact=36 的 row-config；提供密度切换时舒适档统一为 44',
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
    if (/\bdetail-mini-vxe--editable\b/.test(firstLine)) {
      for (const control of block.matchAll(/<a-(?:input|input-number|select|date-picker)\b([^>]*)>/g)) {
        if (/\bv-if=(['"])isEditingRow\(/.test(control[1])) continue;
        violations.push({
          rule: '详情可编辑子表默认必须是展示态；输入控件只允许在 isEditingRow 当前行出现',
          file: relPath,
          line: getLineNumber(content, blockIndex + control.index),
          content: control[0].trim().slice(0, 140),
        });
      }
    }
    if (/\bdetail-mini-vxe\b/.test(firstLine) && /:row-config=(["'])[\s\S]*?height\s*:/.test(firstLine)) {
      violations.push({
        rule: 'detail-mini-vxe 行高由 density modifier + global.css token 控制，禁止 row-config.height（VXE 4.5 会要求 show-overflow 并产生运行警告）',
        file: relPath,
        line: getLineNumber(content, blockIndex),
        content: firstLine.trim().slice(0, 140),
      });
    }
    if (/class=(["'])[^"']*\bworkbench-table\b[^"']*\1/.test(firstLine)) {
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
