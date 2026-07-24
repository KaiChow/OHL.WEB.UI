# Master Data & Configuration (Archetype D)

## Use When

- 基础信息维护：港口、船司、航线、字典、费用项、仓库、车型…
- 用户/组织维护（无复杂权限矩阵时）
- 系统设置：参数分组、开关、集成项（低密度配置）

User job is **configure**, not high-frequency scan. Density may be slightly lower than order workbench, but still use project tokens — no `size="medium"`.

## Layout Patterns

### Pattern MD-1: Left tree + right workbench (default)

Category/tree on the left; list or form on the right. Implement `md-layout` as page-scoped grid/flex or a shared Vue split-workspace component.

```vue
<div class="page-root page-root--dense md-wrap">
  <div class="zone-l2-filter-card zone-card filter-card">
    <!-- optional keyword filter for tree nodes -->
  </div>
  <div class="md-layout zone-card">
    <aside class="md-layout__tree">
      <div class="md-tree-head">分类</div>
      <a-tree
        v-model:selected-keys="selectedKeys"
        :data="treeData"
        size="small"
        block-node
      />
    </aside>
    <main class="md-layout__main">
      <div class="toolbar toolbar--dense">
        <div class="toolbar-group">
          <a-button size="small" type="primary"><template #icon><icon-plus /></template>新建</a-button>
        </div>
        <div class="toolbar-aside">
          <a-button size="small" type="text" @click="fetchList"><template #icon><icon-refresh /></template></a-button>
        </div>
      </div>
      <div class="table-wrap">
        <vxe-table border="none" size="small" class="compact workbench-table" height="100%" show-overflow="title"
          :row-config="{ isHover: true, keyField: 'Id', height: 36 }" :data="rows">
          <!-- identity, 启用状态, 更新时间, 操作 -->
        </vxe-table>
      </div>
    </main>
  </div>
</div>
```

### Pattern MD-2: Left tree + right form

Use when each tree node maps to **one config record** (system parameter group, integration profile).

- Right side: `detail-section` + `a-form class="detail-form"` — not a second tree.
- Sticky save uses a page-local footer with default Cancel and one primary Save; it must not depend on a drawer-footer skin.

### Pattern MD-3: Flat list only

Small dictionaries (&lt;200 rows, no hierarchy): skip tree — use **Archetype A** list only (`list-page.md`).

## Column Rules

| Column | Rule |
|--------|------|
| 编码 | `min-width` 120–160, mono optional |
| 名称 | `min-width` 160+, primary identity |
| 启用状态 | `s-pill` `acc`/`draft` — 启用/停用 |
| 归属组织 | when multi-tenant |
| 更新时间 | F5 aux color |
| 操作 | edit · disable/enable — delete → confirm |

No shipment-specific columns (ETD, MBL, 柜量) on master-data pages.

## Actions

| Action | Placement | Type |
|--------|-----------|------|
| 新建 | toolbar | `primary` (one per scope) |
| 编辑 | row or toolbar when single select | `outline` or row icon |
| 启用/停用 | row or batch | `outline`; 停用 → confirm |
| 删除 | row dropdown / footer | `danger` + confirm |
| 刷新 | `toolbar-aside` | `text` icon |

## Drawer vs Modal

| Fields | Container |
|--------|-----------|
| ≤8 | `a-modal` + `detail-form` (`overlay-dimensions` LG 640) |
| &gt;8 or grouped sections | `detail-drawer--standard` or inline right form (MD-2) |

## Empty & Selection

- Tree empty: `state-center` in `md-layout__tree` — `暂无分类，请联系管理员`.
- Table empty (category selected): `state-center--in-table` — `该分类下暂无数据` + 新建 button.
- No tree selection: right panel shows hint — `请选择左侧分类`.

## Forbidden

- Shipment `dds-head` / `dds-hero` on master-data pages.
- `a-table`.
- Full-width blue header bands.
- Hard-coded tree width in page scoped CSS — use `md-layout` tokens.
- Copying order list filters (ETD range, 船名航次) into dictionary pages.

## Verification

- [ ] `md-layout` + `md-layout__tree` + `md-layout__main`
- [ ] `workbench-table` + `border="none"` when right side is table
- [ ] Enable state uses `s-pill`, not row background color
- [ ] Labels from `domain-language` master-data row
