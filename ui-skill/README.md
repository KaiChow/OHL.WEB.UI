# UI Skill — freight-arco-ui

PESDP Design System 2.0 · Vue 3 + Arco + VXE Table · 货代 SaaS

## 专业 Skill 分层

```
global.css              ← 样式唯一事实源（Token + 类名）
ui-skill/freight-arco-ui/
├── SKILL.md            ← 入口：架构、必读顺序、不可协商项
└── references/
    ├── design-principles.md   ← PESDP 原则
    ├── module-patterns.md     ← 英文槽位 / 结构（无字段表）
    ├── feature-routing.md     ← 功能类型 → 必读规范路由
    ├── feature-delivery-contract.md ← 动作/权限/API/状态/验证契约
    ├── domain-language.md     ← 中文货代用语 + 对象字段示例
    ├── actions.md · table.md · detail-form.md · list-page.md  ← 可执行细则
    └── checklist.md           ← 交付自查
AGENTS.md               ← 一页摘要，指向 skill
scripts/check-spec.js   ← 自动化验收
```

**维护：** 只改 `ui-skill/freight-arco-ui/`，然后 `npm run sync-ui-skill`。

## 同步

| 工具 | 路径 | 调用 |
|------|------|------|
| Cursor | `.cursor/skills/freight-arco-ui/` | 自动 / `@freight-arco-ui` |
| Codex | `.agents/skills/freight-arco-ui/` | `$freight-arco-ui` |
| Claude | `.claude/skills/freight-arco-ui/` | `/freight-arco-ui` |

## 配套

| 文件 | 用途 |
|------|------|
| `AGENTS.md` | Agent 一页摘要 |
| `CLAUDE.md` | Claude 代码骨架（逐步收敛到 skill 链接） |
| `.cursor/rules/ui-spec.mdc` | Cursor 始终生效的强制项 |
