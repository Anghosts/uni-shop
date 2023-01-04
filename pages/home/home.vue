<template>
	<view>
		<view class="search">
			<my-search @click="gotoSearch"></my-search>
		</view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="header-swiper">
			<swiper-item v-for="img in swiperList" :key="img.goods_id">
				<navigator :url="`/subpkg/goods_detail/goods_detail?goods_id=${img.goods_id}`">
					<image :src="img.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<view class="nav-list">
			<view class="nav-item" v-for="(nav,index) in navList" :key="index" @click="navClickHandler(nav)">
				<image :src="nav.image_src"></image>
			</view>
		</view>
		<view class="floor-list">
			<view class="floor-item" v-for="(floor,index) in floorList" :key="index">
				<image :src="floor.floor_title.image_src" class="floor-title"></image>
				<view class="floor-image-box">
					<navigator class="left-image-box" :url="floor.product_list[0].url">
						<image :src="floor.product_list[0].image_src" :style="{width:floor.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<view class="right-image-box">
						<navigator class="right-image-item" v-for="(rimage,index2) in floor.product_list" :key="index2" v-if="index2 !== 0" :url="rimage.url">
							<image :src="rimage.image_src" mode="widthFix" :style="{width:rimage.image_width + 'rpx'}"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	
	export default {
		mixins: [badgeMix],
		data() {
			return {
				swiperList: [],	// 轮播图数据
				navList: [], // 分类导航数据
				floorList: [],  // 楼层数据
			};
		},
		methods: {
			/**
			 * 获取轮播图数据
			 */
			async getSwiperList() {
				const {data: result} = await uni.$http.get('/api/public/v1/home/swiperdata')
				if (result.meta.status !== 200) return uni.$showMsg()
				this.swiperList = result.message
			},
			/**
			 * 获取分类导航数据
			 */
			async getNavList() {
				const {data: result} = await uni.$http.get('/api/public/v1/home/catitems')
				if (result.meta.status !== 200) return uni.$showMsg()
				this.navList = result.message
			},
			/**
			 * 获取分类导航数据
			 */
			async getFloorList() {
				const {data: result} = await uni.$http.get('/api/public/v1/home/floordata')
				if (result.meta.status !== 200) return uni.$showMsg()
				
				result.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				
				this.floorList = result.message
			},
			// 分类导航点击事件回调
			navClickHandler(nav) {
				if (nav.name == '分类') {
					uni.switchTab({ url: '/pages/cate/cate' })
				}
			},
			// 跳转搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		}
	}
</script>

<style lang="scss">
	.search {
		position: sticky;
		top: 0;
		z-index: 100;
	}
	.header-swiper {
		height: 330rpx;
		swiper-item {
			navigator,image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.nav-list {
		display: flex;
		justify-content: space-between;
		margin: 15px 0;
		.nav-item {
			flex: 1;
			text-align: center;
			image {
				width: 128rpx;
				height: 140rpx;
			}
		}
	}
	.floor-list {
		.floor-item {
			padding: 15rpx;
			.floor-title {
				display: flex;
				width: 100%;
				height: 60rpx;
			}
			.floor-image-box {
				display: flex;
				.right-image-box {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					margin-left: 10rpx;
					.right-image-item {
						image {
							width: 100%;
							height: 100%;							
						}
					}
				}
			}
		}
	}
</style>
