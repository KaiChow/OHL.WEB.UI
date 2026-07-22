<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IconRefresh, IconSearch, IconUser, IconDown } from '@arco-design/web-vue/es/icon';
import { Ship } from '@icon-park/vue-next';
import { appMenus } from '../config/menu';

const route = useRoute();
const router = useRouter();
const menuKeyword = ref('');
const selectedMenuKeys = ref<string[]>([]);
const isCompactShell = ref(false);
let compactShellMedia: MediaQueryList | undefined;

const syncCompactShell = (source: MediaQueryList | MediaQueryListEvent) => {
  isCompactShell.value = source.matches;
};

onMounted(() => {
  compactShellMedia = window.matchMedia('(max-width: 1199px)');
  syncCompactShell(compactShellMedia);
  compactShellMedia.addEventListener('change', syncCompactShell);
});

onBeforeUnmount(() => {
  compactShellMedia?.removeEventListener('change', syncCompactShell);
});

const isSameKeys = (a: string[], b: string[]) =>
  a.length === b.length && a.every((k, i) => k === b[i]);

const registeredRouteNames = new Set(
  router.getRoutes().map((item) => item.name).filter(Boolean).map(String),
);

const availableMenus = computed(() => appMenus
  .map((group) => ({
    ...group,
    children: group.children?.filter((item) => item.routeName && registeredRouteNames.has(item.routeName)),
  }))
  .filter((group) => (group.children?.length ?? 0) > 0));

const availableMenuCount = computed(() => availableMenus.value.reduce(
  (count, group) => count + (group.children?.length ?? 0),
  0,
));

const menuKeyRouteMap = computed(() => {
  const map = new Map<string, string>();
  for (const group of availableMenus.value) {
    for (const item of group.children ?? []) {
      if (item.routeName) map.set(item.key, item.routeName);
    }
  }
  return map;
});

const currentPageTitle = computed(() =>
  route.meta.title ? String(route.meta.title) : '工作台',
);

const currentGroupTitle = computed(() => {
  const key = route.meta.menuKey ? String(route.meta.menuKey) : '';
  const group = availableMenus.value.find((item) => item.children?.some((child) => child.key === key));
  return group?.title ?? '海运业务';
});

const filteredMenus = computed(() => {
  const kw = menuKeyword.value.trim().toLowerCase();
  if (!kw) return availableMenus.value;
  return availableMenus.value
    .map((group) => ({
      ...group,
      children: group.children?.filter(
        (item) => item.title.toLowerCase().includes(kw) || group.title.toLowerCase().includes(kw),
      ),
    }))
    .filter((group) => (group.children?.length ?? 0) > 0);
});

watch(
  () => route.meta.menuKey,
  (menuKey) => {
    const key = menuKey ? String(menuKey) : '';
    const next = key ? [key] : [];
    if (!isSameKeys(selectedMenuKeys.value, next)) {
      selectedMenuKeys.value = next;
    }
  },
  { immediate: true },
);

const onMenuItemClick = (key: string) => {
  const routeName = menuKeyRouteMap.value.get(key);
  if (!routeName || route.name === routeName) return;
  router.push({ name: routeName });
};
</script>

<template>
  <a-layout class="app-layout">
    <a-layout-sider
      class="app-layout__sider"
      :class="{ 'app-layout__sider--compact': isCompactShell }"
      :width="isCompactShell ? 176 : 204"
      :collapsible="false"
    >
      <div class="app-layout__brand">
        <a-avatar :size="28" shape="square" class="app-layout__logo">OHL</a-avatar>
        <div class="app-layout__brand-text">
          <div class="app-layout__brand-title">OHL Freight</div>
          <div class="app-layout__brand-sub">Operations OS</div>
        </div>
      </div>

      <div class="app-layout__workspace">
        <span>当前工作区</span>
        <strong>华南操作中心</strong>
      </div>

      <div v-if="availableMenuCount >= 6" class="app-layout__search">
        <a-input v-model="menuKeyword" size="small" allow-clear placeholder="搜索菜单">
          <template #suffix><icon-search /></template>
        </a-input>
      </div>

      <a-menu
        class="app-layout__menu"
        :selected-keys="selectedMenuKeys"
        @menu-item-click="onMenuItemClick"
      >
        <a-menu-item-group v-for="group in filteredMenus" :key="group.key" :title="group.title">
          <a-menu-item v-for="item in group.children" :key="item.key">
            <template #icon><ship theme="outline" :size="16" /></template>
            {{ item.title }}
          </a-menu-item>
        </a-menu-item-group>
      </a-menu>

      <div class="app-layout__footer">
        <span>中国区 · CN</span>
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

.app-layout__sider--compact .app-layout__brand {
  gap: 8px;
  padding-inline: 10px;
}

.app-layout__sider--compact .app-layout__brand-sub {
  display: none;
}

.app-layout__sider--compact .app-layout__workspace {
  padding-inline: 10px;
}

.app-layout__sider--compact .app-layout__search {
  padding-inline: 8px;
}

.app-layout__sider--compact .app-layout__menu {
  padding-inline: 4px;
}

.app-layout__search {
  padding: 10px 12px 8px;
  border-bottom: 1px solid var(--color-border-1);
}

.app-layout__workspace {
  padding: 11px 14px 10px;
  border-bottom: 1px solid var(--color-border-1);
}

.app-layout__workspace span,
.app-layout__workspace strong {
  display: block;
}

.app-layout__workspace span {
  color: var(--color-text-3);
  font-size: var(--dense-font-micro);
  line-height: 16px;
}

.app-layout__workspace strong {
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-layout__search :deep(.arco-input-wrapper) {
  background: var(--color-bg-card);
}

.app-layout__menu {
  flex: 1;
  overflow: auto;
  border-right: none;
  padding: 8px 6px;
  margin-top: 0;
}

.app-layout__menu :deep(.arco-menu) {
  background: transparent;
}

.app-layout__menu :deep(.arco-menu-item) {
  height: 34px;
  margin-bottom: 2px;
  border-radius: 4px;
  padding-left: 10px !important;
  color: var(--color-text-2);
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-nav);
  line-height: 34px;
}

.app-layout__menu :deep(.arco-menu-group-title) {
  height: auto;
  padding: 8px 10px 5px !important;
  color: var(--color-text-3);
  font-size: var(--dense-font-micro);
  font-weight: var(--dense-weight-title);
  line-height: 16px;
}

.app-layout__menu :deep(.arco-menu-selected) {
  background: var(--color-fill-1);
  color: var(--dense-primary-7);
  font-weight: var(--dense-weight-title);
  box-shadow: inset 2px 0 0 var(--dense-primary-6);
}

.app-layout__menu :deep(.arco-menu-item:hover) {
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
