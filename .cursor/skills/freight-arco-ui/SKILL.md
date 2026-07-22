---
name: freight-arco-ui
description: Project UI and feature-delivery skill for FE.OHL.WEB.UI. Use when designing, reviewing, redesigning, rewriting, or implementing any Vue 3 + TypeScript + Arco Design Vue + VXE Table freight SaaS page or frontend business feature under the PESDP Design System 2.0. Covers list pages, detail drawers, long forms, tabs, toolbars, status pills, table styling, dense layout, visual hierarchy, page skeleton rewrites, layout redesign, ordinary-admin cleanup, UI taste/质感/不好看 feedback, action legality, field behavior, permission visibility, API/error handling, verification, and AI-executable design rules.
---

# Freight Arco UI Skill

Project-level **UI delivery contract** for `FE.OHL.WEB.UI`.

**Source of truth:** `ui-skill/freight-arco-ui/` → run `npm run sync-ui-skill` after edits.

**Synced to:** `.cursor/skills/`, `.agents/skills/`

## Arco-First Productization (read this first)

**Arco drives the page. `global.css` is a thin enhancement layer — not a second UI framework.**

Execution priority (mandatory):

1. **Arco-first** — props, slots, layout primitives, built-in interaction
2. **Token-second** — GI baseline/palette + direct `--dense-*` semantic aliases
3. **Business-pattern-third** — freight semantics, workbench archetype, VXE bridge
4. **Page-local-css-last** — minimal page shell only

Full rules: **`references/arco-first.md`**. Every shared custom class must state why Arco + tokens were insufficient.

## Mandatory PESDP Execution Gate

PESDP is a coding contract, not a score added after implementation. For every new page, page rewrite, or material UI/interaction redesign:

1. Read **`references/page-spec-contract.md`**.
2. Create or update the page's typed `pageSpec.ts` before editing its Vue template.
3. Give Professional, Efficient, Structured, Dense, and Premium at least one concrete implementation decision and one measurable acceptance condition each.
4. Read the single-authority references selected by that spec.
5. Implement, inspect the real route, and reconcile the evidence back to the spec.

No page may be called PESDP-compliant because it merely uses Arco, shared classes, compact spacing, or a checklist. Missing/empty PESDP traceability is a blocking failure.

## Architecture

| Layer | Location | Contains |
|-------|----------|----------|
| **Arco foundation** | `@arco-themes/vue-gi-demo` | Default owner: controls, layout, tabs, overlay, interaction states |
| **Shared enhancement CSS** | `src/styles/global.css` | Direct GI/Arco semantic aliases, density tokens, VXE bridge, freight semantics, documented archetype slots only |
| **Agent summary** | `AGENTS.md` | One-page pointer (no duplicate rules) |
| **This skill** | `SKILL.md` + `references/` | PESDP principles + executable rules |
| **Page specification** | `page-spec-contract.md` + page-local `pageSpec.ts` | Typed business/PESDP/surface/action decisions and acceptance conditions required before template code |
| **Structure slots** | `module-patterns.md` | English slots only; no field lists |
| **Artifact intake** | `artifact-intake-template.md` | Minimum business context required with screenshot/prototype input |
| **Prototype translation** | `prototype-to-ui-contract.md` | Screenshot/prototype -> business object/archetype/contracts |
| **Feature contracts** | `feature-routing.md`, `feature-delivery-contract.md` | Action/state/permission/API/verification |
| **Domain copy** | `domain-language.md` | Chinese labels, statuses, object examples |
| **Component rules** | `actions.md`, `icons.md`, `table.md`, `detail-form.md`, `list-page.md` | How to implement |
| **QA** | `checklist.md`, `scripts/check-spec.js` | Pre-ship checks |

**Rule:** Arco structure first → business slots and labels from `module-patterns.md` / `domain-language.md` → thin shared enhancement from `global.css` only where needed → details in topic references. Do not duplicate long rule blocks across `AGENTS.md` / skill.

## Rule Ownership

Each rule family has one authority. Other files route to it or verify it; they do not redefine it.

