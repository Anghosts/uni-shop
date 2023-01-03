<template>
	<view class="goods-item" @click="$emit('click')">
		<view class="goods-item-left">
			<radio color="#C00000" v-if="showRadio" :checked="goods.goods_state" @click="radioClickHandler"></radio>
			<image :src="goods.goods_small_logo || defaultPic"></image>
		</view>
		<view class="goods-item-right">
			<view class="goods-name">
				<text>{{goods.goods_name}}</text>
			</view>
			<view class="goods-info">
				<view class="goods-price">
					<text>&yen; {{goods.goods_price | tofixed}}</text>
				</view>
				<uni-number-box 
					:min="1" 
					:value="goods.goods_count" 
					v-if="showCount"
					@change="countChangeHandler"
				></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-goods",
		data() {
			return {
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png', // 默认显示的图片
			};
		},
		props: {
			goods: {
				type: Object,
				default: {}
			},
			showRadio: {
				type: Boolean,
				default: false
			},
			showCount: {
				type: Boolean,
				default: false
			}
		},
		filters: {
			// 把数字处理为带两位小数点的数字
			tofixed(num) {
				return Number(num).toFixed(2)
			}
		},
		methods: {
			// radio 组件点击事件
			radioClickHandler() {
				this.$emit('radio-change', {
					goods_id: this.goods.goods_id,
					goods_state: !this.goods.goods_state
				})
			},
			// NumberBox 组件的 change 事件
			countChangeHandler(count) {
				this.$emit('count-change', {
					goods_id: this.goods.goods_id,
					goods_count: +count
				})
			}
		}
	}
</script>

<style lang="scss">
.goods-item {
	display: flex;
	padding: 20rpx 10rpx;
	width: 750rpx;
	box-sizing: border-box;
	border-bottom: 1px solid #f0f0f0;
	.goods-item-left {
		display: flex;
		justify-content: space-between;
		align-items: center;
		image {
			display: block;
			width: 200rpx;
			height: 100px;
		}
	}
	.goods-item-right {
		margin-left: 14rpx;
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		.goods-name {
			font-size: 14px;
		}
		.goods-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.goods-price {
				font-size: 18px;
				font-weight: bold;
				color: #c00000;
			}
		}
	}
}
</style>