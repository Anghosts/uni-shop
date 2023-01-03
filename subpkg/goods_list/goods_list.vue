<template>
	<view class="goods-list">
		<my-goods 
			:goods="goods" 
			v-for="(goods,index) in goodsList" 
			:key="i"
			@click="gotoDetail(goods)"
		></my-goods>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				query: { // 请求参数对象
					query: '', // 查询关键字
					cid: '', // 商品分类id
					pagenum: 1, // 页码值
					pagesize: 10 // 每页显示几条数据
				},
				goodsList: [], // 商品列表数据
				total: 0, // 总数量
				isLoading: false, // 请求数据的状态
			};
		},
		methods: {
			async getGoodsList(cb) {
				this.isLoading = true // 节流阀开启
				const {data: result} = await uni.$http.get('/api/public/v1/goods/search', this.query)
				this.isLoading = false // 节流阀关闭
				cb && cb()
				
				if (result.meta.status !== 200) return uni.$showMsg()
				// 将新数据与旧数据合并
				this.goodsList = [...this.goodsList, ...result.message.goods]
				this.total = result.message.total
			},
			// 跳转商品详情页面
			gotoDetail(goods) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		},
		onLoad(options) {
			this.query.query = options.query || ''
			this.query.cid = options.cid || ''
			this.getGoodsList()
		},
		// 上拉触底事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if (this.query.pagenum * this.query.pagesize >= this.total) return uni.$$showMsg('已经到底了')
			// 判断是否正在请求其他数据，如果是，则不发起额外的请求
			if (this.isLoading) return
			this.query.pagenum += 1
			this.getGoodsList()
		},
		// 下拉刷新事件
		onPullDownRefresh() {
			this.query.pagenum = 1
			this.total = 0
			this.isLoading = false
			this.goodsList = []
			this.getGoodsList(()=>uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
.goods-list {
	.goods-item {
		display: flex;
		padding: 20rpx 10rpx;
		border-bottom: 1px solid #f0f0f0;
		.goods-item-left {
			image {
				display: block;
				width: 200rpx;
				height: 100px;
			}
		}
		.goods-item-right {
			margin-left: 14rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.goods-name {
				font-size: 14px;
			}
			.goods-price {
				font-size: 18px;
				font-weight: bold;
				color: #c00000;
			}
		}
	}
}
</style>
