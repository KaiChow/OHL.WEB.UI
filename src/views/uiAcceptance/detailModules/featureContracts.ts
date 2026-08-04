import { defineFeatureContracts } from '../../../design-system/featureContract';

export const DETAIL_MODULE_FEATURE_CONTRACTS = defineFeatureContracts([
  { id: 'detail-workspace-save', actorRoles: ['ui.acceptance.editor'], visibleWhen: '页面为默认编辑工作态', enabledWhen: '表单可提交且未在保存中', request: '保存本地验收页当前详情草稿', successResult: '提交当前编辑值、刷新已保存快照、保持各模块业务模式并显示对象级成功反馈', errorResult: '保留全部编辑值并在固定页脚显示可恢复失败', refreshScope: '对象头、受影响模块和固定页脚' },
  { id: 'detail-cargo-add-party', actorRoles: ['ui.acceptance.editor'], visibleWhen: '货物与发货方模块可编辑', enabledWhen: '未达到本地验收上限', request: '向本地货物模块增加一个发货方草稿', successResult: '新增子模块并展开到新发货方', errorResult: '保留已有子模块并在货物模块显示错误', refreshScope: '货物模块统计与子模块列表' },
  { id: 'detail-cargo-duplicate-party', actorRoles: ['ui.acceptance.editor'], visibleWhen: '当前发货方允许复制', enabledWhen: '页面处于编辑模式', request: '复制当前发货方及其本地货物行', successResult: '新增复制项、更新统计并展开复制项', errorResult: '保留原发货方与货物行并显示局部错误', refreshScope: '货物模块统计与子模块列表' },
  { id: 'detail-cargo-remove-party', actorRoles: ['ui.acceptance.editor'], visibleWhen: '当前发货方允许删除', enabledWhen: '至少保留一个发货方且页面处于编辑模式', request: '确认后删除当前本地发货方及其货物行', successResult: '删除子模块并更新模块统计', errorResult: '保留当前子模块并显示局部错误', refreshScope: '货物模块统计与子模块列表' },
  { id: 'detail-cargo-add-line', actorRoles: ['ui.acceptance.editor'], visibleWhen: '当前发货方货物表可编辑', enabledWhen: '页面处于编辑模式', request: '向当前发货方增加一个本地货物行', successResult: '新增可编辑行并更新子模块与模块统计', errorResult: '保留已有行并在当前子模块显示错误', refreshScope: '当前发货方货物表和相关统计' },
  { id: 'detail-cargo-remove-line', actorRoles: ['ui.acceptance.editor'], visibleWhen: '当前货物行可删除', enabledWhen: '页面处于编辑模式', request: '确认后删除当前本地货物行', successResult: '删除行并更新相关统计', errorResult: '保留当前行并显示行级错误', refreshScope: '当前发货方货物表和相关统计' },
  { id: 'detail-container-add', actorRoles: ['ui.acceptance.editor'], visibleWhen: '箱信息模块可编辑', enabledWhen: '页面处于编辑模式', request: '增加一个本地箱信息草稿行', successResult: '新增可编辑箱行并更新模块统计', errorResult: '保留已有箱行并显示模块级错误', refreshScope: '箱信息表和模块统计' },
  { id: 'detail-container-remove', actorRoles: ['ui.acceptance.editor'], visibleWhen: '当前箱行可删除', enabledWhen: '页面处于编辑模式', request: '确认后删除当前本地箱行', successResult: '删除箱行并更新模块统计', errorResult: '保留当前箱行并显示行级错误', refreshScope: '箱信息表和模块统计' },
] as const);
