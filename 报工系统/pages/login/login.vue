<template>
	<view class="container flex image-back-norepeat align-center"
		style="background-image: url('../../static/image/page-back.png');">
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 自定义键盘 -->
		<v-keyboard ref="keyboard" :disorderly="false" @typing="typing" @enter="enter"></v-keyboard>
		<!-- 设置wifi -->
		<wifiModal v-if="settingWifi" @closeWifi="settingWifi = false"></wifiModal>
		<!-- 导航栏 -->
		<image class="logo" src="../../static/image/logo.png"></image>
		<!-- 主内容 -->
		<view class="content flex image-back-norepeat align-center justify-between"
			style="background-image: url(../../static/image/index-border.png);">
			<view class="index-info flex align-center justify-center">
				<view class="form flex align-center" v-for="(item,index) in formList" :key="index">
					<view class="title">{{item.label}}：</view>
					<view v-if="index == 1" class="editMode flex align-center"
						:class="currentIndex == 1 ?'input-selected':''" @click="openKeyBoard">{{item.value}}
					</view>
					<view v-else class="editMode flex align-center" :class="currentIndex == index ?'input-selected':''"
						@tap="currentIndex = index">{{item.value==''?'请输入':item.value}}</view>

				</view>
				<view class="operate flex align-center justify-between">
					<button class="big btn flex align-center justify-center" @click="handleLogin">开始使用</button>
					<button class="btn flex align-center justify-center" @click="settingWifi = true">
						设置网络
					</button>
				</view>
			</view>
			<view class="num-detail flex justify-center align-center">
				<view class="jsq flex justify-end">
					<view class="jsq-item flex justify-center align-center" @tap.stop="onClickDH('1')">1
					</view>
					<view class="jsq-item flex justify-center align-center" @tap.stop="onClickDH('2')">2</view>
					<view class="jsq-item flex justify-center align-center border-right-none"
						@tap.stop="onClickDH('3')">3</view>
					<view class="jsq-item flex justify-center align-center" @tap.stop="onClickDH('4')">4</view>
					<view class="jsq-item flex justify-center align-center" @tap.stop="onClickDH('5')">5</view>
					<view class="jsq-item flex justify-center align-center border-right-none"
						@tap.stop="onClickDH('6')">6</view>
					<view class="jsq-item flex justify-center align-center" @tap.stop="onClickDH('7')">7</view>
					<view class="jsq-item flex justify-center align-center" @tap.stop="onClickDH('8')">8</view>
					<view class="jsq-item flex justify-center align-center border-right-none"
						@tap.stop="onClickDH('9')">9</view>
					<view class="jsq-item flex justify-center align-center border-bottom-none"
						@tap.stop="onClickDH('0')">0</view>
					<view class="jsq-item flex justify-center align-center border-bottom-none"
						@tap.stop="onClickDH('clear')">清除</view>
					<view class="jsq-item flex justify-center align-center border-right-none border-bottom-none"
						@tap.stop="onClickDH('del')">
						<image src="../../static/image/icon-jsq-close.png"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// wifi设置弹窗
	import wifiModal from '../../components/main/wifiModel.vue'
	// 自定义键盘
	import vKeyboard from '@/components/VKeyboard/VKeyboard.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				// 编辑中的输入框
				currentIndex: 0,
				// 表单结构数据
				formList: [{
						label: '系统编号',
						value: uni.getStorageSync('mySysId'),
						focus: false,
					}, {
						label: 'API 地址',
						value: uni.getStorageSync('API') ? uni.getStorageSync('API') : 'https://qly.info',
						focus: false,
					},
					{
						label: 'SOP账户',
						value: uni.getStorageSync('account'),
						focus: false,
					}, {
						label: 'SOP密码',
						value: uni.getStorageSync('password'),
						focus: false,
					},
				],
				// 记录迷你键盘当前输入的信息
				currentValue: [],
				// 迷你键盘选中的按键
				selectedNum: -1,
				settingWifi: false, // 是否正在设置wifi
			}
		},
		components: {
			wifiModal,
			vKeyboard
		},
		computed: {
			...mapState([])
		},
		methods: {
			...mapMutations(['UPDATE_TIPMODAL']),
			// 迷你数字键盘
			onClickDH(num) {
				this.selectedNum = num
				if (num == 'del') {
					let nowValue = this.formList[this.currentIndex].value.substring(0, this.formList[this.currentIndex]
						.value.length - 1)
					this.$set(this.formList[this.currentIndex], 'value', nowValue)
					this.currentValue = nowValue.split(',')
				} else if (num == 'clear') {
					this.$set(this.formList[this.currentIndex], 'value', '')
				} else {
					if (this.formList[this.currentIndex].value.length <= 15) {
						this.currentValue = [this.formList[this.currentIndex].value]
						this.currentValue.push(num)
						this.$set(this.formList[this.currentIndex], 'value', this.currentValue.join(''))
					} else {
						// 提示超出可输入长度
						this.UPDATE_TIPMODAL({
							isShow: true,
							tipText: '超出可输入长度', // 提示信息
							tipIcon: 'iconshibai', // 图标名称
							mark: true, // 是否有蒙版
							duration: 2000, // 持续时间
							mode: 'custom' // 弹窗模式
						})
					}
				}
			},
			resetSelect() {
				this.selectedNum = -1
			},
			handleLogin() {
				uni.setStorageSync('API', this.formList[1].value)
				for (let i of this.formList) {
					if (i.value == '') {
						// 提示请输入信息
						this.UPDATE_TIPMODAL({
							isShow: true,
							tipText: '请输入信息', // 提示信息
							tipIcon: 'iconshibai', // 图标名称
							mark: true, // 是否有蒙版
							duration: 2000, // 持续时间
							mode: 'custom' // 弹窗模式
						})
						return
					}
				}
				// 检测网络是否连通
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_sopEquipmentClass',
						need_type: 'checkNetOnLineFun',
						mySysId: this.formList[0].value
					}
				}).then(res => {
					// EPC登陆
					return this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Open_sopEquipmentClass',
							need_type: 'equipmentLogin',
							mySysId: this.formList[0].value,
							sop_equipment_account: this.formList[2].value,
							sop_equipment_password: this.formList[3].value
						}
					})
				}).then((res) => {
					// 提示登陆成功
					this.UPDATE_TIPMODAL({
						isShow: true,
						tipText: '登陆成功', // 提示信息
						tipIcon: 'iconchenggong', // 图标名称
						mark: true, // 是否有蒙版
						duration: 2000, // 持续时间
						mode: 'self' // 弹窗模式
					})
					// 登陆凭证持久化
					uni.setStorageSync('loginsession', res.data.data.loginsession_sop)
					uni.setStorageSync('mySysId', this.formList[0].value)
					uni.setStorageSync('account', this.formList[2].value)
					uni.setStorageSync('password', this.formList[3].value)
					// 跳转至报单页面
					uni.reLaunch({
						url: '../index/index'
					})
				}).catch(() => {})
			},
			openKeyBoard() {
				this.currentIndex = 1
				this.$refs.keyboard.activate();
			},
			typing(data) {
				if (data.backspace) {
					this.formList[1].value = this.formList[1].value.substr(0, this.formList[1].value.length - 1);
				} else {
					this.formList[1].value += data.char
				}
			},
			enter() {
				this.$refs.keyboard.deactivate();
			},
		}
	}
