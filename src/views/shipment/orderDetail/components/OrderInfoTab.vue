<script setup lang="ts">
import type { ShipmentOrderDetailRecord } from '../types';

const form = defineModel<ShipmentOrderDetailRecord>('form', { required: true });
</script>

<template>
  <a-form class="detail-form" layout="vertical" size="small" :model="form">
    <div class="detail-section">
      <div class="detail-section__head">
        <h4 class="detail-section__title">客户信息</h4>
      </div>
      <div class="detail-section__body">
        <div class="detail-form-grid detail-form-grid--4">
          <a-form-item label="客户名称">
            <a-input v-model="form.customerName" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="联系人">
            <a-input v-model="form.customerContact" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="联系电话">
            <a-input v-model="form.customerPhone" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input v-model="form.customerEmail" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="销售人员">
            <a-select v-model="form.salesPerson" size="small" allow-clear allow-search>
              <a-option value="刘商务">刘商务</a-option>
              <a-option value="陈商务">陈商务</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="客服人员">
            <a-select v-model="form.csPerson" size="small" allow-clear allow-search>
              <a-option value="周客服">周客服</a-option>
              <a-option value="吴客服">吴客服</a-option>
            </a-select>
          </a-form-item>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section__head">
        <h4 class="detail-section__title">订单信息</h4>
      </div>
      <div class="detail-section__body">
        <div class="detail-form-grid detail-form-grid--4">
          <a-form-item label="订单号">
            <a-input :model-value="form.orderNo" size="small" readonly class="mono" />
          </a-form-item>
          <a-form-item label="业务类型">
            <a-select v-model="form.businessType" size="small" allow-clear>
              <a-option value="FCL">FCL</a-option>
              <a-option value="LCL">LCL</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="贸易条款">
            <a-select v-model="form.tradeTerm" size="small" allow-clear>
              <a-option value="FOB">FOB</a-option>
              <a-option value="CIF">CIF</a-option>
              <a-option value="EXW">EXW</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="运输条款">
            <a-input v-model="form.transportTerm" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="付款方式">
            <a-input v-model="form.paymentMethod" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="操作人员">
            <a-select v-model="form.operator" size="small" allow-clear>
              <a-option value="张操作">张操作</a-option>
              <a-option value="李操作">李操作</a-option>
              <a-option value="王操作">王操作</a-option>
              <a-option value="赵操作">赵操作</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="创建时间">
            <a-input :model-value="form.createdAt" size="small" readonly />
          </a-form-item>
          <a-form-item label="订单来源">
            <a-input v-model="form.orderSource" size="small" allow-clear />
          </a-form-item>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section__head">
        <h4 class="detail-section__title">航线信息</h4>
      </div>
      <div class="detail-section__body">
        <div class="detail-form-grid detail-form-grid--4">
          <a-form-item label="起运港">
            <a-input v-model="form.pol" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="目的港">
            <a-input v-model="form.pod" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="中转港">
            <a-input v-model="form.transitPort" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="船公司">
            <a-select v-model="form.carrier" size="small" allow-clear allow-search>
              <a-option value="COSCO">COSCO</a-option>
              <a-option value="MSC">MSC</a-option>
              <a-option value="CMA CGM">CMA CGM</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="船名">
            <a-input v-model="form.vessel" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="航次">
            <a-input v-model="form.voyage" size="small" allow-clear />
          </a-form-item>
          <a-form-item label="ETD">
            <a-date-picker v-model="form.etd" size="small" style="width:100%" />
          </a-form-item>
          <a-form-item label="ETA">
            <a-date-picker v-model="form.eta" size="small" style="width:100%" />
          </a-form-item>
          <a-form-item label="截关时间">
            <a-date-picker v-model="form.closingTime" size="small" show-time style="width:100%" />
          </a-form-item>
          <a-form-item label="截补料时间">
            <a-date-picker v-model="form.siCutoff" size="small" show-time style="width:100%" />
          </a-form-item>
        </div>
      </div>
    </div>
  </a-form>
</template>

<style scoped>
</style>
