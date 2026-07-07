# Arco-First Contract

## Purpose

Use this reference when deciding **whether a page should rely on Arco built-ins or project custom CSS/classes**.

This project is not trying to replace Arco. The default strategy is:

**Arco first, project enhancement second, page-local CSS last.**

## Core Rule

Before creating or keeping a custom layout/style pattern, ask:

1. Can Arco already solve this with props, slots, layout primitives, or theme tokens?
2. Can the remaining gap be solved by a thin shared enhancement in `global.css`?
3. Only if both answers are no, create a new custom pattern.

Do not start from custom wrappers when Arco already provides a stable surface.

## Layering Model

Use this stack in order:

1. **Arco foundation**
   - layout
   - form controls
   - tabs
   - buttons
   - drawer / modal
   - dropdown
   - basic spacing and interaction behavior

2. **Project shared enhancement**
   - brand-neutral shell rhythm
   - freight semantic status system
   - VXE bridge and table density
   - a small number of reusable workbench/detail surfaces

3. **Business pattern layer**
   - workbench archetype
   - object detail workspace archetype
   - freight workflow/risk/next-action semantics

4. **Page-local CSS**
   - only for page shell or truly local visual gaps
   - must stay small

## What Arco Should Own By Default

Arco should remain the default owner of:

- button structure and states
- input/select/date-picker appearance
- tabs interaction
- modal/drawer mechanics
- dropdown mechanics
- form alignment and validation chrome
- base layout primitives

Do not recreate these from scratch with local containers unless the business interaction truly cannot be expressed with Arco.

## What Project CSS May Own

Shared project CSS may own:

- shell/product frame
- workbench page zone rhythm
- VXE table bridge
- semantic status pills
- detail identity band and summary rails
- small reusable freight-specific structures

It must **not** become a second UI framework that redefines every Arco control surface.

## Allowed Customization

Custom shared CSS is justified only for these cases:

### 1. Freight business semantics

Examples:

- `.s-pill[data-s]`
- milestone semantics
- risk / next-action patterns

### 2. VXE + Arco integration

Examples:

- workbench table density
- readonly vs editable detail-mini-vxe variants
- table hover/selection harmony

### 3. Product shell / archetype structure

Examples:

- shell framing
- workbench page zone layering
- detail object identity band

## Avoid These Anti-Patterns

- using `global.css` to restyle every Arco control as if Arco were not present
- wrapping every section in new custom containers when Arco layout primitives are enough
- adding custom classes when `type`, `status`, `size`, `layout`, `allow-clear`, `position`, or existing Arco structure already solves it
- depending on one giant global stylesheet for every visual decision
- page code that only works because of undocumented global side effects

## Decision Rules

### Use Arco-only when

- the problem is standard UI structure
- the page needs normal form/layout behavior
- built-in hierarchy is sufficient
- the issue is not freight-specific

### Use Arco + shared enhancement when

- Arco behavior is correct but the system needs unified product rhythm
- VXE must visually align with Arco
- freight semantics need shared expression

### Use new custom pattern when

- the interaction is truly business-specific
- the pattern is likely reusable across modules
- Arco and existing shared enhancement are both insufficient

## Rewrite Guidance

When refactoring an existing page:

- first remove unnecessary custom layers
- then fall back to Arco-native structure where possible
- then re-apply only the minimum shared freight/product enhancements

Do not "improve" a page by piling a new custom skin on top of Arco.

## Output Standard

When the user asks for architecture cleanup, framework-first cleanup, or reducing global CSS dependence, report:

```text
arco_first_decision:
arco_owned_parts:
shared_enhancement_parts:
custom_pattern_parts:
global_css_reduced:
remaining_risks:
```

`arco_first_decision` should be one of:

- `arco-only`
- `arco-plus-shared-enhancement`
- `custom-pattern-required`
