import Vue from 'vue'
import Vuex from 'vuex'

import moduleCart from './cart.js'
import modultUser from './user.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		m_cart: moduleCart,
		m_user: modultUser
	}
})

export default store