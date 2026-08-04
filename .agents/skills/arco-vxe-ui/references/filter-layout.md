# Query Filter Layout

> Class names and `--dense-*` tokens in this document are the reference implementation; the rules are the contract, the symbols are replaceable.

## Authority And Boundary

This file owns query-field priority, scenario selection, query-state behavior, advanced-filter composition, and acceptance evidence.

It does not define a second component framework:

- Start with Arco Form, Grid, Input Group, Space, Badge, Drawer, and their props.
- A class name shown in an example is a local semantic hook, not a reusable API. Reuse requires a real shared Vue component or composable found by `rg`.
- Page CSS may arrange local grid, flex, stable width, and overflow relationships. It must not reskin Arco inputs, drawers, buttons, or popup chrome.
- Field count selects a candidate scenario; frequency, task continuity, and adjustment cost decide the final surface.

The command-surface height and first-viewport table budget are owned by `existing-project-modernization.md`. Control dimensions and typography are owned by `form-field.md`.

## Query Field Classification

Classify every available condition before choosing a layout.

| Layer | User job | Default surface |
|------|----------|-----------------|
| Locate | Find a known record or very small result set | Always-visible query row |
| Narrow | Repeatedly reduce the current work queue | Visible row when used daily; page expansion when used regularly |
| Investigate | Diagnose occasional attributes, ranges, flags, or audit conditions | Advanced-filter drawer |

The default row answers: "What does the target operator enter first to find the object now?" Do not promote a field merely because it exists in the API.

## Semantic Width Grid

Visible query fields use the shared `semantic-grid-v1` capability around Arco Form controls. Pages declare field meaning; they do not invent breakpoints, spans, fixed input widths, or page-wide caps independently.

| Width role | Use for | Do not use for |
|------------|---------|----------------|
| `compact` | Short enum/status, owner, region, yes/no/all choice | Free text, date ranges, connected controls |
| `standard` | Normal Input/Select such as customer, keyword, warehouse | Long composite identifiers or ranges |
| `wide` | A proven long-label or long-option field that needs more scan width | Making an ordinary field look important |
| `composite` | One connected selector + input identifier control | Two unrelated conditions grouped together |
| `range` | Date/time or numeric range with two visible endpoints | A single date or short enum |

### Four Width Decisions

Do not collapse these into one `max-width`:

1. **Surface width**: the query surface normally follows the list/table work surface.
2. **Grid width**: the field grid consumes the surface inner width unless another visible region owns the remainder.
3. **Field width**: semantic roles bound control width and prevent stretched chrome.
4. **Visibility**: Locate/Narrow/Investigate priority decides whether a field is visible; free space alone does not promote an Investigate field.

A full-width bordered query surface with a left-pinned capped grid and an unowned blank region is a layout defect, not breathing room. A grid cap is allowed only when it is centered with the whole work surface or the remaining width is visibly owned by context, help, preview, or another documented region.

### Shared Track Model

Use one shared responsive track model so wider containers gain tracks instead of wider controls. A logical track stays roughly `40-56px` across supported desktop profiles at 100% zoom: `compact` spans 3 tracks, `standard` 4, and `wide` / `composite` / `range` 6. The normal action slot spans 5 tracks; the wide slot spans 8 so query, reset, and expand/filter labels remain visible.

- Derive track count from the **query container's inner width**, not the browser width. Keep enough tracks for the supported 1024px desktop and add tracks as the container grows through 1440px and 1920px evidence.
- Controls fill their semantic item, but the shared grid bounds the effective track size. Do not make a customer Select 400px wide merely because the monitor is wide.
- Place query actions immediately after the last permanent visible field, separated by one shared column gutter. Stability means a deterministic position after the field sequence, not flush-right alignment across the query surface.
- At the same container width, the same ordered roles and action set produce the same widths, wrapping, and action alignment across routes.
- A business difference changes the semantic role or field priority in `pageSpec.ts`; it never introduces page-local spans.
- Only a connected control's internal selector may use a stable bounded width based on its longest legal option.
- Advanced drawers keep their documented two-column/one-column composition; list-row tracks do not leak into the drawer.

