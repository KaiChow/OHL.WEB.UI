# UI Skill — freight-arco-ui

PESDP Design System 2.0 项目级 UI skill，适用于 Vue 3 + Arco Design Vue + VXE Table 货代 SaaS 页面。

## 源码（唯一维护入口）

```
ui-skill/freight-arco-ui/
├── SKILL.md
├── agents/openai.yaml
└── references/
```

修改 skill 时**只改 `ui-skill/freight-arco-ui/`**，然后运行同步命令。

## 同步到各 AI 工具

```bash
npm run sync-ui-skill
```

| 工具 | 同步目标 | 调用方式 |
|------|----------|----------|
| **Cursor** | `.cursor/skills/freight-arco-ui/` | Agent 自动发现；或 `@freight-arco-ui` |
| **Codex** | `.agents/skills/freight-arco-ui/` | `$freight-arco-ui` 或隐式触发 |
| **Claude Code** | `.claude/skills/freight-arco-ui/` | `/freight-arco-ui` 或自动触发 |

## 配套项目文档

| 文件 | 用途 |
|------|------|
| `CLAUDE.md` | Claude Code 项目指令（代码骨架 + skill 指针） |
| `AGENTS.md` | Codex 项目指令（精简版 + skill 指针） |
| `.cursor/rules/ui-spec.mdc` | Cursor 始终生效的 UI 规范 |
| `.cursor/rules/read-first.mdc` | Cursor 开发前必读 |

## 兼容入口

根目录 `ui-skill/freight-arco-ui-SKILL.md` 为旧路径兼容，指向 `ui-skill/freight-arco-ui/SKILL.md`。
