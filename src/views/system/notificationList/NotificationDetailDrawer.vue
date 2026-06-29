<script setup lang="ts">
import { IconDownload } from '@arco-design/web-vue/es/icon';
import type { NotificationRecord } from './types';

defineProps<{
  visible: boolean;
  record: NotificationRecord | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const STATUS_PILL: Record<string, { s: string; label: string }> = {
  draft: { s: 'draft', label: '草稿' },
  pending: { s: 'wait', label: '待发布' },
  published: { s: 'rel', label: '已发布' },
  expired: { s: 'partial', label: '已过期' },
  cancelled: { s: 'rej', label: '已取消' },
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
    title="通知详情"
    @cancel="close"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-if="record" class="detail-drawer-body">
      <div class="detail-drawer-status">
        <div class="detail-drawer-status__no">
          <span class="link-text link-text--strong">{{ record.subject }}</span>
        </div>
        <div class="detail-drawer-status__sub">
          <span class="s-pill" :data-s="STATUS_PILL[record.status]?.s">
            {{ STATUS_PILL[record.status]?.label }}
          </span>
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
                <span class="detail-field__label">通知类型</span>
                <span class="detail-field__val">{{ record.type }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">通知对象</span>
                <span class="detail-field__val">{{ record.targetLabel }}</span>
              </div>
              <div class="detail-field detail-field--wide">
                <span class="detail-field__label">主题</span>
                <span class="detail-field__val">{{ record.subject }}</span>
              </div>
              <div class="detail-field detail-field--wide">
                <span class="detail-field__label">内容</span>
                <span class="detail-field__val">{{ record.content }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">生效周期</span>
                <span class="detail-field__val">{{ record.effectivePeriod }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">创建人</span>
                <span class="detail-field__val">{{ record.creator }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">最后发布时间</span>
                <span class="detail-field__val">{{ record.lastPublishTime || '—' }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">最后编辑时间</span>
                <span class="detail-field__val">{{ record.lastEditTime }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="record.files?.length" class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">附件</h4>
          </div>
          <div class="detail-section__body detail-section__body--table">
            <vxe-table
              class="detail-mini-vxe detail-mini-vxe--readonly"
              border="none"
              size="small"
              height="auto"
              :data="record.files"
              :row-config="{ height: 34, isHover: true, keyField: 'uid' }"
            >
              <vxe-column field="name" title="文件名" min-width="200" />
              <vxe-column title="操作" width="80" fixed="right" align="center">
                <template #default>
                  <div class="row-actions">
                    <a-tooltip content="下载">
                      <a-button size="small" type="text" class="row-action-btn">
                        <icon-download />
                      </a-button>
                    </a-tooltip>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
      </div>

      <div class="detail-drawer-footer">
        <div class="detail-drawer-footer__start" />
        <div class="detail-drawer-footer__end">
          <a-button size="small" @click="close">关闭</a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped>
</style>
