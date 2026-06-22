<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <section class="detail-section">
    <header class="detail-section__head">
      <h3 class="detail-section__title">{{ title }}</h3>
      <div v-if="$slots.actions" class="detail-section__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="detail-section__body">
      <slot />
    </div>
  </section>
</template>
