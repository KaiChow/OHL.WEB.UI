# Query Filter Layout

> Class names and `--dense-*` tokens in this document are the reference implementation; the rules are the contract, the symbols are replaceable.

## Authority And Boundary

This file owns query-field priority, placement selection, alignment capacity, query-state behavior, advanced-filter composition, and acceptance evidence.

It does not define a second component framework:

- Start with Arco Form, Grid, Input Group, Space, Badge, Drawer, and their props.
- A class name shown in an example is a local semantic hook, not a reusable API. Reuse requires a real shared Vue component or composable found by `rg`.
- Page CSS may arrange local grid, flex, stable width, and overflow relationships. It must not reskin Arco inputs, drawers, buttons, or popup chrome.
- Field count is a complexity signal only. Frequency, task continuity, and the typed alignment budget decide placement; count never selects a DOM pattern by itself.

The command-surface height and first-viewport table budget are owned by `existing-project-modernization.md`. Control dimensions and typography are owned by `form-field.md`.

## Query Field Classification

Classify every available condition before choosing a layout.

| Layer | User job | Default surface |
|------|----------|-----------------|
| Locate | Find a known record or very small result set | Required page field unless the page has no query surface |
| Narrow | Repeatedly reduce the current work queue | User-configurable page or drawer field |
| Investigate | Diagnose occasional attributes, ranges, flags, or audit conditions | Drawer by default; movable only when the page contract permits it |

The default row answers: "What does the target operator enter first to find the object now?" Do not promote a field merely because it exists in the API.

## Semantic Width Grid
Visible query fields use the shared `semantic-grid-v1` capability around Arco Form controls. Pages declare field meaning; they do not invent breakpoints, spans, fixed input widths, or page-wide caps independently. Treat `standard` as one allocation (`4` tracks), `range` / `composite` as paired controls (`6`), and `batch` as two allocations (`8`) for values plus clear/edit affordances.

| Width role | Use for | Do not use for |
|------------|---------|----------------|
| `compact` | Short enum/status, owner, region, yes/no/all choice | Free text, date ranges, connected controls |
| `standard` | Normal Input/Select such as customer, keyword, warehouse | Long composite identifiers or ranges |
| `wide` | A proven long-label or long-option field that needs more scan width | Making an ordinary field look important |
| `composite` | One connected selector + input identifier control | Two unrelated conditions grouped together |
| `range` | Date/time or numeric range with two visible endpoints | A single date or short enum |
| `batch` | Hybrid multi-value query: direct single value; multi-paste commits immediately, keeps normalized values visible and count on the editor affordance; provide direct one-click clear outside the editor; normalize Unicode width/quotes/separators, de-duplicate in first-seen order, and open Popover only for over-limit/business-validator errors or review; preserve case and accept every non-empty token unless contracted otherwise | Built-in ID regex/case conversion, count without values, clear only inside editor, mandatory editor, tags/raw lines in the row, silent discard |

### Four Width Decisions

Do not collapse these into one `max-width`:

1. **Surface width**: the query surface normally follows the list/table work surface.
2. **Grid width**: the field grid consumes the surface inner width unless another visible region owns the remainder.
3. **Field width**: semantic roles bound control width and prevent stretched chrome.
4. **Visibility**: Locate/Narrow/Investigate priority decides whether a field is visible; free space alone does not promote an Investigate field.

A full-width bordered query surface with a left-pinned capped grid and an unowned blank region is a layout defect, not breathing room. A grid cap is allowed only when it is centered with the whole work surface or the remaining width is visibly owned by context, help, preview, or another documented region.

### Shared Track Model

Use one shared responsive track model so wider containers gain tracks instead of wider controls. A logical track stays roughly `40-56px` across supported desktop profiles at 100% zoom: `compact` spans 3, `standard` 4, `wide` / `composite` / `range` 6, and `batch` 8 tracks. The normal action slot spans 5 tracks, the wide three-command slot 9, and the expanded action slot 10 only when a proven localized command set needs it.

