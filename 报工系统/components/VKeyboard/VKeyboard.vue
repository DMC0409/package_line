<template>
	<view :class="keyboardStyle" v-if="visible">
		<view class="digit-keyboard" v-if="mode === 'digit' || digital">
			<view class="digit-button-box">
				<template v-for="(digit, index) in digits">
					<!-- <view :key="index" class="key-button digit" @tap="typing('.')" v-if="index === 9">.</view> -->
					<view :key="index" class="key-button digit" @tap="typing(digit)">{{digit}}</view>
				</template>
				<view class="key-button digit">
					<i class="iconfont icon-shouqijianpan middle" v-if="digital" @tap="deactivate"></i>
					<i class="iconfont iconABC middle" v-else @tap="typingLetter"></i>
				</view>
			</view>
			<view class="special-button-box">
				<view class="key-button special-button gray" @tap="backspace"><i class="iconfont iconbackspace large"></i></view>
				<view class="key-button special-button gray" @tap="enter"><i class="iconfont iconhuiche large"></i></view>
			</view>
		</view>
		<view class="full-keyboard" v-else>
			<view class="line" v-for="(letters, index) in lines" :key="index">
				<view class="letter key-button special-key gray" v-if="index === 3 && mode === 'letter'" @tap="toggleCase"><i :class="'iconfont ' + (lowercase ? 'iconxiangshang' : 'iconxiangshangpaixu-copy')"></i></view>
				<view class="letter key-button normal" v-for="letter in letters" @tap="typing(letter)" :key="letter">{{letter}}</view>
				<view class="letter key-button special-key gray" v-if="index === 3" @tap="backspace"><i class="iconfont iconbackspace"></i></view>
			</view>
			<view class="line special-line">
				<view class="letter key-button swith-key gray">
					<i class="iconfont iconfuhao-" @tap="typingSymbol" v-if="mode === 'letter'"></i>
					<view class="iconfont iconABC" @tap="typingLetter" v-if="mode === 'symbol'"></view>
				</view>
				<view class="letter key-button space" @tap="typing(' ')"><text class="logo">Magician 安全键盘</text></view>
				<view class="letter key-button swith-key gray" @tap="typingDigit"><i class="iconfont iconshuzi"></i></view>
				<view class="letter key-button swith-key gray" @tap="enter"><i class="iconfont iconhuiche"></i></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { natural, order, disorder, symbols, digits, KEYBOARD_MODE } from './utils'
	export default {
		props: {
			//是否为纯数字键盘
			digital: {
				type: [ Boolean, String ],
				default: false
			},
			//是否无序的排序键盘
			disorderly: {
				type: [ Boolean, String ],
				default: false
			}/* ,
			value: String */
		},
		//app中不生效，不知道为什么
		/* model: {
			prop: 'value',
			event: 'typing'
		}, */
		computed: {
			keyboardStyle() {
				return 'v-keyboard ' + this.cls;
			}
		},
		data() {
			return {
				cls: '',							
				visible: false,					//是否显示
				digits: [],						//自然数数组
				lines: [],						//字母+数字数组
				lowercase: true,				//是否小写输入状态
				mode: KEYBOARD_MODE.LETTER,		//键盘模式
			}
		},
		methods: {
			//大小写转换
			toggleCase() {
				this.lowercase = !this.lowercase;
			},
			//输入符号
			typingSymbol() {
				this.mode = KEYBOARD_MODE.SYMBOL;
				this.lines = symbols;
			},
			//输入字母
			typingLetter() {
				this.mode = KEYBOARD_MODE.LETTER;
				this.lines = this.disorderly ? disorder() : order;
			},
			//键入数字
			typingDigit() {
				this.mode = KEYBOARD_MODE.DIGIT;
			},
			//键盘键入
			typing(input) {
				//app中v-model不生效，改用事件方式在外处理
				this.$emit('typing', {
					backspace: false,
					char: input
				})
			},
			//退格键
			backspace() {
				this.$emit('typing', {
					backspace: true
				})
			},
			//键入回车
			enter() {
				//this.deactivate();
				this.$emit('enter');
			},
			//激活键盘
			activate() {
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord();
				// #endif
				this.visible = true;
			},
			//隐藏键盘
			deactivate() {
				this.visible = false;
			}
		},
		watch: {
			lowercase(val) {
				let [...temp ] = this.lines;
				temp.forEach(line => {
					line.forEach((letter, index) => {
						line[index] = val ? letter.toLowerCase() : letter.toUpperCase();
					});
				});
				this.lines = temp;
			},
			visible(val) {
				this.cls = val ? 'slideup' : 'slidedown';
			}
		},
		created() {
			this.lines = this.disorderly ? disorder() : order;
			this.digits = this.disorderly ? digits() : natural;
		}
	}
</script>

<style lang="scss" scoped>
	.key-button {
		display: inline-block;
		overflow: hidden;
		vertical-align: middle;
		border: 1px solid #e6e6e6;
		color: #333;
		background-color: #fff;
		box-shadow: 0 2px 2px rgba(230,230,230,.7);
		border-radius: 0.35em;
		text-align: center;
		white-space: nowrap;
		user-select: none;
		cursor: pointer;
		
		&:active {
			background: #d6d6d6;
			scale: 0.7;
		}
	}
	
	.v-keyboard {
		// transform: translateY(100%);
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		background: #f5f5f5;
		padding: .5em 0;
		z-index: 100;
		
		/*全键盘*/
		.full-keyboard {
			.line {
				text-align: center;
				
				&:not(:last-child) {
					margin-bottom: 0.5em;
				}
				
				.letter {
					height: 3em;
					line-height: 3em;
					font-size: 1em;
					
					&:not(:last-child) {
						margin-right: 0.2em;
					}
				}
				
				.normal {
					width: 5em;
				}
				
				.special-key {
					width: 5em;
				}
			}
				
			.special-line {
				padding: 0 0.35em;
				display: flex!important;
				justify-content: space-around;
				
				.space {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				
				.swith-key {
					width: 5em;
				}
				
				.logo {
					font-size: 12px;
				}
			}
		}
		
		/*数字键盘*/
		.digit-keyboard {
			display: flex;
			flex-direction: row;
			.digit-button-box {
				padding: 0 .35em;
				flex: 80;
				.digit {
					width: 4.46em;
					height: 2.5em;
					line-height: 2.5em;
					margin-bottom: .35em;
					&:nth-child(10),
					&:nth-child(11),
					&:nth-child(12) {
						margin-bottom: 0;
					}
					&:not(:last-child) {
						margin-right: .35em;
					}
				}
			}
			
			.special-button-box {
				flex: 20;
				padding: 0 .35em 0 0;
				.special-button {
					display: block;
					line-height: 5.5em;
					height: 5.5em;
					width: 4em;
					&:not(:last-child) {
						margin-bottom: .35em;
					}
				}
			}
		}
		
		.gray {
			background: #e1e1e1!important;
			&:active {
				background: #fff!important;
			}
		}
		
		.large {
			font-size: 2em!important;
		}
		
		.middle {
			font-size: 1.2em!important;
			display: block;
		}
	}
	@import './css.scss'
</style>
