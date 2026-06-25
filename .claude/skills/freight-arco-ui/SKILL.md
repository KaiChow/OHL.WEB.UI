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

## PESDP

- **Professional** — freight/logistics language and structure
- **Efficient** — fewer lookups, clicks, errors
- **Structured** — identity · operation · auxiliary data separated
- **Dense** — high information, not cramped chaos
- **Premium** — hierarchy and restraint, not decoration

Priority: **efficiency > information > interaction > visual decoration**

## First Load (minimal)

1. `src/styles/global.css`
2. `references/design-principles.md`
3. `references/module-patterns.md` + `references/domain-language.md` (new pages)
4. One topic file from the map below

Reference implementation: `src/views/orderManage/saleOrder/`

## Reference Map

| Task | Read |
|------|------|
| Any UI task | `design-principles.md` |
| New page / module | `module-patterns.md` → `domain-language.md` |
| Page type choice | `page-archetypes.md` |
| AI page generation | `ai-generation-contract.md` |
| List / workbench | `list-page.md` + `table.md` + `actions.md` |
| **筛选区字段数 → 布局选型** | **`filter-layout.md`** |
| **小屏 / 分辨率适配** | **`responsive.md`** |
| Detail / form structure | `detail-form.md` + `actions.md` |
| **Arco form 写法（校验/提交/combo）** | **`form-rules.md`** |
| File upload / attachments | `upload.md` |
| Modal / dialog / confirm | `modal.md` |
| Typography / i18n | `typography.md` |
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
