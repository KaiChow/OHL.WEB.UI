---
name: freight-arco-ui
description: Project UI skill for FE.OHL.WEB.UI. Use when designing, reviewing, or implementing any Vue 3 + TypeScript + Arco Design Vue + @arco-themes/vue-gi-demo + VXE Table freight SaaS page under the PESDP Design System 2.0: Professional, Efficient, Structured, Dense, Premium. Covers list pages, detail drawers, long forms, tabs, toolbars, status pills, table styling, dense layout, color hierarchy, visual quality, and UI规范/不好看/质感/高密度 feedback.
---

# Freight Arco UI Skill

Project-level **UI delivery contract** for `FE.OHL.WEB.UI`.

**Source of truth:** `ui-skill/freight-arco-ui/` → run `npm run sync-ui-skill` after edits.

**Synced to:** `.cursor/skills/`, `.agents/skills/`, `.claude/skills/`

## Architecture (read this first)

| Layer | Location | Contains |
|-------|----------|----------|
| **Tokens & layout CSS** | `src/styles/global.css` | Classes, colors, table/button chrome |
| **Agent summary** | `AGENTS.md` | One-page pointer (no duplicate rules) |
| **This skill** | `SKILL.md` + `references/` | PESDP principles + executable rules |
| **Structure slots** | `module-patterns.md` | English slots only; no field lists |
| **Domain copy** | `domain-language.md` | Chinese labels, statuses, object examples |
| **Component rules** | `actions.md`, `table.md`, `detail-form.md`, `list-page.md` | How to implement |
| **QA** | `checklist.md`, `scripts/check-spec.js` | Pre-ship checks |
| **Archive** | `legacy-design-manual.md` | Historical; do not read for new work |

**Rule:** Structure in English slots → labels from `domain-language.md` → CSS from `global.css` → details in topic references. Do not duplicate long rule blocks across `AGENTS.md` / `CLAUDE.md` / skill.

## Four-Layer Prompt Model

All agents should understand the project in this order:

1. **Product Positioning** — build a professional freight operations workbench for sales, operators, and coordinators, not a decorative dashboard or traditional ERP sheet.
2. **Design Philosophy** — business workflows, readability, consistency, trust, and operational efficiency come before decoration.
3. **Visual Language** — restrained Arco-based enterprise SaaS: brand-neutral surfaces, white work areas, clear hierarchy, high density, low visual noise; never flat gray ERP or blue-tinted admin.
4. **Implementation Rules** — use `global.css` tokens, Arco/VXE components, skill references, and `check-spec` rules.

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

1. `src/styles/global.css`
2. `references/design-principles.md`
3. `references/module-patterns.md` + `references/domain-language.md` (new pages)
4. One topic file from the map below
5. **Before template:** when the page has search or overlays, read `filter-layout.md` and `modal.md`.

**Coding gate:** `.cursor/rules/spec-first-coding.mdc` — read references first; run `check-spec.js` before delivery.

Optional mirror of an existing page only when the user explicitly asks. Default: skill + `global.css`.

## Reference Map

| Task | Read |
|------|------|
| **Large system / which doc for which menu** | **`domain-routing.md`** |
| Any UI task | `design-principles.md` |
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
| **空态 / 加载 / Message** | **`feedback.md`** |
| **BI / 看板** | **`dashboard.md`** |
| **Arco form 写法（校验/提交/combo）** | **`form-rules.md`** |
| **表单字段统一尺寸（filter/modal/detail）** | **`form-field.md`** |
| File upload / attachments | `upload.md` |
| Modal / dialog / confirm | `modal.md` + **`overlay-dimensions.md`** |
| Typography / i18n | `typography.md` |
| **Modal & drawer width** | **`overlay-dimensions.md`** |
| **Arco `size` (mini/small/medium/large)** | **`component-size.md`** |
| Color / hierarchy / “too gray” | `visual-system.md` |
| Buttons / toolbar / row actions | `actions.md` |
| VXE columns / hover / selection | `table.md` |
| Pre-delivery QA | `checklist.md` |
| Legacy only | `legacy-design-manual.md` |

## Non-Negotiables

- Arco + `global.css` tokens; no new color system
- `vxe-table` only; no `a-table`
- Freight terms from `domain-language.md`; no generic `步骤1` / `处理中`
- Map business object + user job before layout; no copying order fields to unrelated modules
- Structural classes (`dds-head`, `detail-section`, `table-card-cap`) are slots — content follows the object
- One `primary` per scope; row actions icon + tooltip; danger → confirm
- `detail-mini-vxe`: no `show-overflow`; header bg ≠ row hover bg; no checkbox without batch toolbar
- Business Arco controls: `size="small"` only — see `component-size.md` (`medium` = Arco default, forbidden)
- UI rules must be written as AI-executable design language: scope + structure/class + token/density + state + business semantics + forbidden fallback. Vague taste rules like “更好看/更有质感/不要贴在一起” must be translated before coding.

## Working Protocol

1. Fill slot mapping (`module-patterns.md` template).
2. Pick archetype; read topic references.
3. Implement with `global.css` classes; scoped CSS only for page shell.
4. Run `node scripts/check-spec.js` and build when possible.
5. Report object mapping, files changed, rules applied, verification.

## Output Standard

- Slot mapping + archetype (design/generation tasks)
- Files changed
- Rules applied
- Verification run
- Remaining risks
