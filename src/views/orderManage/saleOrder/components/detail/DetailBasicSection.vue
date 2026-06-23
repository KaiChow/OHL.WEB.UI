<script setup lang="ts">
import {
  blFormatOptions,
  cargoTypeCheckboxOptions,
  carrierOptions,
  portOptions,
  tradeTermsOptions,
  transportTermsOptions
} from '../../detailConfig';
import type { SaleOrderDetailModel } from '../../types';
import DetailSection from './DetailSection.vue';

const props = defineProps<{
  detail: SaleOrderDetailModel;
  readonly: boolean;
}>();

const RISK_CARGO_TYPES = new Set(['危险品', '危险货', '化工品', '液体', '带电池', '粉末']);

function toggleCargoType(item: string) {
  if (props.readonly) return;
  const idx = props.detail.CargoTypes.indexOf(item);
  if (idx === -1) props.detail.CargoTypes.push(item);
  else props.detail.CargoTypes.splice(idx, 1);
}
</script>

<template>
  <detail-section title="基础信息">
    <a-form layout="vertical" :model="detail" size="small" class="detail-form">
      <div class="form-subgroup-label">港口 & 航线</div>
      <div class="detail-form-grid detail-form-grid--6">
        <a-form-item label="收货地" required>
          <a-select v-model="detail.Pol" :disabled="readonly" allow-search>
            <a-option v-for="p in portOptions" :key="'pol-' + p" :value="p">{{ p }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="起运港" required>
          <a-select v-model="detail.Pol" :disabled="readonly" allow-search>
            <a-option v-for="p in portOptions" :key="'pol2-' + p" :value="p">{{ p }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="中转港">
          <a-select v-model="detail.Pot" :disabled="readonly" allow-clear allow-search>
            <a-option v-for="p in portOptions" :key="'pot-' + p" :value="p">{{ p }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="目的港" required>
          <a-select v-model="detail.Pod" :disabled="readonly" allow-search>
            <a-option v-for="p in portOptions" :key="'pod-' + p" :value="p">{{ p }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="目的地" required>
          <a-input v-model="detail.FinalDestination" :disabled="readonly" />
        </a-form-item>
        <a-form-item label="船公司">
          <a-select v-model="detail.Carrier" :disabled="readonly" allow-search>
            <a-option v-for="c in carrierOptions" :key="c" :value="c">{{ c }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="航线">
          <a-input v-model="detail.Route" :disabled="readonly" />
        </a-form-item>
        <a-form-item label="大船船名/航次">
          <a-input v-model="detail.VesselVoyage" :disabled="readonly" />
        </a-form-item>
      </div>

      <div class="form-subgroup-label form-subgroup-label--mt">关键时间节点</div>
      <div class="detail-form-grid detail-form-grid--6">
        <a-form-item label="ETD" required>
          <a-date-picker v-model="detail.Etd" :disabled="readonly" style="width: 100%" />
        </a-form-item>
        <a-form-item label="ETA">
          <a-date-picker v-model="detail.Eta" :disabled="readonly" style="width: 100%" />
        </a-form-item>
        <a-form-item label="预计进仓时间" required>
          <a-date-picker v-model="detail.EstInboundTime" :disabled="readonly" style="width: 100%" />
        </a-form-item>
        <a-form-item label="预计出仓时间">
          <a-date-picker v-model="detail.EstOutboundTime" :disabled="readonly" style="width: 100%" />
        </a-form-item>
        <a-form-item label="预计仓库" required>
          <a-input v-model="detail.EstWarehouse" :disabled="readonly" />
        </a-form-item>
      </div>

      <div class="form-subgroup-label form-subgroup-label--mt">条款 & 提单</div>
      <div class="detail-form-grid detail-form-grid--6">
        <a-form-item label="运输条款">
          <a-select v-model="detail.TransportTerms" :disabled="readonly">
            <a-option v-for="t in transportTermsOptions" :key="t" :value="t">{{ t }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="贸易条款" required>
          <a-select v-model="detail.TradeTerms" :disabled="readonly">
            <a-option v-for="t in tradeTermsOptions" :key="t" :value="t">{{ t }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="提单格式">
          <a-select v-model="detail.BlFormat" :disabled="readonly">
            <a-option v-for="b in blFormatOptions" :key="b" :value="b">{{ b }}</a-option>
          </a-select>
        </a-form-item>
      </div>

      <div class="form-subgroup-label form-subgroup-label--mt">特殊要求</div>
      <div class="detail-form-grid detail-form-grid--6">
        <a-form-item label="是否需要交接单抬头">
          <a-radio-group v-model="detail.NeedHandoverHeader" :disabled="readonly">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否需要进仓拍照">
          <a-checkbox v-model="detail.NeedInboundPhoto" :disabled="readonly">需要</a-checkbox>
        </a-form-item>
        <a-form-item label="货物类型" class="detail-form-grid__span6">
          <div class="svc-tags">
            <span
              v-for="c in cargoTypeCheckboxOptions"
              :key="c"
              role="checkbox"
              tabindex="0"
              class="svc-tag"
              :class="{
                'svc-tag--on': detail.CargoTypes.includes(c),
                'svc-tag--risk': detail.CargoTypes.includes(c) && RISK_CARGO_TYPES.has(c)
              }"
              :aria-checked="detail.CargoTypes.includes(c)"
              :aria-disabled="readonly"
              @click="toggleCargoType(c)"
              @keydown.enter.prevent="toggleCargoType(c)"
              @keydown.space.prevent="toggleCargoType(c)"
            >{{ c }}</span>
          </div>
        </a-form-item>
        <a-form-item label="客户备注" class="detail-form-grid__span3">
          <a-textarea v-model="detail.CustomerRemark" :disabled="readonly" :auto-size="{ minRows: 2, maxRows: 4 }" />
        </a-form-item>
        <a-form-item label="海外代理备注" class="detail-form-grid__span3">
          <a-textarea v-model="detail.OverseasRemark" :disabled="readonly" :auto-size="{ minRows: 2, maxRows: 4 }" />
        </a-form-item>
      </div>
    </a-form>
  </detail-section>
</template>
