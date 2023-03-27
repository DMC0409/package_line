<template>
	<view class="container flex image-back-norepeat align-center"
		style="background-image: url('../../static/image/page-back.png');">
		<!-- 放大查看图片 -->
		<previewImage ref="previewImage" :opacity="1" :saveBtn="false" :circular="true" />
		<!-- 确认结束环节弹窗 -->
		<info-sure-modal :showLink.sync="showLink" :rowData="rowData" :title="linkTitle" />
		<!-- 设置框 -->
		<view class="dialog-slot-card flex align-center justify-center" v-if="showSetting" @click="showSetting=false">
			<view class="setting-div flex align-center justify-center" @click.stop="onEgg">
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
		<!-- 订单详情编辑 -->
		<view class="dialog-order-detail" v-if="showOrderDetail" @click="showOrderDetail = false">
			<view class="detail-info" @click.stop="onEgg">
				<view class="detail-header flex align-center justify-between">
					<view class="header-tex">{{dataDetailAllList.formTitle}}</view>
					<image @click="onCloseDataDetail" class="img-close" src="../../static/image/icon-close.png">
					</image>
				</view>
				<viwe class="detail-content flex">
					<view class="detail-con-left flex">
						<view style="height:80%;overflow: auto;">
							<view>
								订单需要：
								<!-- {{dataDetailAllList.yieldInfo.all ||0}}， -->
								已经报工：
								<!-- {{dataDetailAllList.yieldInfo.curr||0}} -->
							</view>
							<!-- <block v-for="(item,index) in dataDetailList" :key="index">
								<view class="left-item flex align-center" v-if="item.head_input_set == 20 || item.head_input_set ==21">
									{{item.head_name ||''}}：
									<view class="type-btn flex align-center justify-around">
										<view v-for="(val,ind) in JSON.parse(item.head_input_setjson)" :key="ind"
											:class="item.head_input_value === ind?'type-item type-item-selected':'type-item'"
											@click="onClickOrderIndex(index,ind)">{{val.name}}</view>
									</view>
								</view>
								<view class="left-item flex align-center"
									v-else-if="item.head_input_save ==1 || item.head_input_save ==2">
									{{item.head_name||''}}：<input type="text" :value="item.head_input_value"
										:class="inputIndex==index ?'input-selected':''" @click="onFocusValue(index)"
										disabled />
								</view>
							</block> -->
						</view>
						<view class="left-switch flex align-center justify-between">
							<view class="switch-title">
								<!-- {{dataDetailAllList.list_Info.list_name}}- -->
								<!-- <span v-if="dataDetailAllList.list_log_Info.list_status === '100'"> 是否驳回?</span> -->
								是否驳回?
								<!-- <span v-else> 是否完成?</span> -->
								<span>是否完成?</span>
							</view>
							<switch color="#007AFF" @change="onChangeChecked" />
						</view>
					</view>
					<view class="detail-con-right">
						<view class="jsq flex">
							<view class="jsq-item flex justify-center align-center" @tap="onClickNum('1')">1</view>
							<view class="jsq-item flex justify-center align-center" @tap="onClickNum('2')">2</view>
							<view class="jsq-item flex justify-center align-center border-right-none" @tap="onClickNum('3')">3</view>
							<view class="jsq-item flex justify-center align-center" @tap="onClickNum('4')">4</view>
							<view class="jsq-item flex justify-center align-center" @tap="onClickNum('5')">5</view>
							<view class="jsq-item flex justify-center align-center border-right-none" @tap="onClickNum('6')">6</view>
							<view class="jsq-item flex justify-center align-center" @tap="onClickNum('7')">7</view>
							<view class="jsq-item flex justify-center align-center" @tap="onClickNum('8')">8</view>
							<view class="jsq-item flex justify-center align-center border-right-none" @tap="onClickNum('9')">9</view>
							<view class="jsq-item flex justify-center align-center" @tap="onClickNum('*')">*</view>
							<view class="jsq-item flex justify-center align-center" @tap="onClickNum('0')">0</view>
							<view class="jsq-item flex justify-center align-center border-right-none" @tap="onClickNum('.')">.</view>
							<view class="jsq-item flex justify-center align-center" @tap="onClickNum('-')">-</view>
							<view class="jsq-item flex justify-center align-center" @tap="onClickNum('清除')">清除</view>
							<view class="jsq-item flex justify-center align-center border-right-none" @tap="onClickNum('del')">
								<image src="../../static/image/icon-jsq-close.png"></image>
							</view>
						</view>
						<!-- <view class="edit-btn" @click="onSureEdit">{{!AddSuccess?'确认':'修改'}}</view> -->
						<view class="edit-btn flex align-center justify-center">
							<input type="text" :value="emploId" @input="onInputValue" @confirm="onSureEdit"
								:focus="getFocus" @blur="getFocus1()" placeholder="员工卡号"
								placeholder-class="place-class" />
							<image class="input-close" @tap.stop="onDelInput" src="../../static/image/input-close.png">
							</image>
							<view class="submit-btn" @click="onSureEdit">提交</view>
						</view>
					</view>
				</viwe>
			</view>
		</view>
		<!-- 头部 -->
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
			<view class="order-info" @click.stop="onEgg">
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
										:src="item.url">
									</image>
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
	import previewImage from '@/components/kxj-previewImage/kxj-previewImage.vue';
	import infoSureModal from '../../components/info-sure-modal.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			previewImage,
			infoSureModal
		},
		data() {
			return {
				appVersion: '',
				time: '',
				date: '',
				week: '',

				showSetting: false,
				showShiGongDH: true,
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

				showList: true,
				showSGD: false,
				shiGongDImg: '', //施工单图片
				tuGaoImgList: [],
				imgs: [], //预览图片

				showOrderList: false,
				totalRow: 0,
				dataList: [],
				orderIndex: -1,
				orderPageIndex: 1, //右侧弹框分页
				orderTotalPage: 1, //总页数

				showLink: false,
				rowData: {},
				linkTitle: '',
				
				dataDetailAllList: {}, //点击新增所有信息
				showOrderDetail: false,

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
						table_about_job: 'report',
						isSopRequest: '1'
					}
				}).then(res => {
					this.stepsList = res.data.data.tableList
				}).catch(err => {
					console.log(err)
				})
			},
			// 选择报工步骤
			onShowDetail(item, index) {
				if (this.orderDetail.order_id == '') {
					return uni.showToast({
						title: '请输入有效施工单号',
						icon: 'error',
						duration: 2000
					})
				}
				this.stepsDetail = item
				this.stepsIndex = index
				this.config_table_id = item.config_table_id
				// 获取需要报工的单据
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_sopEquipmentClass',
						need_type: 'getMobTableList',
						mySysId: uni.getStorageSync('mySysId'),
						loginsession_sop: uni.getStorageSync('loginsession'),
						config_table_id: this.config_table_id,
						order_id: this.orderDetail.order_id,
						isSopRequest: '1'
					}
				}).then(res => {
					console.log(res)
					const {
						tableHeadList,
						tableInfo
					} = res.data.data
					const list = res.data.data.dataInfo.list
					this.totalRow = list.row
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
				}, () => {

				}).catch(err => {
					console.log(err)
				})
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
						console.log(res)
						const {
							orderInfo,
							customerInfo,
							orderFilesList
						} = res.data.data
						this.orderDetail.order_id = orderInfo.order_id
						this.orderDetail.orderTitle = orderInfo.order_title
						this.orderDetail.orderNum = orderInfo.order_index
						this.orderDetail.orderTime = orderInfo.timen_end
						this.orderDetail.customerInfo = orderInfo.company_name_str
						this.orderDetail.orderRang = JSON.parse(orderInfo.now_range_show)
						this.shiGongDImg = orderInfo.order_img || ''
						this.tuGaoImgList = orderFilesList
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
				this.showOrderDetail = true
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
			// 预览图片单张
			previewImg(logourl) {
				this.$nextTick(function() {
					this.imgs = [logourl]
					// this.swiperIndex = 0
					this.$refs.previewImage.open(this.imgs, 0);
				})
				// let _this = this;
				// let imgsArray = [];
				// imgsArray[0] = logourl
				// uni.previewImage({
				// 	current: 0,
				// 	urls: imgsArray,
				// 	indicator:'default'
				// });
			},
			// 多张
			previewMoreImage(index) {
				let _this = this;
				let imgArray = [];
				for (let i = 0; i < _this.tuGaoImgList.length; i++) {
					imgArray.push(_this.tuGaoImgList[i].url);
				}
				this.$nextTick(function() {
					this.imgs = imgArray
					this.swiperIndex = index
					this.$refs.previewImage.open(this.imgs, this.swiperIndex);
				})
				// uni.previewImage({
				// 	current: index, //当前为第几张
				// 	urls: imgArray,
				// 	indicator: 'number',
				// 	loop: true,
				// })
			},
			// 切换图片
			onLookImg(type) {
				if (type == 'sgd') {
					this.showSGD = true
				} else {
					this.showSGD = false
				}
			},
			onSureLink() {
				if (this.orderIndex != -1) {
					this.showLink = true
					// this.linkTitle = this.dataList[this.orderIndex]
				}

			},
			onEgg() {}
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

		.dialog-order-detail {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba($color: #000000, $alpha: .5);
			z-index: 110;
			display: flex;
			align-items: center;
			justify-content: center;

			.detail-info {
				width: 68%;
				height: 64%;
				border: 1rpx solid #42B5F1;
				border-radius: 11rpx;
				background-color: #090E21;

				.detail-header {
					height: 8%;
					background: #081D38;
					border-radius: 11rpx 11rpx 0rpx 0rpx;
					padding: 1.5vh 2vw;

					.header-tex {
						font-size: 1.2vw;
						color: #A6C4E6;
					}

					.img-close {
						width: 1.3vw;
						height: 1.3vw;
					}
				}

				.detail-content {
					width: 100%;
					height: 92%;

					.detail-con-left {
						width: 63%;
						height: 100%;
						flex-direction: column;
						color: #A6C4E6;
						// font-size: 10rpx;
						font-size: 1.5vw;
						// font-weight: bold;
						// padding: 15rpx 0 0 14rpx;
						padding: 3vh 0 0 3vh;
						position: relative;

						.left-item {;
							margin: 3vh 0;

							input {
								width: 17vw;
								padding: 5rpx 0;
								// height: 10rpx;
								background: #0A223B;
								border: 1rpx solid #0A223B;
								border-radius: 5rpx;
								padding: 5rpx 16rpx;
								outline: 0;
								font-size: 1.5vw;
								font-weight: bold;
								color: #A4CEF4;
								height: 3.5vh;

								&:focus {
									border: 1rpx solid #00FFFF;
									outline: 0;
								}
							}

							.input-selected {
								border: 1rpx solid #00FFFF;
							}

							.type-btn {
								width: 70%;

								.type-item {
									padding: 5rpx 12rpx;
									background: #061830;
									border-radius: 5rpx;
									font-size: 1.5vw;
								}

								.type-item-selected {
									background: #A6C4E6;
									color: #FFFFFF;
								}
							}
						}

						.left-switch {
							width: 90%;
							position: absolute;
							bottom: 20px;

							switch {
								opacity: .8;
							}
						}
					}

					.detail-con-right {
						width: 37%;
						height: 100%;
						background-color: #061830;
						border-radius: 0rpx 11rpx 11rpx 0rpx;
						border-left: 1rpx solid #42B5F1;

						.jsq {
							width: 100%;
							height: 80%;
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

								image {
									width: 2vw;
									height: 2vw;
									position: absolute;
									// margin-top: 14rpx;
									// margin-left: -14rpx;
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
							font-size: 1.5vw;
							// background: #73C7EF;
							border-radius: 0 0 9rpx 0;
							padding: 0 1vh;

							input {
								width: 70%;
								background: #0A223B;
								border-radius: 0.5vh 0 0 0.5vh;
								padding: 2vh 2.2vw 2vh 0.8vw;
								outline: 0;
								position: relative;
								border: 1rpx solid #73C7EF;

								&:focus {
									border: 1rpx solid #00FFFF;
								}
							}

							.place-class {
								font-size: 1.5vw;
								color: #9CC8ED;
							}

							.input-close {
								position: absolute;
								width: 2.5vw;
								height: 2.5vw;
								margin-left: 5vw;
							}

							.submit-btn {
								width: 20%;
								font-size: 1.5vw;
								padding: 1.8vh 2vh;
								width: 10vh;
								background: #73C7EF;
								border-radius: 0 0.5vh 0.5vh 0;
							}
						}
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
							flex-wrap: wrap;

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
					height: 72%;
					margin: 2.5vh 0;
					// flex: 1;

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