| Rule family | Authority |
|-------------|-----------|
| Theme ownership and token scope | `theme-contract.md` |
| No-design / no-artifact modernization (default path) | `existing-project-modernization.md` |
| Cross-page layout quality, surface relationships, first-viewport evidence | `redesign-calibration.md` |
| List workbench implementation | `list-page.md` |
| Query-count selection | `filter-layout.md` |
| Supported viewport behavior | `responsive.md` |
| Visual role usage | `visual-system.md` |
| Sellable product maturity gates and scoring | `product-grade-evaluation.md` |
| Delivery checks only | `checklist.md` |
| AI generation sequence and mandatory page IR | `page-spec-contract.md` |

When two files disagree, use the authority above and delete the duplicate rule during maintenance.

## Four-Layer Prompt Model

All agents should understand the project in this order:

1. **Product Positioning** — build a professional freight operations workbench for sales, operators, and coordinators, not a decorative dashboard or traditional ERP sheet.
2. **Design Philosophy** — business workflows, readability, consistency, trust, and operational efficiency come before decoration.
3. **Visual Language** — restrained Arco-based enterprise SaaS: brand-neutral surfaces, white work areas, clear hierarchy, high density, low visual noise; never flat gray ERP or blue-tinted admin.
4. **Implementation Rules** — Arco-first → token-second → business-pattern-third → page-local-css-last; then skill references and `check-spec`.

Do not jump from positioning directly to custom visuals. Every visual decision must pass through philosophy and implementation rules first.

## PESDP

- **Professional** — freight/logistics language and structure
- **Efficient** — fewer lookups, clicks, errors
- **Structured** — identity · operation · auxiliary data separated
- **Dense** — high information, not cramped chaos
- **Premium** — hierarchy and restraint, not decoration

## PESDP+ Operating Principles

- **Consistency** — one design language across tokens, components, spacing, colors, icons, interactions, and behavior.
- **Readability** — key identity, state, amount/date, and next action must be scannable within seconds.
- **Action-first** — operations stay close to the data they affect; use inline actions, drawers, and contextual flows before page transitions.
- **Focus** — each scope has one primary focus and one primary action; avoid competing emphasis points.
- **Trust** — restrained colors, stable layouts, predictable interactions, and clear confirmation for risk.
- **Business Before UI** — visual decisions serve freight workflows and business efficiency before decoration.
- **Information First** — data is the product; visual design improves understanding and must not compete with information.

Priority: **efficiency > information > interaction > visual decoration**

## Operational Workbench Calibration

The product is used by freight sales, operators, and coordinators for continuous office work. The interface must optimize for high-frequency business throughput first, long-session visual comfort second, and visual beauty third.

Target experience: a modern international freight ERP/SaaS workbench. It should preserve dense visible business data, short operation paths, status scanning, and stable repeated workflows while removing old ERP signals such as heavy grids, all-blue buttons, gray form walls, and unclear hierarchy.

For list/workbench pages, keep the first viewport dominated by business data. The measurable threshold and exceptions are owned only by `redesign-calibration.md`.

Do not hide daily filters, status tabs, or reversible workflow actions merely to look minimal. Modern restraint means neutral grouping, semantic color, and one clear primary anchor, not removing the controls operators need all day.

## Default Path (No UI Design)

Most tasks in this repo have **no Figma / screenshot / visual mock**. That is the default. Do not invent a design artifact path, and do not expand the pre-read into every reference.

**Lean pre-read (blocking order):**

1. **`references/arco-first.md`** + **`references/theme-contract.md`**
2. **`references/existing-project-modernization.md`** — no-reference intake + modernization mode
3. **`references/redesign-calibration.md`** — first-viewport / surface / command-surface numbers
4. **One** archetype authority only (`list-page.md` / `detail-form.md` / `full-page-form.md` / `master-data.md` / `dashboard.md`)
5. Surface helpers only when that surface is in scope: `filter-layout.md`, `table.md`, `actions.md`, `overlay-dimensions.md`
6. **`references/page-spec-contract.md`** + typed `pageSpec.ts` for new pages / rewrites / material layout changes
7. Feature contracts **only** when the task changes click/submit/request/state behavior
8. Grep **`src/styles/global.css`** for already-justified shared APIs — never browse it as a design catalog

