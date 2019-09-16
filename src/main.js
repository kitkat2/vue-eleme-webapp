// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import header from './components/header/header'
import star from './components/star/star'
import cart from './components/cart/cart'
import food from './components/food/food'
import split from './components/split/split'
import ratingselect from './components/ratingselect/ratingselect'
import cartcontrol from './components/cartcontrol/cartcontrol'

import store from './vuex'
import router from './router'


import axios from 'axios'

import 'common/stylus/index.styl'

Vue.config.productionTip = false

Vue.prototype.$http = axios


Vue.component(header.name, header)
Vue.component(star.name, star)
Vue.component(cart.name, cart)
Vue.component(cartcontrol.name, cartcontrol)
Vue.component(food.name, food)
Vue.component(ratingselect.name, ratingselect)
Vue.component(split.name, split)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
