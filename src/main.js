import Vue from 'vue'
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue'
import moment from 'moment'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSimplemde from 'vue-simplemde'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'

import { version } from '../package.json'


import App from './App'
import router from './router'
import { store } from './components/store'

/*
 * Introduction for users who opened the console.
 */
console.log(
  `%carabesque ${version}` + '%cfor ribbon',
  'color: #f5f7fa;background-color:#6a50a7;padding:3px;border-top-left-radius:4px;border-bottom-left-radius:4px;',
  'color:#f5f7fa;background-color:#323133;padding:3px;border-top-right-radius:4px;border-bottom-right-radius:4px;'
)

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)
Vue.use(VueSimplemde)
Vue.use(VueChartkick, { adapter: Chart })

Vue.filter('formatDate', (value) => {
  if(value) {
    return moment(String(value)).format('MMM Do, YYYY')
  }
});

let user = JSON.parse(localStorage.getItem('user'))
if (user){
  Vue.axios.defaults.headers.common['session_id'] = user.session_id
  Vue.axios.defaults.headers.common['session_token'] = user.session_token
}

/*
 * The API URL.
 */
Vue.mixin({
  data() {
    return {
      get api() {
        return '/api'
        // return 'http://localhost:8081/api'
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
