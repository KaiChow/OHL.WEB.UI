<script setup lang="ts">
import { reactive, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import type { NotificationRecord } from './types';

const props = defineProps<{
  visible: boolean;
  mode: 'create' | 'edit';
  record: NotificationRecord | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  saved: [];
}>();

const form = reactive({
  type: '内部通知',
  subject: '',
  content: '',
  targetType: 'all' as 'all' | 'custom',
  effectivePeriod: '否',
});

const modalTitle = () => (props.mode === 'create' ? '新建通知' : '编辑通知');

const syncForm = () => {
  if (props.record) {
    form.type = props.record.type;
    form.subject = props.record.subject;
    form.content = props.record.content;
    form.targetType = props.record.targetType;
    form.effectivePeriod = props.record.effectivePeriod;
  } else {
    form.type = '内部通知';
    form.subject = '';
    form.content = '';
    form.targetType = 'all';
    form.effectivePeriod = '否';
  }
};

watch(
  () => [props.visible, props.record] as const,
  ([visible]) => {
    if (visible) syncForm();
  }
);

const close = () => emit('update:visible', false);

const handleOk = () => {
  if (!form.subject.trim()) {
    Message.warning('请填写主题');
    return;
  }
  Message.success(props.mode === 'create' ? '通知已创建' : '通知已保存');
  emit('saved');
  close();
};
</script>

<template>
  <a-modal
    :visible="visible"
    :title="modalTitle()"
    :width="640"
    :mask-closable="false"
    @cancel="close"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="xf-grid xf-grid--modal">
      <div class="xf-field">
        <label class="xf-label">通知类型</label>
        <a-select v-model="form.type" size="small" disabled>
          <a-option value="内部通知">内部通知</a-option>
        </a-select>
      </div>
      <div class="xf-field">
        <label class="xf-label">通知对象</label>
        <a-select v-model="form.targetType" size="small">
          <a-option value="all">全员通知</a-option>
          <a-option value="custom">自定义通知</a-option>
        </a-select>
      </div>
      <div class="xf-field xf-field--wide">
        <label class="xf-label">主题 <span class="xf-req">*</span></label>
        <a-input v-model="form.subject" size="small" allow-clear placeholder="请输入主题" />
      </div>
      <div class="xf-field xf-field--wide">
        <label class="xf-label">内容</label>
        <a-textarea
          v-model="form.content"
          size="small"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入通知内容"
        />
      </div>
      <div class="xf-field">
        <label class="xf-label">生效周期</label>
        <a-select v-model="form.effectivePeriod" size="small">
          <a-option value="是">是</a-option>
          <a-option value="否">否</a-option>
        </a-select>
      </div>
    </div>
    <template #footer>
      <div class="modal-footer">
        <a-button size="small" @click="close">取消</a-button>
        <a-button size="small" type="primary" @click="handleOk">确定</a-button>
      </div>
    </template>
  </a-modal>
</template>

<style scoped>
.xf-grid--modal {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 16px;
}
.xf-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.xf-field--wide {
  grid-column: span 2;
}
.xf-label {
  font-size: var(--dense-font-field);
  color: var(--color-text-2);
  font-weight: 500;
}
.xf-req {
  color: var(--danger-6);
  margin-left: 2px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
@media (max-width: 1280px) {
  .xf-grid--modal {
    grid-template-columns: 1fr;
  }
  .xf-field--wide {
    grid-column: span 1;
  }
}
</style>
