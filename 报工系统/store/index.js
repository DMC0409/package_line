import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		vuex_Wifi: false,
		vuex_TipModal: {
			isShow: false, //是否显示
			tipText: '', // 提示信息
			tipIcon: '', // 图标名称
			mark: true, // 是否有蒙版
			duration: -1, // 持续时间
			mode:'' // 弹窗模式 self-系统发起 custom-用户发起
		},
		vuex_Console: []
	},
	mutations: {
		// 更新wifi状态
		UPDATE_WIFI(state, data) {
			state.vuex_Wifi = data
		},
		// 更新提示框信息
		UPDATE_TIPMODAL(state, data) {
			state.vuex_TipModal = data
		},
		// 更新控制台信息
		UPDATE_CONSOLE(state, data) {
			state.vuex_Console = data
		}
	}
})
export default store