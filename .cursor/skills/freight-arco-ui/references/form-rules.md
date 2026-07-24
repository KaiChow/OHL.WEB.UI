# Arco Form 写法规范

Arco `<a-form>` 有自己的校验绑定机制。写法错误会导致校验失效、星号空摆、错误信息不展示。本文是项目内唯一认可的写法。

---

## 1. Form 根节点（必填属性）

```vue
<a-form
  ref="formRef"
  :model="form"
  layout="vertical"
  size="small"
  class="detail-form"
  @submit="handleSubmit"
>
```

| 属性 | 是否必须 | 说明 |
|------|----------|------|
| `ref="formRef"` | **必须** | 用于调用 `validate()` / `resetFields()` / `clearValidate()` |
| `:model="form"` | **必须** | 告诉 Arco 校验哪个数据对象；缺少则所有 `field` 绑定失效 |
| `layout="vertical"` | **必须** | 项目统一竖排标签；禁止 `horizontal` / `inline` 在详情表单内 |
| `size="small"` | **必须** | 向下传递给所有子控件；禁止每个控件单独写 `size="small"` 而 form 不写 |
| `class="detail-form"` | **必须** | 表单 **布局**（栅格 / form-item）；控件皮肤见 `form-field.md` § Arco Form Controls |

---

## 2. Form Item（每个字段）

```vue
<a-form-item
  field="carrierName"
  label="船公司"
  :rules="[{ required: true, message: '请填写船公司' }]"
>
  <a-input v-model="form.carrierName" size="small" placeholder="请输入船公司" />
</a-form-item>
```

| 属性 | 是否必须 | 说明 |
|------|----------|------|
| `field="xxx"` | **必须** | 必须与 `:model` 对象的 key 完全一致；缺少则校验和错误展示全部失效 |
| `label="..."` | **必须** | 显示标签文字；禁止在 `a-form-item` 外手写 `<div class="label">` |
| `:rules="[...]"` | 有校验时必须 | 校验规则数组；纯展示字段可省略 |

### 禁止写法

```vue
<!-- ❌ required 属性只加星号，不触发校验 -->
<a-form-item label="船公司" required>

<!-- ❌ 缺少 field，validate() 无法定位此字段 -->
<a-form-item label="船公司" :rules="[{ required: true }]">

<!-- ❌ 在 form-item 外手写 label -->
<div class="label">船公司</div>
<a-input v-model="form.carrierName" />

<!-- ❌ 控件不在 a-form-item 内，校验消息无处展示 -->
<a-input v-model="form.carrierName" />
```

---

## 3. 校验规则写法

### 推荐：规则对象集中定义（TypeScript）

```ts
import type { FieldRule } from '@arco-design/web-vue'

const rules: Record<string, FieldRule[]> = {
  carrierName: [{ required: true, message: '请填写船公司' }],
  pol:         [{ required: true, message: '请填写起运港' }],
  etd:         [{ required: true, message: '请选择 ETD' }],
  weight:      [
    { required: true, message: '请填写重量' },
    { type: 'number', min: 0, message: '重量不能为负数' },
  ],
}
```

绑定到 form-item：

```vue
<a-form-item field="carrierName" label="船公司" :rules="rules.carrierName">
```

### 允许：内联规则（字段少时可读性更好）

```vue
<a-form-item
  field="pol"
  label="起运港"
  :rules="[{ required: true, message: '请填写起运港' }]"
>
```

### 禁止

```vue
<!-- ❌ 自写错误提示 div -->
<a-input v-model="form.pol" />
<div v-if="errors.pol" class="err-msg">请填写起运港</div>

<!-- ❌ 用 required prop 代替 rules -->
<a-form-item field="pol" label="起运港" required>
```

---

## 4. TypeScript 类型定义

```ts
import { reactive, ref } from 'vue'
import type { FormInstance } from '@arco-design/web-vue'

interface OrderForm {
  businessNo: string
  carrierName: string
  pol: string
  polCode: string
  etd: string | null
  weight: number | null
}

const formRef = ref<FormInstance>()

const form = reactive<OrderForm>({
  businessNo: '',
  carrierName: '',
  pol: '',
  polCode: '',
  etd: null,
  weight: null,
})
```

- 用 `reactive<T>()` 定义 form 对象，`field` 字符串必须与 `T` 的 key 一致。
- `formRef` 类型为 `FormInstance`，不要写 `any`。

---

## 5. 提交与校验

```ts
const submitting = ref(false)

const handleSubmit = async () => {
  const errors = await formRef.value?.validate()
  if (errors) return  // 有校验错误时 validate() 返回错误对象，不为 null

  submitting.value = true
  try {
    await saveOrder(form)
    Message.success('保存成功')
    emit('success')
  } catch {
    Message.error('保存失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
```

规则：

- `validate()` 返回 `undefined` 表示通过，返回错误对象表示失败。用 `if (errors) return` 判断。
- 提交按钮绑定 `:loading="submitting"`，防止重复提交。
- 成功 → `Message.success` + 关闭弹窗/抽屉。
- 失败 → `Message.error` + 保持弹窗打开。

### 重置

```ts
// 重置字段值 + 清除校验状态
formRef.value?.resetFields()

// 仅清除校验状态，不重置值
formRef.value?.clearValidate()
```

---

## 6. 组合字段（Combo）

对于「港口代码 + 港口名称」「船名 / 航次」等组合字段：

