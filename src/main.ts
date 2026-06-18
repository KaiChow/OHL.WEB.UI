import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import VXETable from 'vxe-table';
import App from './App.vue';
import { router } from './router';

import '@arco-design/web-vue/dist/arco.css';
import '@arco-themes/vue-gi-demo/index.less';
import 'vxe-table/lib/style.css';
import '../ui-skill/arco-ui.css';
import './styles/global.css';

const app = createApp(App);

app.use(ArcoVue);
app.use(VXETable);
app.use(router);
app.mount('#app');
