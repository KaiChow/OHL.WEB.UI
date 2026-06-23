# OHL 规范 Code Review

对当前改动的 Vue 组件进行规范符合性审查。审查依据是 `CLAUDE.md` 中定义的设计规范。

## 执行步骤

1. 运行 `git diff HEAD --name-only` 获取改动文件列表
2. 读取其中所有 `.vue` / `.ts` 文件的完整内容
3. 对照下方检查清单逐条审查，输出所有违规

## 检查清单

### A. 布局结构
- [ ] 列表页根节点是否 `page-root page-root--dense`
- [ ] 搜索区是否用 `zone-l2-filter-card zone-card filter-card` + 内部 `filter-card__main` 结构
- [ ] 工具栏是否用 `toolbar toolbar--dense`，左组 `toolbar-group`，右侧 `toolbar-aside`
- [ ] 表格容器是否用 `table-wrap`，禁止外层再套 `overflow:auto`
- [ ] **stab tab ≤ 4 个时**是否错误使用了独立 `scope-status-bar` 行（应嵌入 toolbar-group）
- [ ] **stab tab ≥ 5 个时**是否用了 `scope-status-bar`（分 `__scope` + `__status` 两区）

### B. VXE Table
- [ ] 是否有用 `<a-table>`（禁止，必须 vxe-table）
- [ ] `border` 是否为 `"none"`
- [ ] `size` 是否为 `"small"`
- [ ] 列表页主表格 `height` 是否为 `"100%"`；子表格/弹窗内是否为 `"auto"`
- [ ] `show-overflow` 是否为 `"title"`
- [ ] 是否至少有一列用 `min-width`（禁止全列用 `width`）
- [ ] 操作列是否 `fixed="right"`

### C. 状态标签与颜色
- [ ] 状态是否全用 `s-pill[data-s]`，禁止行背景色
- [ ] 自定义标签（CRM 标签池等）是否有 `TAG_PILL_MAP` 动态颜色，禁止固定 `data-s="draft"`
- [ ] 是否有 hex 颜色（`#xxx`），应改用 CSS 变量
- [ ] 是否有 `font-size: 14px/15px/16px` 硬编码，应用 token

### D. 按钮规范
- [ ] 刷新按钮是否 `type="text"` icon-only（禁止 `type="outline"`）
- [ ] 重置按钮是否 `type="text"` 纯文字（禁止带图标）
- [ ] 行内操作按钮是否 `type="text" class="row-action-btn"` + `<a-tooltip>`
- [ ] 危险操作（删除/取消/废弃）是否放在 `<a-dropdown>` 下拉菜单里

### E. 表单字段
- [ ] 只读展示字段是否用 `detail-field` + `detail-field__label` + `detail-field__val`
- [ ] 可编辑字段是否用 `a-form layout="vertical" class="detail-form"` + `a-form-item`
- [ ] 是否存在 `detail-field` 包裹可编辑控件的混用情况

### F. 组件选用
- [ ] 文件上传是否用 `<a-upload>`（禁止，应用 UppyUploader）
- [ ] 分页是否裸用 `<a-pagination>`（禁止，应在 `table-card-cap` 结构内）

### G. 空状态
- [ ] 表格空状态是否有 Arco icon（禁止 emoji）
- [ ] 空状态是否有操作引导（如"新建"按钮）

## 输出格式

每处违规按以下格式输出：

```
❌ [文件名:行号] 问题描述
   当前写法: xxx
   正确写法: xxx
```

最后给出总结：
- 违规总数
- 严重程度（🔴 阻塞提交 / 🟡 建议修改 / 🟢 可接受）
- 通过/不通过结论
