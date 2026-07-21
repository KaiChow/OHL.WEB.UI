# UI Skill — freight-arco-ui

PESDP Design System 2.0 · Vue 3 + Arco + VXE Table · 货代 SaaS

## 专业 Skill 分层

```
Arco Design Vue         ← 页面默认组件与交互基础
src/styles/global.css   ← 薄增强层（Token + VXE 桥接 + 货代语义）
ui-skill/freight-arco-ui/
├── SKILL.md            ← 入口：架构、必读顺序、不可协商项
└── references/
    ├── arco-first.md          ← Arco → token → 业务 pattern → page-local CSS
    ├── design-principles.md   ← PESDP 原则
    ├── module-patterns.md     ← 英文槽位 / 结构（无字段表）
    ├── artifact-intake-template.md ← 原型/截图任务的最小业务输入模板
    ├── prototype-to-ui-contract.md ← 截图/原型转业务对象/原型/交互契约
    ├── feature-routing.md     ← 功能类型 → 必读规范路由
    ├── feature-delivery-contract.md ← 动作/权限/API/状态/验证契约
    ├── redesign-calibration.md ← 布局重写 / 质感 / 新 skill 设计改版口径
    ├── product-grade-evaluation.md ← 卖软件 / 融资演示 / 产品化评估口径
    ├── domain-language.md     ← 中文货代用语 + 对象字段示例
    ├── icons.md               ← Arco / IconPark 图标分工与场景约束
    ├── actions.md · table.md · detail-form.md · list-page.md  ← 可执行细则
    └── checklist.md           ← 交付自查
AGENTS.md               ← 一页摘要，指向 skill
scripts/check-spec.js   ← 自动化验收
```

**维护：** 规范只改 `ui-skill/freight-arco-ui/`，然后 `npm run sync-ui-skill`。页面实现优先使用 Arco props / slots / layout primitives；`global.css` 只作为共享增强层，不作为第二套 UI 框架。

## 同步

| 工具 | 路径 | 调用 |
|------|------|------|
| Cursor | `.cursor/skills/freight-arco-ui/` | 自动 / `@freight-arco-ui` |
| Codex | `.agents/skills/freight-arco-ui/` | `$freight-arco-ui` |

## 配套

| 文件 | 用途 |
|------|------|
| `AGENTS.md` | Agent 一页摘要 |
| `.cursor/rules/ui-spec.mdc` | Cursor 始终生效的强制项 |
