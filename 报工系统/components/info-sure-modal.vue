<template>
	<view>
		<view class="pri-content" v-if="showLink" @click="onCloseModal">
			<view class="modal" @click.stop="onEgg">
				<div class="status-icon sa-info" style="display: block;"></div>
				<h2 class="h2">您要确认本环节{{title}}结束吗?</h2>
				<view class="input-content">
					<input class="input-value" placeholder="员工卡号" placeholder-class="place-class" v-model="link"
						type="text" />
					<view style="display: flex;width: 100%;justify-content: space-around;margin-bottom: 1vh;">
						<view class="submit-btn" @click="onDelValue">重置</view>
						<view class="submit-btn" @click="onSureLink">提交</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <model :showModalData.sync="showModalData" :info="dataInfo" :type="dataType" /> -->
	</view>
</template>

<script>
	import model from './model.vue'
	export default {
		name: "info-sure-modal",
		components: {
			model,
		},
		data() {
			return {
				link: '',
				showModalData: false,
				dataInfo: '',
				dataType: '',
			};
		},
		props: {
			showLink: {
				type: Boolean,
				default: false
			},
			rowData: {
				type: Object,
				default () {
					return {}
				}
			},
			title: {
				type: String,
				default: ''
			},
			configTableId: {
				type: String,
				default: ''
			},
			orderId: {
				type: String,
				default: ''
			}
		},
		watch: {
			rowData(newVal, oldVal) {
				return newVal
			}
		},
		methods: {
			onSureLink() {
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_sopEquipmentClass',
						need_type: 'setListCheckDoneFun',
						mySysId: uni.getStorageSync('mySysId'),
						loginsession_sop: uni.getStorageSync('loginsession'),
						config_table_id: this.configTableId,
						order_id: this.orderId,
						finger_print: this.link
					}
				}).then(res => {
					uni.showToast({
						icon: 'success',
						title: '确认成功',
						duration: 2000
					})
				}, () => {}).catch(err => {
					console.log(err)
				})
				this.link = ''
				this.onCloseModal()
			},
			onDelValue() {
				this.link = ''
			},
			onCloseModal() {
				this.$emit('update:showLink', false)
			},
			onEgg() {}
		}
	}
</script>

