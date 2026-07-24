# Query Filter Layout

## Authority And Boundary

This file owns query-field priority, scenario selection, query-state behavior, advanced-filter composition, and acceptance evidence.

It does not define a second component framework:

- Start with Arco Form, Grid, Input Group, Space, Badge, Drawer, and their props.
- A class name shown in an example is a local semantic hook, not a reusable API, unless `rg` proves that `src/styles/global.css` implements it.
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
| Reuse | Reapply a complex condition set across sessions | Saved query scheme/workspace |

The default row answers: "What does the target operator enter first to find the object now?" Do not promote a field merely because it exists in the API.

## Scenario Decision

Every list page selects one primary query scenario. Do not combine a full flat query wall with an advanced drawer.

| Total query fields | Scenario | Default visible | Secondary surface | Selection rule |
|--------------------|----------|-----------------|-------------------|----------------|
| `1-8` | **S1** | all daily Locate/Narrow fields | none | every field is used frequently enough to justify permanent space |
| `9-16` | **S2** | 1-2 rows, usually 6-12 fields | inline expand/collapse | secondary fields are still Narrow and users scan-adjust them in the same session |
| `17-20` | **S2** or **S3** | 1-2 core rows | expand or drawer | S2 only for a specialist workbench when all hidden fields are regular Narrow conditions |
| `21-32` | **S3** | one core row, usually 3-8 fields | grouped advanced-filter drawer | hidden conditions span several concepts or contain Investigate fields |
| `33-50` | **S3 wide** | core row plus optional scheme entry | wide drawer with group anchors | occasional conditions remain composable in one query session |
| `50+` | **workspace** | quick query plus saved-scheme entry | dedicated saved-query workspace | condition reuse and navigation are more important than a larger overlay |

Boundary overrides:

1. A `9-16` field page may use S3 when Investigate fields dominate and opening them is uncommon.
2. A `17-20` field specialist page may use S2 only when the table still owns the first viewport and expanded fields are used several times per week.
3. A page moves to S3 when hidden conditions require four or more visible rows, contain nine or more Investigate fields, or make the query actions move while editing.
4. A page moves to the workspace model when users need saved/shared schemes, recent queries, version migration, and group navigation together.

## Scenario Contracts

### S1: Full Inline

- Compose fields with Arco Form/Grid and keep query actions at a stable row end.
- Use one primary `查询` action and one text `重置` action.
- One row is preferred; two aligned rows are allowed when all fields are daily and the table remains visible in the first viewport.
- Do not add expand, drawer, hidden active count, or saved-scheme chrome when there is no hidden state.

### S2: Inline Expand

- Keep the permanent grid and collapsed grid inside one query surface so columns share the same start lines.
- Expansion adds rows below the permanent fields; it does not move the query/reset action group.
- The trigger states `展开 (+N)` and `收起`, where `N` is the hidden field count.
- When collapsed fields contain values, show an active count on the trigger.
- Remember expansion state locally when useful; do not persist query values without a saved-query contract.
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

## Wide Drawer: 33-50 Fields

- Use D2 width from `overlay-dimensions.md`.
- Add a group-anchor rail when there are seven or more groups or when scrolling cannot keep the current group obvious.
- Anchors scroll to sections; they do not behave as exclusive tabs. Users must be able to combine conditions across groups without losing context.
- The rail stays fixed while the editor is the one vertical scroll owner.
- Provide `清空本组` only when group-level reset is implemented and distinguish it from `清空全部`.
- Do not make a wide filter drawer fullscreen.

## Saved Query Workspace: 50+ Fields

Use a dedicated query workspace, not a giant drawer.

Required capabilities:

- The normal page keeps quick Locate fields and the current scheme entry visible.
- Saved schemes define personal/shared ownership, persistence, default behavior, rename, update, duplicate, delete, permission, conflict handling, and condition-version migration.
- Recent queries and applied-condition summaries use business groups instead of one long comma-separated string.
- Provide clear-current-group and clear-all as distinct commands.
- The group navigation should be anchors over all condition modules, not exclusive tabs that hide other groups.

Alignment contract:

- Use one `--query-ws-pad-x` outer inset for the workspace header, saved-scheme rail, group-anchor rail, and editor.
- Use fixed rails plus `minmax(0, 1fr)` for the editor; rails must not force page-level horizontal scrolling.
- Use the project 8px spacing rhythm. Avoid unrelated per-column padding values.
- Active indicators stay inside their item and do not shift the text start line.

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
- Reset has one documented target: the active default scheme or the system default. It never silently retains hidden conditions.
- URL or route persistence is optional, but when implemented it must serialize visible and advanced state consistently.

## Verification Gate

Verify the selected scenario against real content at `1024x768`, `1366x768`, and `1440x900`:

- [ ] Query actions stay in a stable position when S2 expands or S3 opens/closes.
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
- A fake saved-scheme button backed only by temporary component state.

## Related References

- Overlay width and scroll ownership: `overlay-dimensions.md`
- Control dimensions and label rhythm: `form-field.md`
- Query/list surface order: `list-page.md`
- Query and footer action hierarchy: `actions.md`
- First-viewport budget: `existing-project-modernization.md`
- Loading, failure, empty, and permission feedback: `feedback.md`
