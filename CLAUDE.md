# OHL 货代系统 — Claude Code 规范（摘要）

Vue 3 · TypeScript · Arco Design Vue · VXE Table · Vite

## 单一事实源（按优先级）

| 层级 | 文件 | 用途 |
|------|------|------|
| **框架** | Arco Design Vue | 默认 owner：控件、布局、浮层、交互 |
| **Arco-first 合同** | `references/arco-first.md` | Arco → token → 业务 pattern → page-local CSS |
| UI Skill | `ui-skill/freight-arco-ui/SKILL.md` | PESDP 交付合同、reference 索引 |
| 增强层 | `src/styles/global.css` | Token、VXE 桥接、货代语义、已文档化的 archetype 槽位 |
| 功能契约 | `references/feature-routing.md` + `references/feature-delivery-contract.md` | 动作/权限/API/状态/验证 |
| 输入模板 | `references/artifact-intake-template.md` | 原型/截图任务的最小业务输入 |
| 原型转译 | `references/prototype-to-ui-contract.md` | 截图/原型 → 业务对象/页面原型/交互契约 |
| 图标规范 | `references/icons.md` | Arco / IconPark 分工与场景约束 |
| 编码门禁 | `.cursor/rules/spec-first-coding.mdc` | 先 Arco-first 决策，再写代码 |
| 自动检查 | `node scripts/check-spec.js` | 规范扫描 |

调用 skill：`/freight-arco-ui` · 维护：只改 `ui-skill/freight-arco-ui/` → `npm run sync-ui-skill`

**细则不在此重复。** 布局/表格/按钮/详情/质感 → 读 skill 对应 `references/`。

## PESDP

Professional · Efficient · Structured · Dense · Premium — 效率 > 信息 > 交互 > 装饰。

## 工作流（6 步）

1. `business_object` + `user_job` → [`module-patterns.md`](ui-skill/freight-arco-ui/references/module-patterns.md)（英文槽位）
2. 有截图/原型输入 → [`artifact-intake-template.md`](ui-skill/freight-arco-ui/references/artifact-intake-template.md)
3. 有截图/原型输入 → [`prototype-to-ui-contract.md`](ui-skill/freight-arco-ui/references/prototype-to-ui-contract.md)
4. 有点击/提交/请求/状态变化 → [`feature-routing.md`](ui-skill/freight-arco-ui/references/feature-routing.md) + [`feature-delivery-contract.md`](ui-skill/freight-arco-ui/references/feature-delivery-contract.md)
5. 页面原型 → [`page-archetypes.md`](ui-skill/freight-arco-ui/references/page-archetypes.md)
6. 中文标签/状态/字段 → [`domain-language.md`](ui-skill/freight-arco-ui/references/domain-language.md)
7. [`arco-first.md`](ui-skill/freight-arco-ui/references/arco-first.md) + 任务 reference（list / detail / table / actions / visual-system）
8. Arco 原生实现 → token → 共享 pattern；scoped 仅页面壳层
9. `check-spec.js` + 浏览器抽查

## 不可协商（摘要）

1. **Arco-first**；`global.css` 是增强层，不是第二 UI 框架
2. `vxe-table` only；禁止 `a-table`
3. 共享类：先过 `arco-first.md`，再 grep `global.css`
4. 列表：`filter-card` · `toolbar` · `table-wrap` · `workbench-table`
5. 详情子表：`detail-mini-vxe` · `detail-section__body--table` · 禁止 `show-overflow`
6. 状态 `s-pill[data-s]` only；禁止行铺色
7. 每作用域 1× `primary` → [`actions.md`](ui-skill/freight-arco-ui/references/actions.md)
8. 重置/刷新=`text`；模块主操作=`outline`；页头/吸底=`secondary`
9. 删除/废弃=`danger` + 确认
10. 禁止 hex、硬编码 14–16px 业务字、`font-weight:700`、废弃类名
11. 禁止把订单字段硬抄到无关模块
12. 有行为的功能必须定义功能契约字段
13. 通用动作图标用 Arco；业务语义图标用 IconPark
14. 截图/原型任务必须先补输入模板和原型转译

## Reference 索引

完整任务 → 文件映射见 **`ui-skill/freight-arco-ui/SKILL.md` → Reference Map**。  
编码前先读 → **`.cursor/rules/spec-first-coding.mdc`** + **`arco-first.md`**。

## 代码骨架

Vue DOM 骨架见 **`.cursor/rules/ui-spec.mdc`**；筛选 Tier / 双行结构 / Modal·Drawer 决策见 **`filter-layout.md`** / **`modal.md`**。

共享类使用前：先 **`arco-first.md`**，再 `grep -n "\.类名" src/styles/global.css`。

## 历史文档

功能实现也以 skill 的 feature contract 为准，不再依赖历史说明文档。