- Derive track count from the **query container's inner width**, not the browser width. Keep enough tracks for the supported 1024px desktop and add tracks as the container grows through 1440px and 1920px evidence.
- Controls fill their semantic item, but the shared grid bounds the effective track size. Do not make a customer Select 400px wide merely because the monitor is wide.
- Place query actions immediately after the last configured page field, separated by one shared column gutter. Stability means a deterministic position after the saved field sequence, not flush-right alignment across the query surface. Reserve the action slot first; reject an over-capacity preference before allowing actions to wrap, clip, shrink, iconify, or moving a field without user intent.
- At the same container width, the same ordered roles and action set produce the same widths, wrapping, and action alignment across routes.
- A business difference changes the semantic role or field priority in `pageSpec.ts`; it never introduces page-local spans.
- Only a connected control's internal selector may use a stable bounded width based on its longest legal option.
- Advanced drawers keep their documented two-column/one-column composition; list-row tracks do not leak into the drawer.

Start with Arco Grid when its 24 columns satisfy all supported widths. When a fixed 24-column grid would either stretch fields or require a narrow left-pinned `max-width` on wide desktop, the shared `QueryFieldGrid` may use CSS Grid for layout only. Record the reusable gap as: `Arco's fixed 24-column model cannot preserve bounded semantic field widths while adding wide-desktop capacity.` Arco continues to own Form, controls, validation, focus, and component chrome.
Reference algorithm: derive the minimum supported track count from the query container; reserve the localized `5/9/10`-track action item; map page fields to `3/4/6/8` spans; validate their sum against `minimumTracks * pageRows - actionTracks`; then verify wrapping and DOM/focus order at every larger profile. Implement normalization and capacity validation once in a shared component/composable, not in pages.

### Space-Use Decision

After placing bounded fields, inspect unused space in this order:

1. Keep all proven Locate and daily Narrow fields directly reachable.
2. Use added wide-container tracks to reduce avoidable wrapping; do not promote a drawer field merely because a wider monitor has space.
3. Keep Investigate fields in the advanced surface even when space exists.
4. Accept only the normal tail of the final field row; do not stretch the last field or invent decoration.

Measure `grid width / query-surface inner width` at wide desktop. Below `80%` fails when the surface is full-width, left-aligned, and the remainder has no documented owner. This is a project composition gate, not a universal screen-filling target; field occupancy inside the grid may remain lower because semantic widths and field count still govern it.

## Placement Decision

Every list page selects one query placement mode after classifying fields and calculating its minimum-width alignment budget.

| Mode | Use when | Page surface | Secondary surface |
|------|----------|--------------|-------------------|
| `none` | No user-entered conditions exist | none | none |
| `fixed-inline` | Every condition is Locate/daily Narrow and the full semantic width fits the declared aligned row budget | all fields in stable order | none |
| `page-and-drawer` | Any permitted field is secondary, roles need different daily fields, or all fields do not fit the aligned budget | required defaults plus the user's saved ordered page fields | every remaining field in a grouped drawer |
| `saved-query-workspace` | Condition volume and repeatable combinations justify named views and a real persistence/permission contract | core Locate fields | saved queries; grouped D2 drawer is the complete fallback |

Field count may prompt a complexity review, but it cannot promote/demote fields or select a mode. A four-field page can need a drawer; a ten-field specialist page can remain fixed-inline if all roles fit the explicitly verified two-row budget.

## Placement Contracts

### No Query Surface

- Render no empty query card, divider, placeholder controls, or disabled query button.
- When the route or parent object pre-scopes data, show that scope once as context instead of inventing a control.

### Fixed Inline

- Compose fields with Arco Form/Grid and keep query actions adjacent to the final field.
- Declare `pageRows`, `minimumTracks`, `actionTracks`, and derived `capacityTracks` in `pageSpec.ts`; one row is the default.
- Two rows require proven daily use, stable complete-row alignment, and first-viewport table evidence. Do not infer a second row from field count.
- If a later field no longer fits, graduate to `page-and-drawer`; do not silently hide, truncate, or wrap it.

### Page And Drawer

- Every permitted field belongs to exactly one location: ordered `pageFields` or ordered `drawerFields`. This is placement, not visibility.
- Keep at least one Locate field required on the page. Preserve its stable position when order has workflow meaning.
- User placement is invariant across language and viewport. Responsive behavior changes track count/control width only; it never moves fields between locations.
- The settings trigger stays with query/reset/filter actions and opens an Arco Drawer. The drawer provides page and drawer lists, mouse drag within/across lists, keyboard reordering, an explicit non-drag move command, restore default, cancel, capacity feedback, and one primary save.
- Reject over-capacity drafts in the settings surface and keep them editable. Do not auto-drop the last field or save a layout that wraps.
- Persist versioned stable field IDs, never translated labels. Normalize unknown/duplicate/unauthorized IDs, restore required fields, and put newly introduced fields in the drawer. Invalid or over-capacity persisted state falls back to the typed default.
- Moving or saving fields preserves every query value and does not run a query, reset pagination, clear selection, or change applied results. Query reset clears values without resetting placement; restore default changes placement without clearing values.
- The filter entry shows the applied count for fields currently owned by the drawer. Open the drawer with a draft copied from query state; cancel/close discards draft edits, group clear affects only current drawer fields, and apply resets page 1 and runs the query.
- Render drawer fields in business groups and honor saved order within each group. Empty groups disappear. The native Drawer body remains the one vertical scroll owner.
- When the drawer contains portaled Select or Date popups, set Drawer `esc-to-close="false"`: Escape belongs to the active popup, while drawer close and cancel remain explicit.

### Saved Query Workspace

- High condition volume should graduate only when named-query selection, edit, duplicate, permission, default, apply, reset, and failure behavior have real product/API contracts.
- A saved view never silently overwrites unsaved draft edits. Ask the user to apply, discard, or save before switching.
- Without that contract, use the complete page-and-drawer model with a grouped D2 drawer and anchor rail; do not build a static fake workspace or a flat field wall.

## Query Interaction Invariants

- Query button and Enter submit the same applied condition set. Select/radio auto-query is allowed only for a low-cost, single-dimension change such as queue or scope; text, range, and multi-field conditions wait for explicit query.
- A new query, reset, mode change, queue change, scope change, and advanced apply reset pagination to page 1. They clear selection only when the record set can change.
- Only the owning trigger shows pending. The form stays readable, duplicate submits are blocked, and a newer request wins over any late response from an older request.
- Failure preserves visible fields, advanced applied fields, page context, and the last useful table result whenever it is safe to retain it. Local error/retry belongs beside the data it failed to refresh; a toast only summarizes.
- A dependent condition can clear only the values that become invalid. For example, changing a business mode may clear its incompatible status or date filter; the UI must make that reset visible and must not erase unrelated customer or identifier conditions.
- Applied condition feedback has one owner: the controls themselves, the advanced-filter entry count, and justified queue/scope controls. Do not repeat it in an always-visible chip wall.

## Advanced Filter Overlay Contract

### Container And Width

- Use native `a-drawer`; set `data-ui-surface="advanced-filter"` as non-visual audit evidence.
- The component width prop is authoritative. Use the D1 or D2 responsive expression from `overlay-dimensions.md` directly on the drawer.
- D1 example: `width="min(var(--dense-drawer-w-filter), calc(100vw - var(--dense-drawer-filter-pad)))"`.
- Do not rely on a class or `!important` rule to replace the width prop.
- Do not override `.arco-drawer-header`, `.arco-drawer-title`, `.arco-drawer-body`, or `.arco-drawer-footer` merely to make the overlay look different from Arco.

### Form And Grouping

- Use `a-form layout="vertical" size="small"` and Arco Grid.
- D1 uses two columns at normal desktop width and one column when the actual drawer becomes too narrow for readable controls.
- Group by user-recognizable concepts, not backend field order. A group needs at least two related fields unless a single high-cost field needs its own explanation or validation state.
- A D1 drawer with nine or more advanced fields or three or more business concepts uses 2-4 named sections. Do not render it as one uninterrupted form wall.
- For a mutually exclusive condition with no more than three choices including `全部` (for example yes/no/all), use an Arco button-style Radio Group and keep one value visibly selected. Use Select when option count, search, or label length makes direct choice impractical.
- Each non-empty section shows its draft-condition count and `清空本组`; the command clears only that section and immediately updates the total draft count. Hide both when the section is empty.
- When draft state differs from applied state, expose one quiet `待应用` indicator in the drawer title area. The page entry count continues to represent applied conditions only.
- When the same local predicate or a real count endpoint can produce a preview without another invented API, show the matching-object count in the footer and update it with the draft. Do not fake a preview from static copy.
- Section headings are quiet structural text. A colored rail, icon, card background, and shadow are not all required; use only the minimum hierarchy that makes scanning clear.
- Consecutive advanced sections must keep a grouping rhythm: at least `16px` separation plus one quiet hairline, with the F3 section title at least `8px` above the first control. Title text alone is not enough when many Investigate fields are present.
- High density means packed fields using the shared dense-form configuration from `form-field.md`: 12px column gutter, 8px row gutter, 4px label gap, and zero `form-item` margin because the grid is the sole spacing owner. Do not create empty-looking forms with oversized vertical padding, sticky chrome bands, consumer SaaS air gaps, or a second margin layer; grouping rhythm is not decorative whitespace.
- A D2 anchor rail uses a quieter fill than the editor and a stable active marker (`fill` plus an inset indicator). The active state must not shift the text start line.
- A final odd field stays aligned to the left grid track. Do not stretch it across two columns only to fill space.

