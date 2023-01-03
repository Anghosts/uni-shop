export default {
	namespaced: true,
	state: () => ({
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	mutations: {
		// 添加购物车操作
		addToCart(state, goods) {
			// 根据提交的商品ID，查询购物车中是否存在这件商品
			const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
			if (!findResult) {
				// 不存在，添加
				state.cart.push(goods)
			} else {
				// 存在则添加数量
				findResult.goods_count++
			}
			
			this.commit('m_cart/saveToStorage')
		},
		// 将购物车中的数据持久化存储到本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新购物车中商品的勾选状态
		updateGoodsState(state, goods) {
			const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_state = goods.goods_state
				this.commit('m_cart/saveToStorage')
			}
		},
		// 更新购物车中商品的数量
		updateGoodsCount(state, goods) {
			const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_count = goods.goods_count
				this.commit('m_cart/saveToStorage')
			}
		},
		// 删除购物车中的商品
		removeGoodsById(state, goods_id) {
			state.cart = state.cart.filter(item => item.goods_id !== goods_id)
			this.commit('m_cart/saveToStorage')
		},
		// 更新所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			state.cart.forEach(item => item.goods_state = newState)
			this.commit('m_cart/saveToStorage')
		}
	},
	getters: {
		// 统计购物车中商品的总数量
		total(state) {
			let count = 0
			state.cart.forEach(item => count += item.goods_count)
			return count
		},
		// 勾选的商品的总数量
		checkedCount(state) {
			return state.cart.filter(item => {
				return item.goods_state
			}).reduce((total, item) => total += item.goods_count, 0)
		},
		// 合计总价
		checkedGoodsAmount(state) {
			return state.cart.filter(item => item.goods_state)
											 .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
											 .toFixed(2)
		}
	}
}