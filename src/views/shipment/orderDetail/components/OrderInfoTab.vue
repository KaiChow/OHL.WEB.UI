<script setup lang="ts">
import type { ShipmentOrderDetailRecord } from '../types';

const form = defineModel<ShipmentOrderDetailRecord>('form', { required: true });
</script>

<template>
  <a-form :model="form" layout="vertical" size="small" class="order-info-tab">
    <section class="order-info-section">
      <header class="order-info-section__head">
        <strong>客户与归属</strong>
        <span>联系人、销售与操作责任</span>
      </header>
      <a-row :gutter="[16, 8]" class="order-info-section__body">
        <a-col :md="8" :lg="6"><a-form-item field="customerName" label="客户名称"><a-input v-model="form.customerName" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="customerContact" label="联系人"><a-input v-model="form.customerContact" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="customerPhone" label="联系电话"><a-input v-model="form.customerPhone" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="customerEmail" label="邮箱"><a-input v-model="form.customerEmail" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="salesPerson" label="销售人员">
            <a-select v-model="form.salesPerson" allow-clear allow-search>
              <a-option value="刘商务">刘商务</a-option>
              <a-option value="陈商务">陈商务</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="csPerson" label="客服人员">
            <a-select v-model="form.csPerson" allow-clear allow-search>
              <a-option value="周客服">周客服</a-option>
              <a-option value="吴客服">吴客服</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="operator" label="操作人员">
            <a-select v-model="form.operator" allow-clear>
              <a-option value="张操作">张操作</a-option>
              <a-option value="李操作">李操作</a-option>
              <a-option value="王操作">王操作</a-option>
              <a-option value="赵操作">赵操作</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </section>

    <section class="order-info-section">
      <header class="order-info-section__head">
        <strong>订单属性</strong>
        <span>贸易、运输与结算条件</span>
      </header>
      <a-row :gutter="[16, 8]" class="order-info-section__body">
        <a-col :md="8" :lg="6">
          <a-form-item label="订单号">
            <span class="mono order-info-readonly">{{ form.orderNo }}</span>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="businessType" label="业务类型">
            <a-select v-model="form.businessType" allow-clear>
              <a-option value="FCL">FCL</a-option>
              <a-option value="LCL">LCL</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="tradeTerm" label="贸易条款">
            <a-select v-model="form.tradeTerm" allow-clear>
              <a-option value="FOB">FOB</a-option>
              <a-option value="CIF">CIF</a-option>
              <a-option value="EXW">EXW</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6"><a-form-item field="transportTerm" label="运输条款"><a-input v-model="form.transportTerm" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="paymentMethod" label="付款方式"><a-input v-model="form.paymentMethod" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6">
          <a-form-item label="创建时间">
            <span class="mono order-info-readonly">{{ form.createdAt }}</span>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6"><a-form-item field="orderSource" label="订单来源"><a-input v-model="form.orderSource" allow-clear /></a-form-item></a-col>
      </a-row>
    </section>

    <section class="order-info-section">
      <header class="order-info-section__head">
        <strong>航线与时效</strong>
        <span>港口、船期与关键截点</span>
      </header>
      <a-row :gutter="[16, 8]" class="order-info-section__body">
        <a-col :md="8" :lg="6"><a-form-item field="pol" label="起运港"><a-input v-model="form.pol" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="pod" label="目的港"><a-input v-model="form.pod" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="transitPort" label="中转港"><a-input v-model="form.transitPort" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6">
          <a-form-item field="carrier" label="船公司">
            <a-select v-model="form.carrier" allow-clear allow-search>
              <a-option value="COSCO">COSCO</a-option>
              <a-option value="MSC">MSC</a-option>
              <a-option value="CMA CGM">CMA CGM</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :lg="6"><a-form-item field="vessel" label="船名"><a-input v-model="form.vessel" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="voyage" label="航次"><a-input v-model="form.voyage" allow-clear /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="etd" label="ETD"><a-date-picker v-model="form.etd" style="width: 100%" /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="eta" label="ETA"><a-date-picker v-model="form.eta" style="width: 100%" /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="closingTime" label="截关时间"><a-date-picker v-model="form.closingTime" show-time style="width: 100%" /></a-form-item></a-col>
        <a-col :md="8" :lg="6"><a-form-item field="siCutoff" label="截补料时间"><a-date-picker v-model="form.siCutoff" show-time style="width: 100%" /></a-form-item></a-col>
      </a-row>
    </section>
  </a-form>
</template>

<style scoped>
.order-info-tab,
.order-info-section {
  display: flex;
  flex-direction: column;
}

.order-info-tab {
  gap: 16px;
}

.order-info-section + .order-info-section {
  padding-top: 14px;
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

.order-info-section__head span {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
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
