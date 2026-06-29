# Permissions & Access (Archetype D)

## Use When

- 角色管理、菜单权限、按钮权限、数据范围（组织/仓库/客户）
- 用户绑定角色（简单场景）

Not for general **user profile editing** — that is `master-data.md` MD-2 or list + modal.

## Layout: `perm-layout`

Three-zone pattern in `global.css`:

```text
perm-layout
├── perm-layout__roles     角色列表（左）
├── perm-layout__panel     权限配置（右）
│   ├── perm-panel__head   角色名 + 保存
│   └── perm-panel__body   Tab：菜单 / 按钮 / 数据范围
└── (optional footer)      危险：删除角色
```

```vue
<div class="page-root page-root--dense perm-wrap">
  <div class="perm-layout zone-card">
    <aside class="perm-layout__roles">
      <div class="perm-role-head">
        <span class="perm-role-head__title">角色</span>
        <a-button size="small" type="text"><template #icon><icon-plus /></template></a-button>
      </div>
      <div class="perm-role-list">
        <button
          v-for="role in roles"
          :key="role.id"
          type="button"
          class="perm-role-item"
          :class="{ 'perm-role-item--active': role.id === activeRoleId }"
          @click="selectRole(role.id)"
        >
          <span class="perm-role-item__name">{{ role.name }}</span>
          <span v-if="role.isSystem" class="s-pill" data-s="draft">系统</span>
        </button>
      </div>
    </aside>
    <main class="perm-layout__panel">
      <div class="perm-panel__head">
        <h4 class="perm-panel__title">{{ activeRole?.name }}</h4>
        <a-button size="small" type="primary" :loading="saving">保存权限</a-button>
      </div>
      <div class="perm-panel__body">
        <a-tabs size="small" class="perm-tabs">
          <a-tab-pane key="menu" title="菜单权限">
            <a-tree v-model:checked-keys="menuKeys" :data="menuTree" checkable size="small" />
          </a-tab-pane>
          <a-tab-pane key="data" title="数据范围">
            <a-form class="detail-form" layout="vertical" size="small">
              <a-form-item label="数据范围">
                <a-select size="small" :options="dataScopeOptions" />
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </div>
    </main>
  </div>
</div>
```

## Interaction Rules

| Rule | Detail |
|------|--------|
| One active role | Left list single-select; active item uses `perm-role-item--active` |
| Save scope | One `primary` per panel — **保存权限** |
| System roles | Show `s-pill` 系统; forbid delete or require super-admin confirm |
| Unsaved changes | Leaving role or route → `Modal.confirm` |
| Tree check | Menu tree uses Arco `checkable`; do not hand-roll checkbox tables for menu permission |
| Data scope | Radio/select enum: 全部 / 本组织 / 本部门 / 仅本人 / 自定义 — labels in `domain-language` |

## User–Role Assignment

Prefer **workbench list** (用户管理):

- Columns: 账号、姓名、组织、角色、状态、操作
- 编辑角色: modal ≤8 fields or drawer `--standard`
- Do not embed full permission matrix inside user form

## Button-Level Permission (runtime)

- `v-if="hasPermission('order:create')"` on buttons — not on every table cell without tooltip fallback.
- Missing permission: hide button or `disabled` + tooltip `无权限` — pick one pattern per page, do not mix.
- No permission page: use `state-center` — `暂无访问权限，请联系管理员`.

## Danger Actions

- 删除角色 → `Modal.confirm` + `okButtonProps.status="danger"`
- 清空权限 → confirm with role name in title

## Forbidden

- Shipment order fields in permission UI.
- Multiple `primary` in `perm-panel__head`.
- `a-table` for menu permission grid.
- Saving without feedback — `Message.success('权限已保存')`.

## Verification

- [ ] `perm-layout` structure from `global.css`
- [ ] Role list uses `perm-role-item`, not raw styled `<div>`
- [ ] One primary save per panel
- [ ] System role delete guarded
