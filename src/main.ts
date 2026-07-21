import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import VXETable from 'vxe-table';
import App from './App.vue';
import { router } from './router';

import '@arco-themes/vue-gi-demo/css/arco.css';
import 'vxe-table/lib/style.css';
import '@icon-park/vue-next/styles/index.css';
import './styles/global.css';

const app = createApp(App);

app.use(ArcoVue);
app.use(VXETable);
app.use(router);
app.mount('#app');
