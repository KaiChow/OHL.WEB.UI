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
        <span class="detail-cargo-block__flow">
          <span class="detail-subitem__desc detail-cargo-block__shipper" :title="shipperLabel">{{ shipperLabel }}</span>
          <span v-if="block.consignee" class="detail-cargo-block__route" :title="block.consignee">
            <span class="detail-cargo-block__arrow">→</span>
            {{ block.consignee }}
          </span>
        </span>
      </div>
      <div class="detail-data-stats detail-subitem__stats">
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
      <div class="detail-subitem__actions">
        <span v-if="!expanded" class="detail-subitem__state">已收起</span>
        <a-popconfirm v-if="expanded && !readonly && canDelete" content="确认删除该发货人？" @ok="emit('remove-block')">
          <a-button size="small" type="text" status="danger" @click.stop>
            删除发货人
          </a-button>
        </a-popconfirm>
        <detail-collapse-toggle :expanded="expanded" @click.stop="toggle" />
      </div>
    </header>

    <div v-show="expanded" class="detail-subitem__body detail-cargo-block__body">
      <div class="detail-child-pane">
        <div class="detail-child-pane__head">
          <div>
            <div class="detail-child-pane__title">收发货方</div>
            <div class="detail-child-pane__desc">维护该发货人对应的收货人、通知人和海外代理</div>
          </div>
        </div>
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
      </div>

      <div class="detail-child-pane detail-child-pane--lines">
        <div class="detail-child-pane__head">
          <div>
            <div class="detail-child-pane__title">品名明细</div>
            <div class="detail-child-pane__desc">该发货人名下的货物品名、件数、重量和体积</div>
          </div>
          <a-button v-if="!readonly" size="small" type="outline" @click="emit('add-item')">
            <template #icon><icon-plus /></template>
            添加品名
          </a-button>
        </div>

        <div class="detail-child-pane__table">
          <vxe-table
            class="detail-mini-vxe"
            border="none"
            size="small"
            auto-resize
            show-overflow="title"
            :data="block.items"
            :row-config="{ isHover: true, keyField: 'id', height: 34 }"
          >
            <template #empty>
              <div class="detail-mini-empty">暂无品名明细，点击添加品名录入该发货人名下货物</div>
            </template>
            <vxe-column field="cnName" title="中文品名" min-width="120">
              <template #default="{ row }">
                <a-input v-model="row.cnName" :disabled="readonly" size="small" />
              </template>
            </vxe-column>
            <vxe-column field="enName" title="英文品名" min-width="140">
              <template #default="{ row }">
                <a-input v-model="row.enName" :disabled="readonly" size="small" />
              </template>
            </vxe-column>
            <vxe-column field="mark" title="唛头" min-width="100">
              <template #default="{ row }">
                <a-input v-model="row.mark" :disabled="readonly" size="small" />
              </template>
            </vxe-column>
            <vxe-column field="hsCode" title="HS CODE" min-width="120">
              <template #default="{ row }">
                <a-input v-model="row.hsCode" :disabled="readonly" size="small" />
              </template>
            </vxe-column>
            <vxe-column field="qty" title="件数" width="110" align="right">
              <template #default="{ row }">
                <a-input-number v-model="row.qty" :disabled="readonly" size="small" :min="0" />
              </template>
            </vxe-column>
            <vxe-column field="unit" title="包装单位" width="110">
              <template #default="{ row }">
                <a-input v-model="row.unit" :disabled="readonly" size="small" />
              </template>
            </vxe-column>
            <vxe-column field="grossWeight" title="毛重 KG" width="120" align="right">
              <template #default="{ row }">
                <a-input-number v-model="row.grossWeight" :disabled="readonly" size="small" :min="0" />
              </template>
            </vxe-column>
            <vxe-column field="volume" title="体积 CBM" width="120" align="right">
              <template #default="{ row }">
                <a-input-number v-model="row.volume" :disabled="readonly" size="small" :min="0" :precision="2" />
              </template>
            </vxe-column>
            <vxe-column v-if="!readonly" title="操作" width="72" fixed="right" align="center">
              <template #default="{ row }">
                <a-popconfirm content="确认删除该品名？" @ok="emit('remove-item', row.id)">
                  <a-button size="small" type="text" status="danger">删除</a-button>
                </a-popconfirm>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
    </div>
  </article>
</template>
