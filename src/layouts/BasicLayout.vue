<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IconSearch } from '@arco-design/web-vue/es/icon';
import { appMenus } from '../config/menu';
import { initialTabs } from '../config/tabs';
import type { AppTabItem } from '../types/navigation';

const route = useRoute();
const router = useRouter();
const tabs = ref<AppTabItem[]>([...initialTabs]);
const menuKeyword = ref('');
const openKeys = ref(appMenus.map((g) => g.key));

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

const filteredMenus = computed(() => {
  const kw = menuKeyword.value.trim().toLowerCase();
  if (!kw) return appMenus;
  return appMenus
    .map((group) => ({
      ...group,
      children: group.children?.filter(
        (item) => item.title.toLowerCase().includes(kw) || group.title.toLowerCase().includes(kw)
      ),
    }))
    .filter((group) => (group.children?.length ?? 0) > 0);
});

watch(filteredMenus, (menus) => {
  openKeys.value = menus.map((g) => g.key);
});

const selectedMenuKeys = computed(() => {
  const key = String(route.meta.menuKey || '');
  return key ? [key] : [];
});

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
  { immediate: true }
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

const closeTab = (tab: AppTabItem, event: MouseEvent) => {
  event.stopPropagation();
  if (!tab.closable) return;
  const idx = tabs.value.findIndex((t) => t.key === tab.key);
  if (idx < 0) return;
  const isActive = tab.routeName === route.name;
  tabs.value.splice(idx, 1);
  if (isActive && tabs.value.length) {
    const next = tabs.value[Math.min(idx, tabs.value.length - 1)];
    router.push({ name: next.routeName });
  }
};
</script>

<template>
  <a-layout class="app-shell">
    <a-layout-sider class="app-sider" :width="248">
      <div class="side-brand">
        <span class="brand-mark brand-mark--ptp">OHL</span>
        <strong>OHL 货代系统</strong>
      </div>

      <div class="side-search">
        <a-input v-model="menuKeyword" size="small" allow-clear placeholder="搜索菜单">
          <template #suffix>
            <icon-search />
          </template>
        </a-input>
      </div>

      <a-menu
        class="side-arco-menu"
        :selected-keys="selectedMenuKeys"
        v-model:open-keys="openKeys"
        auto-open-selected
        @menu-item-click="onMenuItemClick"
      >
        <a-sub-menu v-for="group in filteredMenus" :key="group.key">
          <template #title>{{ group.title }}</template>
          <a-menu-item v-for="item in group.children" :key="item.key">
            {{ item.title }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout class="main-layout">
      <header class="system-tabnav">
        <nav class="tabnav-menu" aria-label="页面标签">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tabnav-item"
            :class="{ 'tabnav-item--active': activeTabKey === tab.key }"
            type="button"
            @click="openTab(tab.routeName)"
          >
            {{ tab.title }}
            <span
              v-if="tab.closable"
              class="tabnav-close"
              role="button"
              aria-label="关闭"
              @click="closeTab(tab, $event)"
            >×</span>
          </button>
        </nav>

        <div class="tabnav-actions">
          <button type="button" @click="router.go(0)">刷新</button>
          <span>admin</span>
        </div>
      </header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.tabnav-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  font-size: 14px;
  line-height: 1;
  color: var(--color-text-3);
  transition: background 0.12s, color 0.12s;
}
.tabnav-close:hover {
  background: var(--color-fill-2);
  color: var(--color-text-1);
}
</style>
