import {
	baseURL
} from './base.js'
import store from '../store/index.js'

export const myRequest = (options) => {
	let TIME = undefined
	return new Promise((resolve, reject) => {
		// 统一添加访问标识
		options.data.isSopRequest = '1'
		console.log('send data:', options.data)
		// 访问wifi是否在线或者系统未登录时访问wifi是否在线，则显示loading
		if (options.data.need_type != 'checkNetOnLineFun' || !uni.getStorageSync('mySysId')) {
			// 提示加载中
			store._mutations['UPDATE_TIPMODAL'][0]({
				isShow: true,
				tipText: '加载中', // 提示信息
				tipIcon: 'iconloading', // 图标名称
				mark: true, // 是否有蒙版
				duration: 0, // 持续时间
			})
		}
		TIME = setTimeout(() => {
			uni.request({
				url: baseURL + options.url, //接口地址：前缀+方法中传入的地址
				method: options.method || 'GET', //请求方法：传入的方法或者默认是“GET”
				data: options.data || {}, //传递参数：传入的参数或者默认传递空集合
				headers: {
					'Content-Type ': 'text/html;charset=utf-8'
				},
				success: (res) => {
					// 清除计时器
					clearTimeout(TIME)
					console.log('响应成功', res)
					//返回的数据（不固定，看后端接口，这里是做了一个判断，如果不为true，提示获取数据失败)
					if (typeof(res.data) != 'object') {
						// 提示网络接口错误
						store._mutations['UPDATE_TIPMODAL'][0]({
							isShow: true,
							tipText: '网络接口错误', // 提示信息
							tipIcon: 'iconshibai', // 图标名称
							mark: true, // 是否有蒙版
							duration: 2000, // 持续时间
						})
						reject(res)
					} else if (typeof(res.data) == 'object') {
						if (res.data.sign != 1) {
							// 错误提示
							store._mutations['UPDATE_TIPMODAL'][0]({
								isShow: true,
								tipText: res.data.info, // 提示信息
								tipIcon: 'iconshibai', // 图标名称
								mark: true, // 是否有蒙版
								duration: 2000, // 持续时间
							})
							reject(res)
						} else {
							resolve(res)
						}
					}
					// 关闭提示加载中
					store._mutations['UPDATE_TIPMODAL'][0]({
						isShow: false,
						tipText: '', // 提示信息
						tipIcon: '', // 图标名称
						mark: true, // 是否有蒙版
						duration: 0, // 持续时间
					})
				},
				// 这里的接口请求，如果出现问题就输出接口请求失败
				fail: (err) => {
					console.log(err)
					// 清除计时器
					clearTimeout(TIME)
					// 提示网络接口错误
					store._mutations['UPDATE_TIPMODAL'][0]({
						isShow: true,
						tipText: '网络接口错误', // 提示信息
						tipIcon: 'iconshibai', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
					})
					reject(err)
				}
			})
		}, 1500)
	})
}