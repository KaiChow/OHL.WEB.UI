<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IconRefresh, IconSearch, IconUser, IconDown } from '@arco-design/web-vue/es/icon';
import { appMenus } from '../config/menu';

const route = useRoute();
const router = useRouter();
const menuKeyword = ref('');
const openKeys = ref(appMenus.map((g) => g.key));
const selectedMenuKeys = ref<string[]>([]);

const isSameKeys = (a: string[], b: string[]) =>
  a.length === b.length && a.every((k, i) => k === b[i]);

const setOpenKeys = (keys: string[]) => {
  if (isSameKeys(openKeys.value, keys)) return;
  openKeys.value = keys;
};

const getParentGroupKey = (itemKey: string) => {
  for (const group of appMenus) {
    if (group.children?.some((item) => item.key === itemKey)) return group.key;
  }
  return undefined;
};

const ensureParentMenuOpen = (itemKey: string) => {
  const parentKey = getParentGroupKey(itemKey);
  if (!parentKey || openKeys.value.includes(parentKey)) return;
  setOpenKeys([...openKeys.value, parentKey]);
};

const menuKeyRouteMap = computed(() => {
  const map = new Map<string, string>();
  for (const group of appMenus) {
    for (const item of group.children ?? []) {
      if (item.routeName) map.set(item.key, item.routeName);
    }
  }
  return map;
});

const menuRouteMap = computed(() => {
  const map = new Map<string, { key: string; title: string }>();
  for (const group of appMenus) {
    for (const item of group.children ?? []) {
      if (item.routeName) {
        map.set(item.routeName, { key: item.key, title: item.title });
      }
    }
  }
  return map;
});

const currentPageTitle = computed(() =>
  route.meta.title ? String(route.meta.title) : '工作台',
);

const currentGroupTitle = computed(() => {
  const key = route.meta.menuKey ? String(route.meta.menuKey) : '';
  const group = appMenus.find((item) => item.children?.some((child) => child.key === key));
  return group?.title ?? '业务单';
});

const filteredMenus = computed(() => {
  const kw = menuKeyword.value.trim().toLowerCase();
  if (!kw) return appMenus;
  return appMenus
    .map((group) => ({
      ...group,
      children: group.children?.filter(
        (item) => item.title.toLowerCase().includes(kw) || group.title.toLowerCase().includes(kw),
      ),
    }))
    .filter((group) => (group.children?.length ?? 0) > 0);
});

watch(menuKeyword, () => {
  setOpenKeys(filteredMenus.value.map((g) => g.key));
});

watch(
  () => route.meta.menuKey,
  (menuKey) => {
    const key = menuKey ? String(menuKey) : '';
    const next = key ? [key] : [];
    if (!isSameKeys(selectedMenuKeys.value, next)) {
      selectedMenuKeys.value = next;
    }
    if (key) ensureParentMenuOpen(key);
  },
  { immediate: true },
);

const onOpenKeysChange = (keys: string[]) => {
  setOpenKeys(keys);
};

const onMenuItemClick = (key: string) => {
  const routeName = menuKeyRouteMap.value.get(key);
  if (!routeName || route.name === routeName) return;
  router.push({ name: routeName });
};
</script>

