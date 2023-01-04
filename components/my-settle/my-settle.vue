<template>
	<view class="my-settle-container">
		<label class="radio" @click="changeAllState">
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
		</label>
		<view class="amount">
			合计：<text>&yen;{{checkedGoodsAmount}}</text>
		</view>
		<view class="btn-settle" @click="settlement">结算 ({{checkedCount}})</view>
	</view>
</template>

<script>
	import { mapGetters,mapMutations,mapState } from 'vuex'
	
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
			},
			// 结算按钮
			settlement() {
				if (!this.token) return uni.$showMsg('请先登录！')
				if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
				if (!this.addstr) return uni.$showMsg('请选择收货地址！') 
				
				uni.$showMsg('此功能正在开发中...')
				// 微信支付
				// this.payOrder()
			},
			// 微信支付
			async payOrder() {
				console.log('正在微信支付')
				// 组织订单的信息对象
				const orderInfo = {
					order_price: 0.01,
					consignee_addr: this.addstr,
					goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
				}
				// 发起请求创建订单
				const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				// 得到服务器响应的“订单编号”
				const orderNumber = res.message.order_number
				console.log('创建订单成功')
				// 发起请求获取订单的支付信息
				const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
				// 预付订单生成失败
				if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
				// 得到订单支付相关的必要参数
				const payInfo = res2.message.pay
				console.log('预付订单生成失败成功')
				// 发起微信支付
				// 调用 uni.requestPayment() 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				// 未完成支付
				if (err) return uni.$showMsg('订单未支付！')
				// 完成了支付，进一步查询支付的结果
				const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				// 检测到订单未支付
				if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				// 检测到订单支付完成
				uni.showToast({
					title: '支付完成！',
					icon: 'success'
				})
			}
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
			...mapGetters('m_user', ['addstr']),
			...mapState('m_user', ['token']),
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