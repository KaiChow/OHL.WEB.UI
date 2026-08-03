import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import VXETable from 'vxe-table';
import App from './App.vue';
import { router } from './router';

import '@arco-themes/vue-gi-demo/css/arco.css';
import 'vxe-table/lib/style.css';
import '@icon-park/vue-next/styles/index.css';
import './styles/vxe-theme/index.less';
import './styles/global.css';

// Table look is owned globally: default border + stripe + mini density
// (high-density system), no page-level table CSS.
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
app.use(router);
app.mount('#app');
