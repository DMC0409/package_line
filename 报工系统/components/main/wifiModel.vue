<template>
	<view class="wifiOut flex align-center justify-center">
		<!-- 自定义键盘 -->
		<v-keyboard ref="keyboard" :disorderly="false" @typing="typing" @enter="enter"></v-keyboard>
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
					<view class="psd flex align-center justify-start">
						<view class="psdTitle flex justify-between align-center">
							<view>请输入密码：</view>
							<view class="btn" @click="copy">复制密码</view>
						</view>
						<view class="showPSD" @click.stop="openKeyBoard">{{password==''?'请输入密码':password}}</view>
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
	// 自定义键盘
	import vKeyboard from '@/components/VKeyboard/VKeyboard.vue'
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
		components: {
			vKeyboard
		},
		mounted() {
			// 提示加载中
			this.UPDATE_TIPMODAL({
				isShow: true,
				tipText: '加载中', // 提示信息
				tipIcon: 'iconloading', // 图标名称
				mark: true, // 是否有蒙版
				duration: 0, // 持续时间
			})
			uni.startWifi({
				success: (res) => {
					uni.getWifiList({
						success: (res) => {
							console.log('toGetWifi:', res)
						}
					})
				},
				fail: (err) => {
					this.$utils.judgeWifiState(err)
				}
			})
			// 获取已连接wifi信息
			uni.getConnectedWifi({
				success: (res) => {
					this.nowWifi = res.wifi
					console.log('now:', this.nowWifi)
				},
				fail: (err) => {}
			})
			uni.onGetWifiList((res) => {
				console.log('wifi-----', res)
				// 过滤相同SSID的wifi，保留信号最强的wifi
				let dealHashMap = res.wifiList.reduce((hashMap, next) => {
					hashMap[next.SSID] = hashMap[next.SSID] ? [...hashMap[next.SSID], next] : [next];
					return hashMap;
				}, {});
				let eachMax = []
				for (let i in dealHashMap) {
					let signalArr = dealHashMap[i].sort((a, b) => {
						return b.signalStrength - a.signalStrength;
					});
					eachMax.push(signalArr[0])
				}
				this.list = eachMax.sort((a, b) => {
					return b.signalStrength - a.signalStrength;
				});
				// 关闭提示加载中
				this.UPDATE_TIPMODAL({
					isShow: false,
					tipText: '', // 提示信息
					tipIcon: '', // 图标名称
					mark: true, // 是否有蒙版
					duration: 0, // 持续时间
				})
			})
		},
		methods: {
			...mapMutations(['UPDATE_WIFI', 'UPDATE_TIPMODAL']),
			openKeyBoard() {
				this.$refs.keyboard.activate();
			},
			typing(data) {
				if (data.backspace) {
					this.password = this.password.substr(0, this.password.length - 1);
				} else {
					this.password += data.char
				}
			},
			enter() {
				this.$refs.keyboard.deactivate();
			},
			setWifiPassword(item) {
				this.wifiItem = item
			},
			toLink() {
				uni.connectWifi({
					SSID: this.wifiItem.SSID,
					BSSID: this.wifiItem.BSSID,
					//WiFi的密码 
					password: this.password,
					partialInfo: true,
					maunal: false,
					success: (res) => {
						// 修改网络状态为在线
						this.UPDATE_WIFI(true)
						// 提示连接成功
						this.UPDATE_TIPMODAL({
							isShow: true,
							tipText: '连接成功', // 提示信息
							tipIcon: 'iconchenggong', // 图标名称
							mark: true, // 是否有蒙版
							duration: 2000, // 持续时间
						})
						this.toClose()

					},
					fail: (err) => {
						console.log(err)
						this.$utils.judgeWifiState(err)
						this.password = ''
					}
				})
			},
			cancelLink() {
				this.wifiItem = ''
			},
			toClose() {
				this.$emit('closeWifi')
			},
			doNoting() {},
			copy() {
				uni.setClipboardData({
					data: this.password
				});
			}
		},
		destroyed() {
			uni.stopWifi({
				success: (res) => {},
				fail: (err) => {}
			})
		}
	}
</script>

<style lang="scss" scoped>
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
					width: 100%;
					margin: 40rpx 0;
					.btn {
						width: 10vw;
						padding: 20rpx 0;
						background: #028306;
						text-align: center;
						color: #fff;
						border-radius: 10rpx;
					}
				}

				.showPSD {
					width: 90%;
					padding: 20rpx;
					border: 1px solid #1087fe;
				}

				.operate {
					width: 100%;
					margin-top: 20rpx;

					.btn {
						width: 45%;
						padding: 20rpx 0;
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