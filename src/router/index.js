import Vue from 'vue'
import Router from 'vue-router'
import goods from '@/components/content/goods'
import seller from '@/components/content/seller'
import ratings from '@/components/content/ratings'

Vue.use(Router)

export default new Router({
	mode: "history",
  routes: [
    {
    	path: '/goods',
    	component: goods
    },
		{
      path: '/seller',
      component: seller
    },
		{
      path: '/ratings',
      component: ratings
    },
		{
			path: '/',
			redirect: '/goods'
		}
  ]
})