Start with Arco Grid when its 24 columns satisfy all supported widths. When a fixed 24-column grid would either stretch fields or require a narrow left-pinned `max-width` on wide desktop, the shared `QueryFieldGrid` may use CSS Grid for layout only. Record the reusable gap as: `Arco's fixed 24-column model cannot preserve bounded semantic field widths while adding wide-desktop capacity.` Arco continues to own Form, controls, validation, focus, and component chrome.
Reference algorithm: derive a shared track count from container inner width and the profile's target track; map roles to `3/4/6` spans; append the `5/8`-track action item after the permanent field cluster and reserve that capacity before promoting optional fields; then verify wrapping and DOM/focus order. Implement it once in the shared component, not in pages.

### Space-Use Decision

After placing bounded fields, inspect unused space in this order:

1. Keep all proven Locate and daily Narrow fields directly reachable.
2. Use added wide-container tracks to reduce avoidable wrapping or expose another proven regular Narrow field without exceeding the command-height budget.
3. Keep Investigate fields in the advanced surface even when space exists.
4. Accept only the normal tail of the final field row; do not stretch the last field or invent decoration.

Measure `grid width / query-surface inner width` at wide desktop. Below `80%` fails when the surface is full-width, left-aligned, and the remainder has no documented owner. This is a project composition gate, not a universal screen-filling target; field occupancy inside the grid may remain lower because semantic widths and field count still govern it.

## Scenario Decision

Every list page selects one primary query scenario. Do not combine a full flat query wall with an advanced drawer.

| Total query fields | Scenario | Default visible | Secondary surface | Selection rule |
|--------------------|----------|-----------------|-------------------|----------------|
| `0` | **S0** | none | none | Do not render an empty filter bar. The list starts with its actual command or data surface. |
| `1-3` | **S1 compact** | all | none | Known-record lookup; keep the query action attached to the fields and do not create an extra command row. |
| `4-8` | **S1** | all daily Locate/Narrow fields | none | One row preferred. A second aligned row is allowed only when every field is daily and table data stays in the first viewport. |
| `9-16` | **S2** | 1-2 rows, usually 6-12 fields | inline expand/collapse | Secondary fields are still Narrow and users scan-adjust them in the same session. |
| `17-20` | **S2** or **S3** | 1-2 core rows | expand or drawer | S2 only for a specialist workbench when all hidden fields are regular Narrow conditions. |
| `21-32` | **S3** | one core row, usually 3-8 fields | grouped advanced-filter drawer | Hidden conditions span several concepts or contain Investigate fields. |
| `33-49` | **S3 wide** | core row | wide drawer with group anchors | Occasional conditions remain composable in one query session. |
| `50+` | **S4** | core Locate fields | saved-query workspace, or grouped D2 fallback | Prefer named, permission-aware saved queries. Until that product capability exists, use one grouped wide drawer with an anchor rail instead of an inline field wall. |

Boundary overrides:

1. A `9-16` field page may use S3 when Investigate fields dominate and opening them is uncommon.
2. A `17-20` field specialist page may use S2 only when the table still owns the first viewport and expanded fields are used several times per week.
3. A page moves to S3 when hidden conditions require four or more visible rows, contain nine or more Investigate fields, or make the query actions move while editing.

## Scenario Contracts

### S0: No Query Surface

- Render no empty query card, divider, placeholder controls, or disabled `查询` button.
- The first visible surface is the actual command surface when it has real actions; otherwise it is the table and its meaningful table utilities.
- When the data is intentionally pre-scoped by the route or parent object, show that scope once as page/table context instead of inventing a filter control.

### S1: Full Inline

- Compose fields with Arco Form/Grid and keep query actions adjacent to the final visible field in the stable field sequence.
- Use one primary `查询` action and one text `重置` action.
- One row is preferred; two aligned rows are allowed when all fields are daily and the table remains visible in the first viewport.
- Do not add expand, drawer, or hidden active count chrome when there is no hidden state.

### S2: Inline Expand

- Keep permanent and conditional fields inside one query surface and one shared track model.
- Expansion adds conditional fields after the permanent query path; it does not move the query/reset action anchor or change permanent-field order.
- A wider container may promote proven regular Narrow fields into the permanent row; keep their order stable and make `+N` count only the fields still hidden at that profile.
- The trigger states `展开 (+N)` and `收起`, where `N` is the hidden field count.
- When collapsed fields contain values, show an active count on the trigger.
- Remember expansion state locally when useful; do not persist query values across sessions.
- Expanded query content must not become a four-row default wall.

