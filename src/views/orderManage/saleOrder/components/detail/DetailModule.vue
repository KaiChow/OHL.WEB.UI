<script setup lang="ts">
defineProps<{
  title: string;
  badge?: string;
}>();
</script>

<template>
  <section class="detail-section detail-module">
    <header class="detail-section__head">
      <h3 class="detail-section__title">
        {{ title }}
        <span v-if="badge" class="detail-module__badge">{{ badge }}</span>
      </h3>
      <div v-if="$slots.actions" class="detail-section__actions">
        <slot name="actions" />
      </div>
    </header>

    <div v-if="$slots.summary" class="detail-module__summary">
      <slot name="summary" />
    </div>

    <div class="detail-module__sublist">
      <slot />
    </div>
  </section>
</template>
