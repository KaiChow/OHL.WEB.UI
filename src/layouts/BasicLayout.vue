<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IconRefresh, IconSearch } from '@arco-design/web-vue/es/icon';
import { appMenus } from '../config/menu';
import { initialTabs } from '../config/tabs';
import type { AppTabItem } from '../types/navigation';

const route = useRoute();
const router = useRouter();
const tabs = ref<AppTabItem[]>([...initialTabs]);
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

const activeTabKey = computed(() => {
  const matchedTab = tabs.value.find((tab) => tab.routeName === route.name);
  return matchedTab?.key || '';
});

const ensureTab = (routeName: string) => {
  if (tabs.value.some((tab) => tab.routeName === routeName)) return;
  const meta = menuRouteMap.value.get(routeName);
  if (!meta) return;
  tabs.value.push({ key: meta.key, title: meta.title, routeName, closable: true });
};

watch(
  () => route.name,
  (name) => {
    if (typeof name === 'string') ensureTab(name);
  },
  { immediate: true },
);

const onMenuItemClick = (key: string) => {
  const routeName = menuKeyRouteMap.value.get(key);
  if (!routeName || route.name === routeName) return;
  ensureTab(routeName);
  router.push({ name: routeName });
};

const openTab = (routeName: string) => {
  if (route.name !== routeName) router.push({ name: routeName });
};

const closeTab = (tab: AppTabItem, index: number) => {
  if (!tab.closable) return;
  const isActive = tab.routeName === route.name;
  tabs.value.splice(index, 1);
  if (isActive && tabs.value.length) {
    const next = tabs.value[Math.min(index, tabs.value.length - 1)];
    router.push({ name: next.routeName });
  }
};
</script>

<template>
  <a-layout class="app-layout">
    <a-layout-sider class="app-layout__sider" :width="248" :collapsible="false">
      <div class="app-layout__brand">
        <a-avatar :size="28" shape="square" class="app-layout__logo">OHL</a-avatar>
        <div class="app-layout__brand-text">
          <div class="app-layout__brand-title">OHL Freight OS</div>
          <div class="app-layout__brand-sub">Operations Workspace</div>
        </div>
      </div>

      <div class="app-layout__search">
        <a-input v-model="menuKeyword" size="small" allow-clear placeholder="搜索菜单">
          <template #suffix><icon-search /></template>
        </a-input>
      </div>

      <a-alert type="info" :show-icon="false" class="app-layout__context">
        <template #title>当前工作域</template>
        {{ currentGroupTitle }} / {{ currentPageTitle }}
      </a-alert>

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
        <div class="app-layout__header-context">
          <span class="app-layout__eyebrow">{{ currentGroupTitle }}</span>
          <strong class="app-layout__page-title">{{ currentPageTitle }}</strong>
        </div>

        <a-tabs
          class="app-layout__tabs"
          type="card-gutter"
          size="small"
          :active-key="activeTabKey"
          hide-content
          editable
          @tab-click="(key) => { const tab = tabs.find((t) => t.key === key); if (tab) openTab(tab.routeName); }"
          @delete="(key) => { const idx = tabs.findIndex((t) => t.key === key); if (idx >= 0) closeTab(tabs[idx], idx); }"
        >
          <a-tab-pane
            v-for="tab in tabs"
            :key="tab.key"
            :title="tab.title"
            :closable="tab.closable"
          />
        </a-tabs>

        <a-space class="app-layout__header-actions" :size="8">
          <a-button size="small" type="text" @click="router.go(0)">
            <template #icon><icon-refresh /></template>
          </a-button>
          <a-tag color="arcoblue">admin</a-tag>
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
}

.app-layout__sider {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border-2);
}

.app-layout__sider :deep(.arco-layout-sider-children) {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.app-layout__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-2);
}

.app-layout__logo {
  background: rgb(var(--primary-6));
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.app-layout__brand-title {
  font-size: var(--dense-font-overlay);
  font-weight: 600;
  color: var(--color-text-1);
  line-height: 1.2;
}

.app-layout__brand-sub {
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
  line-height: 1.2;
}

.app-layout__search {
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-border-2);
}

.app-layout__context {
  margin: 10px 12px 0;
  padding: 8px 10px;
}

.app-layout__context :deep(.arco-alert-title) {
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
  margin-bottom: 2px;
}

.app-layout__menu {
  flex: 1;
  overflow: auto;
  border-right: none;
  margin-top: 8px;
}

.app-layout__footer {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
  border-top: 1px solid var(--color-border-2);
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
  padding: 0 12px;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
}

.app-layout__header-context {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
  min-width: 120px;
}

.app-layout__eyebrow {
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
}

.app-layout__page-title {
  font-size: var(--dense-font-nav);
  font-weight: 600;
  color: var(--color-text-1);
}

.app-layout__tabs {
  flex: 1;
  min-width: 0;
}

.app-layout__tabs :deep(.arco-tabs-nav) {
  margin-bottom: 0;
}

.app-layout__header-actions {
  flex-shrink: 0;
}

.app-layout__content {
  min-height: 0;
  overflow: hidden;
  padding: 8px 10px var(--dense-page-bottom-space);
}
</style>
