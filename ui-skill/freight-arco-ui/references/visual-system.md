# Visual System

## Goal

Build a modern dense freight SaaS interface under PESDP: clear hierarchy, compact operations, Arco-native theme color, low visual noise, and long-term comfort.

The system must not look like a gray traditional ERP. It also must not look like a decorative marketing SaaS.

Premium quality must come from order, consistency, hierarchy, and restraint. Do not use visual decoration to compensate for weak information architecture.

## Color Rhythm

| Layer | Rule |
|------|------|
| Page background | Use `--dense-page-bg`: light primary tint at the top, then `color-bg-body`. |
| Cards | Use white `color-bg-card`, subtle border, and `--dense-shadow-card`. |
| Active navigation | Use `primary-1/2/6/7`, not custom blue. |
| Table header | Use light primary tint or `color-bg-card` with a clear primary bottom line. |
| Status | Use semantic tokens only: `warning`, `primary`, `success`, `danger`, `cyan`, `purple`, neutral. |
| Disabled/empty | Use `color-text-4` and `color-fill-1/2`, only for low-priority information. |

Use Arco Design Vue and `@arco-themes/vue-gi-demo` as the color source. Do not build an independent palette.

## Gray Budget

- Do not let gray occupy the page without a primary anchor.
- `color-text-4` is only for empty value, disabled state, timestamps, or helper text.
- `color-fill-1/2` is only for secondary containers or disabled controls.
- Main business values use `color-text-1`.
- Interactive values use `primary-6`.
- Page-level gray is allowed only as a quiet base. Key active navigation, primary operation, selected state, and core links must create a visible Arco-primary rhythm.

## Information Hierarchy

Order of visual strength:

1. Page active nav / primary action / core link: `primary-6`.
2. Business key data: `color-text-1`, `--dense-font-data`.
3. Normal fields: `color-text-2`.
4. Helper/meta: `color-text-3`.
5. Empty/disabled: `color-text-4`.

## Status System

Use `.s-pill[data-s]`.

| data-s | Meaning |
|--------|---------|
| `wait` | waiting, pending, attention |
| `op` | processing, operating, in progress |
| `partial` | partial completion |
| `acc` | accepted, received, completed-like info |
| `rel` | released, settled, done |
| `draft` | draft, inactive |
| `rej` | rejected, exception, overdue, reversal |

Never color an entire table row by status.

## Premium Dense Rules

- Prefer subtle border + surface hierarchy over strong shadows.
- Prefer Arco default radius unless a global dense token already defines otherwise.
- Keep long-term reading comfortable: no heavy contrast blocks, no saturated full-width backgrounds.
- Use whitespace as grouping rhythm, not as decorative emptiness.
- If a page feels "plain", first improve hierarchy and business grouping, then adjust token-based color accents.

## Hard Bans

- No standalone hex colors in new UI CSS.
- No large gray panels that do not carry hierarchy.
- No decorative gradients except the approved subtle page/surface tint based on Arco primary tokens.
- No `font-weight: 700/800` in business UI.
- No negative letter spacing.
- No large-radius consumer SaaS styling unless Arco default component radius produces it.
