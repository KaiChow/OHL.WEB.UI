<script setup lang="ts">
import {
  IconDelete,
  IconDownload,
  IconEye,
  IconPlus
} from '@arco-design/web-vue/es/icon';
import type { DetailAttachmentRow } from '../../types';

defineProps<{
  rows: DetailAttachmentRow[];
  remark: string;
  readonly: boolean;
}>();

const emit = defineEmits<{
  upload: [row: DetailAttachmentRow];
  remove: [id: string];
  'update:remark': [value: string];
}>();

const statusMeta: Record<DetailAttachmentRow['status'], { label: string; dataS: string }> = {
  uploaded: { label: '已上传', dataS: 'rel' },
  missing: { label: '待上传', dataS: 'wait' },
  review: { label: '待复核', dataS: 'op' }
};
</script>

<template>
  <div class="attachment-section">
    <div class="attachment-table-wrap">
      <table class="detail-mini-table detail-mini-table--wide attachment-table">
        <thead>
          <tr>
            <th>单证类型</th>
            <th>文件</th>
            <th>上传状态</th>
            <th>上传人</th>
            <th>上传时间</th>
            <th class="detail-mini-table__op">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>
              <div class="attachment-doc">
                <span class="attachment-doc__name">{{ row.docType }}</span>
                <span v-if="row.required" class="attachment-doc__required">必传</span>
                <span v-if="row.multiple" class="attachment-doc__multi">多文件</span>
              </div>
            </td>
            <td>
              <span v-if="row.fileName" class="link-text">{{ row.fileName }}</span>
              <span v-else class="date-none">未上传</span>
            </td>
            <td>
              <span class="s-pill" :data-s="statusMeta[row.status].dataS">{{ statusMeta[row.status].label }}</span>
            </td>
            <td>{{ row.uploader || '—' }}</td>
            <td><span class="date-val">{{ row.uploadTime || '—' }}</span></td>
            <td class="detail-mini-table__op">
              <div class="row-actions">
                <a-tooltip v-if="row.fileName" content="预览">
                  <a-button type="text" class="row-action-btn">
                    <icon-eye />
                  </a-button>
                </a-tooltip>
                <a-tooltip v-if="row.fileName" content="下载">
                  <a-button type="text" class="row-action-btn">
                    <icon-download />
                  </a-button>
                </a-tooltip>
                <a-tooltip v-if="!readonly" :content="row.fileName ? '重新上传' : '上传'">
                  <a-button type="text" class="row-action-btn" @click="emit('upload', row)">
                    <icon-plus />
                  </a-button>
                </a-tooltip>
                <a-popconfirm
                  v-if="!readonly && row.fileName"
                  content="确认删除该附件？"
                  @ok="emit('remove', row.id)"
                >
                  <a-button type="text" class="row-action-btn" status="danger">
                    <icon-delete />
                  </a-button>
                </a-popconfirm>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <a-form layout="vertical" size="small" class="detail-form attachment-remark">
      <a-form-item label="附件备注">
        <a-textarea
          :model-value="remark"
          :disabled="readonly"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          placeholder="填写单证补充说明、资料缺失原因或客户特殊要求"
          @update:model-value="emit('update:remark', $event)"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.attachment-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.attachment-doc {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.attachment-doc__name {
  color: var(--color-text-1);
  font-weight: 500;
}
.attachment-doc__required,
.attachment-doc__multi {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--dense-radius);
  font-size: var(--dense-font-micro);
  line-height: 1;
  white-space: nowrap;
}
.attachment-doc__required {
  color: var(--danger-6);
  background: var(--danger-1);
  border: 1px solid var(--danger-3);
}
.attachment-doc__multi {
  color: var(--color-text-3);
  background: var(--color-fill-1);
  border: 1px solid var(--color-border-1);
}
.attachment-remark {
  padding-top: 2px;
}
</style>
