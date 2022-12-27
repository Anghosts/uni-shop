<template>
	<view class="my-search-container">
		<!-- 使用 view 组件模拟 input 输入框的样式 -->
		<view class="my-search-box" @click="$emit('click')">
			<uni-icons type="search" size="18"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.my-search-container {
	display: flex;
	padding: 10px;
	background-color: #c00000;
	.my-search-box {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 36px;
		width: 100%;
		border-radius: 15px;
		background-color: #fff;
	}
	.placeholder {
		margin-left: 5px;
		color: #666;
		font-size: 14px;
	}
}
</style>