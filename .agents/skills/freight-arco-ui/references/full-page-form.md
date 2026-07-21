# Full-Page Form (Archetype C)

## Use When

- 客户端下单、新建业务单、HR/行政申请表、长创建流
- User task is **enter or correct a full object** — not list scan
- Field count &gt;8 or multiple `detail-section` groups

Prefer **drawer** when user must keep list context. Use **full page** when creation is the primary task or client portal flow.

## Structure: `xf-wrap`

```vue
<div class="page-root page-root--dense xf-wrap">
  <header class="xf-head zone-card">
    <a-breadcrumb />
    <div class="xf-head__title">新建出口海运订单</div>
    <div v-if="draftNo" class="xf-head__meta">草稿编号 {{ draftNo }}</div>
  </header>

  <div class="xf-body">
    <div class="detail-section">
      <div class="detail-section__head">
        <h4 class="detail-section__title">基础信息</h4>
      </div>
      <div class="detail-section__body">
        <a-form ref="formRef" :model="form" layout="vertical" size="small" class="detail-form">
          <div class="detail-form-grid detail-form-grid--4">
            <a-form-item field="customerId" label="客户" :rules="[{ required: true, message: '请选择客户' }]">
              <a-select v-model="form.customerId" size="small" allow-search />
            </a-form-item>
            <!-- more fields; span2 for remark -->
          </div>
        </a-form>
      </div>
    </div>

    <!-- repeated line module: detail-section + detail-mini-vxe -->
  </div>

  <footer class="detail-drawer-footer xf-footer">
    <div class="detail-drawer-footer__start">
      <a-button size="small" type="text" status="danger" @click="handleAbandon">废弃</a-button>
    </div>
    <div class="detail-drawer-footer__end">
      <a-button size="small" @click="handleCancel">取消</a-button>
      <a-button size="small" type="outline" @click="saveDraft">存草稿</a-button>
      <a-button size="small" type="primary" :loading="submitting" @click="handleSubmit">提交</a-button>
    </div>
  </footer>
</div>
```

Shell classes: `xf-wrap`, `xf-head`, `xf-body`, `xf-footer` in `global.css`.

## Form Rules

- **Must** use `a-form` + `class="detail-form"` + `a-form-item` — see `form-rules.md`.
- **Forbidden** raw `<label class="xf-label">` + custom error div (legacy skeleton only).
- Grid: four columns by default; three or two only for intrinsically narrow sections. Do not add a `max-width:1280px` column-drop rule at the project's exact minimum desktop width.
- Sub-entity tables: `detail-section__body--table` + `detail-mini-vxe` — same as drawer.

## Footer (workflow)

| Button | Type | Notes |
|--------|------|-------|
| 取消 | secondary | back / close |
| 存草稿 | outline | reversible |
| 提交 | **primary** — one only | `:loading="submitting"` |
| 废弃 | `text` + `danger` in `__start` | confirm |

Client portal may hide 废弃; keep one primary.

## Steps (optional)

- Simple objects: **no** step wizard — use `detail-section` groups only.
- Multi-phase client order (货物 → 运输 → 附件): `a-steps size="small"` in `xf-head` or first section — max 5 steps; do not use `type="arrow"` blocks (see `detail-form.md`).

## Client Portal Variant

Same tokens and `detail-form`. Allowed adjustments:

- Filter tier 1 only — fewer visible filters.
- Slightly wider field help via `xf-field-hint` (F5 aux) under critical fields.
- Do **not** use `size="medium"` or 14px hardcode.

## Drawer vs Full Page

| Signal | Choose |
|--------|--------|
| User came from list, may compare rows | Drawer |
| Dedicated menu「新建××」| Full page |
| Client external portal | Full page |
| &gt;12 fields + 2 mini tables | Full page or complex drawer |

## Forbidden

- `xf-grid` / `xf-label` in new pages without migrating to `detail-form`.
- Multiple `primary` in footer.
- Page title &gt; F0 14px overlay except `xf-head__title`.
- Missing dirty-leave confirm on long forms.

## Verification

- [ ] `xf-wrap` shell
- [ ] `detail-form` on all inputs
- [ ] `detail-drawer-footer` sticky pattern
- [ ] `form-rules.md` submit/validate flow
- [ ] `feedback.md` success/error messages
