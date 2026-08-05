<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { IconSearch, IconUser, IconLanguage } from '@arco-design/web-vue/es/icon';
import { Ship } from '@icon-park/vue-next';
import { appMenus } from '../config/menu';
import { setAppLocale, type AppLocale } from '../i18n';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const menuKeyword = ref('');
const selectedMenuKeys = ref<string[]>([]);
const openMenuKeys = ref<string[]>([]);
const isCompactShell = ref(false);
const isNarrowShell = ref(false);
let compactShellMedia: MediaQueryList | undefined;
let narrowShellMedia: MediaQueryList | undefined;

const syncCompactShell = (source: MediaQueryList | MediaQueryListEvent) => {
  isCompactShell.value = source.matches;
};

const syncNarrowShell = (source: MediaQueryList | MediaQueryListEvent) => {
  isNarrowShell.value = source.matches;
};

onMounted(() => {
  compactShellMedia = window.matchMedia('(max-width: 1199px)');
  narrowShellMedia = window.matchMedia('(max-width: 767px)');
  syncCompactShell(compactShellMedia);
  syncNarrowShell(narrowShellMedia);
  compactShellMedia.addEventListener('change', syncCompactShell);
  narrowShellMedia.addEventListener('change', syncNarrowShell);
});

onBeforeUnmount(() => {
  compactShellMedia?.removeEventListener('change', syncCompactShell);
  narrowShellMedia?.removeEventListener('change', syncNarrowShell);
});

const shellSiderWidth = computed(() => (isNarrowShell.value ? 56 : isCompactShell.value ? 184 : 220));

const isSameKeys = (a: string[], b: string[]) =>
  a.length === b.length && a.every((k, i) => k === b[i]);

const registeredRouteNames = new Set(
  router.getRoutes().map((item) => item.name).filter(Boolean).map(String),
);

const availableMenus = computed(() => appMenus
  .map((group) => ({
    ...group,
    title: group.titleKey ? t(group.titleKey) : group.title,
    children: group.children?.filter((item) => item.routeName && registeredRouteNames.has(item.routeName)).map((item) => ({
      ...item,
      title: item.titleKey ? t(item.titleKey) : item.title,
    })),
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
  route.meta.titleKey ? t(String(route.meta.titleKey)) : route.meta.title ? String(route.meta.title) : t('shell.workbench'),
);

const currentGroupTitle = computed(() => {
  const key = route.meta.menuKey ? String(route.meta.menuKey) : '';
  const group = availableMenus.value.find((item) => item.children?.some((child) => child.key === key));
  return group?.title ?? t('shell.defaultGroup');
});

const handleLocaleChange = (value: string | number | Record<string, unknown> | undefined) => {
  if (value === 'zh-CN' || value === 'en-US') setAppLocale(value as AppLocale);
};

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
    const activeGroup = availableMenus.value.find((group) => group.children?.some((item) => item.key === key));
    if (activeGroup && !openMenuKeys.value.includes(activeGroup.key)) {
      openMenuKeys.value = [...openMenuKeys.value, activeGroup.key];
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
      :class="{ 'app-layout__sider--compact': isCompactShell, 'app-layout__sider--narrow': isNarrowShell }"
      :width="shellSiderWidth"
      :collapsible="false"
    >
      <div class="app-layout__brand" aria-label="OHL Freight 导航">
        <a-avatar :size="28" shape="square" class="app-layout__logo">OHL</a-avatar>
        <div class="app-layout__brand-text">
          <div class="app-layout__brand-title">OHL Freight</div>
          <div class="app-layout__brand-sub">Operations OS</div>
        </div>
      </div>

      <div v-if="availableMenuCount >= 6" class="app-layout__search">
        <a-input v-model="menuKeyword" size="small" allow-clear :placeholder="t('shell.searchMenu')">
          <template #suffix><icon-search /></template>
        </a-input>
      </div>

      <a-menu
        v-model:open-keys="openMenuKeys"
        class="app-layout__menu"
        :selected-keys="selectedMenuKeys"
        :collapsed="isNarrowShell"
        accordion
        @menu-item-click="onMenuItemClick"
      >
        <a-sub-menu v-for="group in filteredMenus" :key="group.key">
          <template #icon><ship theme="outline" :size="16" /></template>
          <template #title><span :title="group.title">{{ group.title }}</span></template>
          <a-menu-item v-for="item in group.children" :key="item.key" :title="item.title">
            {{ item.title }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>

      <div class="app-layout__footer">
        <span>{{ t('shell.region') }}</span>
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
          <a-select class="app-layout__locale" size="small" :model-value="locale" :aria-label="t('shell.language')" @change="handleLocaleChange">
            <template #prefix><icon-language /></template>
            <a-option value="zh-CN">{{ t('shell.chinese') }}</a-option>
            <a-option value="en-US">{{ t('shell.english') }}</a-option>
          </a-select>
          <div class="app-layout__user" aria-label="admin">
            <icon-user />
            <span>admin</span>
          </div>
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

.app-layout__sider--compact .app-layout__search {
  padding-inline: 8px;
}

.app-layout__sider--compact .app-layout__menu {
  padding-inline: 4px;
}

.app-layout__sider--narrow .app-layout__brand {
  justify-content: center;
  padding-inline: 6px;
}

.app-layout__sider--narrow .app-layout__brand-text,
.app-layout__sider--narrow .app-layout__search,
.app-layout__sider--narrow .app-layout__footer {
  display: none;
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
  padding: 8px;
  margin-top: 0;
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

.app-layout__locale {
  width: 104px;
}

.app-layout__user {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-2);
}

.app-layout__content {
  min-height: 0;
  overflow: hidden;
  padding: 10px 12px var(--dense-page-bottom-space);
}

@media (max-width: 767px) {
  .app-layout__header { padding-inline: 8px; }
  .app-layout__content { padding-inline: 8px; }
  .app-layout__locale { width: 88px; }
}
</style>
