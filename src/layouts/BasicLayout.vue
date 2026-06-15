<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IconSearch } from '@arco-design/web-vue/es/icon';
import { appMenus } from '../config/menu';
import { initialTabs } from '../config/tabs';

const route = useRoute();
const router = useRouter();
const tabs = ref([...initialTabs]);

const activeMenuKey = computed(() => String(route.meta.menuKey || ''));
const activeTabKey = computed(() => {
  const matchedTab = tabs.value.find((tab) => tab.routeName === route.name);

  return matchedTab?.key || '';
});

const openMenu = (routeName?: string) => {
  if (!routeName || route.name === routeName) {
    return;
  }

  router.push({ name: routeName });
};

const openTab = (routeName: string) => {
  if (route.name !== routeName) {
    router.push({ name: routeName });
  }
};
</script>

<template>
  <a-layout class="app-shell">
    <a-layout-sider class="app-sider" :width="248">
      <div class="side-brand">
        <span class="brand-mark brand-mark--ptp">PTP</span>
        <strong>PTP System</strong>
      </div>

      <div class="side-search">
        <a-input size="small" allow-clear>
          <template #suffix>
            <icon-search />
          </template>
        </a-input>
      </div>

      <nav class="side-menu" aria-label="主菜单">
        <div v-for="group in appMenus" :key="group.key" class="side-menu-group side-menu-group--open">
          <div class="side-menu-title">{{ group.title }}</div>
          <button
            v-for="item in group.children"
            :key="item.key"
            class="side-menu-link"
            :class="{ 'side-menu-link--active': activeMenuKey === item.key }"
            type="button"
            @click="openMenu(item.routeName)"
          >
            {{ item.title }}
          </button>
        </div>
      </nav>
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
          </button>
        </nav>

        <div class="tabnav-actions">
          <button type="button" @click="$router.go(0)">刷新</button>
          <span>admin</span>
        </div>
      </header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
