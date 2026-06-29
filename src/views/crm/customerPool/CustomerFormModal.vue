<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import type { CustomerFormValue, CustomerRecord } from './types';

const props = defineProps<{
  visible: boolean;
  mode: 'create' | 'edit';
  record: CustomerRecord | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  saved: [payload: CustomerFormValue];
}>();

const submitting = ref(false);

const form = reactive({
  name: '',
  customerType: undefined as string | undefined,
  country: undefined as string | undefined,
  csName: undefined as string | undefined,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactTitle: '',
  remark: '',
});

const resetForm = () => {
  form.name = '';
  form.customerType = undefined;
  form.country = undefined;
  form.csName = undefined;
  form.contactName = '';
  form.contactEmail = '';
  form.contactPhone = '';
  form.contactTitle = '';
  form.remark = '';
};

watch(
  () => props.visible,
  (v) => {
    if (!v) return;
    if (props.mode === 'edit' && props.record) {
      form.name = props.record.name;
      form.customerType = props.record.customerType;
      form.country = props.record.country;
      form.csName = props.record.csName;
      form.contactName = props.record.contactName;
      form.contactEmail = props.record.contactEmail;
      form.contactPhone = props.record.contactPhone;
      form.contactTitle = props.record.contactTitle;
      form.remark = props.record.remark;
    } else {
      resetForm();
    }
  },
);

const handleCancel = () => emit('update:visible', false);

const handleOk = () => {
  if (!form.name.trim()) {
    Message.warning('请填写客户名称');
    return false;
  }
  submitting.value = true;
  window.setTimeout(() => {
    submitting.value = false;
    Message.success(props.mode === 'create' ? '客户已创建' : '客户已更新');
    emit('saved', {
      name: form.name.trim(),
      customerType: form.customerType,
      country: form.country,
      csName: form.csName,
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      contactTitle: form.contactTitle.trim(),
      remark: form.remark.trim(),
    });
    emit('update:visible', false);
  }, 300);
  return false;
};
</script>

<template>
  <a-modal
    :visible="visible"
    :title="mode === 'create' ? '新增客户' : '编辑客户'"
    :width="680"
    :mask-closable="false"
    :ok-loading="submitting"
    @cancel="handleCancel"
    @before-ok="handleOk"
    @update:visible="emit('update:visible', $event)"
  >
    <a-form class="detail-form" layout="vertical" size="small" :model="form">
      <div class="detail-form-grid detail-form-grid--2">
        <a-form-item label="客户名称" required>
          <a-input v-model="form.name" size="small" allow-clear placeholder="请输入客户名称" />
        </a-form-item>
        <a-form-item label="客户类型">
          <a-select v-model="form.customerType" size="small" allow-clear placeholder="请选择">
            <a-option value="直客">直客</a-option>
            <a-option value="同行">同行</a-option>
            <a-option value="海外代理">海外代理</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="国家">
          <a-select v-model="form.country" size="small" allow-clear placeholder="请选择">
            <a-option value="中国">中国</a-option>
            <a-option value="德国">德国</a-option>
            <a-option value="美国">美国</a-option>
            <a-option value="泰国">泰国</a-option>
            <a-option value="荷兰">荷兰</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="负责客服">
          <a-select v-model="form.csName" size="small" allow-clear placeholder="请选择">
            <a-option value="张三">张三</a-option>
            <a-option value="李四">李四</a-option>
            <a-option value="王五">王五</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系人">
          <a-input v-model="form.contactName" size="small" allow-clear placeholder="请输入联系人" />
        </a-form-item>
        <a-form-item label="联系人职务">
          <a-input v-model="form.contactTitle" size="small" allow-clear placeholder="请输入职务" />
        </a-form-item>
        <a-form-item label="联系人邮箱">
          <a-input v-model="form.contactEmail" size="small" allow-clear placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="联系人电话">
          <a-input v-model="form.contactPhone" size="small" allow-clear placeholder="请输入电话" />
        </a-form-item>
        <a-form-item label="备注" class="detail-form-grid__span2">
          <a-textarea
            v-model="form.remark"
            size="small"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="备注信息"
          />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>