### S3: Advanced Filter Drawer

- Keep Locate and daily Narrow fields visible. Move occasional Narrow and Investigate fields into the drawer.
- The entry remains beside query/reset and shows the applied hidden-condition count.
- Open the drawer with a draft copied from applied query state.
- `取消` discards draft edits and preserves the current list.
- `清空更多筛选` clears only advanced draft fields unless the label explicitly says `清空全部条件`.
- `应用筛选` commits the draft, closes the drawer, resets pagination to page 1, and runs the query.
- Closing with the drawer close affordance follows cancel semantics; do not partially apply hidden fields.
- When the drawer contains portaled Select or Date popups, set Drawer `esc-to-close="false"`: Escape belongs to the active popup, while drawer close and cancel remain explicit. An orphan popup after the drawer closes is a release blocker.

### S4: Saved Query Workspace

- `50+` conditions should graduate to named saved queries or views with an explicit current-view owner.
- The core Locate fields remain directly reachable. Saved-query selection, edit, duplicate, permission, default, apply, reset, and failure behavior need real product/API contracts before implementation.
- A saved view may combine conditions; it must never silently overwrite unsaved draft edits. Ask the user to apply, discard, or save the draft before switching views.
- Do not claim a saved-query workspace from static frontend fixtures. If persistence, sharing, or permissions are not implemented, use `s4-drawer-fallback`: core fields inline plus a grouped D2 drawer with an anchor rail and one scroll owner.
- The fallback is transitional but complete: it must support draft/apply/cancel/reset, group navigation, applied-condition count, and containment verification. It must not become a fullscreen drawer or an inline 50-field wall.

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
- High density means packed fields using `--dense-gap-field-row`, `--dense-gap-field-col`, and `--dense-gap-label`. Do not create empty-looking forms with oversized vertical padding, sticky chrome bands, or consumer SaaS air gaps; grouping rhythm is not decorative whitespace.
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
      <a-row :gutter="[16, 0]">
        <a-col :span="12" :xs="24" :sm="12">
          <a-form-item field="identifier" label="对象标识">
            <a-input v-model="draftQuery.identifier" size="small" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12" :xs="24" :sm="12">
          <a-form-item field="owner" label="负责人">
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

## Wide Drawer: 33-49 Fields, Or S4 Fallback

- Use D2 width from `overlay-dimensions.md`.
- Add a group-anchor rail when there are seven or more groups or when scrolling cannot keep the current group obvious.
- Anchors scroll to sections; they do not behave as exclusive tabs. Users must be able to combine conditions across groups without losing context.
- The rail stays fixed while the editor is the one vertical scroll owner.
- Provide `清空本组` only when group-level reset is implemented and distinguish it from `清空全部`.
- Do not make a wide filter drawer fullscreen.
- For `50+` fields, this drawer is allowed only as the documented `s4-drawer-fallback` when saved-query product contracts are absent. Record that absence in `pageSpec`; do not label the surface as a saved-query workspace.

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

Verify the selected scenario against real content at `1024x768`, `1366x768`, `1440x900`, and `1920x1080`:

- [ ] The gap from the final permanent field to query actions equals the shared column gutter, and action order stays stable when S2 expands or S3 opens/closes.
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
- Three or four default-visible query rows used to avoid choosing S2/S3.
- A flat ungrouped drawer for dozens of unrelated conditions.
- A D1 advanced drawer that meets the grouping threshold but still looks like one uninterrupted default form.
- Yes/no/all conditions hidden in Select without an option-count, search, or label-length reason.
- `50+` conditions in one drawer or in a page wall above the table.
- Exclusive group tabs that prevent users from combining conditions across concepts.

## Related References

- Overlay width and scroll ownership: `overlay-dimensions.md`
- Control dimensions and label rhythm: `form-field.md`
- Query/list surface order: `list-page.md`
- Query and footer action hierarchy: `actions.md`
- First-viewport budget: `existing-project-modernization.md`
- Loading, failure, empty, and permission feedback: `feedback.md`
- Design sense and hierarchy: `visual-system.md`
