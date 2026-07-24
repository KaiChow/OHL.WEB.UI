# Icon System

## Purpose

Use this file whenever a task adds, removes, changes, or reviews any icon in:

- toolbar actions
- row actions
- module titles
- empty states
- attachment/file rows
- navigation/menu items
- status/warning affordances

Icon rules are part of the project design language. They are not optional decoration.

## Core Rule

Icons exist to **reduce recognition cost**, not to make the page look richer.

Decision rule:

```text
precise metaphor exists -> use icon
no precise metaphor -> use text only
```

If the icon does not make the action or object easier to recognize within seconds, do not add it.

## 双图标库

The project uses **two icon libraries**:

| Library | Package | Use for |
|---------|---------|---------|
| Arco icons | `@arco-design/web-vue` | generic system actions and utilities |
| IconPark | `@icon-park/vue-next` | business-semantic objects, module identity, menu identity, empty-state illustration |

## Library Split

### Selection Contract

| Scene | Preferred library | Why |
|-------|-------------------|-----|
| Search / refresh / settings / filter / expand / collapse / view / more / upload / download | Arco | stable system metaphors already match Arco controls |
| Module identity, business object markers, navigation/menu identity, domain empty state | IconPark | stronger business semantics |
| Business verbs like `订舱`, `放舱`, `流转`, `审核`, `同步报价` | none by default | verbs are read faster as text than as forced decoration |

Do not mix Arco and IconPark inside the same compact icon-only action group unless there is a documented exception.

## IconPark Defaults

`src/main.ts` must import:

```ts
import '@icon-park/vue-next/styles/index.css'
```

When using IconPark in pages/components:

| Property | Value | Rule |
|----------|-------|------|
| `theme` | `outline` | required default |
| `size` | `14` for inline/module title, `16` for menu, `32-48` for empty state | follow surface density |
| `stroke-width` | `2` to `2.5` inline, `1.5` empty state | match dense enterprise readability |
| `color` | inherit `currentColor` unless empty state or documented section accent | avoid local recoloring |

Forbidden:

- `theme="filled"`
- `theme="two-tone"`
- oversized icons inside 28-36px dense controls
- per-icon brand recoloring that overrides the surface hierarchy

## Scope Rules

### Toolbar And Button Icons

#### Utility buttons

Use **Arco** icons only.

Examples:

- `刷新` -> `icon-refresh`
- `列设置` -> `icon-settings`
- `筛选` -> `icon-filter`
- expand/collapse -> `icon-down` / `icon-up`

Rules:

- icon-only + tooltip for toolbar utilities
- do not use IconPark for generic utility buttons
- do not force icons on business verbs without universal metaphors

#### Create/add/upload/download actions

Use **Arco** icons when the metaphor is universal.

Examples:

- `新建` / `添加` -> `icon-plus`
- `上传` -> `icon-upload`
- `下载` / `导出` -> `icon-download`
- `查询` -> `icon-search`

Rules:

- icon + text is allowed for create/add/upload/download
- business workflow verbs stay text-first unless the icon is universally precise

### Row Actions

Use **Arco** icons only.

Rules:

- follow `table.md` row-action matrix
- row actions are icon-only + tooltip
- primary view/edit use `icon-eye` / `icon-edit`
- more menu uses `icon-more`
- list delete stays inside the row More menu as a text danger option; do not direct-expose a delete icon on workbench tables

### Module Title Icons

This is the primary **IconPark** scene.

Use IconPark only for **first-level business modules** that benefit from quick semantic recognition.

Examples:

- customer/contact-related module
- cargo/container-related module
- document/attachment-related module
- warehouse/trucking/ship-related module

Rules:

- place the icon to the left of the title text
- keep the title text; icon never replaces the label
- only first-level `detail-section` or equivalent large module gets the icon
- child panes, sub-panels, and minor subgroup labels do not get icons by default
- prefer `var(--dense-primary-6)` or inherited heading color with restrained opacity when a section accent is needed

### Status Pills And Warnings

Normal `s-pill[data-s]` stays **text-only**.

Rules:

- do not add icons to normal success/processing/completed pills
- risk/exception warnings may use a compact warning icon only when the warning meaning is not already fully explicit in text
- state meaning is carried by pill semantics and wording first, not by icon

### Dropdown Options

Dropdown options are **text-only by default**.

Rules:

- do not add icons to every option just for visual richness
- only use option icons when the whole menu is icon-consistent and every icon is exact
- danger options stay text-only `danger-opt`

### Empty States

This is the second primary **IconPark** scene.

Rules:

- use IconPark `outline` icons with `size="48"` for page-level empty state
- use `size="32"` for subtable/module empty state
- use `color="var(--color-text-4)"` or inherited muted empty-state tone
- choose icons by business object, not generic decoration

Examples:

- cargo-related empty state -> cargo/container metaphor
- attachment empty state -> file/document metaphor
- search-no-result empty state -> search/document metaphor

### Navigation/Menu Icons

Use **IconPark** for navigation identity when menu icons are needed.

Rules:

- `theme="outline"`
- `size="16"`
- do not set local colors; inherit menu theme
- one stable icon per menu object; do not change icon casually across sibling routes

## Surface Matrix

| Surface | Default | Library | Form |
|---------|---------|---------|------|
| Filter query/reset | 查询保留 search + text；重置正常宽度 text、紧凑宽度可 icon-only | Arco | responsive, Tooltip + aria when icon-only |
| Toolbar primary create | icon + text | Arco | `icon-plus` etc. |
| Toolbar utilities | icon-only + tooltip | Arco | compact utility |
| Toolbar business workflow | text-only by default | none | text |
| Row actions | icon-only + tooltip | Arco | `eye/edit/more` |
| Detail/module title | semantic icon + text | IconPark | left icon |
| Status pill | text-only | none | no icon by default |
| Dropdown options | text-only | none | no icons by default |
| Empty state | semantic illustration icon | IconPark | muted outline |
| Navigation/menu | semantic identity icon | IconPark | outline 16 |

## Forbidden Fallbacks

- mixing Arco and IconPark inside the same icon-only toolbar utility group
- adding icons to every button just to look more “premium”
- forcing icons on business verbs with weak metaphors
- adding icons to `detail-data-stats__item` numeric chips by default
- adding icons to normal `s-pill[data-s]`
- partially iconized dropdown menus where some options have icons and others do not
- using filled/two-tone IconPark themes in dense business surfaces
- recoloring individual icons into arbitrary green/orange/purple accents
- using IconPark for generic utility actions already covered by Arco icons

## Quick Decision Tree

```text
Need an icon?
|- generic action or utility -> Arco
|- business object / module identity / menu identity / empty state -> IconPark
|- business verb with no exact metaphor -> no icon
```

## Related References

| Reference | Why |
|-----------|-----|
| `actions.md` | button content form and action scope |
| `table.md` | row-action icon matrix |
| `detail-form.md` | section/module structure |
| `feedback.md` | empty state and warning surfaces |
| `visual-system.md` | icon color hierarchy and restraint |
