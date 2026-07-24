<script setup lang="ts">
import type { ShipmentOrderDetailRecord } from '../types';

defineProps<{ editable?: boolean }>();

const form = defineModel<ShipmentOrderDetailRecord>('form', { required: true });
</script>

<template>
  <a-form v-if="editable" :model="form" layout="vertical" size="small" class="detail-form order-info-tab">
    <section class="order-info-section">
      <header class="order-info-section__head">
        <strong>客户与归属</strong>
      </header>
      <a-row :gutter="[16, 8]" class="order-info-section__body">
        <a-col :md="8" :lg="6"><a-form-item field="customerName" label="客户名称"><a-input v-model="form.customerName" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="customerContact" label="联系人"><a-input v-model="form.customerContact" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="customerPhone" label="联系电话"><a-input v-model="form.customerPhone" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="operator" label="责任操作">
            <a-select v-model="form.operator" size="small" allow-clear>
              <a-option value="张操作">张操作</a-option>
              <a-option value="李操作">李操作</a-option>
              <a-option value="王操作">王操作</a-option>
              <a-option value="赵操作">赵操作</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="16" :lg="12"><a-form-item field="customerEmail" label="邮箱"><a-input v-model="form.customerEmail" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="salesPerson" label="销售人员">
            <a-select v-model="form.salesPerson" size="small" allow-clear allow-search>
              <a-option value="刘商务">刘商务</a-option>
              <a-option value="陈商务">陈商务</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="csPerson" label="客服人员">
            <a-select v-model="form.csPerson" size="small" allow-clear allow-search>
              <a-option value="周客服">周客服</a-option>
              <a-option value="吴客服">吴客服</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </section>

    <section class="order-info-section">
      <header class="order-info-section__head">
        <strong>订单属性</strong>
      </header>
      <a-row :gutter="[16, 8]" class="order-info-section__body">
        <a-col :md="16" :lg="12">
          <a-form-item label="订单号">
            <span class="mono order-info-readonly">{{ form.orderNo }}</span>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="businessType" label="业务类型">
            <a-select v-model="form.businessType" size="small" allow-clear>
              <a-option value="FCL">FCL</a-option>
              <a-option value="LCL">LCL</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="tradeTerm" label="贸易条款">
            <a-select v-model="form.tradeTerm" size="small" allow-clear>
              <a-option value="FOB">FOB</a-option>
              <a-option value="CIF">CIF</a-option>
              <a-option value="EXW">EXW</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6"><a-form-item field="transportTerm" label="运输条款"><a-input v-model="form.transportTerm" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="paymentMethod" label="付款方式"><a-input v-model="form.paymentMethod" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6">
          <a-form-item label="创建时间">
            <span class="mono order-info-readonly">{{ form.createdAt }}</span>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6"><a-form-item field="orderSource" label="订单来源"><a-input v-model="form.orderSource" size="small" allow-clear /></a-form-item></a-col>
      </a-row>
    </section>

    <section class="order-info-section">
      <header class="order-info-section__head">
        <strong>航线与时效</strong>
      </header>
      <a-row :gutter="[16, 8]" class="order-info-section__body">
        <a-col :md="8" :lg="6"><a-form-item field="pol" label="起运港"><a-input v-model="form.pol" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="pod" label="目的港"><a-input v-model="form.pod" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="transitPort" label="中转港"><a-input v-model="form.transitPort" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="carrier" label="船公司">
            <a-select v-model="form.carrier" size="small" allow-clear allow-search>
              <a-option value="COSCO">COSCO</a-option>
              <a-option value="MSC">MSC</a-option>
              <a-option value="CMA CGM">CMA CGM</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6"><a-form-item field="vessel" label="船名"><a-input v-model="form.vessel" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="voyage" label="航次"><a-input v-model="form.voyage" size="small" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="etd" label="ETD"><a-date-picker v-model="form.etd" size="small" style="width: 100%" /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="eta" label="ETA"><a-date-picker v-model="form.eta" size="small" style="width: 100%" /></a-form-item></a-col>
        <a-col :md="12" :lg="12"><a-form-item field="closingTime" label="截关时间"><a-date-picker v-model="form.closingTime" size="small" show-time style="width: 100%" /></a-form-item></a-col>
        <a-col :md="12" :lg="12"><a-form-item field="siCutoff" label="截补料时间"><a-date-picker v-model="form.siCutoff" size="small" show-time style="width: 100%" /></a-form-item></a-col>
      </a-row>
    </section>
  </a-form>

  <div v-else class="order-info-tab order-info-tab--display">
    <section class="order-info-section">
      <header class="order-info-section__head"><strong>客户与归属</strong></header>
      <a-descriptions class="detail-display" :bordered="false" layout="vertical" :column="4" size="small">
        <a-descriptions-item label="客户名称"><span :title="form.customerName">{{ form.customerName }}</span></a-descriptions-item>
        <a-descriptions-item label="联系人"><span :title="form.customerContact">{{ form.customerContact || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="联系电话"><span class="mono" :title="form.customerPhone">{{ form.customerPhone || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="责任操作"><span :title="form.operator">{{ form.operator || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="邮箱" :span="2"><span :title="form.customerEmail">{{ form.customerEmail || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="销售人员"><span :title="form.salesPerson">{{ form.salesPerson || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="客服人员"><span :title="form.csPerson">{{ form.csPerson || '—' }}</span></a-descriptions-item>
      </a-descriptions>
    </section>

    <section class="order-info-section">
      <header class="order-info-section__head"><strong>订单属性</strong></header>
      <a-descriptions class="detail-display" :bordered="false" layout="vertical" :column="4" size="small">
        <a-descriptions-item label="业务单号" :span="2"><span class="mono" :title="form.orderNo">{{ form.orderNo }}</span></a-descriptions-item>
        <a-descriptions-item label="业务类型">{{ form.businessType || '—' }}</a-descriptions-item>
        <a-descriptions-item label="贸易条款">{{ form.tradeTerm || '—' }}</a-descriptions-item>
        <a-descriptions-item label="运输条款">{{ form.transportTerm || '—' }}</a-descriptions-item>
        <a-descriptions-item label="付款方式">{{ form.paymentMethod || '—' }}</a-descriptions-item>
        <a-descriptions-item label="订单来源">{{ form.orderSource || '—' }}</a-descriptions-item>
        <a-descriptions-item label="创建时间"><span class="mono" :title="form.createdAt">{{ form.createdAt }}</span></a-descriptions-item>
      </a-descriptions>
    </section>

    <section class="order-info-section">
      <header class="order-info-section__head"><strong>航线与时效</strong></header>
      <a-descriptions class="detail-display" :bordered="false" layout="vertical" :column="4" size="small">
        <a-descriptions-item label="起运港"><span class="mono" :title="form.pol">{{ form.pol }}</span></a-descriptions-item>
        <a-descriptions-item label="目的港"><span class="mono" :title="form.pod">{{ form.pod }}</span></a-descriptions-item>
        <a-descriptions-item label="中转港"><span class="mono" :title="form.transitPort">{{ form.transitPort || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="船公司"><span :title="form.carrier">{{ form.carrier || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="大船船名/航次" :span="2"><span :title="`${form.vessel} / ${form.voyage}`">{{ form.vessel || '—' }} / {{ form.voyage || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="ETD"><span class="mono" :title="form.etd">{{ form.etd || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="ETA"><span class="mono" :title="form.eta">{{ form.eta || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="截关时间" :span="2"><span class="mono" :title="form.closingTime">{{ form.closingTime || '—' }}</span></a-descriptions-item>
        <a-descriptions-item label="截补料时间" :span="2"><span class="mono" :title="form.siCutoff">{{ form.siCutoff || '—' }}</span></a-descriptions-item>
      </a-descriptions>
    </section>
  </div>
</template>

<style scoped>
.order-info-tab,
.order-info-section {
  display: flex;
  flex-direction: column;
}

.order-info-tab {
  gap: 12px;
}

.order-info-section + .order-info-section {
  padding-top: 12px;
  border-top: 1px solid var(--color-border-1);
}

.order-info-section__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}

.order-info-section__head strong {
  color: var(--color-text-1);
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-title);
}

.order-info-section :deep(.arco-form-item) {
  margin-bottom: 0;
}

.order-info-section :deep(.arco-form-item-label-col) {
  margin-bottom: 4px;
  line-height: 20px;
}

.order-info-readonly {
  display: inline-flex;
  align-items: center;
  min-height: var(--dense-control-h-form);
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
}

</style>
