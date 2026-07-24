# Theme Ownership Contract

## Purpose

Use this reference for every Vue 3 + TypeScript + Arco Design Vue + VXE Table UI task. It prevents theme packages, global aliases, shared patterns, and page CSS from competing for the same visual responsibility.

The current product direction is explicit: keep the color palette from `@arco-themes/vue-gi-demo`. The official Arco token documentation is an API and role reference, not a request to redesign that palette.

## Fixed Ownership Stack

1. `@arco-design/web-vue` owns component implementation, props, slots, behavior, and TypeScript types.
2. `@arco-themes/vue-gi-demo/css/arco.css` is the only Arco component stylesheet and the only palette owner.
3. `src/styles/global.css` may expose `--dense-*` semantic aliases that directly reference the effective GI/Arco variables and own framework-neutral freight status semantics.
4. Shared business patterns own reusable freight structure only when Arco props and layout primitives are insufficient.
5. Page-scoped CSS owns local flex/grid relationships, overflow, and stable dimensions only.

Do not import `@arco-design/web-vue/dist/arco.css` beside the GI stylesheet. This project does not use `src/styles/theme.css`, project color primitives, or a second component skin.

## Ownership Matrix

| Concern | Owner | Allowed | Forbidden |
|---------|-------|---------|-----------|
| Components and interaction | `@arco-design/web-vue` | Props, slots, built-in states and accessibility | Rebuilding standard controls in custom CSS |
| Component CSS and palette | GI theme package | Effective Arco colors, radii, component chrome and interaction states | Default Arco CSS beside GI; page palettes; global reskin |
| Freight semantics | `src/styles/global.css` | Direct `--dense-*` aliases, `.s-pill[data-s]`, layout/dimension tokens | Official palette values; `.arco-*`, `.vxe-*`, framework data selectors, or `--vxe-*` variables |
| VXE behavior and density | VXE public API / shared Vue wrapper | `size`, `row-config`, column props, loading, overflow, fixed columns | Global internal-selector or theme-variable bridge |
| Shared layout patterns | Existing documented patterns | Workbench, toolbar, detail and table structure | Page fields or one-off screenshots promoted to global rules |
| Page composition | Vue scoped CSS | Local flex/grid, min/max dimensions, overflow, responsive relationships | Colors, shadows, radii or component skins that compete with GI |

## Official Token Roles

Use the official Arco documentation to understand roles:

- `--primary-5`: hover;
- `--primary-6`: normal primary;
- `--primary-7`: active/click;
- `--primary-1`: light selected or hover surface;
- `--color-bg-*`: page, container and popup surfaces;
- `--color-fill-*`: neutral interaction and secondary fills;
- `--color-text-*`: text hierarchy;
- `--color-border-*`: boundary hierarchy;
- `--border-radius-*`: component radius scale.

Arco color-scale variables store RGB channels. Consume a channel token as `rgb(var(--primary-6))`; do not use `var(--primary-6)` directly as a CSS color.

Do not redeclare official color variables in `global.css` or page CSS. The rendered GI value is the source of truth. Layout-only values such as widths, gaps, row heights, and font sizes may remain on `:root` because they do not depend on body-scoped theme values.

## Global CSS Boundary

The GI package exposes its effective official variables on `body`. Theme-dependent aliases must therefore be declared on `body` or a descendant scope. Declaring `--dense-card-border: var(--color-border-1)` on `:root` resolves before the body-scoped token exists and produces an invalid empty value.

Allowed:

```css
body {
  --dense-primary-6: rgb(var(--primary-6));
  --dense-card-border: var(--color-border-1);
  --dense-table-header-bg: var(--color-fill-1);
}
```

Forbidden:

```css
:root {
  --primary-6: 18, 104, 178;
  --color-text-1: <custom-color-value>;
}

.arco-input-wrapper {
  /* project-wide component reskin */
}
```

Global `.arco-*` and `.vxe-*` rules are forbidden. A necessary local layout selector must remain scoped to the owning Vue component and may only manage layout, overflow, or stable dimensions; reusable behavior becomes a shared Vue component.

## Theme And Layout Separation

Changing layout does not authorize changing the palette. A layout redesign may:

- merge related logical rows into one command surface;
- rebalance shell, query, action, status and data regions;
- remove duplicated cards, headings or summaries;
- change flex/grid allocation and minimum dimensions;
- improve table ownership of the first viewport.

It may not recolor controls, declare alternative neutrals, or add a page-specific palette to create perceived quality. Product quality must come from structure, hierarchy, density, and interaction clarity.

## Product Gate

1. One GI stylesheet is imported before `global.css`; default Arco CSS and `theme.css` are absent.
2. Computed `--primary-6`, `--color-text-1`, `--color-fill-2`, and `--color-border-1` come from GI on a real route.
3. Inputs, buttons, tabs, menus and drawers remain GI-native; VXE uses its native small-density public configuration without a hidden global skin.
4. Page CSS contains no alternate palette or broad Arco reskin.
5. Primary, hover, active, focus and semantic status states remain distinguishable.
6. Theme ownership changes do not reduce table dominance or cause wrapping at the minimum desktop width.

## Future Brand Theme Rule

A future project may introduce a dedicated official-token override only after the user explicitly requests a different brand theme and a verified cross-module gap is recorded. That is a separate theme migration, not part of normal page modernization. Until then, GI remains the sole palette owner.

## Verification

```bash
rg "@arco-design/web-vue/dist/arco.css|@arco-themes/vue-gi-demo|styles/theme.css" src package.json
rg "^[[:space:]]*--(primary-[0-9]+|color-(bg|fill|text|border)-[0-9]+)[[:space:]]*:" src/styles src/views
node scripts/check-spec.js
npm run build
```

Browser verification records the route, viewport, computed token sample, first-viewport data ratio for table workbenches, and remaining component-specific overrides.
