# Project Architecture

Design and implement as a large Vue application, even when the current project is a prototype.

## Expected Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Arco Design Vue
- `@arco-themes/vue-gi-demo`
- vxe-table

## Directory Pattern

Use this shape for business modules:

```text
src/
  router/
    index.ts
    modules/
      orderManage.ts
  config/
    menu.ts
    tabs.ts
  layouts/
    BasicLayout.vue
  views/
    orderManage/
      saleOrder/
        index.vue
        components/
        composables/
        config/
        mock/
        types/
  styles/
    global.css
```

## Route Rules

- Put business routes under `src/router/modules`.
- Keep route metadata explicit: title, menu key, and tab behavior where needed.
- Redirect `/` to the primary prototype page only when this is the project requirement.
- Do not register routes for nonexistent business pages.

## Menu Rules

- Keep menu data in config files.
- Keep menu keys stable and aligned with routes.
- Do not hard-code menu items inside pages.
- Do not add placeholder menus to make the system look larger.

## Tabnav Rules

- Tabnav is system navigation, not page content.
- Only show tabs for real pages in scope.
- Active state must follow route state.
- Do not split the same operation into left and right groups when the action belongs to the same filter or toolbar cluster.

## Page Module Rules

- `index.vue` should orchestrate components and state only.
- Put reusable page sections in `components`.
- Put list state, filtering, pagination, and drawer state in `composables`.
- Put columns, tabs, status maps, options, and field groups in `config`.
- Put mock business data in `mock`.
- Put shared types in `types`.
