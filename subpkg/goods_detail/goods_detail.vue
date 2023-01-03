<template>
	<view v-if="goods_info.goods_name" class="goods-detail">
		<!-- 轮播图区域 -->
		<swiper 
			:indicator-dots="true" 
			:autoplay="true" 
			:interval="3000" 
			:circular="true"
			class="swiper"
		>
			<swiper-item v-for="(pic,index) in goods_info.pics" :key="pic.pics_id">
				<image :src="pic.pics_big" @click="preview(index)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
		  <!-- 商品价格 -->
		  <view class="price">￥{{goods_info.goods_price}}</view>
		  <!-- 信息主体区域 -->
		  <view class="goods-info-body">
		    <!-- 商品名称 -->
		    <view class="goods-name">{{goods_info.goods_name}}</view>
		    <!-- 收藏 -->
		    <view class="favi">
		      <uni-icons type="star" size="18" color="gray"></uni-icons>
		      <text>收藏</text>
		    </view>
		  </view>
		  <!-- 运费 -->
		  <view class="yf">快递：免运费</view>
		</view>
		<!-- 商品详情信息 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		<view class="goods-nav">
			<uni-goods-nav 
				:fill="true" 
				:options="options"
				:buttonGroup="buttonGroup" 
				@click="onClick" 
				@buttonClick="buttonClick"
			></uni-goods-nav>
		</view>
	</view>
</template>

<script>
	import { mapState,mapMutations,mapGetters } from 'vuex'
	
	export default {
		data() {
			return {
				goods_info: {}, // 商品详情数据
				// 左侧按钮组的配置对象
				options: [{
					icon: 'shop',
					text: '店铺'
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				// 右侧按钮组的配置对象
				buttonGroup: [{
					text: '加入购物车',
					backgroundColor: '#ff0000',
					color: '#fff'
				},
				{
					text: '立即购买',
					backgroundColor: '#ffa200',
					color: '#fff'
				}]
			};
		},
		methods: {
			...mapMutations('m_cart', ['addToCart']),
			
			async getGoodsDetail(goods_id) {
				const {data:result} = await uni.$http.get('/api/public/v1/goods/detail', { goods_id })
				if (result.meta.status !== 200) return uni.$showMsg()
				
				// 解决图片底板空白间隙问题
				result.message.goods_introduce = result.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
				this.goods_info = result.message
			},
			// 轮播图预览图片效果
			preview(index) {
				uni.previewImage({
					current: index,
					urls: this.goods_info.pics.map(item => item.pics_big)
				})
			},
			// 底部导航栏左侧按钮点击事件
			onClick(e) {
				// 切换购物车页面
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			// 底部导航栏右侧按钮点击事件
			buttonClick(e) {
				// 加入购物车 按钮
				if (e.content.text === '加入购物车') {
					const goods = {
						goods_id: this.goods_info.goods_id,       // 商品的Id
						goods_name: this.goods_info.goods_name,   // 商品的名称
						goods_price: this.goods_info.goods_price, // 商品的价格
						goods_count: 1,                           // 商品的数量
						goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
						goods_state: true                         // 商品的勾选状态
					}
					this.addToCart(goods)
				}
			}
		},
		computed: {
			...mapState('m_cart', ['cart']),
			...mapGetters('m_cart', ['total'])
		},
		watch: {
			// 监听购物车的商品总数量的值
			total: {
				immediate: true,
				handler(newVal) {
					const findResult = this.options.find(item => item.text === '购物车')
					if (findResult) {
						findResult.info = newVal
					}
				}
			}
		},
		onLoad(options) {
			const goods_id = options.goods_id
			this.getGoodsDetail(goods_id)
		}
	}
</script>

<style lang="scss">
.goods-detail {
	padding-bottom: 50px;
}

.swiper {
	height: 750rpx;
	image {
		width: 100%;
		height: 100%;
	}
}

.goods-info-box {
  padding: 10px;
  padding-right: 0;
  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
		font-weight: bold;
  }
  .goods-info-body {
    display: flex;
    justify-content: space-between;
    .goods-name {
      font-size: 13px;
      padding-right: 10px;
    }
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }
  .yf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
}
.goods-nav {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
