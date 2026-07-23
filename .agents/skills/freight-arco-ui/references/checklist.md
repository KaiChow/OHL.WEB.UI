# Delivery Checklist

Use this only before delivery. It verifies that the selected authorities were applied; it does not restate their component rules.

## 1. Task Path

- No visual artifact: use `existing-project-modernization.md`, `redesign-calibration.md`, and one matching page authority.
- Screenshot/Figma/prototype: complete the intake, delivery level, and translation block in `prototype-to-ui-contract.md` first.
- New page or material rewrite: complete typed `pageSpec.ts` from `page-spec-contract.md` before template work.
- Click/request/permission/mutation/state change: complete `feature-delivery-contract.md` and the matching surface authority before behavior code.
- New menu or unclear archetype: resolve it with `domain-routing.md`; fill the current business object through `module-patterns.md` and `domain-language.md`.

## 2. Implementation Ownership

- Arco/GI ownership follows `arco-first.md` and `theme-contract.md`; no second palette, component skin, or undocumented shared class.
- Layout and first-viewport decisions follow `redesign-calibration.md`, `responsive.md`, and the selected page authority.
- Query, table, action, icon, overlay, form, upload, permission, and feedback behavior comes only from its matching authority.
- Shared CSS is grep-proven and justified by reuse; page-local CSS contains only local shell/flex/overflow needs.
- Business fields and labels belong to the current object and user job; no copied shipment/order vocabulary in unrelated modules.

Surface authorities:

| Surface | Authority |
| --- | --- |
| List/query/table | `list-page.md`, `filter-layout.md`, `table.md` |
| Detail/forms | `detail-form.md`, `form-rules.md`, `form-field.md` |
| Full-page/master/dashboard | `full-page-form.md`, `master-data.md`, `dashboard.md` |
| Actions/icons | `actions.md`, `icons.md` |
| Modal/drawer | `modal.md`, `overlay-dimensions.md` |
| Size/type/visual roles | `component-size.md`, `typography.md`, `visual-system.md` |
| Upload/permission/state | `upload.md`, `permissions.md`, `feedback.md` |

## 3. Evidence Gate

Record evidence, not compliance claims:

| Area | Required evidence |
| --- | --- |
| Business | Object, actor, repeated job, key state, next action, and terminology are visible on the real route |
| Structure | Each fact/action/state has one owner; primary data dominates the first viewport; no repeated summary or nested card chrome |
| Efficiency | High-frequency reversible actions stay near affected data; rare/risky actions are grouped and confirmed |
| Theme | Computed GI tokens, absence of page-local repaint, and shared-class justification |
| Table | VXE structure, column ownership, density, overflow, row actions, empty state, and long-data behavior |
| Overlay/form | Width tier, one scroll owner, validation locality, failure preservation, and stable footer/actions |
| Feature | Visibility, enablement, permissions, request, duplicate-submit, success/failure, refresh scope, and state transition cases |
| States | Loading, empty, no permission, validation, business rejection, network failure, retry, long text, extreme values, and partial failure when applicable |

For productization, financing, or demo claims, also score `product-grade-evaluation.md`. A target written in `pageSpec.ts` is not evidence.

## 4. Verification

1. Run `.cursor/rules/adversarial-review.mdc` against the changed route and its selected authorities.
2. Run `npm run validate-freight-skill` after skill changes.
3. Run `node scripts/check-spec.js`.
4. Run `npm run build` or the relevant type/build command.
5. Inspect the real route at `1366x768`, `1024x768`, and one wide desktop viewport when UI/layout quality is in scope; add `1280x720` for sellable-grade evidence.
6. Exercise applicable edge states deterministically through fixtures, interception, tests, or a QA-only trigger.
7. Report remaining risks and unverified states explicitly.

A green script without rendered evidence does not complete UI-quality work.
