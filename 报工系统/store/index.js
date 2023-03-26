import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		vuex_Wifi: false
	},
	mutations: {
		// 更新wifi状态
		UPDATE_WIFI(state, data) {
			state.vuex_Wifi = data
		}
	}
})
export default store