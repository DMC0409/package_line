<template>
	<view class="container flex image-back-norepeat align-center"
		style="background-image: url('../../static/image/page-back.png');">
		<!-- 设置框 -->
		<view class="dialog-slot-card flex align-center justify-center" v-if="showSetting" @click="showSetting=false">
			<view class="setting-div flex align-center justify-center">
				<view class="set-title">设置</view>
				<view class="set-btn-div flex justify-around">
					<view class="set-btn" @click.stop="onInitSet('init')">初始化设定</view>
					<view class="set-btn" @click.stop="onInitSet('toface')">人脸识别</view>
				</view>
			</view>
		</view>
		<!-- 刷卡框 -->
		<view class="dialog-slot-card flex align-center justify-center" v-if="showShiGongDH">
			<view class="card-div">
				<view class="card-num flex align-center justify-between">
					<text>{{shigongDH2==''?'施工单号':shigongDH2}}</text>
					<image @click="toScan" src="../../static/image/scan.png" alt=""></image>
				</view>
				<view class="detail">
					<view class="jsq flex justify-end">
						<view class="jsq-item flex justify-center align-center" @tap.stop="onClickDH('1')">1</view>
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
						<view class="jsq-item flex justify-center align-center" @tap.stop="onClickDH('0')">0</view>
						<view class="jsq-item flex justify-center align-center" @tap.stop="onClickDH('clear')">清除</view>
						<view class="jsq-item flex justify-center align-center border-right-none"
							@tap.stop="onClickDH('del')">
							<image src="../../static/image/icon-jsq-close.png"></image>
						</view>
					</view>
					<view class="edit-btn flex align-center justify-center" @click="onInputSure">
						{{shigongDH2?'确认':'取消'}}
					</view>
				</view>
			</view>
		</view>
		<view class="header flex image-back-norepeat align-center justify-between"
			style="background-image: url(../../static/image/header-back.png);">
			<view class="reCheck" @click="onSetReCode">
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
		<!-- 弹窗 -->
		<view class="dialog-order" v-if="showOrderList" ref="msk" @click="showOrderList = false">
			<!-- 订单 -->
			<view class="order-info">
				<view class="order-header flex align-center justify-between">
					<view class="header-tex">共计：{{totalRow}}条</view>
					<image @click="showOrderList = false" class="img-close"
						src="../../static/image/right-back-close.png">
					</image>
				</view>
				<view class="order-list">
					<block v-for="(item,index) in dataList" :key="index">
						<view class="order-list-item flex align-center" :class="orderIndex == index?' item-selected':''"
							@click.stop="onEditOrder(item,index)">
							<view class="order-tags" v-if="item.bgTitle" :style="'background-color:'+item.bgColor+';'">
								{{item.bgTitle}}
							</view>
							<view :style="item.bgTitle?'':'margin-left:1vw;'">
								<view :class="orderIndex == index?'item-binahao':''">
									{{item.order_index ? 'No.'+item.order_index:''}}
								</view>
								<view :class="orderIndex == index?'item-title':''">{{item.title}}</view>
								<view>{{item.descA}}</view>
								<view>{{item.descB}}</view>
								<view>{{item.descC}}</view>
								<view>{{item.descD}}</view>
							</view>
						</view>
					</block>
				</view>

				<view class="list-footer flex align-center justify-between">
					<view class="list-btn" @click="onSureLink" style="background-color:green;">
						确认环节
					</view>
					<view class="footer-right-btn"
						style=" display: flex;align-items:center;width:65%;justify-content: flex-end;">
						<view class="list-btn" @click="onPageListCit('pre')">上一页</view>
						<view>{{orderPageIndex}}/{{orderTotalPage}}</view>
						<view class="list-btn" @click="onPageListCit('next')">下一页</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content flex justify-between">
			<!--单号详情-->
			<view class="info-detail flex">
				<view class="detail-top image-back-norepeat flex justify-between align-center"
					style="background-image: url(../../static/image/top-back.png);">
					<view class="top-title u-line-1">订单信息：{{orderDetail.orderTitle || '暂无'}}</view>
					<view class="con-info flex align-center justify-between">
						<view>客户信息：{{orderDetail.customerInfo || '暂无'}}</view>
						<view v-show="orderDetail.orderTime">交期：<text class="date">{{orderDetail.orderTime}}</text>
						</view>
					</view>
					<view class="con-time flex align-center justify-between">
						<text>订单流水号：<text>{{orderDetail.orderNum || '暂无'}}</text></text>
						<view class="value-item flex">
							<block v-for="(item,index) in orderDetail.orderRang" :key="index">
								<span v-if="item.status==-100" class="value black">{{index+1}}</span>
								<span v-else-if="item.status==0" class="value grey">{{index+1}}</span>
								<span v-else class="value green">{{index+1}}</span>
							</block>
						</view>
					</view>
				</view>
				<view class="detail-bottom image-back-norepeat flex justify-center align-center"
					style="background-image: url(../../static/image/bottom-back.png);">
					<view class="steps-all flex justify-between">
						<view class="btm-steps flex align-center" @click="onShowDetail(item,index)"
							v-for="(item,index) in stepsList" :key="index">
							<view :class="index==stepsIndex ?'steps-item steps-item-selected':'steps-item'">
								{{index+1}}
							</view>
							<view class="steps-item-line"></view>
							<view :class="index==stepsIndex ?'btn steps-btn steps-btn-selected':'btn steps-btn'">
								{{item.table_name}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<!--查看图片-->
			<view class="con-right image-back-norepeat flex align-center justify-center"
				style="background-image: url(../../static/image/right-back.png);">
				<view class="right-head flex align-center justify-around">
					<view class="flex align-center justify-center right-btn btn"
						:class="showSGD ? ' right-btn-selected' :''" @click="onLookImg('sgd')">
						<image src="../../static/image/icon-menu.png" mode="widthFix"></image>
						施工单
					</view>
					<view class="flex align-center justify-center right-btn btn"
						:class="showSGD ? '' :'right-btn-selected'" @click="onLookImg('tg')">
						<image src="../../static/image/icon-tugao.png" mode="widthFix"></image>
						图稿
					</view>
				</view>
				<view class="right-image flex align-center justify-center" v-if="showSGD&&shiGongDImg">
					<image @click="previewImg(shiGongDImg)" :src="shiGongDImg" mode="widthFix"></image>
				</view>

				<view v-if="!showSGD&&tuGaoImgList.length>0"
					class="uni-padding-wrap right-image flex align-center justify-center">
					<view class="page-section swiper">
						<view class="page-section-spacing swiper">
							<swiper class="swiper" indicator-dots indicator-colo="#224B7A" interval="10000">
								<swiper-item v-for="(item,index) in tuGaoImgList" :key="index">
									<image @click="previewMoreImage(index)" class="swiper" mode="widthFix"
										:src="item.url"></image>
								</swiper-item>
							</swiper>
						</view>
					</view>
				</view>
				<view class="data-none none-img" v-if="(showSGD&&!shiGongDImg)||(!showSGD&&tuGaoImgList.length<=0) ">
					暂无图片
				</view>
				<!-- <view class="right-head flex align-center justify-around" v-if="showList">
					<view class="add-btn flex align-center justify-center"
						@click="onGetRowDetail(tableRowData,currentIndex,0)">
						立即报工
					</view>
					<view class="add-btn flex align-center justify-center" @click="onSureLink"
						style="background-color:green;">
						确认环节
					</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				appVersion: '',
				time: '',
				date: '',
				week: '',

				showSetting: false,
				showShiGongDH: false,
				shigongDH2: '',

				orderDetail: {
					orderTitle: '',
					orderNum: '',
					orderTime: '',
					customerInfo: '',
					orderRang: [],
					order_id: '',
				},

				stepsIndex: -1,
				stepsList: [],
				config_table_id: -1,
				tuGaoImgList: [],
				showList: true,
				showSGD: false,

				showOrderList: false,
				totalRow: 0,
				dataList: [],
				orderIndex: -1,
				orderPageIndex: 1, //右侧弹框分页
				orderTotalPage: 1, //总页数

				timer: null,
				timer2: null,
			}
		},
		onLoad() {
			this.topRightData()
			this.timer2 = setInterval(() => {
				this.topRightData()
			}, 1000);
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				this.appVersion = wgtinfo.version;
			})
			// #endif
			this.getPackTable()
		},
		computed: {
			...mapState(['vuex_Wifi'])
		},
		methods: {
			// 获取当前时间和日期
			topRightData() {
				this.time = this.$moment().format('HH:mm:ss')
				this.date = this.$moment().format('YYYY-MM-DD')
				this.week = this.$moment().format('dddd')
			},
			// 判断wifi状态
			onSetWifi() {
				// #ifdef APP-PLUS
				var main = plus.android.runtimeMainActivity(); //获取activity  
				var Intent = plus.android.importClass('android.content.Intent');
				var Settings = plus.android.importClass('android.provider.Settings');
				var intent = new Intent(Settings.ACTION_WIFI_SETTINGS); //可设置表中所有Action字段  
				main.startActivity(intent);
				// #endif
			},
			// 获取报工表格
			getPackTable() {
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_sopEquipmentClass',
						need_type: 'getAboutJobTable',
						mySysId: uni.getStorageSync('mySysId'),
						loginsession_sop: uni.getStorageSync('loginsession'),
						table_about_job: 'report'
					}
				}).then(res => {
					this.stepsList = res.data.data.tableList
				}).catch(err => {
					console.log(err)
				})
			},
			// 选择报工步骤
			onShowDetail(item, index) {
				this.stepsDetail = item
				this.stepsIndex = index
				this.config_table_id = item.config_table_id
				this.onSetReCode()
				// this.showOrderList = true
			},
			// 打开施工单号输入框
			onSetReCode() {
				this.showShiGongDH = true
			},
			// 确认/取消施工单号输入框
			onInputSure() {
				if (this.shigongDH2 != '') {
					this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Open_sopEquipmentClass',
							need_type: 'checkScanCodeFun',
							mySysId: uni.getStorageSync('mySysId'),
							loginsession_sop: uni.getStorageSync('loginsession'),
							code: this.shigongDH2,
							isSopRequest: '1'
						}
					}).then(res => {
						// 获取需要报工的单据
						return this.$api({
							url: '/api/data.php',
							method: 'post',
							data: {
								api_class: 'Open_sopEquipmentClass',
								need_type: 'getMobTableList',
								mySysId: uni.getStorageSync('mySysId'),
								loginsession_sop: uni.getStorageSync('loginsession'),
								config_table_id: this.config_table_id,
								order_id: res.data.data.order_id,
								isSopRequest: '1'
							}
						})
					}).then(res => {
						console.log(res)
						const {
							tableHeadList,
							tableInfo
						} = res.data.data
						const list = res.data.data.dataInfo.list
						this.totalRow = list.row
						this.showShiGongDH = false
						this.showOrderList = true
						let getHtmlList = []
						for (let index in list.dataList) {
							var dataInfo = list.dataList[index];
							var tempInfo = {
								'th_com_name': list.dataList[index]['th_com_name'],
								'order_index': list.dataList[index]['order_index'],
								'tb_auto_id': list.dataList[index]['tb_auto_id'],
								'config_table_id': list.dataList[index]['config_table_id'],
								'order_id': list.dataList[index]['order_id'],
								'bgColor': list.dataList[index]['mobsop_line_data_bgcolor'],
								'bgTitle': list.dataList[index]['mobsop_line_data_title'],
								'title': "",
								'descA': "",
								'descB': "",
								'descC': "",
								'descD': ""
							}
							for (let key in tableHeadList) {
								var headInfo = tableHeadList[key];
								if (typeof(headInfo['comm_set_json']) == 'string') {
									headInfo['comm_set_json'] = JSON.parse(headInfo['comm_set_json']);
								}

								//标题
								if (typeof(headInfo['comm_set_json']['user_head_show_title_mob']) != "undefined") {
									if (tempInfo['title'] != '') {
										tempInfo['title'] += " | ";
									}
									tempInfo['title'] += dataInfo['th_' + headInfo['config_table_head_id']] ?
										dataInfo[
											'th_' + headInfo['config_table_head_id']] : '';
								}

								//第一级
								if (typeof(headInfo['comm_set_json']['user_head_show_desc_a_mob']) !=
									"undefined") {
									if (tempInfo['descA'] != '') {
										tempInfo['descA'] += " | ";
									}
									if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
										dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
									}
									tempInfo['descA'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
										headInfo[
											'config_table_head_id']] || '-');
								}

								if (typeof(headInfo['comm_set_json']['user_head_show_desc_b_mob']) !=
									"undefined") {
									if (tempInfo['descB'] != '') {
										tempInfo['descB'] += " | ";
									}
									if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
										dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
									}
									tempInfo['descB'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
										headInfo[
											'config_table_head_id']] || '-');
								}

								if (typeof(headInfo['comm_set_json']['user_head_show_desc_c_mob']) !=
									"undefined") {
									if (tempInfo['descC'] != '') {
										tempInfo['descC'] += " | ";
									}
									if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
										dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
									}
									tempInfo['descC'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
										headInfo[
											'config_table_head_id']] || '-');
								}

								if (typeof(headInfo['comm_set_json']['user_head_show_desc_d_mob']) !=
									"undefined") {
									if (tempInfo['descD'] != '') {
										tempInfo['descD'] += " | ";
									}
									if (dataInfo['th_' + headInfo['config_table_head_id']] == "") {
										dataInfo['th_' + headInfo['config_table_head_id']] = " — ";
									}
									tempInfo['descD'] += (headInfo['head_name'] || '-') + ":" + (dataInfo['th_' +
										headInfo[
											'config_table_head_id']] || '-');
								}
							}
							getHtmlList[index] = tempInfo;
						}
						this.dataList = getHtmlList
						//总共有多少页
						let count = Number(res.data.data.dataInfo.list.row) / 10
						if (count > parseInt(count)) {
							this.totalPage = parseInt(count) + 1;
						} else {
							this.totalPage = parseInt(count);
						}
						console.log(this.dataList)
					}, () => {
						this.showShiGongDH = false
					}).catch(err => {
						console.log(err)
					})
				} else {
					// 关闭施工单号输入框
					this.showShiGongDH = false
				}
			},
			// 选中右侧订单
			onEditOrder(item, index) {
				this.orderIndex = index
			},
			// 执行扫一扫获取单号
			toScan() {
				let _this = this
				uni.scanCode({
					onlyFromCamera: true,
					success: function(res) {
						_this.shigongDH2 = res.result
					}
				})
			},
			//刷卡施工单号
			onClickDH(num) {
				if (num == 'del') {
					this.shigongDH2 = this.shigongDH2.substring(0, this.shigongDH2.length - 1)
				} else if (num == 'clear') {
					this.shigongDH2 = ''
				} else {
					this.shigongDH2 += num
				}
			},
			// 重新登录
			onInitSet(type) {
				if (type == 'init') {
					uni.removeStorageSync('loginsession')
					uni.reLaunch({
						url: '../index/index'
					})
				} else {
					return uni.showToast({
						title: '暂无',
						icon: 'none'
					})
				}
			},
			onSureLink() {}
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
		// padding-top: 5vh;
		flex-direction: column;

		.dialog-slot-card {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba($color: #000000, $alpha: .7);
			z-index: 110;

			.card-div {
				width: 40%;
				height: 75%;
				background: #061830;
				border-radius: 10rpx;
				padding: 3vh;

				.card-num {
					width: 95%;
					height: 4vh;
					background: #081E39;
					border-radius: 1vh;
					padding: 1.5vh 1.6vh;
					border: 1rpx solid #9CC8ED;
					font-weight: bold;
					color: #9CC8ED;
					font-size: 1.5vw;

					image {
						width: 2vw;
						height: 2vw;
					}
				}

				.detail {
					width: 100%;
					height: 82%;
					margin-top: 20rpx;

					.jsq {
						width: 100%;
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

							image {
								width: 3vw;
								height: 3vw;
								position: absolute;
							}
						}

						.border-right-none {
							border-right: none
						}

						.border-bottom-none {
							border-bottom: none
						}
					}

					.edit-btn {
						width: 100%;
						height: 20%;
						color: #FFFFFF;
						font-size: 1.7vw;
						background-color: #73C7EF;
						margin-top: 2vh;
					}
				}
			}

			.setting-div {
				width: 30vw;
				max-width: 30vw;
				min-height: 30vh;
				background: #061830;
				border-radius: 10rpx;
				flex-direction: column;
				color: #9CC8ED;

				.set-title {
					font-size: 2vw;
					margin-bottom: 10vh;
				}

				.set-btn-div {
					width: 100%;
					font-size: 12px;
					color: #FFFFFF;

					.set-btn {
						padding: 1.5vh 2vh;
						background-color: #2878FF;
						border-radius: 5rpx;
					}
				}
			}
		}

		.header {
			width: 100%;
			height: 11vh;
			margin-top: 5vh;
			color: #A6C4E6;

			.reCheck {
				width: 30%;
				text-indent: 40rpx;
				font-size: 20px;
				font-weight: bold;
			}

			.logo {
				width: 10vw;
				height: 5vh;
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

		.dialog-order {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba($color: #000000, $alpha: .7);
			z-index: 100;

			.order-info {
				position: absolute;
				right: 0;
				z-index: 101;
				width: 40%;
				height: 100%;
				background-color: #EFF4FF;
				color: #222222;

				.order-header {
					padding: 8rpx 10rpx 8rpx 20rpx;
					background-color: #96CDF7;
					height: 6vh;

					.header-tex {
						font-size: 1vw;
						color: #222222;
					}

					.img-close {
						width: 1.5vw;
						height: 1.5vw;
					}
				}

				.order-list {
					font-size: 2vh;
					color: #080b15;
					height: 84%;
					overflow: auto;

					.order-list-item {
						padding: 8rpx 0 4rpx 0;
						border-bottom: 1rpx solid #DCDFE7;

						.order-tags {
							width: 4vw;
							min-width: 3.5vw;
							padding: 6vh 0;
							border-radius: 2vw 0 0 2vw;
							-webkit-writing-mode: vertical-lr;
							writing-mode: vertical-lr;
							font-size: 2vw;
							text-align: center;
							font-weight: bold;
							color: #FFFFFF;
							margin-right: 1vw;
							padding-left: 0.6vh;
						}

						view {
							margin-bottom: 6rpx;
							margin-right: 6rpx;
							opacity: 0.5;
						}

						.item-binahao {
							font-weight: bold;
							color: #222222;
							opacity: 1;
						}

						.item-title {
							color: #222222;
							opacity: 1;
						}
					}

					.item-selected {
						border: 2rpx solid #42B5F1;
						background: linear-gradient(to right, #EFF4FF 64%, #C8E3FF);
					}
				}


				.list-footer {
					width: 100%;
					height: 10%;
					font-size: 1.5vw;
					color: #222222;
					box-shadow: 0 -2rpx 8rpx -1rpx #333F5A;

					.list-btn {
						margin: 0 10rpx;
						background: #007aff;
						border-radius: 0.8vw;
						font-size: 1vw;
						padding: 1.5vh 2.5vw;
						color: #FFFFFF;
						text-align: center;
					}
				}
			}
		}

		.content {
			width: 100%;
			height: 89vh;
			padding: 9rpx 1rpx;

			.info-detail {
				width: 60%;
				height: 96%;
				flex-direction: column;

				.detail-top {
					width: 85%;
					margin: auto;
					height: 20%;
					color: #A6C4E6;
					font-size: 1vw;
					padding: 2vh 3vw;
					flex-direction: column;

					.top-title {
						width: 100%;
						min-height: 11rpx;
					}

					.con-info {
						width: 100%;
						margin-top: 5rpx;

						.date {
							font-size: 1.5vw;
							font-weight: bold;
						}
					}

					.con-time {
						width: 100%;

						.value-item {
							padding: 5rpx;

							.value {
								width: 2vw;
								height: 2vw;
								margin: 0 5rpx;
								color: #FFFFFF;
								font-size: 1vw;
								text-align: center;
								line-height: 2vw;
								border-radius: 2rpx;
								font-weight: bold;
							}

							.green {
								background-color: #28A743;
							}

							.grey {
								background-color: #969696;
							}

							.black {
								background-color: #545454;
							}
						}
					}
				}

				.detail-bottom {
					width: 100%;
					height: 80%;

					.steps-all {
						height: 85%;
						width: 80%;
						overflow: auto;
						flex-direction: row;
						flex-wrap: wrap;

						.btm-steps {
							width: 50%;

							.steps-item {
								width: 2vw;
								height: 2vw;
								background: rgba(159, 196, 225, 0.8);
								color: #FFFFFF;
								font-size: 1vw;
								border-radius: 50rpx;
								text-align: center;
								line-height: 2vw;
								font-weight: bold;
								position: relative;
							}

							.steps-item-selected {
								background: #9FC4E1;
								box-shadow: 2rpx 0 8rpx -1rpx #9FC4E1;
							}

							.steps-item-line {
								width: 3vw;
								height: 1rpx;
								border-top: 1rpx solid #9FC4E1;
								opacity: 0.2;
							}

							.steps-btn {
								font-size: 1.3vw;
								width: 14vw;
								padding: 1.3vh 1.5vw;
								text-align: center;
								background: rgba($color: #9FC4E1, $alpha: .4);
								border-radius: 5rpx;
								margin: 0;
								color: #fff;
							}

							.steps-btn-selected {
								border: 1rpx solid #9FC4E1;
								box-shadow: 2rpx 0 8rpx -1rpx #9FC4E1;
							}
						}
					}
				}
			}

			.con-right {
				width: 40%;
				height: 96%;
				flex-direction: column;

				.right-head {
					width: 100%;

					.right-btn {
						color: #FFFFFF;
						font-size: 1.3vw;
						background-color: #12304C;
						padding-left: 20rpx;
						padding: 1vh 2vw;

						image {
							width: 1vw;
							height: 1vw;
							margin-right: 5rpx;
						}
					}

					.add-btn {
						color: #FFFFFF;
						font-size: 1.3vw;
						background-color: #007AFF;
						border-radius: 0.3vw;
						padding: 1.5vh 3.5vw;
					}

					.right-btn-selected {
						background-color: #9FC4E1;
					}
				}

				.right-image {
					width: 31vw;
					// height: 72%;
					margin: 2.5vh 0;
					flex: 1;

					image {
						max-height: 100%;
						max-width: 75%;
					}
				}

				.swiper {
					width: 100%;
					height: 100%;

					swiper-item {
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
	}
</style>