**Skip unless the user actually supplies an artifact:** `artifact-intake-template.md`, `prototype-to-ui-contract.md`.

**Outcome over process:** `pageSpec` prose, checklist ticks, and a green `check-spec.js` do not replace real-route before/after evidence. Without a design file, measured layout + removed visual debt + shared-API reuse are the acceptance source.

## Skill Growth Freeze

Do **not** add a new reference, duplicate gate, or longer checklist to fix a weak UI. Prefer this order:

1. Ship or extend a **shared** Arco composition / `global.css` API used by ≥2 pages
2. Make the page consume that shared API; delete page-local skin
3. Only then document a portable rule in the single authority file

A larger skill with the same page-local CSS budget is a process failure, not product progress.

## First Load (with design artifact only)

When the user provides a screenshot / Figma / annotated mock:

1. `artifact-intake-template.md` + `prototype-to-ui-contract.md`
2. Then follow the Default Path from step 1, using the translated archetype instead of inventing one from visual similarity

**Coding gate:** `.cursor/rules/spec-first-coding.mdc` — lean pre-read first; run `check-spec.js` before delivery; no-design tasks also require modernization evidence from `existing-project-modernization.md`.

Optional mirror of an existing page only when the user explicitly asks. Default: skill + Arco docs + justified `global.css` patterns.

## Reference Map

| Task | Read |
|------|------|
| **Theme / token / palette / component chrome** | **`theme-contract.md`** + `arco-first.md` + `visual-system.md` |
| **Existing project modernization with no reference image** | **`existing-project-modernization.md`** + `redesign-calibration.md` + page archetype reference |
| **Large system / which doc for which menu** | **`domain-routing.md`** |
| **Any feature with click/submit/request/state change** | **`feature-routing.md`** + **`feature-delivery-contract.md`** |
| **Any screenshot / 原型 / Figma / 视觉稿驱动任务** | **`artifact-intake-template.md`** + **`prototype-to-ui-contract.md`** + `page-archetypes.md` + `module-patterns.md` |
| Any UI task | `design-principles.md` |
| **Any icon change** | **`icons.md`** + `actions.md` / `table.md` / `feedback.md` by surface |
| **UI redesign / 布局重写 / 质感 / 普通后台味 / 新 skill 改版** | **`redesign-calibration.md`** + `visual-system.md` + archetype reference |
| **卖软件 / 融资演示 / 高级感 / 产品化 / 商业包装感** | **`product-grade-evaluation.md`** + `redesign-calibration.md` + `visual-system.md` |
| **框架优先 / 减少 global.css 依赖 / Arco-first 重构** | **`arco-first.md`** + `ai-generation-contract.md` + relevant surface reference |
| New page / module | `module-patterns.md` → `domain-language.md` → **`domain-routing.md`** |
| Page type choice | `page-archetypes.md` |
| AI page generation | **`page-spec-contract.md`** + `ai-generation-contract.md` |
| List / workbench | `list-page.md` + `table.md` + `actions.md` |
| **筛选区字段数 → 布局选型** | **`filter-layout.md`** |
| **小屏 / 分辨率适配** | **`responsive.md`** |
| Detail / form structure | `detail-form.md` + `actions.md` |
| **全页新建/编辑、客户端下单** | **`full-page-form.md`** + `form-rules.md` |
| **主数据 / 字典 / 设置** | **`master-data.md`** |
| **权限 / 角色** | **`permissions.md`** |
| **动作显隐 / 按钮可点条件 / 只读条件** | **`feature-delivery-contract.md`** + `permissions.md` |
| **提交 / 保存 / 批量 / 状态流转** | **`feature-delivery-contract.md`** + `actions.md` |
| **接口请求 / 响应 / 成功失败 / 刷新范围** | **`feature-delivery-contract.md`** |
| **空态 / 加载 / Message** | **`feedback.md`** |
| **BI / 看板** | **`dashboard.md`** |
| **Arco form 写法（校验/提交/combo）** | **`form-rules.md`** |
| **表单 Arco 控件（input/select/date）** | **`form-field.md`** |
| File upload / attachments | `upload.md` |
| Modal / dialog / confirm | `modal.md` + **`overlay-dimensions.md`** |
| Typography / i18n | `typography.md` |
| **按钮 icon / 行 icon / 模块标题 icon / 空态 icon / 菜单 icon** | **`icons.md`** |
| **Modal & drawer width** | **`overlay-dimensions.md`** |
| **Arco `size` (mini/small/medium/large)** | **`component-size.md`** |
| Color / hierarchy / “too gray” | `visual-system.md` |
| Buttons / toolbar / row actions | `actions.md` |
| VXE columns / hover / selection | `table.md` |
| Pre-delivery QA | `checklist.md` |

