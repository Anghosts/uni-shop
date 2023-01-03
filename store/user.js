export default {
	namespaced: true,
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
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