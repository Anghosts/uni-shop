export default {
	namespaced: true,
	state: () => ({
		// 收货地址信息
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 用户 token
		token: uni.getStorageSync('token') || '',
		// 用户信息
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}')
	}),
	mutations: {
		// 更新收货地址
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		// 将 address 地址信息持久化存储到本地
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		// 更新用户的信息
		updateUserInfo(state, userInfo) {
			state.userInfo = userInfo
			this.commit('m_user/saveUserInfoToStorage')
		},
		// 将用户信息持久化存储到本地
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		// 更新 token
		updateToken(state, token) {
			state.token = token
			this.commit('m_user/saveTokenToStorage')
		},
		// 将 token 持久化存储到本地
		saveTokenToStorage(state) {
			uni.setStorageSync('token', state.token)
		}
	},
	getters: {
		// 收货详细地址
		addstr(state) {
			if (!state.address.provinceName) return ''
				return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	}
}