## Non-Negotiables

- Arco-first: prefer Arco built-ins, props, slots, and theme behavior before shared custom CSS
- Theme ownership: GI is the single Arco baseline and palette; `global.css` may alias its variables but must not redefine them or become another component skin
- `global.css` is a shared enhancement layer, not a second UI framework
- Arco + `global.css` tokens; no new color system
- `vxe-table` only; no `a-table`
- Freight terms from `domain-language.md`; no generic `步骤1` / `处理中`
- Map business object + user job before layout; no copying order fields to unrelated modules
- Exact class names are not a portable API. Use a documented shared class only when grep proves its implementation exists; otherwise preserve the required role with Arco structure plus minimal page-local layout CSS
- One `primary` per scope; row actions icon + tooltip; danger → confirm
- Generic action icons use Arco; business-semantic identity/menu/empty-state icons use IconPark; no forced icons when the metaphor is weak
- `detail-mini-vxe`: no `show-overflow`; header bg ≠ row hover bg; no checkbox without batch toolbar
- Business Arco controls: `size="small"` only — see `component-size.md` (`medium` = Arco default, forbidden)
- When the task is redesign, AI may regroup surfaces or rewrite the page skeleton if business workflow becomes clearer; do not default to structure-preserving polish. See `redesign-calibration.md`.
- When the task goal is productization, sellable SaaS quality, financing/demo quality, or "高级感", evaluate against `product-grade-evaluation.md`; do not stop at internal-system quality.
- Any feature with click/submit/request/state change must complete the functional contract: `feature_type` + `entry_point` + `actor_roles` + `visible_when` + `enabled_when` + `api_request` + `api_response` + `success_result` + `error_result` + `refresh_scope` + `verification_cases`
- Any screenshot/prototype-driven task must complete the artifact intake template and prototype translation block before coding; do not code directly from visual similarity
- UI rules must be written as AI-executable design language: scope + structure/class + token/density + state + business semantics + forbidden fallback. Vague taste rules like “更好看/更有质感/不要贴在一起” must be translated before coding.
- New pages and material rewrites must have a typed `pageSpec.ts`; every PESDP dimension requires decisions plus acceptance conditions before template code. The target grade is not an achieved grade.

## Working Protocol

1. Decide path: **no design (default)** → modernization intake; **has artifact** → artifact + prototype blocks.
2. Create/update typed `pageSpec.ts` for new pages / rewrites / material layout changes; resolve PESDP decisions + acceptance before template code.
3. If the task changes behavior, classify `feature_type` and complete the functional contract.
4. Read only the lean pre-read + the one archetype/topic authority in scope — do not preload the full reference map.
5. Repair theme ownership; reuse or extract shared APIs before page-local visual tuning.
6. Implement: Arco built-ins → tokens → grep-proven business patterns → minimal page-local CSS (budget in `existing-project-modernization.md`).
7. Run real-route inspection with before/after evidence, `node scripts/check-spec.js`, and build when possible.
8. Reconcile evidence to `pageSpec.ts` acceptance; a target without rendered evidence remains unverified.
9. Report intake/audit, shared APIs reused, page-local CSS delta, files changed, rules applied, and verification.

## Output Standard

- Existing-project audit block (**default** when no visual artifact)
- Artifact intake + prototype translation (only when an artifact exists)
- Page spec + archetype (new page / rewrite / material redesign)
- Feature mapping + delivery contract keys (behavior tasks)
- Shared APIs reused / page-local CSS lines before→after
- Files changed
- Rules applied
- Verification run (must include real-route evidence for no-design modernization)
- Remaining risks