</script>

<style lang="scss" scopeds>
	.container {
		height: 100vh;
		flex-direction: column;
		position: relative;

		.logo {
			width: 10vw;
			height: 5vh;
			margin-top: 23rpx;
			margin-bottom: 10rpx;
		}

		.content {
			width: 90vw;
			height: 95vh;
			margin: 2vh;
			padding: 5vh 7vh;

			.index-info {
				height: 70vh;
				width: 43vw;
				flex-direction: column;
				color: #A6C4E6;
				font-size: 2vw;
				padding-left: 2vh;

				.form {
					margin: 4vh 0;

					.editMode {
						width: 22vw;
						height: 5vh;
						background: #0A223B;
						border-radius: 5rpx;
						padding: 8rpx 23rpx;
						outline: 0;
						border: 1px solid #0A223B;
						overflow: hidden;
					}

					.input-selected {
						border: 1rpx solid #00FFFF;
					}
				}

				.operate {
					width: 100%;

					.btn {
						background: #9CC8ED;
						border-radius: 5rpx;
						font-size: 2vw;
						color: #FFFFFF;
						margin-top: 2vh;
						width: 30%;
					}

					.big {
						width: 60%;
						background: green;
					}
				}
			}

			.num-detail {
				width: 38vw;
				margin: 0 1vw;
				height: 70vh;
				border: 1rpx solid #40A1D6;
				border-radius: 1vw;

				.jsq {
					width: 90%;
					height: 79%;
					flex-wrap: wrap;

					.jsq-item {
						flex: 1;
						width: 33.3%;
						min-width: 33.3%;
						max-width: 33.3%;
						font-size: 3vw;
						font-weight: 600;
						color: #FFFFFF;
						border-bottom: 1rpx solid #68686F;
						border-right: 1rpx solid #68686F;
						box-sizing: border-box;

						&:active {
							background: #00d4d4;
						}
					}

					image {
						width: 3vw;
						height: 3vw;
						position: absolute;
					}

					.border-right-none {
						border-right: none
					}

					.border-bottom-none {
						border-bottom: none
					}
				}
			}
		}
	}
</style>