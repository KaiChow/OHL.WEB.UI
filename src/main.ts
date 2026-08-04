import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import VXETable from 'vxe-table';
import App from './App.vue';
import { router } from './router';
import { i18n } from './i18n';

import '@arco-themes/vue-gi-demo/css/arco.css';
import 'vxe-table/lib/style.css';
import '@icon-park/vue-next/styles/index.css';
import './styles/vxe-theme/index.less';
import './styles/global.css';

// The global workbench baseline owns border, stripe, and mini density.
// Typed detail roles may disable stripe through the VXE public prop; CSS never owns banding.
VXETable.setup({
  table: {
    border: true,
    stripe: true,
    size: 'mini',
  },
});

const app = createApp(App);

app.use(ArcoVue);
app.use(VXETable);
app.use(i18n);
app.use(router);
app.mount('#app');
