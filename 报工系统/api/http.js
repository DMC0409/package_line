import {
	baseURL
} from './base.js'
import store from '../store/index.js'

export const myRequest = (options) => {
	return new Promise((resolve, reject) => {
		var sendData = options.data || {};
		console.log('send data:', sendData)
		//显示加载框
		uni.showLoading({
			title: '加载中'
		});
		// 显示遮罩层
		store._mutations['UPDATE_REQUEST'][0](true)
		uni.request({
			url: baseURL + options.url, //接口地址：前缀+方法中传入的地址
			method: options.method || 'GET', //请求方法：传入的方法或者默认是“GET”
			data: options.data || {}, //传递参数：传入的参数或者默认传递空集合
			headers: {
				'Content-Type ': 'text/html;charset=utf-8'
			},
			success: (res) => {
				console.log('响应成功', res)
				//隐藏加载框
				uni.hideLoading();
				// 关闭遮罩层
				store._mutations['UPDATE_REQUEST'][0](false)
				//返回的数据（不固定，看后端接口，这里是做了一个判断，如果不为true，用uni.showToast方法提示获取数据失败)
				if (typeof(res.data) != 'object') {
					uni.showToast({
						title: '网络接口错误',
						icon: 'error',
						duration: 2000
					})
					reject(res)
				} else if (typeof(res.data) == 'object') {
					if (res.data.sign != 1) {
						uni.showToast({
							title: res.data.info,
							icon: 'error',
							duration: 2000
						})
						reject(res)
					} else {
						resolve(res)
					}
				}
			},
			// 这里的接口请求，如果出现问题就输出接口请求失败
			fail: (err) => {
				console.log(err)
				uni.showToast({
					title: '请检查网络连接',
					icon: 'error',
					duration: 2000
				})
				//隐藏加载框
				uni.hideLoading();
				// 关闭遮罩层
				store._mutations['UPDATE_REQUEST'][0](false)
				reject(err)
			}
		})
	})
}
