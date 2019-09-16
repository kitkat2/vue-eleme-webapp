<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{'highlight': totalCount > 0}">
							<i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
						</div>
						<div class="num" v-show="totalCount > 0">{{totalCount}}</div>
					</div>
					<div class="price"  :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
					<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
				</div>
				<div class="content-right" @click.stop="pay">
					<div class="pay" :class="{'enough': totalPrice >= minPrice}">{{payDesc}}</div>
				</div>
			</div>
			<div class="ball-container">
				<transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter = "afterEnter" >
					<div class="ball" v-for="ball in balls" v-show="ball.show" :key="ball.id">
						<div class="inner inner-hook" key="ball.id"></div>
					</div>
				</transition-group>
			</div>
			<transition name="fold">
				<div class="shopcart-list" v-show="showList">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="content">
						<ul>
							<li class="food" v-for="food in selectFoods">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span>￥{{food.price * food.count}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cart-control :food="food"></cart-control>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div class="list-mask" v-show="showList" @click="isFold = true"></div>
		</transition>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import {mapState} from 'vuex';
	// import {mapGetters} from 'vuex';
	
	export default {
		name: 'shopcart',
		data() {
			return {
				balls: [
					{
						show: false,
						id: 111
					},
					{
						show: false,
						id: 112
					},
					{
						show: false,
						id: 113
					},
					{
						show: false,
						id: 114
					},
					{
						show: false,
						id: 115
					}
				],
				dropBalls: [],
				isFold: true
			}
		},
		props:{
			selectFoods: {
				type: Array,
				default: function(){
					return  [];
				}
			},
			deliveryPrice : {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0

			}
		},
		computed:{
			totalPrice: function() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				})
				return total;
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				})
				return count;
			},
			payDesc() {
				if(this.totalPrice === 0){
					return `￥${this.minPrice}元起送`;
				}else if ( this.totalPrice < this.minPrice){
					let diff = this.minPrice - this.totalPrice;
					return `还差￥${diff}元起送`;
				}else{
					return '去结算';
				}
				
			},
			showList() {
				if(!this.totalCount) {
					this.isFold = true;
					return false;
				};
				let show = !this.isFold;
				// console.log("show: "+show)
				if(show) {
					this.$nextTick(() => {
						if (!this.scroll) { //如果没有better-scroll的实例则添加
							this.scroll = new BScroll(this.$refs.content, {
								click: true
							});
						} else {
							this.scroll.refresh(); //refresh计算是否需要滚动
						}
					});
				}
				return show;
			} ,
			
			...mapState(['cart'])
		},
		watch:{
			totalCount: 'drop'
		},
		methods: {
			drop(oldVal, newVal) {
				if(oldVal > newVal){
					for (var i = 0; i < this.balls.length; i++) {
						let ball = this.balls[i];
						if(!ball.show){
							ball.show = true;
							// ball.ehl = el;
							ball.el = this.cart;
							
							this.dropBalls.push(ball);
							return;
						}
					}
				}
				
			},
			
			toggleList() {
				if(!this.totalCount) {
					return;
				}
				this.isFold = !this.isFold
				// console.log("fold: "+this.isFold)
			},
			empty() {
				this.selectFoods.forEach((food) =>{
					food.count = 0;
				})
			},
			pay() {
				if(this.totalPrice < this.minPrice) {
					return;
				}
				window.alert(`支付${this.totalPrice}元`)
			},
			beforeEnter(el) {
				//el元素表示小球的div，ball.el表示加按钮
				
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					console.log(ball.el)
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
						el.style.transform = `translate3d(0,${y}px,0)`;
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			enter(el) {
				/* eslint-disable no-unused-vars */
				let rf = el.offsetHeight;
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
				});
			},
			afterEnter(el) {
				let ball = this.dropBalls.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			}
				
		},
		
	}
</script>

<style scoped lang="stylus">
	@import '../../common/stylus/mixin'
	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 45
		height: 48px
		width: 100%
		.content
			display: flex
			background: #141d27
			color: rgba(2555,255,255,0.4)	
			font-size: 0
			.content-left
				flex: 1
				.logo-wrapper
					display: inline-block
					vertical-align: top
					position: relative
					top: -10px
					margin: 0 12px
					padding: 6px 
					height: 56px
					width: 56px
					box-sizing: border-box
					border-radius: 50%
					background: #141d27
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						background: #2b343c
						text-align: center
						&.highlight
							background: rgb(0, 160 ,220)
						.icon-shopping_cart
							line-height: 44px
							font-size: 24px
							color: #80858a
							&.highlight
								color: #fff
					.num
						position: absolute
						top: 0
						right: 0
						width: 24px
						height: 16px
						line-height: 16px
						text-align: center
						border-radius: 16px
						font-size: 9px
						font-weight: 700
						color: #fff
						background: rgb(240, 20, 20)
						box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
						
				.price
					display: inline-block
					vertical-align: top
					margin-top: 12px
					padding-right: 12px 
					box-sizing: border-box
					line-height: 24px
					border-right: 1px solid rgba(255,255,255,0.1)
					font-size:	16px
					font-weight: 700
					&.highlight
						color: #fff
				.desc
					display: inline-block
					vertical-align: top
					line-height: 24px
					margin: 12px 0 0 12px
					font-size: 10px
			.content-right
				flex: 0 0 105px
				.pay
					height: 48px
					line-height: 48px
					text-align: center
					font-size: 12px
					background:	#2b333b
					font-weight: 700
					&.enough
						background: #00b42c
						color: #fff
		.ball-container
			.ball
				position: fixed
				left: 32px
				bottom: 22px
				z-index: 200
				&.drop-enter-active
					transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
					.inner
						width: 16px
						height: 16px
						border-radius: 50%
						background: rgb(0, 160, 220)
						transition: all 0.4s linear	
		.shopcart-list	
			position: absolute
			top: 0
			left:0
			z-index: -1
			width: 100%
			// -100%相对于当前自身高度做偏移
			transform: translate3d(0, -100% , 0)
			&.fold-enter-active, &.fold-leave-active
				transition: all 0.3s
			&.fold-enter, &.fold-leave-to
				transform: translate3d(0, 0 , 0)
			.list-header
				height: 40px
				padding: 0 18px
				line-height: 40px
				background: #f3f5f7
				border-bottom: 1px solid rgba(7, 17, 27, 0.1)
				.title
					float: left
					font-size: 14px
					color: rgb(7, 17, 27)
				.empty
					float: right
					font-size: 12px
					color: rgb(0, 160, 220)
			.list-content
				padding: 0 18px
				max-height: 217px
				overflow: hidden
				background: #fff
				// border-1px()
				.food
					position:relative
					padding: 12px 0
					box-sizing: border-box
					border-1px(rgba(7, 17, 27, 0.1))
					.name
						line-height: 24px
						font-size: 14px
						color: rgb(7, 17, 27)
					.price
						position: absolute
						bottom: 12px
						right: 90px
						line-height: 24px
						font-size: 14px
						font-weight: 700
						color: rgb(240, 20, 20)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 6px
	.list-mask
		position: fixed
		top: 0
		left: 0
		width: 100%
		height: 100%
		z-index: 40
		backdrop-filter: blur(10px)
		background: rgba(7, 17, 27, 0.6)
		&.fade-enter-active, &.fade-leave-active
			transition: all 0.3s
		&.fade-enter, &.fade-leave-to
			opacity: 0
</style>