<style>
	.input-content {
		font-size: 1.5vw;
		width: 95%;
		text-align: center;
		padding: 0 1.5vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.input-value {
		border-radius: 0.5vw;
		padding: 2vh 3.5vw 2vh 1.5vw;
		border: 1px solid #C9DAE1;
		margin: 2vh 0;
		text-align: left;
		color: #73C7EF;
		font-size: 2.5vw;
		min-height: 4vh;
		font-weight: bold;
		position: relative;
	}

	.place-class {
		font-size: 1.5vw;
		color: #C9DAE1;
	}

	.submit-btn {
		width: 45%;
		font-size: 1.5vw;
		padding: 2vh 0vh;
		background: #73C7EF;
		border-radius: 0.5vh;
		color: #FFFFFF;
		margin: 2vh 0;
	}

	.pri-content {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 115;
	}

	.modal {
		width: 40vw;
		max-width: 40vw;
		min-height: 42vh;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.closeBtn {
		border: 0;
		border-radius: 0.25em;
		background-color: #7066e0;
		color: #fff;
		font-size: 1.5vw;
		padding: 1.8vh 6vh;
		text-align: center;
		margin: 3vh 0 2vh 0;
	}

	.h2 {
		color: #575757;
		font-size: 30px;
		text-align: center;
		font-weight: 600;
		text-transform: none;
		position: relative;
		margin: 10px 0;
		padding: 0 1vw;
		line-height: 40px;
		display: block;
	}

	.status-icon {
		width: 80px;
		height: 80px;
		border: 4px solid gray;
		-webkit-border-radius: 40px;
		border-radius: 50%;
		margin: 20px auto;
		padding: 0;
		position: relative;
		box-sizing: content-box;
	}

	.status-icon.sa-error {
		border-color: #F27474;
	}

	.status-icon.sa-error .sa-x-mark {
		position: relative;
		display: block;
	}

	.status-icon.sa-error .sa-line {
		position: absolute;
		height: 5px;
		width: 47px;
		background-color: #F27474;
		display: block;
		top: 37px;
		border-radius: 2px;
	}

	.status-icon.sa-error .sa-line.sa-left {
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
		left: 17px;
	}

	.status-icon.sa-error .sa-line.sa-right {
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
		right: 16px;
	}

	.status-icon.sa-error.animateErrorIcon {
		-webkit-animation: animateErrorIcon 0.5s;
		animation: animateErrorIcon 0.5s;
	}

	.status-icon.sa-warning {
		border-color: #F8BB86;
	}

	.status-icon.sa-warning .sa-body {
		position: absolute;
		width: 5px;
		height: 47px;
		left: 50%;
		top: 10px;
		-webkit-border-radius: 2px;
		border-radius: 2px;
		margin-left: -2px;
		background-color: #F8BB86;
	}

	.status-icon.sa-warning .sa-dot {
		position: absolute;
		width: 7px;
		height: 7px;
		-webkit-border-radius: 50%;
		border-radius: 50%;
		margin-left: -3px;
		left: 50%;
		bottom: 10px;
		background-color: #F8BB86;
	}

	.status-icon.sa-warning.pulseWarning {
		-webkit-animation: pulseWarning 0.75s infinite alternate;
		animation: pulseWarning 0.75s infinite alternate;
	}

	.status-icon.sa-warning .pulseWarningIns {
		-webkit-animation: pulseWarningIns 0.75s infinite alternate;
		animation: pulseWarningIns 0.75s infinite alternate;
	}

	.status-icon.sa-info {
		border-color: #C9DAE1;
	}

	.status-icon.sa-info::before {
		content: "";
		position: absolute;
		width: 5px;
		height: 29px;
		left: 50%;
		bottom: 17px;
		border-radius: 2px;
		margin-left: -2px;
		background-color: #C9DAE1;
	}

	.status-icon.sa-info::after {
		content: "";
		position: absolute;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		margin-left: -3px;
		top: 19px;
		background-color: #C9DAE1;
		left: 50%;
	}

	.status-icon.sa-success {
		border-color: #A5DC86;
	}

	.status-icon.sa-success::before,
	.status-icon.sa-success::after {
		content: '';
		-webkit-border-radius: 40px;
		border-radius: 50%;
		position: absolute;
		width: 60px;
		height: 120px;
		background: white;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
	}

	.status-icon.sa-success::before {
		-webkit-border-radius: 120px 0 0 120px;
		border-radius: 120px 0 0 120px;
		top: -7px;
		left: -33px;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
		-webkit-transform-origin: 60px 60px;
		transform-origin: 60px 60px;
	}

	.status-icon.sa-success::after {
		-webkit-border-radius: 0 120px 120px 0;
		border-radius: 0 120px 120px 0;
		top: -11px;
		left: 30px;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
		-webkit-transform-origin: 0px 60px;
		transform-origin: 0px 60px;
	}

	.status-icon.sa-success.animate::after {
		-webkit-animation: rotatePlaceholder 4.25s ease-in;
		animation: rotatePlaceholder 4.25s ease-in;
	}

	.status-icon.sa-success .sa-placeholder {
		width: 80px;
		height: 80px;
		border: 4px solid rgba(165, 220, 134, 0.2);
		-webkit-border-radius: 40px;
		border-radius: 50%;
		box-sizing: content-box;
		position: absolute;
		left: -4px;
		top: -4px;
		z-index: 2;
	}

	.status-icon.sa-success .sa-line {
		height: 5px;
		background-color: #A5DC86;
		display: block;
		border-radius: 2px;
		position: absolute;
		z-index: 2;
	}

	.status-icon.sa-success .sa-line.sa-tip {
		width: 25px;
		left: 14px;
		top: 46px;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
	}

	.status-icon.sa-success .sa-line.sa-long {
		width: 47px;
		right: 8px;
		top: 38px;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
	}

	.status-icon.sa-success .sa-line.animateSuccessTip {
		-webkit-animation: animateSuccessTip 0.75s;
		animation: animateSuccessTip 0.75s;
	}

	.status-icon.sa-success .sa-line.animateSuccessLong {
		-webkit-animation: animateSuccessLong 0.75s;
		animation: animateSuccessLong 0.75s;
	}

	@-webkit-keyframes rotatePlaceholder {
		0% {
			transform: rotate(-45deg);
			-webkit-transform: rotate(-45deg);
		}

		5% {
			transform: rotate(-45deg);
			-webkit-transform: rotate(-45deg);
		}

		12% {
			transform: rotate(-405deg);
			-webkit-transform: rotate(-405deg);
		}

		100% {
			transform: rotate(-405deg);
			-webkit-transform: rotate(-405deg);
		}
	}

	@keyframes rotatePlaceholder {
		0% {
			transform: rotate(-45deg);
			-webkit-transform: rotate(-45deg);
		}

		5% {
			transform: rotate(-45deg);
			-webkit-transform: rotate(-45deg);
		}

		12% {
			transform: rotate(-405deg);
			-webkit-transform: rotate(-405deg);
		}

		100% {
			transform: rotate(-405deg);
			-webkit-transform: rotate(-405deg);
		}
	}

	.status-icon.sa-success .sa-fix {
		width: 5px;
		height: 90px;
		background-color: white;
		position: absolute;
		left: 28px;
		top: 8px;
		z-index: 1;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
	}

	@-webkit-keyframes animateSuccessTip {
		0% {
			width: 0;
			left: 1px;
			top: 19px;
		}

		54% {
			width: 0;
			left: 1px;
			top: 19px;
		}

		70% {
			width: 50px;
			left: -8px;
			top: 37px;
		}

		84% {
			width: 17px;
			left: 21px;
			top: 48px;
		}

		100% {
			width: 25px;
			left: 14px;
			top: 45px;
		}
	}

	@keyframes animateSuccessTip {
		0% {
			width: 0;
			left: 1px;
			top: 19px;
		}

		54% {
			width: 0;
			left: 1px;
			top: 19px;
		}

		70% {
			width: 50px;
			left: -8px;
			top: 37px;
		}

		84% {
			width: 17px;
			left: 21px;
			top: 48px;
		}

		100% {
			width: 25px;
			left: 14px;
			top: 45px;
		}
	}

	@-webkit-keyframes animateSuccessLong {
		0% {
			width: 0;
			right: 46px;
			top: 54px;
		}

		65% {
			width: 0;
			right: 46px;
			top: 54px;
		}

		84% {
			width: 55px;
			right: 0px;
			top: 35px;
		}

		100% {
			width: 47px;
			right: 8px;
			top: 38px;
		}
	}

	@keyframes animateSuccessLong {
		0% {
			width: 0;
			right: 46px;
			top: 54px;
		}

		65% {
			width: 0;
			right: 46px;
			top: 54px;
		}

		84% {
			width: 55px;
			right: 0px;
			top: 35px;
		}

		100% {
			width: 47px;
			right: 8px;
			top: 38px;
		}
	}

	@-webkit-keyframes animateErrorIcon {
		0% {
			transform: rotateX(100deg);
			-webkit-transform: rotateX(100deg);
			opacity: 0;
		}

		100% {
			transform: rotateX(0deg);
			-webkit-transform: rotateX(0deg);
			opacity: 1;
		}
	}

	@keyframes animateErrorIcon {
		0% {
			transform: rotateX(100deg);
			-webkit-transform: rotateX(100deg);
			opacity: 0;
		}

		100% {
			transform: rotateX(0deg);
			-webkit-transform: rotateX(0deg);
			opacity: 1;
		}
	}

	@-webkit-keyframes pulseWarning {
		0% {
			border-color: #F8D486;
		}

		100% {
			border-color: #F8BB86;
		}
	}

	@keyframes pulseWarning {
		0% {
			border-color: #F8D486;
		}

		100% {
			border-color: #F8BB86;
		}
	}

	@-webkit-keyframes pulseWarningIns {
		0% {
			background-color: #F8D486;
		}

		100% {
			background-color: #F8BB86;
		}
	}

	@keyframes pulseWarningIns {
		0% {
			background-color: #F8D486;
		}

		100% {
			background-color: #F8BB86;
		}
	}

	/* Internet Explorer 9 has some special quirks that are fixed here */
	/* The icons are not animated. */
	/* This file is automatically merged into sweet-alert.min.js through Gulp */
	/* Error icon */
	.status-icon.sa-error .sa-line.sa-left {
		-ms-transform: rotate(45deg) \9;
	}

	.status-icon.sa-error .sa-line.sa-right {
		-ms-transform: rotate(-45deg) \9;
	}

	/* Success icon */
	.status-icon.sa-success {
		border-color: transparent \9;
	}

	.status-icon.sa-success .sa-line.sa-tip {
		-ms-transform: rotate(45deg) \9;
	}

	.status-icon.sa-success .sa-line.sa-long {
		-ms-transform: rotate(-45deg) \9;
	}
</style>