### Scroll Ownership

- A standard advanced drawer has one vertical scroll owner: the native Arco drawer body.
- Do not add nested `height: 100%` plus `overflow-y: auto` shell/body wrappers around the form.
- D2 may use a fixed group-anchor rail and one scrolling editor region. The outer drawer and editor must not both scroll vertically.
- The drawer root, scroll owner, and footer must satisfy `scrollWidth === clientWidth`; horizontal scrolling is a release blocker. Arco Grid's negative gutter may extend inside the body's padding, but it must not increase an ancestor scroll container's width.

### Footer

- Use the native Drawer footer slot.
- Layout is clear/reset at the left, then cancel and one primary apply action at the right.
- The footer child may use flex and `width: 100%`, but it must use `box-sizing: border-box` when it also owns horizontal padding. Prefer the native footer padding and no duplicate child padding.
- Footer buttons stay fully inside the drawer inset at every supported viewport and never require horizontal scrolling.
- When the actual drawer is narrower than the command groups, wrap the clear action above the right-aligned cancel/apply cluster; do not clip labels or hide the apply action.
- While applying, only the apply button shows loading; cancel and close behavior must be explicit.

### Minimal Arco-First Example

The section class names below are local hooks. They are not a mandatory shared DOM.

```vue
<a-drawer
  v-model:visible="advancedVisible"
  title="高级筛选"
  data-ui-surface="advanced-filter"
  width="min(var(--dense-drawer-w-filter), calc(100vw - var(--dense-drawer-filter-pad)))"
  :mask-closable="false"
>
  <a-form layout="vertical" size="small" :model="draftQuery">
    <section class="advanced-filter-section" aria-labelledby="identity-filter-title">
      <h3 id="identity-filter-title" class="advanced-filter-section__title">识别条件</h3>
      <a-row :gutter="denseFormGridGutter">
        <a-col :span="12" :xs="24" :sm="12">
          <a-form-item field="identifier" label="对象标识" :style="denseFormItemStyle">
            <a-input v-model="draftQuery.identifier" size="small" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12" :xs="24" :sm="12">
          <a-form-item field="owner" label="负责人" :style="denseFormItemStyle">
            <a-select v-model="draftQuery.owner" size="small" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
    </section>
  </a-form>

  <template #footer>
    <div class="advanced-filter-footer">
      <a-button size="small" type="text" @click="clearAdvanced">清空更多筛选</a-button>
      <a-space :size="8">
        <a-button size="small" @click="cancelAdvanced">取消</a-button>
        <a-button size="small" type="primary" :loading="applying" @click="applyAdvanced">应用筛选</a-button>
      </a-space>
    </div>
  </template>
</a-drawer>
```

## Wide Drawer And Saved-Query Fallback

- Use D2 width from `overlay-dimensions.md`.
- Add a group-anchor rail when there are seven or more groups or when scrolling cannot keep the current group obvious.
- Anchors scroll to sections; they do not behave as exclusive tabs. Users must be able to combine conditions across groups without losing context.
- The rail stays fixed while the editor is the one vertical scroll owner.
- Provide `清空本组` only when group-level reset is implemented and distinguish it from `清空全部`.
- Do not make a wide filter drawer fullscreen.
- Use this drawer only when D1 grouping cannot keep the permitted field catalog navigable or when saved-query product contracts are absent. Record the missing contract in `pageSpec`; do not label the fallback as a saved-query workspace.

