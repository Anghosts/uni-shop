<template>
	<view class="cart">
		<template v-if="cart && cart.length !== 0">
			<my-address></my-address>
			<view class="cart-title">
				<uni-icons type="shop" size="18"></uni-icons>
				<text>购物车</text>
			</view>
			<uni-swipe-action>
				<uni-swipe-action-item 
					v-for="goods in cart" 
					:right-options="options" 
					@click="swipeActionClickHandler(goods)"
					:key="goods.goods_id" 
				>
					<my-goods
						:goods="goods" 
						:showRadio="true"
						:showCount="true"
						@radio-change="radioChangeHandler"
						@count-change="countChangeHandler"
					></my-goods>
				</uni-swipe-action-item>
			</uni-swipe-action>
			<my-settle></my-settle>
		</template>
		
		<view class="empty-cart" v-else>
			<text class="tip">空空如也~</text>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import { mapState,mapMutations } from 'vuex'
	
	export default {
		data() {
			return {
				options: [{
					text: '删除', // 显示的文本内容
					style: {
						backgroundColor: '#C00000' // 按钮的背景颜色
					}
				}]
			};
		},
		mixins: [badgeMix],
		computed: {
			...mapState('m_cart', ['cart']),
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			
			// 商品勾选状态变化
			radioChangeHandler(goods) {
				this.updateGoodsState(goods)
			},
			// 商品数量变化
			countChangeHandler(goods) {
				this.updateGoodsCount(goods)
			},
			swipeActionClickHandler(goods) {
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
.cart {
	padding-bottom: 50px;
	.cart-title {
		display: flex;
		align-items: center;
		padding-left: 5px;
		height: 40px;
		font-size: 14px;
		border-bottom: 1px solid #efefef;
		text {
			margin-left: 10px;
		}
	}
	.empty-cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;
		.tip {
			font-size: 14px;
			color: gray;
		}
	}
}
</style>
