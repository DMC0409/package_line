<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				timer: null,
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			plus.screen.lockOrientation('landscape-primary'); //锁定屏幕为横屏
		},
		onShow: function() {
			console.log('App Show')
			// 开启wifi功能模块
			uni.startWifi({
				success: (res) => {
					// 获取当前使用的wifi
					this.onCheckNet()
				},
				fail: (err) => {
					// 修改网络状态为离线
					this.UPDATE_WIFI(false)
					this.$utils.judgeWifiState(err)
				}
			})
			// 检查wifi
			this.timer = setInterval(async () => {
				await this.onCheckNet()
			}, 60 * 1000);
		},
		onHide: function() {
			console.log('App Hide')
			clearInterval(this.timer)
			uni.stopWifi({
				success: (res) => {},
				fail: (err) => {}
			})
		},
		methods: {
			...mapMutations(['UPDATE_WIFI']),
			async onCheckNet() {
				// 获取已连接wifi信息
				uni.getConnectedWifi({
					success: (res) => {
						console.log(res)
						// 修改网络状态为在线
						this.UPDATE_WIFI(true)
					},
					fail: (err) => {
						console.log(err)
						// 修改网络状态为离线
						this.UPDATE_WIFI(false)
						this.$utils.judgeWifiState(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import 'static/css/common.scss';
	@import './font/iconfont/iconfont.css';
	/* 只更改一个动画的持续时间 */
	.animate__animated.animate__bounceIn,.animate__animated.animate__fadeOut {
	  --animate-duration: .5s;
	}
</style>