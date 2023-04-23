<template>
	<view class="outBorder">
		<web-view :webview-styles="webviewStyles" src="/hybrid/html/face.html" @message="toShot"></web-view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	// 直播流查看权限
	import permission from '../../utils/permission.js'
	var wv; //计划创建的webview
	export default {
		data() {
			return {
				pusher: null,
				scanWin: null,
				faceInitTimeout: null,
				snapshTimeout: null,
				webviewStyles: {
					progress: false
				}
			}
		},
		props: ['dataDetailAllList'],
		mounted() {
			// #ifdef APP-PLUS
			var currentWebview = this.$parent.$scope
				.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
			this.snapshTimeout = setTimeout(function() {
				wv = currentWebview.children()[0]
				wv.setStyle({
					background: 'transparent'
				})
			}, 50); //如果是页面初始化调用时，需要延时一下
			// #endif
			// plus.screen.lockOrientation('portrait-primary'); //锁定屏幕为竖屏
			this.faceInit()
		},
		methods: {
			...mapMutations(['UPDATE_TIPMODAL']),

			// 自定义提示信息未成功，主要原因，无法关闭显示窗口

			// // 提示层信息
			// tipOper(type) {
			// 	// 覆盖在视频之上的内容，根据实际情况编写
			// 	// 利用plus.webview.create将扫描框页面及扫描动画（xxx.html）覆盖在视频之上；
			// 	this.scanWin = plus.webview.create('/static/face.html?msgType=' + type + '&width=' + this
			// 		.screenWidth +
			// 		'&height=' + this.screenHeight, '', {
			// 			background: 'transparent',
			// 			videoFullscreen: 'landscape-secondary'
			// 		});
			// 	//新引入的webView显示
			// 	this.scanWin.show();
			// },
			// hideTip() {
			// 	let page = plus.webview.getTopWebview();
			// 	console.log('page------',page)
			// 	//新引入的webView隐藏
			// 	this.scanWin.hide(page.id);
			// },
			//初始化
			faceInit() {
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
				}, 2000);
			},
			//初始化播放器
			pusherInit() {
				// 获取当前窗口
				const currentWebview = this.$mp.page.$getAppWebview()
				// 创建推流，url不填写代表不上传
				this.pusher = plus.video.createLivePusher('livepusher', {
					url: '',
					top: '0',
					left: '0',
					mode: 'FHD',
					width: '100%',
					height: '100%',
					aspect: '9:16',
					muted: true,
				});
				// 将推流对象加到当前页面中
				currentWebview.append(this.pusher);
				//反转摄像头
				this.pusher.switchCamera();
				//开始预览
				this.pusher.preview();
			},
			toShot(e) {
				console.log('shot-------', e.detail.data)
				// 提示识别中
				uni.showLoading({
					title: ''
				});
				this.snapshotPusher()
			},
			//快照
			snapshotPusher() {
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
							// console.log(res.target.result.split(',')[1])
							uni.request({
								url: 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' +
									this.dataDetailAllList.subToken, //接口地址：前缀+方法中传入的地址
								method: 'POST', //请求方法：传入的方法或者默认是“GET”
								data: {
									image: res.target.result.split(',')[1],
									image_type: 'BASE64',
									group_id_list: uni.getStorageSync('mySysId')
								},
								headers: {
									'Content-Type ': 'text/html;charset=utf-8'
								},
								success: (res) => {
									console.log(res)
									uni.hideLoading()
									this.pusher.close() // 关闭直播流
									this.$emit('stopCheckFace') // 调用父组件方法关闭人脸识别弹窗
									// // plus.screen.lockOrientation('landscape-primary'); //锁定屏幕为横屏
									if (res.data.error_msg == "pic not has face") {
										// 提示未捕获到人脸
										this.UPDATE_TIPMODAL({
											isShow: true,
											tipText: '未捕获到人脸', // 提示信息
											tipIcon: 'iconshibai', // 图标名称
											mark: false, // 是否有蒙版
											duration: 2000, // 持续时间
											mode: 'self' // 弹窗模式
										})
									} else if (res.data.error_msg == 'SUCCESS') {
										if (res.data.result.user_list[0] && res.data.result.user_list[
												0].score > 80) {
											// plus.screen.lockOrientation(
											// 	'landscape-primary'); //锁定屏幕为横屏
											// 提示人脸识别成功
											this.UPDATE_TIPMODAL({
												isShow: true,
												tipText: '人脸识别成功', // 提示信息
												tipIcon: 'iconchenggong', // 图标名称
												mark: false, // 是否有蒙版
												duration: 2000, // 持续时间
												mode: 'self' // 弹窗模式
											})
											// 调用父组件方法提交报工信息
											this.$emit(
												'checkSuccess', {
													checkFace: true,
													faceInfo: res.data.result
														.user_list[0]
												}
											)
										} else {
											// 提示对比失败
											this.UPDATE_TIPMODAL({
												isShow: true,
												tipText: '对比失败', // 提示信息
												tipIcon: 'iconshibai', // 图标名称
												mark: false, // 是否有蒙版
												duration: 2000, // 持续时间
												mode: 'self' // 弹窗模式
											})
										}
									}
								},
								fail: (err) => {
									uni.hideLoading()
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
		},
		destroyed() {
			clearTimeout(this.faceInitTimeout)
			clearTimeout(this.snapshTimeout)
		}
	}
</script>

<style lang="scss" scoped>
	.outBorder {
		width: 100%;
		height: 100%;
		background: #000;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 9999;
	}
</style>