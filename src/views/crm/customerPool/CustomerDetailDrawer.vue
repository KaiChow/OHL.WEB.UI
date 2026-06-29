<script setup lang="ts">
import type { CustomerRecord } from './types';

defineProps<{
  visible: boolean;
  record: CustomerRecord | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const COOPERATE_PILL: Record<string, { s: string; label: string }> = {
  uncooperated: { s: 'wait', label: '未合作' },
  cooperated: { s: 'rel', label: '已合作' },
};

const close = () => emit('update:visible', false);
</script>

<template>
  <a-drawer
    :visible="visible"
    class="detail-drawer detail-drawer--standard"
    :width="720"
    :footer="false"
    :mask-closable="false"
    title="客户详情"
    @cancel="close"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-if="record" class="detail-drawer-body">
      <div class="detail-drawer-status">
        <div class="detail-drawer-status__no">
          <span class="link-text link-text--strong">{{ record.name }}</span>
        </div>
        <div class="detail-drawer-status__sub">
          <span class="s-pill" :data-s="COOPERATE_PILL[record.cooperateStatus]?.s">
            {{ COOPERATE_PILL[record.cooperateStatus]?.label }}
          </span>
          <template v-if="record.tags?.length">
            <span
              v-for="tag in record.tags"
              :key="tag.label"
              class="s-pill"
              :data-s="tag.tone"
              style="margin-left: 6px"
            >
              {{ tag.label }}
            </span>
          </template>
        </div>
      </div>

      <div class="detail-drawer-scroll">
        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">基本信息</h4>
          </div>
          <div class="detail-section__body">
            <div class="detail-form-grid detail-form-grid--2">
              <div class="detail-field">
                <span class="detail-field__label">客户类型</span>
                <span class="detail-field__val">{{ record.customerType }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">国家</span>
                <span class="detail-field__val">{{ record.country }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">负责客服</span>
                <span class="detail-field__val">{{ record.csName }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">运维人员</span>
                <span class="detail-field__val">{{ record.opsStaff || '—' }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">创建时间</span>
                <span class="detail-field__val">{{ record.createdAt }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">创建人</span>
                <span class="detail-field__val">{{ record.creator }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">最后跟进</span>
                <span class="detail-field__val">{{ record.lastFollowAt || '—' }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">最后发货</span>
                <span class="detail-field__val">{{ record.lastShipAt || '—' }}</span>
              </div>
              <div v-if="record.remark" class="detail-field detail-field--wide">
                <span class="detail-field__label">备注</span>
                <span class="detail-field__val">{{ record.remark }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">主联系人</h4>
          </div>
          <div class="detail-section__body">
            <div class="detail-form-grid detail-form-grid--2">
              <div class="detail-field">
                <span class="detail-field__label">姓名</span>
                <span class="detail-field__val">{{ record.contactName }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">职务</span>
                <span class="detail-field__val">{{ record.contactTitle }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">邮箱</span>
                <span class="detail-field__val">{{ record.contactEmail }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">电话</span>
                <span class="detail-field__val">{{ record.contactPhone }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">最新跟进记录</h4>
          </div>
          <div class="detail-section__body">
            <div class="detail-field">
              <span class="detail-field__val">{{ record.lastFollowUp || '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-drawer-footer">
        <div class="detail-drawer-footer__start">
          <a-button v-if="!record.deleted" type="text" status="danger" size="small">废弃</a-button>
        </div>
        <div class="detail-drawer-footer__end">
          <a-button size="small" type="outline">添加跟进</a-button>
          <a-button size="small" @click="close">关闭</a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
