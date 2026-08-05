import { defineFeatureContracts } from '../../../design-system/featureContract';

export const TEMPLATE_MANAGEMENT_FEATURE_CONTRACTS = defineFeatureContracts([
  { id: 'template-query', actorRoles: ['template.viewer', 'template.editor'], visibleWhen: '模板列表可见', enabledWhen: '本地查询未执行中', request: '按已应用条件过滤本地模板数据', successResult: '更新表格结果和分页', errorResult: '保留查询条件与当前结果', refreshScope: '本地列表与分页' },
  { id: 'template-create', actorRoles: ['template.editor'], visibleWhen: '列表工具栏可见', enabledWhen: '没有编辑弹窗正在提交', request: '打开空白本地模板草稿', successResult: '显示新增弹窗', errorResult: '保持当前列表上下文', refreshScope: '编辑弹窗' },
  { id: 'template-save', actorRoles: ['template.editor'], visibleWhen: '新增或编辑弹窗可见', enabledWhen: '必填字段有效', request: '将模板草稿保存到浏览器内存', successResult: '更新本地列表并关闭弹窗', errorResult: '保留弹窗与用户输入', refreshScope: '当前行或新增行' },
  { id: 'template-copy', actorRoles: ['template.editor'], visibleWhen: '当前模板行可见', enabledWhen: '当前行存在', request: '复制当前本地模板并生成新名称', successResult: '将副本插入本地列表首行', errorResult: '保持当前列表', refreshScope: '本地列表与分页' },
  { id: 'template-export', actorRoles: ['template.viewer', 'template.editor'], visibleWhen: '当前模板行可见', enabledWhen: '当前行存在', request: '在前端生成当前模板 CSV', successResult: '下载模板 CSV 文件', errorResult: '保持当前列表', refreshScope: '下载产物' },
  { id: 'template-delete', actorRoles: ['template.editor'], visibleWhen: '当前模板行可见', enabledWhen: '用户已确认删除', request: '从浏览器内存移除当前模板', successResult: '更新本地列表并修正分页', errorResult: '保留当前模板和列表上下文', refreshScope: '本地列表与分页' },
  { id: 'template-column-settings', actorRoles: ['template.viewer', 'template.editor'], visibleWhen: '列表工具栏可见', enabledWhen: '列设置弹窗未提交', request: '更新当前页面的本地可见列集合', successResult: '按选择重新显示表格列', errorResult: '保留原列设置', refreshScope: '当前表格列' },
] as const);
