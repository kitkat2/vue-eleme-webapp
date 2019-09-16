<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menu">
			<ul>
				<li v-for="(item, index) in goods" class="menu-item" :class="{'current' : currentIndex === index}" @click="selectMenu(index)">
					
					<span class="text">
						<span v-show="item.type > 0 " class="icon" :class="classMap[item.type]"></span>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foods">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li @click="selectFood(food)" v-for="food in item.foods" class="food-item">
							<div class="icon">
								<img :src="food.icon" alt="">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cart-control :food="food" ></cart-control>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods ="selectFoods"></shopcart>
		<food :food="selectedFood" ref="food" ></food>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	export default {
		name : 'goods',
		// 利用vuex状态管理实现组件间的通信, 故不再使用props
// 		props: {
// 			seller: {
// 				type: Object
// 			}
// 		},
		data: function() {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0,
				classMap: ['decrease','discount','special','invoice','guarantee'],
				selectedFood: {}
			};
		},
		computed:{
			currentIndex()  {
				for (let i= 0; i<this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					
					if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
						return i;
					}
				}
				return 0;
			},
			selectFoods() {
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if(food.count){
							foods.push(food);
						}
					});
				});
				return foods;
			},
			seller() {
				return this.$store.state.seller
			}
		},
		created(){
			this.$http.post('/api/goods', {
				params: {
					appkey: 'appkey',
					pagenum: 1,
					pagesize: 20,
					sort: 'addtime'
				}
			}).then((res) => {
				this.goods = res.data.data
				// nextTick 确定DOM渲染完成
				this.$nextTick(() => {
					this._initScroll();
					this._calculateHeight();
				})
			}).catch((err) => {
				console.error(err)
			})
		},
		methods:{
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.menu, {
					click: true
				})
				this.foodsScroll = new BScroll(this.$refs.foods, {
					probeType: 3,
					click: true
					
				})
				
				this.foodsScroll.on('scroll', (pos) =>{
					this.scrollY = Math.abs(Math.round(pos.y));
				})
			},
			_calculateHeight() {
				let foodList = this.$refs.foods.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					height += foodList[i].clientHeight;
					this.listHeight.push(height);
				}
			},
			
			selectMenu(index){
				let foodList = this.$refs.foods.getElementsByClassName('food-list-hook')
				let el = foodList[index];
				this.foodsScroll.scrollToElement(el ,300)
				
			},

			selectFood (food) {
				this.selectedFood = food
				this.$refs.food.show();
			}
		},

		
	}
</script>

<style scoped lang="stylus">
	@import "../../common/stylus/mixin"
	.goods
		display: flex
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px
			width: 80px
			background: #faf5f7
			.menu-item
				display: table
				height: 54px
				width: 56px
				padding: 0 12px
				color: #999
				line-height: 14px
				&.current
					position: relative
					z-index: 10
					margin-top: -1px
					background: #fff
					color: #000
					font-weight: 700
					.text
						border-none()
				.icon
					display: inline-block
					width: 12px
					height: 12px
					vertical-align: top
					margin-right: 2px
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('goods-img/decrease_3')
					&.discount
						bg-image('goods-img/discount_3')
					&.invoice
						bg-image('goods-img/invoice_3')
					&.guarantee
						bg-image('goods-img/guarantee_3')
					&.special
						bg-image('goods-img/special_3') 
				.text
					display: table-cell
					width: 56px
					vertical-align: middle
					text-align: center
					border-1px(rgba(7,17,27,0.1))
					font-size: 12px
			
		.foods-wrapper
			flex: 1
			.title
				padding-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dde1
				font-size: 12px
				color: rgb(147, 153, 159)
				background: #f3f5f7
			.food-item
				display: flex
				margin-top: 18px 
				padding-bottom: 18px
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border-none()
				.icon
					flex: 0 0 57px
					margin-right: 10px
					margin-left: 18px
					img
						width: 57px
						height: 57px
				.content
					flex: 1
					.name
						margin: 2px 0 8px 0
						height: 14px
						line-height: 14px
						font-size: 14px
						color: rgb(7,17,27)
					.desc, .extra
						font-size: 10px
						color: rgb(147, 153, 159)
					.desc
						margin-bottom: 8px
						line-height: 12px
					.extra
						line-height: 10px
						.count
							margin-right: 12px
							
					.price
						font-weight: 700
						line-height: 24px
						.now
							margin-right: 8px
							line-height: 14px
							color: rgb(240, 20, 20)
						.old
							text-decoration: line-through
							color: rgb(147, 153, 159)
							font-size: 10px
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 12px
			
</style>