import App from './App'
import store from './store/store.js'

// 网络请求
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
$http.baseUrl = 'https://www.uinav.com'

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
		title: '加载中...',
	})
	
	if (options.url.indexOf('/my/') !== -1) {
		// 添加请求头
		options.header ={
			Authorization: store.state.m_user.token
		}
	}
}
// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()
}

// 提示消息
uni.$showMsg = function(title='数据请求失败！', duration=1500, icon='none') {
	uni.showToast({
		title: title,
		duration: duration,
		icon: icon,
	})
}

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
		store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif