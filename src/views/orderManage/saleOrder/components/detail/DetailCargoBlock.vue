<script setup lang="ts">
import { computed } from 'vue';
import { IconPlus } from '@arco-design/web-vue/es/icon';
import { calcBlockSummary } from '../../composables/useSaleOrderDetailForm';
import type { DetailCargoBlock } from '../../types';
import DetailCollapseToggle from './DetailCollapseToggle.vue';

const props = defineProps<{
  block: DetailCargoBlock;
  index: number;
  readonly: boolean;
  expanded: boolean;
  canDelete: boolean;
  isLast?: boolean;
}>();

const emit = defineEmits<{
  'update:expanded': [value: boolean];
  'add-item': [];
  'remove-item': [itemId: string];
  'remove-block': [];
}>();

const blockSummary = computed(() => calcBlockSummary(props.block));

const shipperLabel = computed(() => {
  const s = props.block.shipper?.trim();
  return s || '未填写发货人';
});

const toggle = () => emit('update:expanded', !props.expanded);

const onHeadKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggle();
  }
};
</script>

<template>
  <article
    class="detail-module__subitem detail-subitem detail-cargo-block"
    :class="{
      'detail-module__subitem--collapsed': !expanded,
      'detail-module__subitem--expanded': expanded,
      'detail-module__subitem--last': isLast
    }"
  >
    <header
      class="detail-subitem__head detail-cargo-block__head"
      role="button"
      tabindex="0"
      :aria-expanded="expanded"
      @click="toggle"
      @keydown="onHeadKeydown"
    >
      <span class="detail-subitem__index detail-cargo-block__index">{{ index + 1 }}</span>
      <div class="detail-subitem__meta detail-cargo-block__meta">
        <span class="detail-subitem__title detail-cargo-block__title">发货人 {{ index + 1 }}</span>
        <span class="detail-subitem__desc detail-cargo-block__shipper" :title="shipperLabel">{{ shipperLabel }}</span>
      </div>
      <div v-if="expanded" class="detail-data-stats detail-subitem__stats">
        <span class="detail-data-stats__item">
          <span class="detail-data-stats__label">件数</span>
          <span class="detail-data-stats__val">{{ blockSummary.qty.toLocaleString() }}</span>
        </span>
        <span class="detail-data-stats__sep">·</span>
        <span class="detail-data-stats__item">
          <span class="detail-data-stats__label">毛重</span>
          <span class="detail-data-stats__val">{{ blockSummary.weight.toLocaleString() }}</span>
          <span class="detail-data-stats__unit">KG</span>
        </span>
        <span class="detail-data-stats__sep">·</span>
        <span class="detail-data-stats__item">
          <span class="detail-data-stats__label">体积</span>
          <span class="detail-data-stats__val">{{ blockSummary.volume.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}</span>
          <span class="detail-data-stats__unit">CBM</span>
        </span>
        <span class="detail-data-stats__sep">·</span>
        <span class="detail-data-stats__item">
          <span class="detail-data-stats__label">品名</span>
          <span class="detail-data-stats__val">{{ block.items.length }}</span>
        </span>
      </div>
      <span v-if="!expanded" class="detail-subitem__state">已收起</span>
      <detail-collapse-toggle :expanded="expanded" @click.stop="toggle" />
    </header>

    <div v-show="expanded" class="detail-subitem__body detail-cargo-block__body">
      <a-form layout="vertical" :model="block" size="small" class="detail-form">
        <div class="detail-form-grid detail-form-grid--4">
          <a-form-item label="发货人" required>
            <a-input v-model="block.shipper" :disabled="readonly" />
          </a-form-item>
          <a-form-item label="收货人" required>
            <a-input v-model="block.consignee" :disabled="readonly" />
          </a-form-item>
          <a-form-item label="通知人">
            <a-input v-model="block.notifyParty" :disabled="readonly" />
          </a-form-item>
          <a-form-item label="海外代理">
            <a-input v-model="block.overseasAgent" :disabled="readonly" />
          </a-form-item>
          <a-form-item label="VAT">
            <a-input v-model="block.vatNo" :disabled="readonly" />
          </a-form-item>
          <a-form-item label="EORI">
            <a-input v-model="block.eoriNo" :disabled="readonly" />
          </a-form-item>
          <a-form-item label="备注" class="detail-form-grid__span4">
            <a-textarea v-model="block.remark" :disabled="readonly" :auto-size="{ minRows: 2 }" />
          </a-form-item>
        </div>
      </a-form>

      <div v-if="!readonly" class="detail-table-toolbar">
        <a-button size="small" type="primary" @click="emit('add-item')">
          <template #icon><icon-plus /></template>
          添加品名
        </a-button>
        <a-button v-if="canDelete" size="small" type="outline" status="danger" @click.stop="emit('remove-block')">
          删除发货人
        </a-button>
      </div>

      <div class="detail-mini-table-wrap">
        <table class="detail-mini-table detail-mini-table--wide">
          <thead>
            <tr>
              <th>中文品名</th>
              <th>英文品名</th>
              <th>唛头</th>
              <th>HS CODE</th>
              <th>件数</th>
              <th>包装单位</th>
              <th>毛重 KG</th>
              <th>体积 CBM</th>
              <th v-if="!readonly" class="detail-mini-table__op">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in block.items" :key="item.id">
              <td><a-input v-model="item.cnName" :disabled="readonly" size="small" /></td>
              <td><a-input v-model="item.enName" :disabled="readonly" size="small" /></td>
              <td><a-input v-model="item.mark" :disabled="readonly" size="small" /></td>
              <td><a-input v-model="item.hsCode" :disabled="readonly" size="small" /></td>
              <td><a-input-number v-model="item.qty" :disabled="readonly" size="small" :min="0" /></td>
              <td><a-input v-model="item.unit" :disabled="readonly" size="small" /></td>
              <td><a-input-number v-model="item.grossWeight" :disabled="readonly" size="small" :min="0" /></td>
              <td><a-input-number v-model="item.volume" :disabled="readonly" size="small" :min="0" :precision="2" /></td>
              <td v-if="!readonly" class="detail-mini-table__op">
                <a-button size="small" type="outline" status="danger" @click="emit('remove-item', item.id)">删除</a-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </article>
</template>
