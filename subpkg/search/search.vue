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
			<view class="sugg-list" v-if="searchResult.length !== 0">
				<view class="sugg-item" v-for="goods in searchResult" :key="goods.goods_id" @click="gotoDetail(goods.goods_id)">
					<view class="goods-name">{{goods.goods_name}}</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="history" v-else>
				<view class="history-title">
					<text>搜索历史</text>
					<uni-icons type="trash" size="20" @click="cleanHistory"></uni-icons>
				</view>
				<view class="history-list">
					<uni-tag :text="kw" v-for="(kw,index) in historys" :key="index" :inverted="true" @click="gotoGoodsList(kw)"></uni-tag>
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
				historyList: [], // 搜索历史记录
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
				// 过滤关键字为空的情况
				if (!this.keyword) {
					this.searchResult = []
					return
				}
				const {data: result} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.keyword})
				if (result.meta.status !== 200) return uni.$showMsg()
				this.searchResult = result.message
			},
			/**
			 * 跳转商品详情页面
			 */
			gotoDetail(goods_id) {
				// 保存搜索历史
				this.saveSearchHistory()
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			/**
			 * 跳转商品列表页面
			 */
			gotoGoodsList(kw) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
			},
			/**
			 * 保存搜索历史
			 */
			saveSearchHistory() {				
				// 解决关键字重复的问题
				const set = new Set(this.historyList)
				set.delete(this.keyword)
				set.add(this.keyword)
				this.historyList = Array.from(set)
				
				// 将搜索历史持久化存储到本地
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			/**
			 * 清空搜索历史
			 */
			cleanHistory() {
				this.historyList = []
				uni.setStorageSync('kw', '[]')
			}
		},
		computed: {
			historys() {
				return [...this.historyList].reverse()
			}
		},
		onLoad() {
			// 读取历史记录
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
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
		.history {
			padding: 0 10rpx;
			.history-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 10px;
				height: 40px;
				border-bottom: 1px solid #efefef;
				text {
					font-size: 14px;
				}
			}
			.history-list {
				display: flex;
				flex-wrap: wrap;
				margin-top: 5px;
				.uni-tag {
					margin-top: 5px;
					margin-right: 5px;
				}
			}
		}
	}

</style>
