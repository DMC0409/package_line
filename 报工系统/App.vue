<script>
	export default {
		data() {
			return {
				timer: null,
			}
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			// 检查wifi
			this.timer = setInterval(async () => {
				await this.onCheckNet()
			}, 60 * 1000);
		},
		onHide: function() {
			console.log('App Hide')
			clearInterval(this.timer)
		},
		methods: {
			async onCheckNet() {
				if (uni.getStorageSync('mySysId')) {
					this.$api({
							url: '/api/data.php',
							method: 'post',
							data: {
								api_class: 'Open_sopEquipmentClass',
								need_type: 'checkNetOnLineFun',
								mySysId: uni.getStorageSync('mySysId'),
							}
						}).then(res => {})
						.catch(err => {
							console.log(err)
						})
				}

			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import 'static/css/common.scss'
</style>
