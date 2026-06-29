# OHL 货代系统 — Claude Code 规范（摘要）

Vue 3 · TypeScript · Arco Design Vue · VXE Table · Vite

## 单一事实源（按优先级）

| 层级 | 文件 | 用途 |
|------|------|------|
| 样式 | `src/styles/global.css` | Token、布局类 — **禁止页面自写等效 CSS** |
| UI Skill | `ui-skill/freight-arco-ui/SKILL.md` | PESDP 交付合同、reference 索引 |
| 功能契约 | `references/feature-routing.md` + `references/feature-delivery-contract.md` | 动作/权限/API/状态/验证 |
| 原型转译 | `references/prototype-to-ui-contract.md` | 截图/原型 → 业务对象/页面原型/交互契约 |
| 图标规范 | `references/icons.md` | Arco / IconPark 分工与场景约束 |
| 编码门禁 | `.cursor/rules/spec-first-coding.mdc` | 先决策 Tier / 结构 / Modal·Drawer，再写代码 |
| 自动检查 | `node scripts/check-spec.js` | 规范扫描 |

调用 skill：`/freight-arco-ui` · 维护：只改 `ui-skill/freight-arco-ui/` → `npm run sync-ui-skill`

**细则不在此重复。** 布局/表格/按钮/详情/质感 → 读 skill 对应 `references/`。

## PESDP

Professional · Efficient · Structured · Dense · Premium — 效率 > 信息 > 交互 > 装饰。

## 工作流（6 步）

1. `business_object` + `user_job` → [`module-patterns.md`](ui-skill/freight-arco-ui/references/module-patterns.md)（英文槽位）
2. 有截图/原型输入 → [`prototype-to-ui-contract.md`](ui-skill/freight-arco-ui/references/prototype-to-ui-contract.md)
3. 有点击/提交/请求/状态变化 → [`feature-routing.md`](ui-skill/freight-arco-ui/references/feature-routing.md) + [`feature-delivery-contract.md`](ui-skill/freight-arco-ui/references/feature-delivery-contract.md)
4. 页面原型 → [`page-archetypes.md`](ui-skill/freight-arco-ui/references/page-archetypes.md)
5. 中文标签/状态/字段 → [`domain-language.md`](ui-skill/freight-arco-ui/references/domain-language.md)
6. `global.css` + 任务 reference（list / detail / table / actions / visual-system）
7. 复用类名；scoped 仅页面骨架
8. `check-spec.js` + 浏览器抽查

## 不可协商（10 条）

1. `vxe-table` only；禁止 `a-table`
2. 类名 grep 验证后使用 `global.css`
3. 列表：`filter-card` · `toolbar` · `table-wrap` · `workbench-table`
4. 详情子表：`detail-mini-vxe` · `detail-section__body--table` · 禁止 `show-overflow`
5. 状态 `s-pill[data-s]` only；禁止行铺色
6. 每作用域 1× `primary` → [`actions.md`](ui-skill/freight-arco-ui/references/actions.md)
7. 重置/刷新=`text`；模块主操作=`outline`；页头/吸底=`secondary`
8. 删除/废弃=`danger` + 确认
9. 禁止 hex、硬编码 14–16px 业务字（14px 仅 `--dense-font-overlay` 浮层标题）、`font-weight:700`、废弃类名
10. 禁止把订单字段硬抄到无关模块
11. 有行为的功能必须定义 `visible_when` / `enabled_when` / `api_request` / `success_result` / `error_result` / `refresh_scope`
12. 通用动作图标用 Arco；业务语义/菜单/空态/模块标题图标用 IconPark；无精确隐喻则纯文字
13. 截图/原型任务必须先转成 business_object + archetype + feature contracts，禁止直接照图抄交互

## Reference 索引

完整任务 → 文件映射见 **`ui-skill/freight-arco-ui/SKILL.md` → Reference Map**。  
编码前先读 → **`.cursor/rules/spec-first-coding.mdc`**。

## 代码骨架

Vue DOM 骨架见 **`.cursor/rules/ui-spec.mdc`**；筛选 Tier / 双行结构 / Modal·Drawer 决策不在 ui-spec 重复，见 **`filter-layout.md`** / **`modal.md`**。

类名使用前：`grep -n "\.类名" src/styles/global.css`

## 历史文档

功能实现也以 skill 的 feature contract 为准，不再依赖历史说明文档。
