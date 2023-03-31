import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		vuex_Wifi: false,
		vuex_Requeset: false
	},
	mutations: {
		// 更新wifi状态
		UPDATE_WIFI(state, data) {
			state.vuex_Wifi = data
		},
		// 更新遮罩层状态
		UPDATE_REQUEST(state, data) {
			state.vuex_Requeset = data
		},
	}
})
export default store
