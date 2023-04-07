<template>
	<view class="outBorder flex align-center justify-center" v-if="vuex_TipModal.isShow">
		<view class="mark" v-show="vuex_TipModal.mark"></view>
		<view class="tipOut flex align-center justify-center">
			<i v-show="vuex_TipModal.tipIcon!=''" class="iconfont"
				:class="vuex_TipModal.tipIcon=='iconloading'?'turnRound iconloading':vuex_TipModal.tipIcon"></i>
			<view>{{vuex_TipModal.tipText}}</view>
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
				closeTimer: null
			}
		},
		computed: {
			...mapState(['vuex_TipModal'])
		},
		watch: {
			vuex_TipModal: {
				handler(newVal, oldVal) {
					if (newVal.isShow) {
						if (newVal.duration != 0) {
							this.closeTimer = setTimeout(() => {
								this.UPDATE_TIPMODAL({
									isShow: false,
									tipText: '', // 提示信息
									tipIcon: '', // 图标名称
									mark: true, // 是否有蒙版
									duration: 0, // 持续时间
								})
								clearTimeout(this.closeTimer)
							}, newVal.duration)
						}
					}
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			...mapMutations(['UPDATE_TIPMODAL']),
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes fadenum {
		100% {
			transform: rotate(360deg);
		}
	}

	.outBorder {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10000;

		.mark {
			width: 100%;
			height: 100%;
			position: absolute;
			background: rgba(0, 0, 0, .3);
		}

		.tipOut {
			flex-direction: column;
			width: 20vw;
			height: 20vw;
			border-radius: 20rpx;
			background: #000;
			z-index: 10001;
			color: #fff;

			i {
				font-size: 50rpx;
				margin-bottom: 20rpx;
			}

			.turnRound {
				animation: fadenum 3s infinite;
			}
		}
	}
</style>