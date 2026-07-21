/**
 * OHL 规范自动检查脚本
 * 用法: node scripts/check-spec.js
 * 检查页面、组件和 UI skill 样式下所有 .vue / .ts / .css 文件
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
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
    desc: 'IconPark 图标禁止使用 filled/two-tone/multi-color 主题，统一 outline',
    pattern: /\btheme="(filled|two-tone|multi-color)"/,
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
const packageJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const modulePatterns = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/module-patterns.md'), 'utf8');
const aiGenerationContract = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/ai-generation-contract.md'), 'utf8');
const checklist = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/checklist.md'), 'utf8');
const visualSystem = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/visual-system.md'), 'utf8');
const filterLayout = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/filter-layout.md'), 'utf8');
const actionsReference = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/actions.md'), 'utf8');
const iconsReference = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/icons.md'), 'utf8');
const artifactIntakeTemplate = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/artifact-intake-template.md'), 'utf8');
const prototypeToUiContract = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/prototype-to-ui-contract.md'), 'utf8');
const featureRouting = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/feature-routing.md'), 'utf8');
const featureDeliveryContract = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/feature-delivery-contract.md'), 'utf8');
const typographyReference = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/typography.md'), 'utf8');
const formFieldReference = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/form-field.md'), 'utf8');
const skillSource = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/SKILL.md'), 'utf8');
const specFirstCoding = readFileSync(join(ROOT, '.cursor/rules/spec-first-coding.mdc'), 'utf8');
const adversarialReview = readFileSync(join(ROOT, '.cursor/rules/adversarial-review.mdc'), 'utf8');
const mainTs = readFileSync(join(ROOT, 'src/main.ts'), 'utf8');
const existingProjectModernization = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/existing-project-modernization.md'), 'utf8');
const redesignCalibration = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/redesign-calibration.md'), 'utf8');
const responsiveReference = readFileSync(join(ROOT, 'ui-skill/freight-arco-ui/references/responsive.md'), 'utf8');
const agentsSummary = readFileSync(join(ROOT, 'AGENTS.md'), 'utf8');

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
const bodyScopedThemeRefInRoot = rootBlocks.match(/--[\w-]+\s*:[^;]*var\(--(?:primary|warning|success|danger)-\d+|--color-(?:bg|fill|text|border)-\d+|--border-radius-[\w-]+)/g) || [];
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
if (!skillSource.includes('theme-contract.md') || !skillSource.includes('existing-project-modernization.md')) {
  violations.push({
    rule: 'SKILL.md 必须路由主题任务与无参考图的既有项目改造任务',
    file: 'ui-skill/freight-arco-ui/SKILL.md',
    line: 1,
    content: 'missing theme/modernization routing',
  });
}
if (!skillSource.includes('## Rule Ownership') || !redesignCalibration.includes('## Layout Authority')) {
  violations.push({
    rule: 'Skill 必须声明唯一规则所有权，跨页面布局由 redesign-calibration.md 单独负责',
    file: 'ui-skill/freight-arco-ui/SKILL.md',
    line: 1,
    content: 'missing rule ownership or layout authority',
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
if (responsiveReference.includes('1024-1279') || responsiveReference.includes('< 1024px')) {
  violations.push({
    rule: '当前项目 min-width 为 1280px，responsive.md 禁止宣称未实现的 1024/mobile 支持',
    file: 'ui-skill/freight-arco-ui/references/responsive.md',
    line: 1,
    content: 'unsupported smaller viewport contract detected',
  });
}
if (/上传用\s*Uppy/.test(agentsSummary)) {
  violations.push({
    rule: 'AGENTS.md 禁止把未安装/未实现的 Uppy 写成既定项目能力',
    file: 'AGENTS.md',
    line: 1,
    content: 'phantom uploader dependency detected',
  });
}

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
if (!checklist.includes('Functional Delivery Gate')) {
  violations.push({
    rule: '交付清单必须包含 Functional Delivery Gate，约束功能的动作、权限、接口、状态与验证',
    file: 'ui-skill/freight-arco-ui/references/checklist.md',
    line: 1,
    content: 'missing Functional Delivery Gate',
  });
}
if (!visualSystem.includes('Arco Theme Color Contract')) {
  violations.push({
    rule: '视觉规范必须定义 Arco Theme Color Contract，禁止项目另起配色系统',
    file: 'ui-skill/freight-arco-ui/references/visual-system.md',
    line: 1,
    content: 'missing Arco Theme Color Contract',
  });
}
if (!existingProjectModernization.includes('Layout Quality Gate')) {
  violations.push({
    rule: '无参考图的既有项目改造必须包含可量化的 Layout Quality Gate',
    file: 'ui-skill/freight-arco-ui/references/existing-project-modernization.md',
    line: 1,
    content: 'missing Layout Quality Gate',
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
  !iconsReference.includes('双图标库') ||
  !iconsReference.includes('Library Split') ||
  !iconsReference.includes('Toolbar And Button Icons') ||
  !iconsReference.includes('Module Title Icons') ||
  !iconsReference.includes('Empty States') ||
  !iconsReference.includes('Navigation/Menu Icons')
) {
  violations.push({
    rule: '图标规范必须定义 Arco/IconPark 分工，并覆盖按钮、模块标题、空态、导航等主要场景',
    file: 'ui-skill/freight-arco-ui/references/icons.md',
    line: 1,
    content: 'missing icon scope coverage',
  });
}
if (
  !artifactIntakeTemplate.includes('Minimum Required Input') ||
  !artifactIntakeTemplate.includes('Delivery Expectation Levels') ||
  !artifactIntakeTemplate.includes('Fast Intake Questionnaire')
) {
  violations.push({
    rule: '原型输入模板必须覆盖最小输入字段、交付级别和快速问询顺序',
    file: 'ui-skill/freight-arco-ui/references/artifact-intake-template.md',
    line: 1,
    content: 'missing artifact intake template sections',
  });
}
if (
  !prototypeToUiContract.includes('Prototype Translation Block') ||
  !prototypeToUiContract.includes('What A Screenshot Can And Cannot Decide') ||
  !prototypeToUiContract.includes('Consistency Promise Rule')
) {
  violations.push({
    rule: '原型转译规范必须覆盖 screenshot 边界、转译块与一致性承诺规则',
    file: 'ui-skill/freight-arco-ui/references/prototype-to-ui-contract.md',
    line: 1,
    content: 'missing prototype translation contract sections',
  });
}
if (!typographyReference.includes('Same Component Rule')) {
  violations.push({
    rule: '字体规范必须定义 Same Component Rule，禁止同类组件因所在页面不同而切换字号',
    file: 'ui-skill/freight-arco-ui/references/typography.md',
    line: 1,
    content: 'missing Same Component Rule',
  });
}
if (!typographyReference.includes('Component Typography Map')) {
  violations.push({
    rule: '字体规范必须提供 Component Typography Map，便于按组件快速查字号层级',
    file: 'ui-skill/freight-arco-ui/references/typography.md',
    line: 1,
    content: 'missing Component Typography Map',
  });
}
if (!formFieldReference.includes('Typography Contract By Role') || !formFieldReference.includes('同一 Arco 组件在任意业务场景使用同一字号层级')) {
  violations.push({
    rule: '表单控件规范必须定义按角色分层的字号契约，并禁止同类控件分场景分字号',
    file: 'ui-skill/freight-arco-ui/references/form-field.md',
    line: 1,
    content: 'missing role-based typography contract for controls',
  });
}
if (!featureRouting.includes('feature-delivery-contract.md') || !featureRouting.includes('feature_type:')) {
  violations.push({
    rule: '功能路由规范必须把行为任务路由到 feature-delivery-contract，并给出最小输出块',
    file: 'ui-skill/freight-arco-ui/references/feature-routing.md',
    line: 1,
    content: 'missing route to feature-delivery-contract or feature output block',
  });
}
if (
  !featureDeliveryContract.includes('visible_when') ||
  !featureDeliveryContract.includes('enabled_when') ||
  !featureDeliveryContract.includes('api_request') ||
  !featureDeliveryContract.includes('api_response') ||
  !featureDeliveryContract.includes('refresh_scope') ||
  !featureDeliveryContract.includes('verification_cases')
) {
  violations.push({
    rule: '功能交付契约必须覆盖显隐、可点、接口、刷新与验证关键键位',
    file: 'ui-skill/freight-arco-ui/references/feature-delivery-contract.md',
    line: 1,
    content: 'missing required functional contract keys',
  });
}
if (!skillSource.includes('feature-routing.md') || !skillSource.includes('feature-delivery-contract.md')) {
  violations.push({
    rule: 'SKILL.md 必须把功能任务路由到 feature-routing 与 feature-delivery-contract',
    file: 'ui-skill/freight-arco-ui/SKILL.md',
    line: 1,
    content: 'missing feature references in skill source',
  });
}
if (!skillSource.includes('artifact-intake-template.md')) {
  violations.push({
    rule: 'SKILL.md 必须把截图/原型任务路由到 artifact-intake-template.md',
    file: 'ui-skill/freight-arco-ui/SKILL.md',
    line: 1,
    content: 'missing artifact intake template in skill source',
  });
}
if (!skillSource.includes('prototype-to-ui-contract.md')) {
  violations.push({
    rule: 'SKILL.md 必须把截图/原型任务路由到 prototype-to-ui-contract.md',
    file: 'ui-skill/freight-arco-ui/SKILL.md',
    line: 1,
    content: 'missing prototype-to-ui contract in skill source',
  });
}
if (!skillSource.includes('icons.md')) {
  violations.push({
    rule: 'SKILL.md 必须把 icon 任务路由到 icons.md',
    file: 'ui-skill/freight-arco-ui/SKILL.md',
    line: 1,
    content: 'missing icons reference in skill source',
  });
}
if (!specFirstCoding.includes('feature-routing.md') || !specFirstCoding.includes('feature-delivery-contract.md')) {
  violations.push({
    rule: 'spec-first-coding.mdc 必须要求功能任务先读 feature-routing 与 feature-delivery-contract',
    file: '.cursor/rules/spec-first-coding.mdc',
    line: 1,
    content: 'missing functional pre-read gate',
  });
}
if (!specFirstCoding.includes('artifact-intake-template.md')) {
  violations.push({
    rule: 'spec-first-coding.mdc 必须要求截图/原型任务先读 artifact-intake-template.md',
    file: '.cursor/rules/spec-first-coding.mdc',
    line: 1,
    content: 'missing artifact intake pre-read gate',
  });
}
if (!specFirstCoding.includes('prototype-to-ui-contract.md')) {
  violations.push({
    rule: 'spec-first-coding.mdc 必须要求截图/原型任务先读 prototype-to-ui-contract.md',
    file: '.cursor/rules/spec-first-coding.mdc',
    line: 1,
    content: 'missing prototype pre-read gate',
  });
}
if (!specFirstCoding.includes('icons.md')) {
  violations.push({
    rule: 'spec-first-coding.mdc 必须要求 icon 变更先读 icons.md',
    file: '.cursor/rules/spec-first-coding.mdc',
    line: 1,
    content: 'missing icon pre-read gate',
  });
}
if (!adversarialReview.includes('feature-delivery-contract.md')) {
  violations.push({
    rule: 'adversarial-review.mdc 必须审查功能契约，而不只审查 UI 结构',
    file: '.cursor/rules/adversarial-review.mdc',
    line: 1,
    content: 'missing functional review checks',
  });
}
if (!adversarialReview.includes('artifact-intake-template.md')) {
  violations.push({
    rule: 'adversarial-review.mdc 必须审查截图/原型任务是否先满足 artifact intake 模板',
    file: '.cursor/rules/adversarial-review.mdc',
    line: 1,
    content: 'missing artifact intake review checks',
  });
}
if (!adversarialReview.includes('prototype-to-ui-contract.md')) {
  violations.push({
    rule: 'adversarial-review.mdc 必须审查原型任务是否先完成 prototype-to-ui 转译',
    file: '.cursor/rules/adversarial-review.mdc',
    line: 1,
    content: 'missing prototype review checks',
  });
}
if (!adversarialReview.includes('icons.md')) {
  violations.push({
    rule: 'adversarial-review.mdc 必须审查图标作用域与库选择',
    file: '.cursor/rules/adversarial-review.mdc',
    line: 1,
    content: 'missing icon review checks',
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
if (!specFirstCoding.includes('arco-first.md')) {
  violations.push({
    rule: 'spec-first-coding.mdc 必须要求 UI 任务先读 arco-first.md',
    file: '.cursor/rules/spec-first-coding.mdc',
    line: 1,
    content: 'missing arco-first pre-read gate',
  });
}
if (!adversarialReview.includes('arco-first.md')) {
  violations.push({
    rule: 'adversarial-review.mdc 必须审查 Arco-first 优先级',
    file: '.cursor/rules/adversarial-review.mdc',
    line: 1,
    content: 'missing arco-first review gate',
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
      if (name === 'domain-language.md') continue;
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
    if (detailDensity && !new RegExp(`:?row-config=(["'])\\{[\\s\\S]*?height:\\s*${detailDensity.height}[\\s\\S]*?\\1`).test(firstLine)) {
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
