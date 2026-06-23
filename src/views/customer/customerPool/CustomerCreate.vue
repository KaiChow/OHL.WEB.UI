<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon';
import {
  customerTypeOptions,
  customerLevelOptions,
  countryOptions,
  tradeTermsOptions,
  transportModeOptions,
  tagOptions
} from './config';
import type { CustomerContact } from './types';

const router = useRouter();

let contactUid = 1;
const mkContact = (): CustomerContact => ({
  id: `new-${contactUid++}`,
  name: '',
  email: '',
  phone: '',
  title: ''
});

const form = reactive({
  Name: '',
  CustomerType: '',
  Level: '',
  Country: '',
  ProductName: '',
  Department: '',
  SalesContact: '',
  OperationContact: '',
  TradeTerms: '',
  TransportMode: '',
  Pol: '',
  Pod: '',
  Tags: [] as string[],
  Remark: '',
  Contacts: [mkContact()] as CustomerContact[]
});

const saving = ref(false);

const addContact = () => {
  form.Contacts.push(mkContact());
};

const removeContact = (id: string) => {
  if (form.Contacts.length <= 1) {
    Message.warning('至少保留一个联系人');
    return;
  }
  form.Contacts = form.Contacts.filter((c) => c.id !== id);
};

const handleSave = () => {
  if (!form.Name) {
    Message.error('请填写客户名称');
    return;
  }
  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    Message.success('客户创建成功');
    router.back();
  }, 600);
};

const handleCancel = () => {
  router.back();
};
</script>

