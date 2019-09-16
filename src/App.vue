<template>
  <div id="app">
		<v-header :seller="seller"></v-header>
		<div class="tab border-1px">
			<router-link to="/goods" class="tab-item" >商品</router-link>
			<router-link to="/ratings" class="tab-item" >评论</router-link>
			<router-link to="/seller"class="tab-item" >商家</router-link>
		</div>
		<keep-alive>
			<router-view />
		</keep-alive>
		
  </div>
</template>

<script >
import {urlParse} from 'common/js/util';
export default {
  name: 'App',
	data() {
		return {
			seller: {
				id: (() => {
					let queryParam = urlParse();
					return queryParam.id;
				})()
			}
		}
	},
	created () {
		// seller
		this.$http.get('/api/seller?id='+this.seller.id, {
			
		}).then((res) => {
			// console.log(res.data)
			// 给对象扩展属性
			this.seller = Object.assign({}, this.seller,res.data.data);
			this.$store.commit('sellerAdd',this.seller);
		}).catch((err) => {
			console.error(err)
		});
		
	}

}
</script>

<style lang="stylus" rel = "stylesheet/stylus">
	@import "common/stylus/mixin.styl"
	#app
		.tab
			display: flex
			width: 100%
			height: 40px
			line-height: 40px
			border-1px(rgba(7,17,27,0.1))
			.tab-item
				flex: 1
				text-align: center
				
				display: block
				// 可被继承的属性放在最后
				font-size: 14px
				color: rgb(77,85,93)
				&.router-link-active
					color: rgb(240,20,20)
</style>
