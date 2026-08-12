<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Sortable from 'sortablejs';
import { IconCheck, IconDragDotVertical, IconEdit } from '@arco-design/web-vue/es/icon';
import type { ExportQueryScheme } from '@/views/uiAcceptance/exportOrderList/types';

const props = defineProps<{
  visible: boolean;
  schemes: ExportQueryScheme[];
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  rename: [id: string, name: string];
  remove: [id: string];
  setDefault: [id: string];
  reorder: [orderedIds: string[]];
}>();

const { t } = useI18n();

const drawerVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

const listRef = ref<HTMLElement>();
const editingId = ref('');
const editingName = ref('');
let sortable: Sortable | undefined;

const startRename = (scheme: ExportQueryScheme) => {
  editingId.value = scheme.id;
  editingName.value = scheme.name;
};

const commitRename = (scheme: ExportQueryScheme) => {
  const name = editingName.value.trim();
  editingId.value = '';
  if (!name || name === scheme.name) return;
  emit('rename', scheme.id, name);
};

const setupSortable = async () => {
  sortable?.destroy();
  await nextTick();
  if (!listRef.value) return;
  sortable = Sortable.create(listRef.value, {
    animation: 150,
    handle: '.scheme-item__drag',
    draggable: '.scheme-item',
    ghostClass: 'scheme-item--ghost',
    onEnd: () => {
      const orderedIds = Array.from(listRef.value?.querySelectorAll<HTMLElement>('[data-scheme-id]') ?? [])
        .map((element) => element.dataset.schemeId ?? '')
        .filter(Boolean);
      emit('reorder', orderedIds);
    },
  });
};

watch(() => props.visible, async (visible) => {
  if (visible) await setupSortable();
  else {
    sortable?.destroy();
    sortable = undefined;
    editingId.value = '';
  }
});

onBeforeUnmount(() => sortable?.destroy());
</script>

<template>
  <a-drawer
    v-model:visible="drawerVisible"
    width="min(var(--dense-drawer-w-standard), calc(100vw - var(--dense-drawer-viewport-pad)))"
    :footer="false"
    unmount-on-close
  >
    <template #title>
      <div class="scheme-drawer__title">
        <span>{{ t('exportOrderList.schemes.manageTitle') }}</span>
        <span class="scheme-drawer__hint">{{ t('exportOrderList.schemes.manageHint') }}</span>
      </div>
    </template>

    <div v-if="schemes.length" ref="listRef" class="scheme-list">
      <div v-for="scheme in schemes" :key="scheme.id" class="scheme-item" :data-scheme-id="scheme.id">
        <a-tooltip :content="t('common.dragColumn', { column: scheme.name })">
          <a-button size="mini" type="text" class="scheme-item__drag" :aria-label="t('common.dragColumn', { column: scheme.name })">
            <template #icon><icon-drag-dot-vertical /></template>
          </a-button>
        </a-tooltip>
        <a-input
          v-if="editingId === scheme.id"
          v-model="editingName"
          size="small"
          class="scheme-item__input"
          :aria-label="t('exportOrderList.schemes.nameLabel')"
          @press-enter="commitRename(scheme)"
          @blur="commitRename(scheme)"
        />
        <span v-else class="scheme-item__name" :title="scheme.name">{{ scheme.name }}</span>
        <span v-if="scheme.isDefault" class="s-pill" data-s="acc">{{ t('exportOrderList.schemes.defaultTag') }}</span>
        <div class="scheme-item__actions">
          <a-tooltip v-if="editingId !== scheme.id" :content="t('exportOrderList.schemes.rename')">
            <a-button size="mini" type="text" :aria-label="t('exportOrderList.schemes.rename')" @click="startRename(scheme)">
              <template #icon><icon-edit /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip v-else :content="t('common.save')">
            <a-button size="mini" type="text" :aria-label="t('common.save')" @click="commitRename(scheme)">
              <template #icon><icon-check /></template>
            </a-button>
          </a-tooltip>
          <a-button v-if="!scheme.isDefault" size="mini" type="text" @click="emit('setDefault', scheme.id)">
            {{ t('exportOrderList.schemes.setDefault') }}
          </a-button>
          <a-popconfirm
            :content="t('exportOrderList.schemes.deleteCopy', { name: scheme.name })"
            :ok-button-props="{ status: 'danger', size: 'small' }"
            @ok="emit('remove', scheme.id)"
          >
            <a-button size="mini" type="text" status="danger">{{ t('exportOrderList.schemes.remove') }}</a-button>
          </a-popconfirm>
        </div>
      </div>
    </div>
    <div v-else class="scheme-empty">{{ t('exportOrderList.schemes.empty') }}</div>
  </a-drawer>
</template>

<style scoped>
.scheme-drawer__title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}

.scheme-drawer__hint {
  overflow: hidden;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scheme-list {
  display: grid;
  gap: 6px;
}

.scheme-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  min-height: 36px;
  padding-inline: 6px 10px;
  border: 1px solid var(--color-border-1);
  border-radius: 6px;
}

.scheme-item--ghost {
  background: var(--dense-primary-1);
  opacity: .45;
}

.scheme-item__drag {
  flex: 0 0 auto;
  color: var(--color-text-3);
  cursor: grab;
}

.scheme-item__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scheme-item__input {
  flex: 1;
  min-width: 0;
}

.scheme-item__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 2px;
}

.scheme-empty {
  display: grid;
  min-height: 120px;
  place-items: center;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}
</style>
