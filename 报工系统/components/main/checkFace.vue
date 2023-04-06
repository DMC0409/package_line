<template>
	<view class="outBorder"></view>
</template>

<script>
	// 直播流查看权限
	import permission from '../../utils/permission.js'
	export default {
		data() {
			return {
				pusher: null,
				scanWin: null,
				faceInitTimeout: null,
				snapshTimeout: null,
				uploadFileTask: null,
				faceCheckNum: 0,
				currentWebview: null,

				screamWidth: 0,
				screamHeight: 0,
			}
		},
		props: ['dataDetailAllList'],
		mounted() {
			// 获取屏幕宽高
			let that = this
			uni.getSystemInfo({
				success: function(res) {
					that.screamWidth = res.windowWidth;
					that.screamHeight = res.windowHeight;
					that.faceInit()
				}
			});
		},
		methods: {
			//初始化
			faceInit() {
				//显示加载框
				uni.showLoading({
					title: '加载中'
				});
				this.faceCheckNum = 0
				this.faceInitTimeout = setTimeout(async () => {
					//创建livepusher
					if (uni.getSystemInfoSync().platform === 'android') {
						const data1 = await permission.requestAndroidPermission(
							"android.permission.RECORD_AUDIO")
						const data2 = await permission.requestAndroidPermission("android.permission.CAMERA")
						if (data1 == 1 && data2 == 1) {
							this.pusherInit();
						}
					} else {
						this.pusherInit();
					}
					//隐藏加载框
					uni.hideLoading();
					// 覆盖在视频之上的内容，根据实际情况编写
					// 利用plus.webview.create将扫描框页面及扫描动画（xxx.html）覆盖在视频之上；
					// this.scanWin = plus.webview.create('/static/456.html', '', {
					//  background: 'transparent'
					// });
					// //新引入的webView显示
					// this.scanWin.show();
				}, 2000);
			},
			//初始化播放器
			pusherInit() {
				// 获取当前窗口
				this.currentWebview = this.$mp.page.$getAppWebview()
				// 创建推流，url不填写代表不上传
				this.pusher = plus.video.createLivePusher('livepusher', {
					url: '',
					top: '0',
					// left:'0',
					left: this.screamWidth / 2 - this.screamHeight / 16 * 12 / 2 + 'px',
					width: this.screamHeight / 16 * 12 + 'px',
					height: this.screamHeight + 'px',
					mode: 'FHD',
					// width: '100%',
					// height: '100%',
					aspect: '9:16',
					muted: true,
					videoFullscreen: 'landscape-primary'
				});

				// 将推流对象加到当前页面中
				this.currentWebview.append(this.pusher);
				//反转摄像头
				this.pusher.switchCamera();
				//开始预览
				this.pusher.preview();
				this.pusher.requestFullScreen({
					success: res => {
						console.log('我要执行了');
					},
					fail: res => {
						console.log('fullscreen fail');
					},
					direction: 90
				});
				this.snapshotPusher()
			},
			//快照
			snapshotPusher() {
				if (this.faceCheckNum > 1) {
					uni.showToast({
						title: '对比超时',
						icon: 'error',
						duration: 2000
					})
					// // 关闭直播流
					// this.pusher.close()
					// this.$emit('stopCheckFace')

				} else {
					uni.showToast({
						icon: 'none',
						title: '识别中...',
						duration: 2000
					})
					this.snapshTimeout = setTimeout(() => {
						this.faceCheckNum++
						this.pusher.snapshot(
							e => {
								//拿到本地文件路径
								var src = e.tempImagePath;
								// console.log(src)
								//获取图片base64
								this.getMinImage(src);
							},
							function(e) {
								plus.nativeUI.alert('snapshot error: ' + JSON.stringify(e));
							}
						);
					}, 2000)
				}
			},

			//使用plus.zip.compressImage压缩图片
			getMinImage(imgPath) {
				let that = this
				plus.zip.compressImage({
						src: imgPath,
						dst: imgPath,
						overwrite: true,
						quality: 40
					},
					zipRes => {
						var reader = new plus.io.FileReader();
						reader.onloadend = res => {
							//获取图片base64	
							console.log(res.target.result)
							uni.request({
								url: 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' +
									this.dataDetailAllList.subToken, //接口地址：前缀+方法中传入的地址
								method: 'POST', //请求方法：传入的方法或者默认是“GET”
								data: {
									image: res.target.result,
									image_type: 'BASE64',
									group_id_list: uni.getStorageSync('mySysId')
								},
								headers: {
									'Content-Type ': 'text/html;charset=utf-8'
								},
								success: (res) => {
									console.log(res)
									if (res.data.error_msg == "pic not has face") {
										uni.showToast({
											title: '未捕获到人脸',
											icon: 'error',
											duration: 2000
										})
										this.snapshotPusher()
									}
									if (res.data.error_msg == "image check fail") {
										this.snapshotPusher()
									}
									if (res.data.error_msg == 'SUCCESS') {
										if (res.data.result.user_list[0].score > 80) {
											if (res.data.result.user_list[0].user_id != this
												.dataDetailAllList
												.userInfo.info_userid) {
												uni.showModal({
													title: '失败',
													content: '您的脸型不正确',
													showCancel: false,
													success(res) {}
												});
											} else {
												uni.showModal({
													title: 'OK',
													content: '人脸识别成功',
													showCancel: false,
													success(res) {
														this.onSureEdit()
													}
												});
											}
										} else {
											uni.showModal({
												title: '错误',
												content: '对比失败',
												showCancel: false,
												success(res) {}
											});
										}
									}
								},
								fail: (err) => {
									this.snapshotPusher()
									console.log(err)
								}
							})
						};
						//一定要使用plus.io.convertLocalFileSystemURL将target地址转换为本地文件地址，否则readAsDataURL会找不到文件
						reader.readAsDataURL(plus.io.convertLocalFileSystemURL(zipRes.target));
					},
					function(error) {
						console.log('Compress error!', error);
					}
				);
			},
		}
	}
</script>

<style lang="scss">
	.outBorder {
		width: 100%;
		height: 100%;
		background: #fff;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 9999;
	}
</style>