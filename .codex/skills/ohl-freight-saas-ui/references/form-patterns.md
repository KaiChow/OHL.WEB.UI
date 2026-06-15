# Form Patterns

Rules for editable forms — especially full-screen detail forms with 50+ fields.

---

## Form Size Guide

| Field count | Pattern |
|---|---|
| ≤ 10 fields | Inline form or small drawer (720px), 2-column grid |
| 11–30 fields | Side drawer (720–960px), 2–3 column grid, no anchor needed |
| 31–50 fields | Right drawer (960px), grouped sections, optional anchor |
| 50+ fields | **Full-screen drawer** (`calc(100vw - 248px)`), grouped sections, **anchor nav required** |

---

## Full-Screen Form Layout (50+ Fields)

Use the `ds-*` class system. See `page-patterns.md` for the complete structure.

### Section Organization

Group fields into logical business sections. Each section gets a `ds-section` card with a `ds-sec-head`.

Standard section order for 业务单:
1. 基本信息 (top card, no section head — use `ds-card`)
2. 权限人员列表
3. 基础信息
4. 附件
5. 订单类型 (single-line bar — use `ds-card`)
6. 货物信息
7. 尾端派送信息
8. 清关信息

---

## Column Grid Rules

Match column count to available width and field complexity:

```css
/* Top card / service items: 3 columns */
.ds-top-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }

/* Main form sections: 4 columns (full-screen only) */
.ds-basic-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }

/* Cargo/customs: 2 columns side by side */
.ds-cargo-cols { grid-template-columns: 1fr 1fr; }

/* Advanced filter (in drawer): 3 columns */
.adv-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
```

Never use 1-column flat list for full-screen forms — wastes horizontal space and looks like legacy ERP.

---

## Field Pattern

```vue
<!-- Standard field -->
<div class="ds-field">
  <span class="ds-label">字段名</span>
  <a-input size="small" class="ds-ctrl" />
</div>

<!-- Required field -->
<div class="ds-field ds-field--req">
  <span class="ds-label">字段名</span>
  <a-input size="small" class="ds-ctrl ds-ctrl--req" />
</div>
```

- Label width: `80px`, right-aligned, `font-size: 12px`, `color: var(--color-text-2)`.
- `ds-ctrl--req`: adds `border-color: #f5a9a9` + `background: #fff9f9` for required highlight.
- All form controls: `size="small"`.
- Never use plain `<label>` without the `ds-field` wrapper.

---

## Required Field Strategy

- Mark fields with `ds-field--req` if they are business-critical or blocked on submit.
- Required marker (`*`) on the label, not on the input.
- Do not mark more than 40% of fields as required — dilutes urgency.
- Group all required fields in the first 2 columns of each section for fast scanning.

---

## Repeatable Row Sections (货物信息 / 尾端派送 / 清关信息)

Use collapsible cards for repeatable entities:

```vue
<div class="ds-cargo-card">
  <div class="ds-cargo-head" @click="item.expanded = !item.expanded">
    <span class="ds-cargo-toggle">{{ item.expanded ? '▾' : '▸' }}</span>
    <span class="ds-cargo-name">发货人_{{ index + 1 }}</span>
    <a-button size="mini" status="danger" style="margin-left:auto" @click.stop="remove(item.id)">删除</a-button>
  </div>
  <div v-if="item.expanded" class="ds-cargo-body">
    <!-- fields -->
  </div>
</div>
```

Add button is always at the bottom of the group, `size="small"`, `type="dashed"`.

For tabular repeatable rows (派送 / 清关): use `ds-table` inside `ds-table-wrap` with `overflow-x: auto`. Min-width on table: 1000px.

---

## Tables Inside Forms

```vue
<div class="ds-table-wrap">
  <table class="ds-table">
    <thead><tr>
      <th>列名</th>
      <th class="ds-th-req">必填列</th>
    </tr></thead>
    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td><a-input v-model="row.val" size="mini" class="ds-td-inp" /></td>
        <td><a-select v-model="row.sel" size="mini" class="ds-td-sel ds-td-req" /></td>
      </tr>
    </tbody>
  </table>
</div>
```

- `ds-th-req::before`: red `*`.
- `ds-td-req`: red border tint on required cells.
- All table form controls: `size="mini"`.

---

## Remark / Textarea Fields

Place remark fields at the bottom of their section, always 2-column side by side:

```vue
<div class="ds-remark-row">
  <div class="ds-remark-item">
    <span class="ds-label">客户备注</span>
    <a-textarea size="small" :auto-size="{ minRows:2, maxRows:3 }" />
  </div>
  <div class="ds-remark-item">
    <span class="ds-label">境外备注</span>
    <a-textarea size="small" :auto-size="{ minRows:2, maxRows:3 }" />
  </div>
</div>
```

Never stack textareas vertically in full-screen forms — wastes vertical space.

---

## Footer Action Bar

Always fixed at bottom (`ds-footer`). Buttons centered, grouped by action type:

```text
[批量下单 (warning)] [保存 (success)] [提交 (primary)] [废弃 (danger)]
```

Rules:
- Max 4 buttons in footer.
- `size="small"`.
- Destructive action (废弃) always rightmost.
- Never use text buttons in the fixed footer — use colored type buttons for clarity.
- The scroll area must reserve footer space: add `.ds-scroll-spacer` at the end of `.ds-scroll` and set `scroll-padding-bottom` at least `96px`.
- Do not use anonymous inline `<div style="height:...">` spacers. Use the named spacer class so every long form behaves consistently.

---

## Anchor Navigation (5+ Sections)

Required for full-screen forms with 5 or more sections.

Position: `position: absolute; right: 0; top: 0; bottom: 0; width: 64px` inside `.ds-body`.

The scroll area (`ds-scroll`) must have `padding-right: 72px` to prevent content going under the anchor nav.
Use at least `88px` when the anchor labels are visible or the drawer has a visible scrollbar.

Section IDs use format: `id="ds-{key}"` where key matches the anchor config.

Scroll spy pattern:
```typescript
const onScroll = () => {
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const top = scrollRef.value!.scrollTop;
    let cur = anchors[0].key;
    for (const { key } of anchors) {
      const el = document.getElementById(`ds-${key}`);
      if (el && el.offsetTop - 40 <= top) cur = key;
    }
    activeAnchor.value = cur;
  });
};
```

Attach listener via `watch(visible, ...)` + `nextTick()`, not `onMounted()` — the drawer may be closed on mount.
