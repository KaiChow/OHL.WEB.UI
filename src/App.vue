<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';

const { locale } = useI18n();
const arcoLocale = computed(() => locale.value === 'en-US' ? enUS : zhCN);
</script>

<template>
  <a-config-provider :locale="arcoLocale" :update-at-scroll="true" :scroll-to-close="true" size="small">
    <router-view />
  </a-config-provider>
</template>
