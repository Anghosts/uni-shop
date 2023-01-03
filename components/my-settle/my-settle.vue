<template>
	<view class="my-settle-container">
		<label class="radio" @click="changeAllState">
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
		</label>
		<view class="amount">
			合计：<text>&yen;{{checkedGoodsAmount}}</text>
		</view>
		<view class="btn-settle">结算 ({{checkedCount}})</view>
	</view>
</template>

<script>
	import { mapGetters,mapMutations } from 'vuex'
	
	export default {
		name:"my-settle",
		data() {
			return {
				
			};
		},
		methods: {
			...mapMutations('m_cart', ['updateAllGoodsState']),
			// 全选 label 的点击事件
			changeAllState() {
				this.updateAllGoodsState(!this.isFullCheck)
			},
			// 设置购物车角标的数值
			setBadge() {
				uni.setTabBarBadge({
					index: 2,
					text: this.total + ''
				})
			}
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
			// 是否全选
			isFullCheck() {
				return this.total === this.checkedCount
			}
		},
		watch: {
			total() {
				this.setBadge()
			}
		}
	}
</script>

<style lang="scss">
.my-settle-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 100;
	padding-left: 5px;
	height: 50px;
	font-size: 14px;
	border-top: 1px solid #f0f0f0;
	background-color: white;
	
	.radio {
		display: flex;
		align-items: center;
	}
	.amount {
		text {
			font-size: 16px;
			color: #c00000;
		}
	}
	.btn-settle {
		padding: 0 10px;
		height: 50px;
		min-width: 100px;
		line-height: 50px;
		text-align: center;
		color: white;
		border-top: 1px solid #c00000;
		background-color: #c00000;
	}
}
</style>