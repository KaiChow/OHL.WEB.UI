# OHL 货代系统 — Agent 规范（摘要）

> **完整 UI 规范不在此文件。** 详见项目 skill：`ui-skill/freight-arco-ui/SKILL.md`（维护后运行 `npm run sync-ui-skill`）。

## 技术栈

Vue 3 · TypeScript · Arco Design Vue · `@arco-themes/vue-gi-demo` · VXE Table · Vite

## 三条铁律

1. **Arco-first** — Arco 驱动页面；执行链：GI baseline/palette → 直接语义 token → 业务 pattern → page-local layout CSS（见 `references/arco-first.md` + `references/theme-contract.md`）。
2. **Skill** — 无设计稿是默认；先走 lean 路径，禁止为过关而堆 reference。
3. **编码门禁** — 写前 `spec-first-coding.mdc`；交付前 `adversarial-review.mdc` + `check-spec.js` + **真实路由 before/after 证据**（脚本绿不算完成）。

## Skill 读什么

完整索引 → `ui-skill/freight-arco-ui/SKILL.md` · **默认无设计稿路径** → `references/existing-project-modernization.md` · **框架优先** → `references/arco-first.md`  
编码流程 → `.cursor/rules/spec-first-coding.mdc`

**无设计稿（默认）只读：** `arco-first` + `theme-contract` + `existing-project-modernization` + `redesign-calibration` + **一个**页面原型 reference。不要预读全库。

| 域 | 读 |
|----|-----|
| 主题 / token / 组件皮肤 | `theme-contract.md` + `visual-system.md` |
| **无参考图改造（默认）** | **`existing-project-modernization.md`** + `redesign-calibration.md` |
| 融资 / 可销售产品成熟度 | `product-grade-evaluation.md` + `checklist.md` |
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
- **主题唯一所有权**：GI 是唯一 Arco CSS baseline 与 palette；项目无 `theme.css` 适配层，页面与 `global.css` 禁止改色或另起皮肤
- 表格一律 `vxe-table`，禁止 `a-table`
- 上传遵循 `upload.md` 的共享上传契约；未安装/未实现的上传库不得写成既定事实，禁止直接用 `a-upload` 绕过业务策略
- 状态只用 `s-pill[data-s]`，禁止行铺色
- 通用动作 icon 用 Arco；业务语义/菜单/空态/模块标题 icon 才用 IconPark；无精确隐喻则不用 icon
- 每作用域仅 1 个 `type="primary"`
- 列表主表 `workbench-table`；详情子表 `detail-mini-vxe`，禁止 `show-overflow`
- 详情子表无批量栏时禁止 checkbox 列
- 业务对象先填槽位再画 UI，禁止硬抄订单页字段到财务/客户页
- 有点击/提交/请求/状态流转的功能，必须先补功能契约再写交互
- 有截图/原型输入时，必须先补输入模板和原型转译，禁止按视觉相似度直接开写

## 布局角色速查

先实现角色关系，再决定是否需要类名。只有 grep 能证明定义存在的共享类才可直接使用；否则使用 Arco 结构和最小 page-local layout CSS。

| 场景 | 结构角色 |
|------|----------|
| 列表 | 一个 command surface + 一个主 data surface；阈值见 `redesign-calibration.md` |
| 筛选 | Arco Form/Grid/Input Group；字段数量选型见 `filter-layout.md` |
| 工作流 | 业务动作 + scope/status；1280 不折行，状态区内部滚动 |
| 主表 | `vxe-table.workbench-table` |
| 详情 | identity → sections → local actions；抽屉层级见 `detail-form.md` |
| 浮层 | `overlay-dimensions.md`（Modal 420–860；Drawer D1–D4） |
| 子表 | `vxe-table.detail-mini-vxe`，按行任务选择密度 |

按钮、表格、详情 footer 的具体规则见 `references/actions.md`、`references/table.md` 与 `references/detail-form.md`。

## 验证

```bash
node scripts/check-spec.js
npx vite build
```
