<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

export interface ExceptionFormPayload {
  exceptionType: string;
  exceptionLevel: string;
  description: string;
  owner: string;
  expectResolveTime: string;
  notifySupervisor: boolean;
}

const props = defineProps<{
  visible: boolean;
  targetOrderNos: string[];
  operatorOptions: string[];
  submitting: boolean;
  serverError: string;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  submit: [payload: ExceptionFormPayload];
}>();

const EXCEPTION_TYPE_OPTIONS = [
  '订舱异常',
  '拖车异常',
  '报关异常',
  '文件异常',
  '费用异常',
  '客户异常',
  '船期延误',
  '柜号异常',
  '查验异常',
  '海外段异常',
];

const EXCEPTION_LEVEL_OPTIONS = [
  { value: 'low', label: '低（不影响订单正常流转）' },
  { value: 'medium', label: '中（影响部分节点，需要跟进）' },
  { value: 'high', label: '高（影响截关、开船、放货、费用）' },
  { value: 'critical', label: '严重（可能造成投诉、罚款、亏损）' },
];

const form = reactive<ExceptionFormPayload>({
  exceptionType: '',
  exceptionLevel: '',
  description: '',
  owner: '',
  expectResolveTime: '',
  notifySupervisor: true,
});

const errors = reactive({ exceptionType: '', exceptionLevel: '', description: '' });
const attachmentNames = ref<string[]>([]);

watch(() => props.visible, (visible) => {
  if (!visible) return;
  form.exceptionType = '';
  form.exceptionLevel = '';
  form.description = '';
  form.owner = '';
  form.expectResolveTime = '';
  form.notifySupervisor = true;
  errors.exceptionType = '';
  errors.exceptionLevel = '';
  errors.description = '';
  attachmentNames.value = [];
});

const close = (value: boolean) => emit('update:visible', value);

const beforeOk = () => {
  errors.exceptionType = form.exceptionType ? '' : '请选择异常类型';
  errors.exceptionLevel = form.exceptionLevel ? '' : '请选择异常等级';
  errors.description = form.description.trim() ? '' : '请填写异常描述';
  if (errors.exceptionType || errors.exceptionLevel || errors.description) return false;
  // 始终返回 false：弹窗是否关闭由父级按提交结果决定，失败时保留全部输入。
  emit('submit', { ...form, description: form.description.trim() });
  return false;
};
</script>

<template>
  <a-modal
    :visible="visible"
    :title="targetOrderNos.length > 1 ? `批量标记异常（${targetOrderNos.length} 条）` : '标记异常'"
    :width="560"
    :mask-closable="false"
    ok-text="提交异常"
    :ok-loading="submitting"
    :ok-button-props="{ size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    :on-before-ok="beforeOk"
    @cancel="close(false)"
  >
    <a-alert v-if="targetOrderNos.length > 1" type="info" class="exception-modal-context">
      将对 {{ targetOrderNos.length }} 条订单登记同一异常：{{ targetOrderNos.join('、') }}
    </a-alert>
    <a-alert v-else type="info" class="exception-modal-context">
      订单 {{ targetOrderNos[0] }} 将被标记为异常并进入异常队列。
    </a-alert>
    <a-alert v-if="serverError" type="error" class="exception-modal-context">{{ serverError }}</a-alert>
    <a-form :model="form" layout="vertical" size="small" class="detail-form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="异常类型"
            field="exceptionType"
            required
            :validate-status="errors.exceptionType ? 'error' : undefined"
            :help="errors.exceptionType"
          >
            <a-select
              v-model="form.exceptionType"
              size="small"
              allow-clear
              placeholder="请选择异常类型"
              @change="errors.exceptionType = ''"
            >
              <a-option v-for="type in EXCEPTION_TYPE_OPTIONS" :key="type" :value="type">{{ type }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="异常等级"
            field="exceptionLevel"
            required
            :validate-status="errors.exceptionLevel ? 'error' : undefined"
            :help="errors.exceptionLevel"
          >
            <a-select
              v-model="form.exceptionLevel"
              size="small"
              allow-clear
              placeholder="请选择异常等级"
              @change="errors.exceptionLevel = ''"
            >
              <a-option v-for="level in EXCEPTION_LEVEL_OPTIONS" :key="level.value" :value="level.value">
                {{ level.label }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="异常描述"
            field="description"
            required
            :validate-status="errors.description ? 'error' : undefined"
            :help="errors.description"
          >
            <a-textarea
              v-model="form.description"
              size="small"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :max-length="200"
              show-word-limit
              placeholder="请描述异常现象、影响范围与已采取措施"
              @input="errors.description = ''"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="责任人" field="owner">
            <a-select v-model="form.owner" size="small" allow-clear allow-search placeholder="默认为当前操作员">
              <a-option v-for="operator in operatorOptions" :key="operator" :value="operator">{{ operator }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="期望解决时间" field="expectResolveTime">
            <a-date-picker
              v-model="form.expectResolveTime"
              size="small"
              show-time
              style="width: 100%"
              placeholder="请选择期望解决时间"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="附件">
            <a-tooltip content="附件上传服务尚未接入共享上传契约，当前仅记录占位文件名">
              <span class="exception-attachment">
                <a-button size="small" type="outline" disabled>选择文件</a-button>
                <span v-if="!attachmentNames.length" class="exception-attachment__hint">未选择文件</span>
              </span>
            </a-tooltip>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="通知主管">
            <a-switch v-model="form.notifySupervisor" />
            <span class="exception-notify-hint">{{ form.notifySupervisor ? '提交后同步通知主管' : '不通知主管' }}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style scoped>
.exception-modal-context {
  margin-bottom: 12px;
}

.exception-attachment {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.exception-attachment__hint,
.exception-notify-hint {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.exception-notify-hint {
  margin-left: 8px;
}
</style>
