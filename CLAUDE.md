# OHL 货代系统 — Claude Code 规范（摘要）

Vue 3 · TypeScript · Arco Design Vue · VXE Table · Vite

## 单一事实源（按优先级）

| 层级 | 文件 | 用途 |
|------|------|------|
| 样式 | `src/styles/global.css` | Token、布局类 — **禁止页面自写等效 CSS** |
| UI Skill | `ui-skill/freight-arco-ui/SKILL.md` | PESDP 交付合同、reference 索引 |
| 编码门禁 | `.cursor/rules/spec-first-coding.mdc` | 先决策 Tier / 结构 / Modal·Drawer，再写代码 |
| 自动检查 | `node scripts/check-spec.js` | 规范扫描 |

调用 skill：`/freight-arco-ui` · 维护：只改 `ui-skill/freight-arco-ui/` → `npm run sync-ui-skill`

**细则不在此重复。** 布局/表格/按钮/详情/质感 → 读 skill 对应 `references/`。

## PESDP

Professional · Efficient · Structured · Dense · Premium — 效率 > 信息 > 交互 > 装饰。

## 工作流（6 步）

1. `business_object` + `user_job` → [`module-patterns.md`](ui-skill/freight-arco-ui/references/module-patterns.md)（英文槽位）
2. 页面原型 → [`page-archetypes.md`](ui-skill/freight-arco-ui/references/page-archetypes.md)
3. 中文标签/状态/字段 → [`domain-language.md`](ui-skill/freight-arco-ui/references/domain-language.md)
4. `global.css` + 任务 reference（list / detail / table / actions / visual-system）
5. 复用类名；scoped 仅页面骨架
6. `check-spec.js` + 浏览器抽查

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

## Reference 索引

完整任务 → 文件映射见 **`ui-skill/freight-arco-ui/SKILL.md` → Reference Map**。  
编码前先读 → **`.cursor/rules/spec-first-coding.mdc`**。

## 代码骨架

Vue DOM 骨架见 **`.cursor/rules/ui-spec.mdc`**；筛选 Tier / 双行结构 / Modal·Drawer 决策不在 ui-spec 重复，见 **`filter-layout.md`** / **`modal.md`**。

类名使用前：`grep -n "\.类名" src/styles/global.css`

## 历史文档

`legacy-design-manual.md` 仅归档查阅，新需求以 skill + `global.css` 为准。
