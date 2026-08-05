<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  title: string;
  headingLevel?: 3 | 4;
}>(), { headingLevel: 3 });

const headingTag = computed(() => `h${props.headingLevel}`);
</script>

<template>
  <section class="business-field-group">
    <header class="business-field-group__head">
      <component :is="headingTag" class="business-field-group__title">{{ title }}</component>
      <div v-if="$slots.meta" class="business-field-group__meta"><slot name="meta" /></div>
    </header>
    <div class="business-field-group__body"><slot /></div>
  </section>
</template>

<style scoped>
.business-field-group { min-width: 0; }

.business-field-group__head {
  min-height: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dense-gap-inline);
}

.business-field-group__title {
  margin: 0;
  color: var(--color-text-1);
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
  line-height: 20px;
  letter-spacing: 0;
}

.business-field-group__meta {
  min-width: 0;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.business-field-group__body {
  min-width: 0;
  padding-top: 6px;
}
</style>
