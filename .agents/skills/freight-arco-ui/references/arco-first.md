# Arco-First Productization Contract

## Purpose

Use this reference when deciding **whether a page should rely on Arco built-ins or project custom CSS/classes**.

This project is **not** replacing Arco. The default strategy is:

**Arco drives the page. `global.css` is a thin enhancement layer, not a second UI framework.**

## Execution Priority (mandatory order)

Apply decisions in this order. Do not skip to a lower layer when a higher layer can solve the problem.

| Priority | Layer | Question |
|----------|-------|----------|
| 1 | **Arco-first** | Can Arco props, slots, layout primitives, or built-in structure solve this? |
| 2 | **Token-second** | Can Arco theme tokens or existing `--dense-*` / semantic tokens solve the remaining gap? |
| 3 | **Business-pattern-third** | Does freight semantics, workbench archetype, or VXE bridge require a shared project pattern? |
| 4 | **Page-local-css-last** | Is there a truly local shell gap that cannot be shared? Keep it small. |

Shorthand: **Arco-first → token-second → business-pattern-third → page-local-css-last**

## Core Rule

Before creating or keeping a custom layout/style pattern, ask:

1. Can Arco already solve this with props, slots, layout primitives, or theme tokens?
2. Can the remaining gap be solved by an Arco CSS variable or an existing token in `global.css`?
3. Does freight semantics, workbench archetype, or VXE integration require a shared project pattern?
4. Only if all three above are no, add page-local CSS — and keep it minimal.

**Every shared custom class must document why Arco + tokens were insufficient.** If you cannot state the gap in one sentence, do not add the class.

Do not start from custom wrappers when Arco already provides a stable surface.

## Layering Model

Use this stack in order:

### 1. Arco foundation (default owner)

Arco should own by default:

- layout primitives (`a-space`, `a-row` / `a-col`, `a-layout` where appropriate)
- form controls and validation chrome
- button structure and states
- tabs interaction
- modal / drawer / dropdown mechanics
- base spacing, radius, shadow, and interaction behavior

**Prefer Arco props over custom classes:**

- `type`, `status`, `size`, `layout`, `allow-clear`, `position`, `long`, `loading`
- built-in slots instead of wrapper divs
- Arco form layout instead of hand-rolled label/control rows for standard fields

### 2. Token enhancement

When Arco behavior is correct but the product needs unified rhythm:

- Arco Design Vue CSS variables (`--primary-*`, `--color-*`, etc. from `@arco-design/web-vue`)
- project `--dense-*` tokens already in `global.css`
- semantic color aliases (`--danger-6`, `--warning-6`, etc.)

Do not write new CSS when an existing token already expresses the intent.

### 3. Business pattern layer (shared, justified)

Shared project CSS may own only these categories:

| Category | Examples | Why Arco alone is not enough |
|----------|----------|------------------------------|
| Freight business semantics | `.s-pill[data-s]`, milestone semantics, risk / next-action patterns | Arco Tag/Badge has no freight status vocabulary |
| Workbench archetype | `filter-card`, `toolbar`, `table-card-cap`, `detail-section` | Repeated freight list/detail shells need stable slots |
| VXE + Arco bridge | `workbench-table`, `detail-mini-vxe`, table density / hover harmony | VXE is not an Arco component; bridge is required |

These are **structural slots**, not replacements for Arco controls inside them.

### 4. Page-local CSS (last resort)

- page shell only (`xp-wrap`, `xf-wrap`, route-specific flex/overflow)
- truly local visual gaps with no reuse potential
- must stay small; promote to `global.css` only after a second module needs the same pattern

## What `global.css` Contains

`src/styles/global.css` is a shared enhancement layer. The target is small and explicit. It may contain:

