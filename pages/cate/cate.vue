<template>
	<view>
		<view class="scroll-view-container">
			<scroll-view scroll-y class="left-scroll-view" :style="{height: wh + 'px'}">
				<view 
					class="left-scroll-view-item" 
					v-for="(cate,index) in cateList" 
					:key="cate.cat_id" 
					:class="{active: active==index}"
					@click="activeChanged(index)"
				>{{cate.cat_name}}</view>
			</scroll-view>
			<scroll-view scroll-y class="right-scroll-view" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view 
					class="right-scroll-view-item"
					v-for="cate2 in cateLevel2"
					:key="cate2.cat_id"
				>
					<view class="cate-lv2-title">/ {{cate2.cat_name}} /</view>
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="cate3 in cate2.children" :key="cate3.cat_id" @click="gotoGoodsList(cate3)">
							<image :src="cate3.cat_icon"></image>
							<text>{{cate3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: 0, // 选中的分类项
				wh: 0, // 高度
				cateList: [], // 分类数据
				cateLevel2: [], // 二级分类数据
			};
		},
		methods: {
			/**
			 * 获取分类数据
			 */
			async getCateList() {
				const {data: result} = await uni.$http.get('/api/public/v1/categories')
				if (result.meta.status !== 200) return uni.$showMsg()
				this.cateList = result.message
				this.cateLevel2 = result.message[0].children
			},
			// 分类项切换
			activeChanged(index) {
				this.active = index
				this.cateLevel2 = this.cateList[index].children
			},
			// 跳转商品列表页面
			gotoGoodsList(cate3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + cate3.cat_id
				})
			}
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			// 为 wh 窗口可用高度动态赋值
			this.wh = sysInfo.windowHeight
			this.getCateList()
		}
	}
</script>

<style lang="scss">
.scroll-view-container {
	display: flex;
	// 左侧一级分类
	.left-scroll-view {
		width: 120px;
		background-color: #f7f7f7;
		.left-scroll-view-item {
			line-height: 60px;
			text-align: center;
			font-size: 14px;
			&.active {
				position: relative;
				background-color: #fff;
				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 3px;
					height: 30px;
					background-color: #c00000;
				}
			}
		}
	}
	
	// 右侧二级分类
	.right-scroll-view {
		.right-scroll-view-item {
			.cate-lv2-title{
				padding: 10px 0;
				text-align: center;
				font-weight: bold;
				font-size: 14px;
			}
			.cate-lv3-list {
				display: flex;
				flex-wrap: wrap;
				.cate-lv3-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-bottom: 10px;
					text-align: center;
					width: 33.3%;
					image {
						width: 60px;
						height: 60px;
						border: 1px solid #ccc;
					}
					text {
						margin-top: 5px;
						font-size: 12px;
					}
				}
			}
		}
	}
}
</style>
