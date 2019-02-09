// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap'
import VueAxios from 'vue-axios'
import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

// 引用自定義
import App from './App'
import router from './router'
import './bus'
import currencyFilter from './filters/currency';
import timestampFilter from './filters/timestamp';
import Pages from '@/components/Pagination' // @ 指 src

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VeeValidate);
VeeValidate.Validator.localize('zh_TW',zhTWValidate) //驗證表單
Vue.use(VueAwesomeSwiper, /* { default global options } */)

// 全域啟用元件
Vue.component('Loading', Loading);
Vue.component('pagination',Pages);
Vue.filter('currency', currencyFilter);
Vue.filter('timestamp', timestampFilter);

axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// 驗證
router.beforeEach((to, from, next) =>{
  if (to.meta.requiresAuth) {
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response) => {
      if (response.data.success) {
        //如果已經登入就繼續
        next();
      }else{
        //如果還沒登入就轉到登入頁
        next({
          path: '/login', 
        })
      }
    })
  }else{
    next();
  }
})