<template>
  <div class="page-root page-root--dense" style="overflow:auto;padding-bottom:60px">
    <!-- A组：客户基础信息 -->
    <div class="detail-section" style="margin-bottom:8px">
      <div class="detail-section__head">
        <h4 class="detail-section__title">A · 客户基础信息</h4>
      </div>
      <div class="detail-section__body">
        <div class="detail-form-grid detail-form-grid--4">
          <div class="detail-field">
            <span class="detail-field__label">客户名称 <span style="color:var(--danger-6)">*</span></span>
            <a-input v-model="form.Name" size="small" placeholder="请输入客户全称" />
          </div>
          <div class="detail-field">
            <span class="detail-field__label">客户类型</span>
            <a-select v-model="form.CustomerType" size="small" placeholder="请选择" allow-clear>
              <a-option v-for="opt in customerTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
            </a-select>
          </div>
          <div class="detail-field">
            <span class="detail-field__label">客户等级</span>
            <a-select v-model="form.Level" size="small" placeholder="请选择" allow-clear>
              <a-option v-for="opt in customerLevelOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
            </a-select>
          </div>
          <div class="detail-field">
            <span class="detail-field__label">国家</span>
            <a-select v-model="form.Country" size="small" placeholder="请选择" allow-clear>
              <a-option v-for="opt in countryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
            </a-select>
          </div>
          <div class="detail-field">
            <span class="detail-field__label">所在部门/组</span>
            <a-input v-model="form.Department" size="small" placeholder="请输入" />
          </div>
          <div class="detail-field">
            <span class="detail-field__label">对接销售</span>
            <a-input v-model="form.SalesContact" size="small" placeholder="请输入" />
          </div>
          <div class="detail-field">
            <span class="detail-field__label">对接运营</span>
            <a-input v-model="form.OperationContact" size="small" placeholder="请输入" />
          </div>
          <div class="detail-field">
            <span class="detail-field__label">品名</span>
            <a-input v-model="form.ProductName" size="small" placeholder="主要货物品名" />
          </div>
        </div>
      </div>
    </div>

    <!-- B组：联系人列表 -->
    <div class="detail-section" style="margin-bottom:8px">
      <div class="detail-section__head">
        <h4 class="detail-section__title">B · 联系人列表</h4>
        <div class="detail-section__actions">
          <a-button size="small" type="outline" @click="addContact">
            <template #icon><icon-plus /></template>
            新增联系人
          </a-button>
        </div>
      </div>
      <div class="detail-section__body" style="padding:0">
        <vxe-table
          border="none"
          size="small"
          :data="form.Contacts"
          :row-config="{ isHover: true, keyField: 'id' }"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-column type="seq" title="#" width="44" />
          <vxe-column field="name" title="姓名" min-width="130" :edit-render="{}">
            <template #edit="{ row }">
              <a-input v-model="row.name" size="small" placeholder="请输入姓名" />
            </template>
            <template #default="{ row }">
              <span style="font-size:var(--dense-font-data)">{{ row.name || '—' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="title" title="职务" width="140" :edit-render="{}">
            <template #edit="{ row }">
              <a-input v-model="row.title" size="small" placeholder="职务/头衔" />
            </template>
            <template #default="{ row }">
              <span style="font-size:var(--dense-font-data)">{{ row.title || '—' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="email" title="邮箱" min-width="200" :edit-render="{}">
            <template #edit="{ row }">
              <a-input v-model="row.email" size="small" placeholder="邮箱地址" />
            </template>
            <template #default="{ row }">
              <span style="font-size:var(--dense-font-data);color:var(--primary-6)">{{ row.email || '—' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="phone" title="电话" width="160" :edit-render="{}">
            <template #edit="{ row }">
              <a-input v-model="row.phone" size="small" placeholder="联系电话" />
            </template>
            <template #default="{ row }">
              <span style="font-size:var(--dense-font-data)">{{ row.phone || '—' }}</span>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="60" align="center">
            <template #default="{ row }">
              <a-tooltip content="删除">
                <a-button type="text" class="row-action-btn" @click="removeContact(row.id)">
                  <icon-delete style="color:var(--danger-6)" />
                </a-button>
              </a-tooltip>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <!-- C组：贸易信息 -->
    <div class="detail-section" style="margin-bottom:8px">
      <div class="detail-section__head">
        <h4 class="detail-section__title">C · 贸易信息</h4>
      </div>
      <div class="detail-section__body">
        <div class="detail-form-grid detail-form-grid--4">
          <div class="detail-field">
            <span class="detail-field__label">贸易条款</span>
            <a-select v-model="form.TradeTerms" size="small" placeholder="请选择" allow-clear>
              <a-option v-for="opt in tradeTermsOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
            </a-select>
          </div>
          <div class="detail-field">
            <span class="detail-field__label">运输方式</span>
            <a-select v-model="form.TransportMode" size="small" placeholder="请选择" allow-clear>
              <a-option v-for="opt in transportModeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
            </a-select>
          </div>
          <div class="detail-field">
            <span class="detail-field__label">自填POL</span>
            <a-input v-model="form.Pol" size="small" placeholder="起运港" />
          </div>
          <div class="detail-field">
            <span class="detail-field__label">自填POD</span>
            <a-input v-model="form.Pod" size="small" placeholder="目的港" />
          </div>
        </div>
      </div>
    </div>

    <!-- D组：备注标签 -->
    <div class="detail-section" style="margin-bottom:8px">
      <div class="detail-section__head">
        <h4 class="detail-section__title">D · 备注与标签</h4>
      </div>
      <div class="detail-section__body">
        <div class="detail-form-grid detail-form-grid--3">
          <div class="detail-field" style="grid-column:span 3">
            <span class="detail-field__label">标签</span>
            <a-select v-model="form.Tags" size="small" placeholder="请选择标签" allow-clear multiple>
              <a-option v-for="tag in tagOptions" :key="tag" :value="tag">{{ tag }}</a-option>
            </a-select>
          </div>
          <div class="detail-field" style="grid-column:span 3">
            <span class="detail-field__label">备注</span>
            <a-textarea v-model="form.Remark" placeholder="补充说明" :auto-size="{ minRows: 2, maxRows: 4 }" />
          </div>
        </div>
      </div>
    </div>

    <!-- 吸底操作栏 -->
    <div class="detail-drawer-footer" style="position:fixed;bottom:0;left:0;right:0;z-index:100;border-top:1px solid var(--color-border-1);background:#fff">
      <a-button type="primary" size="small" :loading="saving" @click="handleSave">保存</a-button>
      <a-button size="small" @click="handleCancel">取消</a-button>
    </div>
  </div>
</template>
