# Density & Long-Term Fatigue Prevention

Rules for maintaining high information density without causing visual fatigue over long work sessions.

Design target: users work 4–8 hours per day in this system. Every design decision must account for sustained use.

---

## Core Principle

**High density ≠ high noise.**

Density means: more information per square pixel.
Noise means: more visual elements competing for attention.

The goal is maximum information density with minimum visual noise.

---

## Background Neutrality

Page background must be neutral and low-saturation. Never use colored, gradient, or textured backgrounds.

```css
/* ✅ Correct */
.content-area { background: var(--color-fill-2); }  /* light gray, ~#f2f3f5 */
.card         { background: var(--color-bg-2);   }  /* white or near-white */

/* ❌ Forbidden */
background: linear-gradient(135deg, #667eea, #764ba2);  /* colored gradient */
background: #e8f4ff;   /* tinted blue — causes fatigue */
background-image: url(pattern.svg);  /* texture */
```

Rule: Content area background should be `var(--color-fill-2)`. Cards/panels use `var(--color-bg-2)`.

---

## Primary Color Frequency

Blue (`rgb(var(--primary-6))`) is the highest-attention color. Use sparingly:

| Usage | Limit |
|---|---|
| Primary buttons | 1 per toolbar |
| Active state (tabs, nav items, filter chips) | Allowed freely |
| Table links / order numbers | Allowed |
| Section title markers (3px bar) | Allowed |
| Body text | ❌ Never |
| Background fills | ❌ Never (use `rgb(var(--primary-1))` for tints only) |
| Borders | ❌ Never (except active/focus states) |

Limit decorative blue elements to < 10% of the visible page area. When everything is blue, nothing stands out.

---

## Color Count Per Page

| Color role | Max count |
|---|---|
| Status colors (tags) | 6 (Arco predefined: orange / arcoblue / green / red / gray / cyan) |
| Background tints | 2 (neutral fill + white) |
| Text colors | 4 (text-1 / text-2 / text-3 / text-4) |
| Accent (primary-6) | Use for interactive elements only |
| Warning / danger | Reserved for actual errors and destructive actions |

Never introduce new colors outside this set. Color inflation is the #1 cause of visual fatigue.

---

## Text Contrast Rules

Follow WCAG AA minimum (4.5:1 for normal text):

```text
Primary text (values, order nos): var(--color-text-1)  — high contrast
Labels / field names:             var(--color-text-2)  — medium contrast
Auxiliary / muted text:           var(--color-text-3)  — lower, used sparingly
Disabled / placeholder:           var(--color-text-4)  — lowest
```

Do NOT use `var(--color-text-3)` for primary data — it strains eyes at scale.
Do NOT use `var(--color-text-1)` for labels — wastes contrast budget, makes values indistinct.

---

## Spacing Rhythm (Avoid Claustrophobia)

Dense does not mean zero whitespace. Consistent micro-spacing creates visual rhythm that prevents fatigue.

```text
Between field rows inside a grid:    8px
Between sections/cards:              8px
Between groups within a section:     12px
Card internal padding:               10px 14px
Section header padding:              8px 14px
```

Rhythm rule: spacing should be consistent within a zone. Do not mix 6px, 8px, 10px, 12px randomly in the same grid — pick one and stay with it.

---

## Typography Fatigue Prevention

```text
Body / cell text:     400 weight, 12–13px
Labels:               400 weight, 12px, color-text-2
Section titles:       600 weight, 13px
Order numbers/links:  600–700 weight, primary-6 color
```

Rules:
- Do not bold entire rows — bold only primary identifiers (order no, business no).
- Do not use ALL CAPS for labels — increases cognitive load.
- `font-variant-numeric: tabular-nums` on all numbers so columns align visually.
- Line height: 1.4–1.5 for body text. Never below 1.3.

---

## Icon Usage

Icons reduce scan time when used for repeated actions. Rules:

- Table row action icons: max 2 visible, rest in `...` dropdown.
- Toolbar icon-only buttons: max 3 (refresh, settings, export).
- Never use icons as decorative elements next to text labels in forms.
- Status icons: only inside tags, never floating alone.
- Icon size in tables: 14px. Icon size in toolbars: 16px.

---

## Motion and Animation

For a business tool used 8 hours/day, minimize animation:

```css
/* ✅ Allowed — functional state feedback */
transition: background 0.15s;   /* hover state */
transition: color 0.15s;        /* active state */

/* ⚠️ Limit to once per interaction */
scroll-behavior: smooth;        /* anchor nav scroll */

/* ❌ Forbidden */
animation: spin 2s infinite;    /* spinning decorations */
@keyframes pulse { ... }        /* pulsing effects */
transition: all 0.5s;           /* slow transitions */
```

Rule: Transitions should be 100–200ms max. Nothing should animate continuously.

---

## Summary Checklist

- [ ] Page background is `var(--color-fill-2)` (neutral gray), not colored/gradient.
- [ ] Primary blue used on < 10% of visible area.
- [ ] No more than 6 status colors on any single page.
- [ ] Text contrast: values in `color-text-1`, labels in `color-text-2`, never mixed.
- [ ] Spacing within each zone is consistent (same gap value throughout a grid).
- [ ] No ALL CAPS labels. No bold body text.
- [ ] Numbers use `font-variant-numeric: tabular-nums`.
- [ ] Transitions ≤ 200ms. No continuous animations.
- [ ] No colored backgrounds on cards or sections (white / near-white only).
