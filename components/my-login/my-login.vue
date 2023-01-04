<template>
	<view class="login-container">
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo','updateToken']),
			// 获取用户的基本信息
			getUserInfo(e) {
				if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权')
				this.updateUserInfo(e.detail.userInfo)
				this.getToken(e.detail)
			},
			// 获取 token
			async getToken(info) {
				// 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err)
				if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败')
				
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				// (接口不可用)
				// const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				// if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败')
				
				// 保存 token
				// this.updateToken(loginResult.message.token)
				this.updateToken(res.code)
			}
		}
	}
</script>

<style lang="scss">
.login-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
	height: 750rpx;
	background-color: #f8f8f8;
	
	&::after {
		content: '';
		display: block;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		transform: translateY(50%);
		height: 40px;
		border-radius: 100%;
		background-color: #fff;
	}
	
	.btn-login {
		margin: 15px 0;
		width: 90%;
		border-radius: 100px;
		background-color: #c00000;
	}
	
	.tips-text {
		font-size: 14px;
		color: gray;
	}
}
</style>