import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import http from './assets/js/http';
import appConst from './assets/js/appConst'
import { apiUrl } from './assets/js/apiUrl'
import global from './assets/js/global'
import '@/assets/css/_main.scss'
import bus from '@/views/eventBus/eventBus'
import './assets/js/dialogDrag';
import './assets/js/validate';
import './assets/js/vueFilter';
import store from './store';
Vue.use(ElementUI)

Vue.prototype.$axiosTools = axios;
Vue.prototype.$http = http;
Vue.prototype.$appConst = appConst
Vue.prototype.$apiUrl = apiUrl
Vue.prototype.$global = global
Vue.prototype.$bus = bus

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
