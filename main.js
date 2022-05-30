
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
//按需导入http对象
import {$http} from '@escook/request-miniprogram'
uni.$http=$http
$http.baseUrl = 'https://api-ugo-web.itheima.net'
//请求拦截器
$http.beforeRequest=function(options){
  //显示加载图标
  uni.showLoading({
  	title: '加载中......'
  });
}
//响应拦截
$http.afterRequest=function(){
  //关闭提示框
  uni.hideLoading()
}

//封装一个$showMessage方法
uni.$showMsg=function(title="数据加载失败",duration="1500"){
   uni.showToast({
   	title,
   	duration,
    icon:'none'
   });
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif