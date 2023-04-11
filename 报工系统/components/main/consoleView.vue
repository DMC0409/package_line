<template>
	<view class="consoleOut">
		<view class="contentOut">
			<view class="eachRes" v-for="(item,index) in vuex_Console" :key="index">
				{{item}}
			</view>
		</view>
		<view class="operate flex align-center justify-between">
			<view class="btn red flex align-center justify-center" @click="clear">
				清空
			</view>
			<view class="btn flex align-center justify-center" @click="back">
				返回
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

			}
		},
		computed: {
			...mapState(['vuex_Console'])
		},
		methods: {
			...mapMutations(['UPDATE_CONSOLE']),
			clear() {
				this.UPDATE_CONSOLE([])
			},
			back() {
				this.$emit('closeConsole')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.consoleOut {
		width: 100%;
		height: 100%;
		background: #fff;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 999;

		.contentOut {
			width: 100%;
			height: 90%;
			overflow: auto;

			.eachRes {
				width: 95%;
				padding: 40rpx;
				margin: 0 auto;
				border-bottom: 1px solid #ccc;
				word-wrap: break-word;
				word-break: break-all;
			}
		}

		.operate {
			width: 100%;
			height: 10%;

			.btn {
				width: 10vw;
				height: 100%;
				background: #666;
				border-radius: 10rpx;
				color: #fff;
			}

			.red {
				background: red;
			}
		}
	}
</style>