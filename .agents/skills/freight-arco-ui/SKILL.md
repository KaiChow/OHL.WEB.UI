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

## Architecture

| Layer | Location | Contains |
|-------|----------|----------|
| **Arco foundation** | `@arco-themes/vue-gi-demo` | Default owner: controls, layout, tabs, overlay, interaction states |
| **Shared enhancement CSS** | `src/styles/global.css` | Direct GI/Arco semantic aliases, density tokens, VXE bridge, freight semantics, documented archetype slots only |
| **Agent summary** | `AGENTS.md` | One-page pointer (no duplicate rules) |
| **This skill** | `SKILL.md` + `references/` | PESDP principles + executable rules |
| **Structure slots** | `module-patterns.md` | English slots only; no field lists |
| **Artifact intake** | `artifact-intake-template.md` | Minimum business context required with screenshot/prototype input |
| **Prototype translation** | `prototype-to-ui-contract.md` | Screenshot/prototype -> business object/archetype/contracts |
| **Feature contracts** | `feature-routing.md`, `feature-delivery-contract.md` | Action/state/permission/API/verification |
| **Domain copy** | `domain-language.md` | Chinese labels, statuses, object examples |
| **Component rules** | `actions.md`, `icons.md`, `table.md`, `detail-form.md`, `list-page.md` | How to implement |
| **QA** | `checklist.md`, `scripts/check-spec.js` | Pre-ship checks |

**Rule:** Arco structure first → business slots and labels from `module-patterns.md` / `domain-language.md` → thin shared enhancement from `global.css` only where needed → details in topic references. Do not duplicate long rule blocks across `AGENTS.md` / skill.

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

For list/workbench pages, aim to keep most first-screen space owned by business data, normally 70-80% when the module is table-dominant. Treat 75% as a workbench target, not a universal rule for detail, review, modal, or exception pages.

Do not hide daily filters, status tabs, or reversible workflow actions merely to look minimal. Modern restraint means neutral grouping, semantic color, and one clear primary anchor, not removing the controls operators need all day.

## First Load (minimal)

1. **`references/arco-first.md`**
2. **`references/theme-contract.md`**
3. `references/design-principles.md`
4. For an existing-project rewrite without a visual reference: **`references/existing-project-modernization.md`**
5. `references/module-patterns.md` + `references/domain-language.md` (new pages)
6. For any task with behavior or request flow: `references/feature-routing.md` + `references/feature-delivery-contract.md`
7. For any screenshot/prototype-driven task only: `references/artifact-intake-template.md` + `references/prototype-to-ui-contract.md`
8. One topic file from the map below
7. **Before template:** when the page has search or overlays, read `filter-layout.md` and `modal.md`.
8. **Before changing icon usage:** read `icons.md`.
9. **Before any redesign / 布局重写 / 质感优化 / 普通后台味反馈:** read `redesign-calibration.md`.
10. **Before any custom class or `global.css` pattern:** re-check `arco-first.md` and document why Arco + tokens are insufficient.
11. **`src/styles/global.css`** — only after steps 1–10; grep tokens/patterns already justified, do not browse the file as the primary design catalog.

**Coding gate:** `.cursor/rules/spec-first-coding.mdc` — read references first; run `check-spec.js` before delivery.

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
| AI page generation | `ai-generation-contract.md` |
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
- Structural classes (`dds-head`, `detail-section`, `table-card-cap`) are slots — content follows the object
- One `primary` per scope; row actions icon + tooltip; danger → confirm
- Generic action icons use Arco; business-semantic identity/menu/empty-state icons use IconPark; no forced icons when the metaphor is weak
- `detail-mini-vxe`: no `show-overflow`; header bg ≠ row hover bg; no checkbox without batch toolbar
- Business Arco controls: `size="small"` only — see `component-size.md` (`medium` = Arco default, forbidden)
- When the task is redesign, AI may regroup surfaces or rewrite the page skeleton if business workflow becomes clearer; do not default to structure-preserving polish. See `redesign-calibration.md`.
- When the task goal is productization, sellable SaaS quality, financing/demo quality, or "高级感", evaluate against `product-grade-evaluation.md`; do not stop at internal-system quality.
- Any feature with click/submit/request/state change must complete the functional contract: `feature_type` + `entry_point` + `actor_roles` + `visible_when` + `enabled_when` + `api_request` + `api_response` + `success_result` + `error_result` + `refresh_scope` + `verification_cases`
- Any screenshot/prototype-driven task must complete the artifact intake template and prototype translation block before coding
- Any screenshot/prototype-driven task must complete the prototype translation block before coding; do not code directly from visual similarity
- UI rules must be written as AI-executable design language: scope + structure/class + token/density + state + business semantics + forbidden fallback. Vague taste rules like “更好看/更有质感/不要贴在一起” must be translated before coding.

## Working Protocol

1. Fill slot mapping (`module-patterns.md` template).
2. For an existing project with no reference image, complete the no-reference intake and measured audit from `existing-project-modernization.md`.
3. If the task comes from a screenshot/prototype, complete the artifact intake template and prototype translation block.
4. If the task has behavior, classify `feature_type` and complete the functional contract.
5. Pick archetype; read topic references.
6. Repair theme ownership before page-local visual tuning.
7. Implement in priority order: Arco built-ins → official/project tokens → documented business patterns → minimal page-local CSS.
8. Run real-route visual inspection, `node scripts/check-spec.js`, and build when possible.
9. Report object mapping, applicable intake/audit, product-grade evidence, files changed, rules applied, and verification.

## Output Standard

- Slot mapping + archetype (design/generation tasks)
- Existing-project audit block when no visual artifact is supplied
- Artifact intake block (screenshot/prototype-driven tasks)
- Prototype translation block (screenshot/prototype-driven tasks)
- Feature mapping + delivery contract keys (behavior tasks)
- Files changed
- Rules applied
- Verification run
- Remaining risks