| Layer | Content |
|-------|---------|
| Base | `html/body/#app` reset, min-width |
| Tokens | `:root` `--dense-*` density and semantic color aliases |
| VXE bridge | `--vxe-*` theme bridge, `.workbench-table`, `.detail-mini-vxe`, `.compact` row height |
| Freight semantics | `.s-pill[data-s]`, `.link-text`, `.mono` |
| Documented transition slots | Existing list/detail/filter/toolbar shell slots that are already documented and reused |
| Row actions | `.row-actions`, `.row-action-btn` inside VXE tables only |

**Target after slimming:** layout archetypes should move toward Arco structure plus small scoped shell CSS. Existing documented slots may remain during transition, but new global layout archetypes require a clear `why_arco_not_enough`.

**Forbidden in `global.css`:** new one-off page shells, app shell chrome, page-specific business-field classes, and **broad** `.arco-*` layout overrides.

**Allowed in `global.css`:** `:root` Arco semantic token bridge (surface/fill/border), a compact **Arco surface bridge** for control white-surface + disabled gray, VXE row-action fixes, and `detail-display` read-only descriptions.

New layout patterns start as **Arco components** or **Vue scoped CSS**. Promote to `global.css` only after reuse is proven and the Arco gap is documented.

## What `global.css` Is NOT

`global.css` must **not**:

- restyle every Arco control as if Arco were not present
- become the primary decision layer for buttons, inputs, tabs, or overlays
- define behavior that should be Arco props
- create undeclared side effects that pages depend on implicitly

If removing a `global.css` rule would break standard Arco surfaces (button, input, tab, modal), that rule is probably wrong scope.

## Anti-Patterns

- **Taking over Arco** — wrapping every section in custom containers when Arco layout is enough
- **global.css-driven pages** — choosing class names before trying Arco structure
- **Undocumented enhancement** — shared CSS with no stated Arco/token gap
- **Second framework** — redefining Arco control surfaces project-wide via deep overrides
- **Page fragility** — page only works because of undocumented global side effects

## Decision Rules

### Use Arco-only when

- standard UI structure (form, list actions, overlay, tabs)
- built-in hierarchy is sufficient
- the issue is not freight-specific

### Use Arco + token when

- Arco structure is correct
- only rhythm/density/color alias needs alignment
- no new DOM archetype is required

### Use Arco + shared business pattern when

- VXE must align with Arco workbench rhythm
- freight semantics need shared expression
- a documented archetype slot is required (`list-page.md`, `detail-form.md`, etc.)

### Use new custom pattern when

- Arco, tokens, and existing shared patterns are all insufficient
- the interaction is truly business-specific
- the pattern is likely reusable across modules
- you can state **why Arco is not enough** in one sentence

## Rewrite Guidance

When refactoring an existing page (e.g. `shipment/export-orders`):

1. **Strip** unnecessary custom layers and global.css-dependent hacks
2. **Restore** Arco-native structure (props, slots, layout primitives)
3. **Re-apply** only minimum tokens and documented business patterns
4. **Report** what stayed Arco-only vs what still needs shared enhancement

Do not "improve" a page by piling a new custom skin on top of Arco.

## Reference Read Order (Arco-first tasks)

1. `arco-first.md` (this file)
2. Arco component docs for the surfaces in scope
3. Task archetype reference (`list-page.md`, `detail-form.md`, etc.)
4. `global.css` — only for tokens/patterns you have already justified
5. `check-spec.js` + `checklist.md`

## Output Standard

When the user asks for architecture cleanup, framework-first cleanup, or reducing global CSS dependence, report:

```text
execution_priority_applied: arco-first | token-second | business-pattern-third | page-local-css-last
arco_owned_parts:
token_only_parts:
shared_enhancement_parts:
custom_pattern_parts:
why_arco_not_enough:   # required for each shared_enhancement / custom_pattern item
global_css_reduced:
remaining_risks:
```

`execution_priority_applied` is the **highest layer used** for the main visual decision on the page.

Legacy field `arco_first_decision` maps as:

- `arco-only` → Arco-first (maybe token-second for color/density)
- `arco-plus-shared-enhancement` → business-pattern-third
- `custom-pattern-required` → business-pattern-third or page-local-css-last
