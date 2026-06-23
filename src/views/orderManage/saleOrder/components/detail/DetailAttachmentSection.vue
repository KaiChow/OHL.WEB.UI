<script setup lang="ts">
import {
  IconDelete,
  IconDownload,
  IconEye,
  IconFile,
  IconPlus,
  IconUpload
} from '@arco-design/web-vue/es/icon';
import type { DetailAttachmentFile, DetailAttachmentRow } from '../../types';

defineProps<{
  rows: DetailAttachmentRow[];
  remark: string;
  readonly: boolean;
}>();

const emit = defineEmits<{
  upload: [row: DetailAttachmentRow];
  remove: [rowId: string, fileId?: string];
  'update:remark': [value: string];
}>();

const statusMeta: Record<DetailAttachmentRow['status'], { label: string; dataS: string }> = {
  uploaded: { label: '已上传', dataS: 'rel' },
  missing: { label: '待上传', dataS: 'wait' },
  review: { label: '待复核', dataS: 'op' }
};

const getRowStatus = (row: DetailAttachmentRow) => {
  if (!row.files.length) return statusMeta.missing;
  if (row.files.some((file) => file.status === 'review')) return statusMeta.review;
  return statusMeta.uploaded;
};

const getFileStatus = (file: DetailAttachmentFile) => statusMeta[file.status];
</script>

<template>
  <div class="attachment-section">
    <div class="attachment-doc-list">
      <article v-for="row in rows" :key="row.id" class="attachment-doc-row">
        <div class="attachment-doc-row__meta">
          <div class="attachment-doc-row__title">
            <span class="attachment-doc-row__name">{{ row.docType }}</span>
            <span v-if="row.required" class="attachment-doc-row__required">必传</span>
          </div>
          <div class="attachment-doc-row__status">
            <span class="s-pill" :data-s="getRowStatus(row).dataS">{{ getRowStatus(row).label }}</span>
            <span class="attachment-doc-row__mode">{{ row.multiple ? '多文件' : '单文件' }}</span>
            <span class="attachment-doc-row__count">{{ row.files.length }} 个文件</span>
          </div>
        </div>

        <div class="attachment-doc-row__files">
          <div v-if="row.files.length" class="attachment-file-list">
            <div v-for="file in row.files" :key="file.id" class="attachment-file-item">
              <icon-file class="attachment-file-item__icon" />
              <button class="attachment-file-item__name link-text" type="button">{{ file.name }}</button>
              <span class="attachment-file-item__size">{{ file.size }}</span>
              <span class="s-pill" :data-s="getFileStatus(file).dataS">{{ getFileStatus(file).label }}</span>
              <span class="attachment-file-item__uploader">{{ file.uploader }}</span>
              <span class="attachment-file-item__time">{{ file.uploadTime }}</span>
              <div class="attachment-file-item__actions">
                <a-tooltip content="预览">
                  <a-button type="text" class="row-action-btn">
                    <icon-eye />
                  </a-button>
                </a-tooltip>
                <a-tooltip content="下载">
                  <a-button type="text" class="row-action-btn">
                    <icon-download />
                  </a-button>
                </a-tooltip>
                <a-popconfirm
                  v-if="!readonly"
                  content="确认删除该文件？"
                  @ok="emit('remove', row.id, file.id)"
                >
                  <a-button type="text" class="row-action-btn" status="danger">
                    <icon-delete />
                  </a-button>
                </a-popconfirm>
              </div>
            </div>
          </div>
          <div v-else class="attachment-empty-file">
            <span class="attachment-empty-file__main">暂无文件</span>
            <span v-if="row.required" class="attachment-empty-file__sub">该单证为必传资料</span>
          </div>
        </div>

        <div class="attachment-doc-row__actions">
          <a-button
            v-if="!readonly"
            size="small"
            :type="row.files.length ? 'outline' : 'primary'"
            @click="emit('upload', row)"
          >
            <template #icon>
              <icon-upload v-if="!row.files.length" />
              <icon-plus v-else />
            </template>
            {{ row.files.length ? (row.multiple ? '继续上传' : '替换文件') : '上传文件' }}
          </a-button>
        </div>
      </article>
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

.attachment-doc-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-1);
  border-radius: var(--dense-radius);
  background: var(--color-bg-card);
  overflow: hidden;
}

.attachment-doc-row {
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr) 112px;
  min-height: 56px;
}

.attachment-doc-row + .attachment-doc-row {
  border-top: 1px solid var(--dense-border-subtle);
}

.attachment-doc-row__meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  background: linear-gradient(180deg, var(--color-bg-card), var(--color-fill-1));
  border-right: 1px solid var(--dense-border-subtle);
  min-width: 0;
}

.attachment-doc-row__title,
.attachment-doc-row__status {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.attachment-doc-row__name {
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
  color: var(--color-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-doc-row__required,
.attachment-doc-row__mode,
.attachment-doc-row__count {
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
  white-space: nowrap;
}

.attachment-doc-row__required {
  color: var(--danger-6);
}

.attachment-doc-row__files {
  min-width: 0;
  padding: 7px 10px;
}

.attachment-file-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.attachment-file-item {
  display: grid;
  grid-template-columns: 18px minmax(180px, 1fr) 64px 66px 80px 132px 86px;
  align-items: center;
  min-height: 28px;
  gap: 8px;
  padding: 2px 4px;
  background: var(--color-bg-card);
}

.attachment-file-item + .attachment-file-item {
  border-top: 1px dashed var(--dense-border-subtle);
}

.attachment-file-item__icon {
  color: var(--primary-6);
  font-size: var(--dense-font-data);
}

.attachment-file-item__name {
  display: inline-flex;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;
  font-weight: var(--dense-weight-data);
}

.attachment-file-item__size,
.attachment-file-item__uploader,
.attachment-file-item__time {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  white-space: nowrap;
}

.attachment-file-item__actions {
  display: flex;
  justify-content: flex-end;
  gap: 2px;
}

.attachment-empty-file {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
}
.attachment-empty-file__main {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}
.attachment-empty-file__sub {
  color: var(--warning-7);
  font-size: var(--dense-font-aux);
}

.attachment-doc-row__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 10px;
  border-left: 1px solid var(--dense-border-subtle);
}

.attachment-remark {
  padding-top: 2px;
}

@media (max-width: 1200px) {
  .attachment-doc-row {
    grid-template-columns: 200px minmax(0, 1fr);
  }

  .attachment-doc-row__actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
    border-left: 0;
    border-top: 1px solid var(--dense-border-subtle);
  }

  .attachment-file-item {
    grid-template-columns: 18px minmax(160px, 1fr) 64px 66px 72px 96px 86px;
  }
}
</style>
