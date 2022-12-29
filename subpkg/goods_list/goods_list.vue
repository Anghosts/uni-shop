<template>
	<view class="goods-list">
		<view class="goods-item"  v-for="(goods,index) in goodsList" :key="goods.cat_id" @click="gotoDetail(goods)">
			<view class="goods-item-left">
				<image :src="goods.goods_small_logo || defaultPic"></image>
			</view>
			<view class="goods-item-right">
				<view class="goods-name">
					<text>{{goods.goods_name}}</text>
				</view>
				<view class="goods-price">
					<text>&yen; {{goods.goods_price | tofixed}}</text>
				</view>
			</view>
		</view>
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
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png', // 默认显示的图片
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
		filters: {
			// 把数字处理为带两位小数点的数字
			tofixed(num) {
				return Number(num).toFixed(2)
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
