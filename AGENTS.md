# OHL 货代系统 — Agent 规范（摘要）

> **完整 UI 规范不在此文件。** 详见项目 skill：`ui-skill/freight-arco-ui/SKILL.md`（维护后运行 `npm run sync-ui-skill`）。

## 技术栈

Vue 3 · TypeScript · Arco Design Vue · VXE Table · Vite

## 三条铁律

1. **Arco-first** — Arco 驱动页面；执行链：Arco → token → 业务 pattern → page-local CSS（见 `references/arco-first.md`）。
2. **Skill** — 页面/布局/表格/按钮/质感/功能流程先读 `$freight-arco-ui`，按任务读 `references/`。
3. **编码门禁** — 写前 `spec-first-coding.mdc`；交付前 `adversarial-review.mdc` + `check-spec.js`。

## Skill 读什么

完整索引 → `ui-skill/freight-arco-ui/SKILL.md` · **框架优先** → `references/arco-first.md` · **大系统域路由** → `references/domain-routing.md`  
编码流程 → `.cursor/rules/spec-first-coding.mdc`

| 域 | 读 |
|----|-----|
| 框架优先 / 减 global.css 依赖 | `arco-first.md` |
| 新菜单选型 | `domain-routing.md` |
| 截图/原型转页面 | `artifact-intake-template.md` + `prototype-to-ui-contract.md` + `page-archetypes.md` + `module-patterns.md` |
| 功能实现/动作/提交流程 | `feature-routing.md` + `feature-delivery-contract.md` |
| 图标/空态/菜单/模块标题 | `icons.md` + `actions.md` |
| 主数据/设置 | `master-data.md` |
| 权限/显隐/数据范围 | `permissions.md` + `feature-delivery-contract.md` |
| BI/看板 | `dashboard.md` |
| 全页表单/客户端下单 | `full-page-form.md` |
| 空态/反馈 | `feedback.md` |

## 不可协商（摘要）

- **Arco-first**：能用 Arco props/结构解决就不用自定义 class；`global.css` 是增强层不是第二框架
- 表格一律 `vxe-table`，禁止 `a-table`
- 上传用 Uppy，禁止 `a-upload`
- 状态只用 `s-pill[data-s]`，禁止行铺色
- 通用动作 icon 用 Arco；业务语义/菜单/空态/模块标题 icon 才用 IconPark；无精确隐喻则不用 icon
- 每作用域仅 1 个 `type="primary"`
- 列表主表 `workbench-table`；详情子表 `detail-mini-vxe`，禁止 `show-overflow`
- 详情子表无批量栏时禁止 checkbox 列
- 业务对象先填槽位再画 UI，禁止硬抄订单页字段到财务/客户页
- 有点击/提交/请求/状态流转的功能，必须先补功能契约再写交互
- 有截图/原型输入时，必须先补输入模板和原型转译，禁止按视觉相似度直接开写

## 结构类名速查

共享 pattern 仅在 Arco + token 不够时使用。类名 grep 验证后使用。

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
