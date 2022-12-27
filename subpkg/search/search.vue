<template>
	<view class="search-container">
		<uni-search-bar 
			class="uni-search" 
			radius="15" 
			placeholder="请输入搜索内容" 
			clearButton="auto" 
			cancelButton="none" 
			bgColor="#fff"
			@input="input" />
			<view class="sugg-list">
				<view class="sugg-item" v-for="goods in searchResult" :key="goods.goods_id" @click="gotoDetail(goods.goods_id)">
					<view class="goods-name">{{goods.goods_name}}</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null, // 防抖定时器
				keyword: '', // 搜索关键字
				searchResult: [], // 搜索结果列表
			};
		},
		methods: {
			input(value) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.keyword = value
					this.getSearchResult()
				},500)
			},
			/**
			 * 获取搜索结果
			 */
			async getSearchResult() {
				if (!this.keyword) {
					this.searchResult = []
					return
				}
				const {data: result} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.keyword})
				if (result.meta.status !== 200) return uni.$showMsg()
				this.searchResult = result.message
			},
			// 跳转商品详情页面
			gotoDetail(goods_id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.search-container {
		position: sticky;
		top: 0;
		z-index: 100;
		.sugg-list {
			padding: 0 10rpx;
			.sugg-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24rpx 0;
				border-bottom: 1px solid #efefef;
				.goods-name {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-right: 6rpx;
					font-size: 12px;
				}
			}
		}
	}

</style>
