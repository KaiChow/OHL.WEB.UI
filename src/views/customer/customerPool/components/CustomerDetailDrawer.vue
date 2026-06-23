<script setup lang="ts">
import { IconPlus } from '@arco-design/web-vue/es/icon';
import type { CustomerRecord } from '../types';

const props = defineProps<{
  visible: boolean;
  record: CustomerRecord | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  edit: [row: CustomerRecord];
}>();

const coopStatusMap: Record<string, { label: string; pill: string }> = {
  cooperated: { label: '已合作', pill: 'rel' },
  not_cooperated: { label: '未合作', pill: 'wait' }
};

const close = () => emit('update:visible', false);
</script>

<template>
  <a-drawer
    class="detail-drawer"
    :width="960"
    :visible="visible"
    :footer="false"
    unmount-on-close
    @cancel="close"
  >
    <template #title>客户详情</template>

    <div v-if="record" class="detail-drawer-body">
      <!-- 顶部状态栏 -->
      <div class="detail-drawer-status">
        <div class="detail-drawer-status__no">
          <span class="link-text link-text--strong mono">{{ record.Name }}</span>
        </div>
        <div class="detail-drawer-status__sub">
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
      </div>

      <!-- 灰底滚动区 -->
      <div class="detail-drawer-scroll">

        <!-- 基本信息 -->
        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">基本信息</h4>
            <div class="detail-section__actions">
              <a-button size="small" type="outline" @click="emit('edit', record)">编辑</a-button>
            </div>
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
            <div v-if="record.Remark" style="margin-top:8px;font-size:var(--dense-font-aux);color:var(--color-text-3)">
              备注：{{ record.Remark }}
            </div>
          </div>
        </div>

        <!-- 联系人列表 -->
        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">联系人（{{ record.Contacts.length }}）</h4>
            <div class="detail-section__actions">
              <a-button size="small" type="outline">
                <template #icon><icon-plus /></template>
                新增联系人
              </a-button>
            </div>
          </div>
          <div class="detail-section__body" style="padding:0">
            <vxe-table
              border="none"
              size="small"
              :data="record.Contacts"
              :row-config="{ isHover: true, keyField: 'id' }"
            >
              <vxe-column type="seq" title="#" width="44" />
              <vxe-column field="name" title="姓名" width="130">
                <template #default="{ row }">
                  <span style="font-size:var(--dense-font-data);font-weight:500">{{ row.name }}</span>
                </template>
              </vxe-column>
              <vxe-column field="title" title="职务" width="140" />
              <vxe-column field="email" title="邮箱" min-width="200">
                <template #default="{ row }">
                  <span style="font-size:var(--dense-font-data);color:var(--primary-6)">{{ row.email }}</span>
                </template>
              </vxe-column>
              <vxe-column field="phone" title="电话" width="160" />
            </vxe-table>
          </div>
        </div>

        <!-- 跟进记录 -->
        <div class="detail-section">
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
              style="margin-bottom:12px;padding:8px 10px;background:var(--color-fill-1);border-radius:var(--dense-radius)"
            >
              <div style="font-size:var(--dense-font-data);color:var(--color-text-1);margin-bottom:4px">
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

      </div>

      <!-- 吸底操作栏 -->
      <div class="detail-drawer-footer">
        <a-button size="small" type="primary" @click="emit('edit', record)">编辑</a-button>
        <a-button size="small" @click="close">关闭</a-button>
      </div>
    </div>
  </a-drawer>
</template>