```vue
<!-- ✅ 正确：detail-combo 包裹，外层一个 a-form-item -->
<a-form-item field="pol" label="起运港" :rules="[{ required: true, message: '请填写起运港' }]">
  <div class="detail-combo detail-combo--code-name">
    <a-input v-model="form.polCode" size="small" placeholder="港口代码" />
    <a-input v-model="form.pol"     size="small" placeholder="港口名称" />
  </div>
</a-form-item>

<!-- ✅ 字段 + 操作按钮 -->
<a-form-item field="customerId" label="客户">
  <div class="detail-combo detail-combo--action">
    <a-select v-model="form.customerId" size="small" allow-search />
    <a-button size="small" type="outline" @click="copyCustomer">
      <template #icon><icon-copy /></template>
    </a-button>
  </div>
</a-form-item>
```

```vue
<!-- ❌ 禁止：a-input-group compact -->
<a-form-item label="起运港">
  <a-input-group compact class="detail-combo detail-combo--code-name">
    <a-input v-model="form.polCode" size="small" />
    <a-input v-model="form.pol"     size="small" />
  </a-input-group>
</a-form-item>
```

组合字段优先用 CSS grid/flex 安排多个原生 small 控件；不要通过内部选择器合并或重画控件边框。

---

## 7. 纯只读字段

### 7.1 对象详情工作区（展示优先）

运单、订单、账单等对象详情默认是可扫描的 **展示态**，遵守 `detail-form.md` 的 Object Workspace Mode Contract。禁止把全部字段在首屏直接渲染为常驻输入控件：

- 展示态优先用 Arco `a-descriptions class="detail-display"`；字段按业务分区，不使用 disabled/readonly input 假装文本。
- 用户显式进入编辑后，可改字段才切换为 `a-input` / `a-select` / `a-date-picker` 等真实控件，统一 `size="small"`。
- 系统主键/审计字段（订单号、创建时间）在编辑态仍用纯文本 `<span class="mono">`，不得伪装成输入框。
- 保存失败保留输入和编辑态；取消恢复快照；离开/切换对象处理未保存修改。
- 吸底编辑栏只在编辑态出现，保留一个 primary 保存和 secondary 取消；状态推进、行编辑和对象编辑互斥。

全页新建、分阶段交易录入或明确以录入为唯一任务的页面可使用 edit-first，按 `full-page-form.md`，不得把该例外反推到对象详情。

### 7.2 局部纯展示字段

只读字段（无需校验，仅展示）不进入 `a-form`，用 `detail-field`：

```vue
<!-- ✅ 只读字段：在 detail-form-grid 内，但不用 a-form-item -->
<div class="detail-field">
  <div class="detail-field__label">创建时间</div>
  <div class="detail-field__val">{{ order.createdAt }}</div>
</div>

<!-- ❌ 禁止：用 disabled a-input 假装只读 -->
<a-form-item label="创建时间">
  <a-input :model-value="order.createdAt" disabled />
</a-form-item>
```

例外：字段在**编辑时 disabled、新建时可编辑**，可以保留在 `a-form-item` 内并加 `:disabled="isEdit"`。

---

## 8. Modal 内表单

Modal 内的表单遵循同样规则。额外注意：

```vue
<a-modal v-model:visible="visible" title="添加联系人" :width="560" :mask-closable="false">
  <a-form ref="formRef" :model="form" layout="vertical" size="small" class="detail-form">
    <a-row :gutter="[16, 8]">
      <a-col :span="12"><a-form-item field="name" label="姓名" :rules="[{ required: true, message: '请填写姓名' }]">
        <a-input v-model="form.name" size="small" />
      </a-form-item></a-col>
      <a-col :span="12"><a-form-item field="phone" label="电话">
        <a-input v-model="form.phone" size="small" />
      </a-form-item></a-col>
    </a-row>
  </a-form>

  <template #footer>
    <a-row justify="space-between" align="center">
      <a-col><a-button v-if="isEdit" type="text" status="danger" size="small" @click="handleDelete">删除</a-button></a-col>
      <a-col><a-space :size="8"><a-button size="small" @click="handleCancel">取消</a-button><a-button size="small" type="primary" :loading="submitting" @click="handleSubmit">确定</a-button></a-space></a-col>
    </a-row>
  </template>
</a-modal>
```

- 表单生命周期必须显式重置，防止上次错误状态残留；在 dirty-leave/关闭确认完成后，于 `after-close` 或下一次 open 初始化时重置，不要在用户尚未确认放弃时先清空：

  ```ts
  const handleAfterClose = () => formRef.value?.resetFields()
  ```

---

## 9. 快速自查

```
□ a-form 有 ref / :model / layout="vertical" / size="small"；local class 只负责布局
□ 每个需要校验/提交的 a-form-item 有 field，且与 :model key 一致
□ 校验用 :rules 数组，不用 required prop
□ 没有在 a-form-item 外手写 label div
□ 组合字段优先 Arco Space/Grid/Input Group；不靠内部选择器重画边框
□ 只读字段用 a-descriptions/文本，不用 disabled input 假装展示态（编辑态切换例外）
□ 提交调用 formRef.value?.validate()，判断返回值
□ dirty close 先确认；关闭完成或下次打开初始化时 resetFields()
□ 提交按钮绑定 :loading="submitting"
□ 失败保留输入并聚焦首个错误；成功后按 feature contract 刷新 owner
```
