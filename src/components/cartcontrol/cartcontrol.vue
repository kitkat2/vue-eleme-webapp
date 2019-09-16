<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="food.count  > 0" @click.stop="decreaseCart">
				<i class="icon-remove_circle_outline inner"></i>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
		<div class="cart-add">
			<i class="icon-add_circle" @click.stop="addCart"></i>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	// import {mapMutations} from 'vuex'
	export default {
		name: 'cart-control',
		props: {
			food: {
				type: Object,
				
			}
		},
		methods: {
			addCart(ev) {
				if(!this.food.count){
					Vue.set(this.food, 'count', 1);
				}else{
					this.food.count++;
				}
				this.$store.commit('cartAdd', ev.target);

			},
			decreaseCart() {
				this.food.count--;
			}
		}, 
		
	}
</script>

<style scoped lang="stylus">
	.cartcontrol
		font-size: 0
		.cart-decrease
			display: inline-block
			padding: 6px
			&.move-enter-active, &.move-leave-active
				transition: all 0.4s linear
			&.move-enter, &.move-leave-to
				opacity: 0
				transform: translate3d(24px, 0 , 0) rotate(180deg)	
			.inner
				display: inline-block
				line-height: 24px
				font-size: 24px
				color: rgb(0,120,220)
		.cart-count
			display: inline-block
			vertical-align: top
			width: 12px
			padding-top: 6px
			line-height: 24px
			text-align: center
			font-size: 10px
			color: rgb(147, 153, 159)
		.cart-add
			display: inline-block
			padding: 6px
			line-height: 24px
			font-size: 24px
			color: rgb(0,120,220)
		

</style>