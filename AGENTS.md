# OHL 货代系统 — Agent 规范（摘要）

> **完整 UI 规范不在此文件。** 详见项目 skill：`ui-skill/freight-arco-ui/SKILL.md`（维护后运行 `npm run sync-ui-skill`）。

## 技术栈

Vue 3 · TypeScript · Arco Design Vue · VXE Table · Vite

## 三条铁律

1. **样式** — 先读 `src/styles/global.css`，复用类名，禁止自写等效 CSS。
2. **Skill** — 页面/布局/表格/按钮/质感问题先读 `$freight-arco-ui`（`ui-skill/freight-arco-ui/`），按任务读 `references/` 对应文件。
3. **编码门禁** — 写前 `spec-first-coding.mdc`；交付前 `adversarial-review.mdc` + `check-spec.js`。

## Skill 读什么

完整索引 → `ui-skill/freight-arco-ui/SKILL.md` · **大系统域路由** → `references/domain-routing.md`  
编码流程 → `.cursor/rules/spec-first-coding.mdc`

| 域 | 读 |
|----|-----|
| 新菜单选型 | `domain-routing.md` |
| 主数据/设置 | `master-data.md` |
| 权限 | `permissions.md` |
| BI/看板 | `dashboard.md` |
| 全页表单/客户端下单 | `full-page-form.md` |
| 空态/反馈 | `feedback.md` |

`references/legacy-design-manual.md` 仅历史归档，新任务勿全读。

## 不可协商（摘要）

- 表格一律 `vxe-table`，禁止 `a-table`
- 上传用 Uppy，禁止 `a-upload`
- 状态只用 `s-pill[data-s]`，禁止行铺色
- 每作用域仅 1 个 `type="primary"`
- 列表主表 `workbench-table`；详情子表 `detail-mini-vxe`，禁止 `show-overflow`
- 详情子表无批量栏时禁止 checkbox 列
- 业务对象先填槽位再画 UI，禁止硬抄订单页字段到财务/客户页

## 结构类名速查

| 场景 | 类名 |
|------|------|
| 列表根 | `page-root page-root--dense` |
| 筛选 | `filter-card` / `filter-field`（禁 `search-bar`） |
| 工具栏 | `toolbar` / `toolbar-group` / `toolbar-aside` |
| 表格容器 | `table-wrap` |
| 详情抽屉 | `detail-drawer`（复杂）/ `detail-drawer--standard`（只读）+ `detail-section` |
| 浮层宽度 | `overlay-dimensions.md`（Modal 420–860；Drawer D1–D4） |
| 子表容器 | `detail-section__body--table` + `detail-mini-vxe` |

按钮五类型 × 四状态、表格 hover/表头分层、详情 footer 分区：见 `references/actions.md` 与 `references/table.md`。

## 验证

```bash
node scripts/check-spec.js
npx vite build
```