<template>
  <a-layout class="app-layout">
    <a-layout-sider class="app-layout__sider" :width="204" :collapsible="false">
      <div class="app-layout__brand">
        <a-avatar :size="28" shape="square" class="app-layout__logo">OHL</a-avatar>
        <div class="app-layout__brand-text">
          <div class="app-layout__brand-title">OHL Freight OS</div>
          <div class="app-layout__brand-sub">Freight Operations Platform</div>
        </div>
      </div>

      <div class="app-layout__search">
        <a-input v-model="menuKeyword" size="small" allow-clear placeholder="搜索菜单">
          <template #suffix><icon-search /></template>
        </a-input>
      </div>

      <a-menu
        class="app-layout__menu"
        :selected-keys="selectedMenuKeys"
        :open-keys="openKeys"
        @update:open-keys="onOpenKeysChange"
        @menu-item-click="onMenuItemClick"
      >
        <a-sub-menu v-for="group in filteredMenus" :key="group.key">
          <template #title>{{ group.title }}</template>
          <a-menu-item v-for="item in group.children" :key="item.key">
            {{ item.title }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>

      <div class="app-layout__footer">
        <span>CN Workspace</span>
        <span>v0.1</span>
      </div>
    </a-layout-sider>

    <a-layout class="app-layout__main">
      <a-layout-header class="app-layout__header">
        <div class="app-layout__header-main">
          <div class="app-layout__header-context">
            <span class="app-layout__eyebrow">{{ currentGroupTitle }}</span>
            <strong class="app-layout__page-title">{{ currentPageTitle }}</strong>
          </div>
        </div>

        <a-space class="app-layout__header-actions" :size="8">
          <a-button size="small" type="text" class="app-layout__icon-action" title="刷新" @click="router.go(0)">
            <template #icon><icon-refresh /></template>
          </a-button>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" class="app-layout__user">
              <template #icon><icon-user /></template>
              admin
              <icon-down />
            </a-button>
            <template #content>
              <a-doption>个人设置</a-doption>
              <a-doption>切换工作区</a-doption>
              <a-doption>退出登录</a-doption>
            </template>
          </a-dropdown>
        </a-space>
      </a-layout-header>

      <a-layout-content class="app-layout__content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.app-layout {
  height: 100vh;
  background: var(--dense-page-bg);
}

.app-layout__sider {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-card);
  border-right: 1px solid var(--dense-card-border);
  box-shadow: none;
}

.app-layout__sider :deep(.arco-layout-sider-children) {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.app-layout__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 54px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--dense-card-border);
}

.app-layout__logo {
  background: var(--dense-primary-6);
  color: var(--color-white);
  font-size: 11px;
  font-weight: var(--dense-weight-title);
}

.app-layout__brand-title {
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-title);
  color: var(--color-text-1);
  line-height: 1.2;
}

.app-layout__brand-sub {
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
  line-height: 1.2;
}

.app-layout__search {
  padding: 10px 12px 8px;
  border-bottom: 1px solid var(--color-border-1);
}

.app-layout__search :deep(.arco-input-wrapper) {
  background: var(--color-bg-card);
}

.app-layout__menu {
  flex: 1;
  overflow: auto;
  border-right: none;
  padding: 8px 6px 8px;
  margin-top: 0;
}

.app-layout__menu :deep(.arco-menu) {
  background: transparent;
}

.app-layout__menu :deep(.arco-menu-inline-header),
.app-layout__menu :deep(.arco-menu-item) {
  border-radius: 6px;
}

.app-layout__menu :deep(.arco-menu-inline-header) {
  color: var(--color-text-2);
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-title);
  background: transparent;
  padding-left: 12px;
}

.app-layout__menu :deep(.arco-menu-selected) {
  background: var(--dense-primary-1);
  color: var(--dense-primary-7);
  font-weight: var(--dense-weight-title);
  box-shadow: inset 2px 0 0 var(--dense-primary-5);
}

.app-layout__menu :deep(.arco-menu-item:hover),
.app-layout__menu :deep(.arco-menu-inline-header:hover) {
  background: var(--color-fill-1);
}

.app-layout__footer {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
  border-top: 1px solid var(--dense-card-border);
}

.app-layout__main {
  min-width: 0;
  background: var(--dense-page-bg);
}

.app-layout__header {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 14px;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--dense-card-border);
  box-shadow: none;
}

.app-layout__header-main {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.app-layout__header-context {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex-shrink: 0;
  min-width: 0;
}

.app-layout__eyebrow {
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
  line-height: 14px;
  white-space: nowrap;
}

.app-layout__page-title {
  font-size: var(--dense-font-overlay);
  font-weight: var(--dense-weight-title);
  color: var(--color-text-1);
  line-height: 18px;
  white-space: nowrap;
}

.app-layout__header-actions {
  flex-shrink: 0;
}

.app-layout__icon-action {
  color: var(--color-text-3);
}

.app-layout__user {
  border-color: var(--color-border-1);
  background: var(--color-bg-card);
  color: var(--color-text-2);
  box-shadow: none;
}

.app-layout__content {
  min-height: 0;
  overflow: hidden;
  padding: 10px 12px var(--dense-page-bottom-space);
}
</style>
