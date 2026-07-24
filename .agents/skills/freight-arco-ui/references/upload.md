# Upload And Attachments

## Rule: No `a-upload`

Never use Arco's `<a-upload>` directly for business file upload. Business upload must go through the project's shared uploader contract so OSS policy, progress, file type, permission, and error behavior stay consistent.

Do not claim that the project uses Uppy or another library unless its dependency and shared wrapper actually exist. If no shared uploader exists, stop at the feature contract and integration boundary; do not invent a component or silently fall back to `a-upload`.

## Upload Trigger Patterns

### Inline trigger (detail section, form field)

```vue
<!-- Single file field inside a detail form -->
<a-form-item label="提单文件">
    <a-button size="small" type="outline" @click="openUpload">
      <template #icon><icon-upload /></template>上传文件
    </a-button>
</a-form-item>
```

### Section-level trigger (module header right)

```vue
<div class="detail-section__actions">
  <a-button size="small" type="outline" @click="openUpload">
    <template #icon><icon-upload /></template>添加附件
  </a-button>
</div>
```

Trigger button type:
- `outline` when upload is the primary action in the module scope
- `text` when upload is auxiliary alongside another primary action

## File List Display

Show uploaded files as a compact list inside the section body. Do not use cards or grid thumbnails for freight document lists.

```vue
<div class="detail-section__body">
  <div v-for="file in fileList" :key="file.id" class="attach-row">
    <icon-file class="attach-row__icon" />
    <a class="attach-row__name" :href="file.url" target="_blank">{{ file.name }}</a>
    <span class="attach-row__meta">{{ file.size }} · {{ file.uploadedAt }}</span>
    <a-tooltip content="删除附件">
      <a-popconfirm :content="`确认删除附件 ${file.name}？`" @ok="removeFile(file.id)">
        <a-button size="small" type="text" class="row-action-btn" status="danger" :aria-label="`删除附件 ${file.name}`">
          <template #icon><icon-delete /></template>
        </a-button>
      </a-popconfirm>
    </a-tooltip>
  </div>
  <div v-if="!fileList.length" class="attach-row attach-row--empty">
    <icon-file class="attach-row__icon attach-row__icon--muted" />
    <span class="attach-row__meta">暂无附件</span>
  </div>
</div>
```

## Upload State Feedback

| State | Pattern |
|-------|---------|
| Uploading | Progress bar or spinner inside `attach-row`; disable delete button |
| Success | Update the local file row/list + concise `Message.success` |
| Failure | Keep failed file row/field with reason and retry; Message may summarize |
| Over size limit | Show inline error near the trigger, not a modal alert |

## File Type Restrictions

- Declare accepted types at the component or trigger level.
- Show accepted formats near the upload trigger: `支持 PDF、Word、Excel，单文件不超过 20MB`.
- Do not silently reject — show a clear error message with the accepted type list.

## Rules

- Upload triggers follow the button scope rules in `actions.md`: one `outline` per section, auxiliary = `text`.
- File delete uses `a-popconfirm` + `status="danger"` unless the backend provides a real recoverable delete/Undo contract.
- Do not show upload progress in the page title or toolbar — keep it local to the section.
- File list rows use `row-action-btn` for the delete icon, same as table row actions.
- Do not use emoji or decorative icons in the file list.

## Release Gate

- [ ] Shared uploader contract owns permission, accepted types, size, progress, cancellation, retry, and request errors.
- [ ] Each file keeps a stable id and explicit uploading/success/failure/removing state.
- [ ] Failure remains local and retryable; closing an overlay does not silently abandon an active upload.
- [ ] File actions have Tooltip, business-specific accessible name, pending protection, and destructive confirmation/recovery.
