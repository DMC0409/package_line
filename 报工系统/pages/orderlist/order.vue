<template>
	<view class="container flex image-back-norepeat align-center"
		style="background-image: url('../../static/image/page-back.png');">
		<view class="header flex image-back-norepeat align-center justify-between"
			style="background-image: url(../../static/image/header-back.png);">
			<view class="reCheck">
				重新扫描
			</view>
			<image class="logo" src="../../static/image/logo.png"></image>
			<view class="setting flex align-center justify-end">
				<view class="version">{{appVersion?'V'+appVersion:''}}</view>
				<image src="../../static/image/icon-setting.png" @click="showSetting=true"></image>
				<image v-if="vuex_Wifi" src="../../static/image/icon-wifi.png" @click="onSetWifi"></image>
				<image v-else src="../../static/image/no-wifi.png" @click="onSetWifi"></image>
				<view class="time flex">
					<text class="time-moment">{{time}}</text>
					<text class="time-date">{{date}} {{week}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				appVersion: '',
				time: '',
				date: '',
				week: '',
				vuex_Wifi: true,
				timer: null,
				timer2: null,
			}
		},
		onLoad() {
			this.timer2 = setInterval(() => {
				this.time = this.$moment().format('HH:mm:ss')
				this.date = this.$moment().format('YYYY-MM-DD')
				this.week = this.$moment().format('dddd')
			}, 1000);
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				this.appVersion = wgtinfo.version;
			})
			// #endif
		},
		methods: {
			showSetting() {},
			onSetWifi() {
				// #ifdef APP-PLUS
				var main = plus.android.runtimeMainActivity(); //获取activity  
				var Intent = plus.android.importClass('android.content.Intent');
				var Settings = plus.android.importClass('android.provider.Settings');
				var intent = new Intent(Settings.ACTION_WIFI_SETTINGS); //可设置表中所有Action字段  
				main.startActivity(intent);
				// #endif
			}
		},
		onUnload() {
			clearInterval(this.timer2)
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		height: 100vh;
		flex-direction: column;

		.header {
			width: 100%;
			height: 8vh;
			color: #A6C4E6;
			margin-top: 2vh;

			.reCheck {
				width: 30%;
				text-indent: 40rpx;
				font-size: 20px;
			}

			.logo {
				width: 10vw;
				height: 5vh;
				margin-top: 23rpx;
				margin-bottom: 10rpx;
			}

			.setting {
				width: 30%;
				font-size: 18px;


				.version {
					color: #A6C4E6;
				}

				image {
					width: 2vw;
					height: 2vw;
					margin-left: 20rpx;
				}

				.time {
					flex-direction: column;
					margin: 0 18px;

					.time-moment {
						font-size: 12px;
					}

					.time-date {
						font-size: 8px;
					}
				}
			}
		}



	}
</style>
