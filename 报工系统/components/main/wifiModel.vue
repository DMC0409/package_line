<template>
	<view class="wifiOut flex align-center justify-center" @click="toClose">
		<view class="wifiMain" @click.stop="doNoting">
			<view class="title flex align-center justify-between">
				<text>wifi列表</text>
				<image @click="toClose" class="img-close" src="../../static/image/right-back-close.png">
				</image>
			</view>
			<view class="wifiList">
				<block v-if="wifiItem === ''">
					<view class="eachWifi flex align-center justify-between" v-for="(item,index) in list" :key="index"
						v-if="item.SSID!=''" @click="setWifiPassword(item)">
						<view class="wifiName">
							{{item.SSID}}{{item.SSID === nowWifi.SSID?'（已连接）':''}}
						</view>
						<view class="wifiStrong" :style="{'color':item.signalStrength>-60?'green':'gray'}">
							{{item.signalStrength>-60?'强':'弱'}}
						</view>
					</view>
				</block>
				<block v-else>
					<!-- 输入密码框 -->
					<view class="psd flex align-center justify-center">
						<view class="psdTitle" @click="a">请输入密码：</view>
						<input type="text" v-model="password">
						<view class="operate flex align-center justify-around">
							<view class="btn cancel" @click="cancelLink">取消</view>
							<view class="btn" @click="toLink">确认</view>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				// wifi列表
				list: [],
				// 输入的wifi密码
				password: '',
				// 目标连接wifi信息
				wifiItem: '',
				// 当前使用的wifi
				nowWifi: {}
			}
		},
		mounted() {
			// //显示加载框
			// uni.showLoading({
			// 	title: '加载中'
			// });
			// uni.startWifi({
			// 	success: (res) => {
			// 		uni.getWifiList({
			// 			success: (res) => {
			// 				console.log('toGetWifi:', res)
			// 			}
			// 		})
			// 	},
			// 	fail: (err) => {
			// 		this.$utils.judgeWifiState(err)
			// 	}
			// })
			// // 获取已连接wifi信息
			// uni.getConnectedWifi({
			// 	success: (res) => {
			// 		this.nowWifi = res.wifi
			// 		//隐藏加载框
			// 		uni.hideLoading();
			// 		console.log('now:', this.nowWifi)
			// 	},
			// 	fail: (err) => {
			// 	}
			// })
			// uni.onGetWifiList((res) => {
			// 	console.log('wifi-----', res)
			// 	// 过滤相同SSID的wifi，保留信号最强的wifi
			// 	let dealHashMap = res.wifiList.reduce((hashMap, next) => {
			// 		hashMap[next.SSID] = hashMap[next.SSID] ? [...hashMap[next.SSID], next] : [next];
			// 		return hashMap;
			// 	}, {});
			// 	let eachMax = []
			// 	for (let i in dealHashMap) {
			// 		let signalArr = dealHashMap[i].sort((a, b) => {
			// 			return b.signalStrength - a.signalStrength;
			// 		});
			// 		eachMax.push(signalArr[0])
			// 	}
			// 	this.list = eachMax.sort((a, b) => {
			// 		return b.signalStrength - a.signalStrength;
			// 	});
			// })
		},
		methods: {
			...mapMutations(['UPDATE_WIFI']),
			a(){
				this.$refs.keyboard.activate();
			},
			typing(){},
			enter(){},
			setWifiPassword(item) {
				this.wifiItem = item
			},
			toLink() {
				// uni.connectWifi({
				// 	SSID: this.wifiItem.SSID,
				// 	BSSID: this.wifiItem.BSSID,
				// 	//WiFi的密码 
				// 	password: this.password,
				// 	partialInfo: true,
				// 	maunal: false,
				// 	success: (res) => {
				// 		// 修改网络状态为在线
				// 		this.UPDATE_WIFI(true)
				// 		uni.showToast({
				// 			title: '连接成功',
				// 			icon: 'success',
				// 			duration: 2000
				// 		})
				// 		this.toClose()

				// 	},
				// 	fail: (err) => {
				// 		console.log(err)
				// 		this.$utils.judgeWifiState(err)
				// 		this.password = ''
				// 	}
				// })
			},
			cancelLink() {
				this.wifiItem = ''
			},
			toClose() {
				this.$emit('closeWifi')
			},
			doNoting() {}
		},
		destroyed() {
			// uni.stopWifi({
			// 	success: (res) => {},
			// 	fail: (err) => {}
			// })
		}
	}
</script>

<style lang="scss">
	.wifiOut {
		width: 100vw;
		height: 100vh;
		position: absolute;
		background: rgba(0, 0, 0, .5);
		z-index: 999;

		.wifiMain {
			width: 50%;
			height: 70%;
			background: #fff;
			border-radius: 10rpx;

			.psd {
				width: 80%;
				height: 100%;
				margin: 0 auto;
				background: #fff;
				flex-direction: column;

				.psdTitle {
					text-align: left;
					margin-bottom: 20rpx;
				}

				input {
					width: 90%;
					height: 7vh;
					border: 1px solid #1087fe;
				}

				.operate {
					width: 100%;
					margin-top: 20rpx;

					.btn {
						width: 45%;
						padding: 10rpx 0;
						background: #73C7EF;
						text-align: center;
						border-radius: 10rpx;
					}

					.cancel {
						background: #666;
					}
				}
			}

			.title {
				width: 100%;
				height: 10%;
				color: #000;
				background: #96CDF7;
				border-top-left-radius: 10rpx;
				border-top-right-radius: 10rpx;

				text {
					text-indent: 20rpx;
				}

				image {
					width: 3vw;
					height: 3vw;
					margin-right: 20rpx;
				}
			}

			.wifiList {
				width: 100%;
				height: 90%;
				overflow: auto;

				.eachWifi {
					width: 90%;
					height: 80rpx;
					margin: 0 auto;
					border-bottom: 1px solid #ccc;
				}
			}
		}
	}
</style>