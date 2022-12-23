import App from './App'

// 网络请求
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
$http.baseUrl = 'https://www.uinav.com'

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  wx.showLoading({
		title: '加载中...',
	})
}
// 请求完成之后做一些事情
$http.afterRequest = function () {
  wx.hideLoading()
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
    ...App
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