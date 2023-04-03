<template>
	<view class="wifiOut flex align-center justify-center" @click="toClose">
		<view class="wifiMain" @click.stop="doNoting">
			<view class="title flex align-center">wifi列表</view>
			<view class="wifiList">
				<view class="eachWifi flex align-center justify-between" v-for="(item,index) in list" :key="index"
					v-if="item.SSID!=''">
					<view class="wifiName">
						{{item.SSID}}
					</view>
					<view class="wifiStrong" :style="{'color':item.signalStrength>-60?'green':'gray'}">
						{{item.signalStrength>-60?'强':'弱'}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		mounted() {
			uni.startWifi({
				success: (res) => {
					uni.getWifiList({
						success: (res) => {
							console.log('wifi:', res)
						}
					})
				},
				fail: (err) => {

				}
			})
			uni.onGetWifiList((res) => {
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
				console.log(eachMax)
				this.list = eachMax.sort((a, b) => {
					return b.signalStrength - a.signalStrength;
				});
			})
			// uni.connectWifi({
			// 	SSID: '呱呱家',
			// 	BSSID: '18:f2:2c:8e:d6:5f',
			// 	//WiFi的密码 
			// 	password: '13175152848gu',
			// 	partialInfo: true,
			// 	maunal: false,
			// 	success: (res) => {
			// 		console.log(res)
			// 	}
			// })
		},
		methods: {
			toClose() {
				this.$emit('closeWifi')
			},
			doNoting() {}
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

			.title {
				width: 100%;
				height: 8%;
				color: #fff;
				text-indent: 20rpx;
				background: #0a1d64;
			}

			.wifiList {
				width: 100%;
				height: 92%;
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