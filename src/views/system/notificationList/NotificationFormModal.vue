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
    <a-form class="detail-form" layout="vertical" size="small" :model="form">
      <div class="detail-form-grid detail-form-grid--2">
        <a-form-item label="通知类型">
          <a-select v-model="form.type" size="small" disabled>
            <a-option value="内部通知">内部通知</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="通知对象">
          <a-select v-model="form.targetType" size="small">
            <a-option value="all">全员通知</a-option>
            <a-option value="custom">自定义通知</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="主题" required class="detail-form-grid__span2">
          <a-input v-model="form.subject" size="small" allow-clear placeholder="请输入主题" />
        </a-form-item>
        <a-form-item label="内容" class="detail-form-grid__span2">
          <a-textarea
            v-model="form.content"
            size="small"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入通知内容"
          />
        </a-form-item>
        <a-form-item label="生效周期">
          <a-select v-model="form.effectivePeriod" size="small">
            <a-option value="是">是</a-option>
            <a-option value="否">否</a-option>
          </a-select>
        </a-form-item>
      </div>
    </a-form>
    <template #footer>
      <div class="modal-footer">
        <a-button size="small" @click="close">取消</a-button>
        <a-button size="small" type="primary" @click="handleOk">确定</a-button>
      </div>
    </template>
  </a-modal>
</template>

<style scoped>
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