## Connected Identifier Search

`filter-combo` is a connected control, not two unrelated controls placed beside each other.

- Use Arco Input Group or an equivalent local flex relationship.
- The selector owns the left rounded corners; the input owns the right rounded corners; the joining edge is single.
- The input flexes with `min-width: 0`; the selector has a stable width based on its longest option.
- The combined control counts as one query field.
- Focus behavior must remain visible across both parts without creating a double border.

## Query State And Feedback

- Visible control values are the primary condition feedback. Do not duplicate them into a second chip strip by default.
- The advanced entry shows hidden applied count, not temporary draft count.
- Query and apply requests show loading on the triggering action and block duplicate submissions.
- Failure preserves all conditions and leaves the user in the same context.
- Reset has one documented target: the system default (all conditions cleared). It never silently retains hidden conditions.
- URL or route persistence is optional, but when implemented it must serialize visible and advanced state consistently.

## Verification Gate

Verify the selected placement mode against real content at `1024x768`, `1366x768`, `1440x900`, and `1920x1080`:

- [ ] The gap from the final configured page field to query actions equals the shared column gutter, and action order stays stable when either drawer opens or closes.
- [ ] Page-field track usage stays within the typed minimum-width capacity; over-capacity drafts cannot be saved and invalid persisted state recovers to defaults.
- [ ] Moving, saving, resetting, refreshing, changing language, and changing viewport preserve the placement/value boundaries defined above.
- [ ] At `1920x1080`, record query-surface width, grid width, ratio, row count, and action rectangle; a full-width left-pinned grid with less than `80%` coverage has a documented owner or fails.
- [ ] Wide layout adds track capacity without scaling type or making ordinary controls visibly oversized.
- [ ] Permanent field order and keyboard order stay coherent when conditional fields appear, disappear, or wrap.
- [ ] The advanced entry shows the number of applied hidden conditions.
- [ ] A non-empty advanced group shows its local count; clearing that group preserves conditions in every other group.
- [ ] Direct three-state conditions have a visible selected value in default, edited, and reopened states.
- [ ] `待应用` appears only while draft and applied states differ, and disappears after cancel or successful apply.
- [ ] Cancel/close does not mutate the applied list; apply resets pagination and queries once.
- [ ] Drawer root, vertical scroll owner, and footer satisfy `scrollWidth === clientWidth`; grid gutters remain contained inside body padding.
- [ ] Exactly one vertical form-content scroll owner exists.
- [ ] Footer action rectangles remain inside the drawer rectangle with the required viewport inset.
- [ ] Two-column controls remain readable; the grid becomes one column when the drawer is genuinely narrow.
- [ ] A live match count, when implemented, equals the result set produced by applying the same draft.
- [ ] The first table header and first data row remain visible within the workbench budget when the query surface is closed.
- [ ] Long labels, empty values, validation errors, loading, no permission, and request failure are exercised.

## Prohibited

- Treating historical BEM examples as a globally available component without checking their implementation.
- A page-local second Drawer skin that overrides Arco header, body, footer, colors, radius, or shadow.
- Nested full-height scroll wrappers in a standard advanced-filter drawer.
- A footer child whose `width: 100%` plus padding increases intrinsic width.
- Ragged extra query rows created because field count, translation, or viewport silently changed placement.
- A flat ungrouped drawer for dozens of unrelated conditions.
- A D1 advanced drawer that meets the grouping threshold but still looks like one uninterrupted default form.
- Yes/no/all conditions hidden in Select without an option-count, search, or label-length reason.
- A high-volume condition catalog in one uninterrupted drawer or in a page wall above the table.
- Exclusive group tabs that prevent users from combining conditions across concepts.

## Related References

- Overlay width and scroll ownership: `overlay-dimensions.md`
- Control dimensions and label rhythm: `form-field.md`
- Query/list surface order: `list-page.md`
- Query and footer action hierarchy: `actions.md`
- First-viewport budget: `existing-project-modernization.md`
- Loading, failure, empty, and permission feedback: `feedback.md`
- Design sense and hierarchy: `visual-system.md`
