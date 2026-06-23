<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { customerMockRecords } from '../../../mock/customers';

const route = useRoute();
const router = useRouter();

const id = computed(() => Number(route.query.id));
const record = computed(() => customerMockRecords.find((r) => r.Id === id.value) ?? null);

const activeTab = ref('basic');

const coopStatusMap: Record<string, { label: string; pill: string }> = {
  cooperated: { label: '已合作', pill: 'rel' },
  not_cooperated: { label: '未合作', pill: 'wait' }
};
</script>

<template>
  <div v-if="record" class="page-root page-root--dense" style="overflow:auto">
    <!-- 页头 -->
    <div class="zone-l3-action zone-card" style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:10px">
        <a-button size="small" type="text" @click="router.back()">← 返回</a-button>
        <span class="link-text link-text--strong mono" style="font-size:var(--dense-font-data)">{{ record.Name }}</span>
        <span class="s-pill" :data-s="coopStatusMap[record.CoopStatus]?.pill">
          {{ coopStatusMap[record.CoopStatus]?.label }}
        </span>
        <span
          v-for="tag in record.Tags"
          :key="tag"
          class="s-pill"
          data-s="draft"
          style="font-size:var(--dense-font-micro)"
        >
          {{ tag }}
        </span>
      </div>
      <div style="display:flex;gap:8px">
        <a-button size="small" type="primary">编辑</a-button>
        <a-button size="small">新增跟进</a-button>
      </div>
    </div>

    <!-- Tab 导航 -->
    <div class="zone-l3-action zone-card" style="display:flex;align-items:center;padding:0 14px;height:36px">
      <button
        v-for="tab in [
          { key: 'basic', label: '基本信息' },
          { key: 'contacts', label: '联系人' },
          { key: 'followups', label: '跟进记录' },
          { key: 'orders', label: '关联订单' }
        ]"
        :key="tab.key"
        type="button"
        class="stab"
        :class="{ 'stab--active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 内容 -->
    <div style="flex:1;min-height:0;overflow:auto">

      <!-- Tab1 基本信息 -->
      <div v-if="activeTab === 'basic'" class="detail-section" style="margin:0">
        <div class="detail-section__head">
          <h4 class="detail-section__title">基本信息</h4>
        </div>
        <div class="detail-section__body">
          <div class="detail-form-grid detail-form-grid--4">
            <div class="detail-field">
              <span class="detail-field__label">客户类型</span>
              <span class="detail-field__val">{{ record.CustomerType }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">客户等级</span>
              <span class="detail-field__val">{{ record.Level }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">国家</span>
              <span class="detail-field__val">{{ record.Country }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">品名</span>
              <span class="detail-field__val">{{ record.ProductName }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">贸易条款</span>
              <span class="detail-field__val">{{ record.TradeTerms }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">运输方式</span>
              <span class="detail-field__val">{{ record.TransportMode }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">POL</span>
              <span class="detail-field__val">{{ record.Pol || '—' }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">POD</span>
              <span class="detail-field__val">{{ record.Pod || '—' }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">所在部门</span>
              <span class="detail-field__val">{{ record.Department }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">对接销售</span>
              <span class="detail-field__val">{{ record.SalesContact }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">对接运营</span>
              <span class="detail-field__val">{{ record.OperationContact }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">创建时间</span>
              <span class="detail-field__val">{{ record.CreatedAt }}</span>
            </div>
          </div>
          <div v-if="record.Remark" style="margin-top:10px;font-size:var(--dense-font-aux);color:var(--color-text-3)">
            备注：{{ record.Remark }}
          </div>
        </div>
      </div>

      <!-- Tab2 联系人 -->
      <div v-if="activeTab === 'contacts'" class="detail-section" style="margin:0">
        <div class="detail-section__head">
          <h4 class="detail-section__title">联系人（{{ record.Contacts.length }}）</h4>
        </div>
        <div class="detail-section__body" style="padding:0">
          <vxe-table
            border="none"
            size="small"
            :data="record.Contacts"
            :row-config="{ isHover: true, keyField: 'id' }"
          >
            <vxe-column type="seq" title="#" width="44" />
            <vxe-column field="name" title="姓名" width="140" />
            <vxe-column field="title" title="职务" width="160" />
            <vxe-column field="email" title="邮箱" min-width="220">
              <template #default="{ row }">
                <span style="color:var(--primary-6)">{{ row.email }}</span>
              </template>
            </vxe-column>
            <vxe-column field="phone" title="电话" width="170" />
          </vxe-table>
        </div>
      </div>

      <!-- Tab3 跟进记录 -->
      <div v-if="activeTab === 'followups'" class="detail-section" style="margin:0">
        <div class="detail-section__head">
          <h4 class="detail-section__title">跟进记录（{{ record.FollowUps.length }}）</h4>
          <div class="detail-section__actions">
            <a-button size="small" type="primary">新增跟进</a-button>
          </div>
        </div>
        <div class="detail-section__body">
          <div
            v-for="fu in record.FollowUps"
            :key="fu.id"
            style="margin-bottom:12px;padding:10px 12px;background:var(--color-fill-1);border-radius:var(--dense-radius)"
          >
            <div style="font-size:var(--dense-font-data);color:var(--color-text-1);margin-bottom:6px">
              {{ fu.content }}
            </div>
            <div style="font-size:var(--dense-font-aux);color:var(--color-text-3)">
              {{ fu.createdBy }} · {{ fu.createdAt }}
            </div>
          </div>
          <div v-if="record.FollowUps.length === 0" style="font-size:var(--dense-font-aux);color:var(--color-text-3)">
            暂无跟进记录
          </div>
        </div>
      </div>

      <!-- Tab4 关联订单 -->
      <div v-if="activeTab === 'orders'" class="detail-section" style="margin:0">
        <div class="detail-section__head">
          <h4 class="detail-section__title">关联订单</h4>
        </div>
        <div class="detail-section__body">
          <div class="table-wrap" style="height:300px">
            <vxe-table
              border="none"
              size="small"
              height="100%"
              :data="[]"
              :row-config="{ isHover: true }"
            >
              <vxe-column type="seq" title="#" width="44" />
              <vxe-column field="OrderNo" title="订单编号" width="160" />
              <vxe-column field="Status" title="状态" width="100" />
              <vxe-column field="CreatedAt" title="创建时间" min-width="160" />
              <template #empty>
                <div style="font-size:var(--dense-font-aux);color:var(--color-text-3)">暂无关联订单</div>
              </template>
            </vxe-table>
          </div>
        </div>
      </div>

    </div>
  </div>
  <div v-else class="page-root page-root--dense" style="display:flex;align-items:center;justify-content:center">
    <span style="font-size:var(--dense-font-aux);color:var(--color-text-3)">客户不存在或已删除</span>
  </div>
</template>
