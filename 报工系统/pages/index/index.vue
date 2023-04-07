<template>
	<view class="container flex image-back-norepeat align-center"
		style="background-image: url('../../static/image/page-back.png');">
		<!-- 自定义键盘 -->
		<v-keyboard ref="keyboard" :disorderly="false" @typing="typing" @enter="enter"></v-keyboard>
		<!-- 人脸识别窗口 -->
		<checkFace v-if="checkIngFace" @stopCheckFace="stopCheckFace" @checkSuccess="onSureEdit"
			:dataDetailAllList="dataDetailAllList">
		</checkFace>
		<!-- 自定义提示框 -->
		<tipModal></tipModal>
		<!-- 设置wifi -->
		<wifiModal v-if="settingWifi" @closeWifi="settingWifi = false"></wifiModal>
		<!-- 放大查看图片 -->
		<previewImage ref="previewImage" :opacity="1" :saveBtn="false" :circular="true" />
		<!-- 确认结束环节弹窗 -->
		<info-sure-modal :showLink.sync="showLink" :rowData="rowData" :orderId="orderDetail.order_id"
			:configTableId="tableInfoLink.config_table_id_main" :title="linkTitle" />
		<!-- 设置框 -->
		<view class="dialog-slot-card flex align-center justify-center" v-if="showSetting" @click="showSetting=false">
			<view class="setting-div flex align-center justify-center" @click.stop="onEgg">
				<view class="set-title">设置</view>
				<view class="set-btn-div flex justify-around">
					<view class="set-btn" @click.stop="onInitSet">
						初始化设定
					</view>
				</view>
			</view>
		</view>
		<!-- 刷卡框 -->
		<view class="dialog-slot-card flex align-center justify-center" v-if="showShiGongDH">
			<view class="card-div">
				<!-- <view class="card-num flex align-center justify-between">
					<text>{{shigongDH2==''?'施工单号':shigongDH2}}</text>
					<image @click="toScan" src="../../static/image/scan.png" alt=""></image>
				</view> -->
				<input type="number" :focus="getFocus" @blur="toFocus" v-model="shigongDH2"
					placeholder-class="place-class" @confirm="onInputSure" placeholder="施工单号">
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
					<view class="card-operate flex align-center justify-between">
						<view class="edit-btn cancel flex align-center justify-center" @click="offInputSure">
							取消
						</view>
						<view class="edit-btn flex align-center justify-center" @click="onInputSure">
							确认
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 订单详情编辑 -->
		<view class="dialog-order-detail" v-if="showOrderDetail" @click="showOrderDetail = false">
			<view class="detail-info" @click.stop="onEgg">
				<view class="detail-header flex align-center justify-between">
					<view class="header-tex">No. {{dataDetailAllList.order_index}}</view>
					<image @click="showOrderDetail = false" class="img-close" src="../../static/image/icon-close.png">
					</image>
				</view>
				<view class="detail-content">
					<view class="detail-con-out flex">
						<view class="detail-con-left flex">
							<view style="height:90%;overflow: auto;">
								<view>
									订单需要：
									{{dataDetailAllList.yieldInfo.all.num ||0}}，
									已经报工：
									{{dataDetailAllList.yieldInfo.curr.num||0}}
								</view>
								<block v-for="(item,index) in dataDetailList" :key="index">
									<view class="left-item flex align-center"
										v-if="item.head_style == '0' && item.comm_set_json.show_job_submission!=undefined">
										{{item.head_name}}：
										<view class="type-btn flex align-center justify-start"
											v-if="item.head_input_set == '30' || item.head_input_set == '31'">
											<picker class="type-item" mode="date" :value="item.this_str"
												:disabled="item.comm_set_json.set_job_submission!=undefined || item.comm_set_json.isedit!=undefined"
												start="2020-01-01 00:00:00" end="2030-01-01 00:00:00">
												<view>{{item.this_str}}</view>
											</picker>
										</view>
										<view class="type-btn flex align-center justify-start"
											v-else-if="item.head_input_set == '20' || item.head_input_set == '21'">
											<view class="type-item" @click="getPickerArr(index)">
												{{item.this_str}}
											</view>
											<image v-if="pickerArr.length!=0" class="triangle"
												src="../../static/image/triangle-up.png">
											</image>
											<view class="equipmOut flex" v-if="pickerArr.length!=0">
												<view class="eachEquip" @click.stop="bindPickerArr(i)"
													v-for="(i,num) in pickerArr" :key="num">
													{{i.label}}
												</view>
											</view>
										</view>
										<view class="type-btn flex align-center justify-start"
											v-else-if="item.head_input_set == '1' || item.head_input_set == '2'">
											<view class="type-item" :class="inputIndex==index ?'input-selected':''"
												v-if="item.head_input_save == '1' || item.head_input_save == '2'"
												@click="onFocusValue(index)">
												{{item.this_value}}
											</view>
											<view class="type-item" v-else>
												<input type="text" v-model="item.this_value"
													:disabled="item.comm_set_json.set_job_submission!=undefined || item.comm_set_json.isedit!=undefined">
											</view>
										</view>
										<view class="type-btn flex align-center justify-start" v-else>
											<view class="type-item">
												{{item.this_str}}
											</view>
										</view>
									</view>
									<view class="left-item flex align-center"
										v-else-if="item.head_style=='17' && item.comm_set_json.show_job_submission!=undefined">
										{{item.head_name}}：
										<view class="type-btn flex align-center justify-start">
											<view class="type-item" @click="getEquimp(index)">
												{{item.this_str?item.this_str:'-'}}
											</view>
											<image v-if="equimpArr.length!=0" class="triangle"
												src="../../static/image/triangle-up.png">
											</image>
											<view class="equipmOut flex" v-if="equimpArr.length!=0">
												<view class="eachEquip" @click.stop="bindPickerEquip(i)"
													v-for="(i,num) in equimpArr" :key="num">
													{{i.equipment_name}}
												</view>
											</view>
										</view>
									</view>
									<view class="left-item flex align-center"
										v-else-if="item.comm_set_json.show_job_submission!=undefined">
										{{item.head_name}}：
										<view class="type-btn flex align-center justify-start">
											<view class="type-item">{{item.this_str}}</view>
										</view>
									</view>
								</block>
							</view>
						</view>
						<view class="detail-con-right">
							<view class="jsq flex">
								<view class="jsq-item flex justify-center align-center" @tap="onClickNum('1')">1</view>
								<view class="jsq-item flex justify-center align-center" @tap="onClickNum('2')">2</view>
								<view class="jsq-item flex justify-center align-center border-right-none"
									@tap="onClickNum('3')">3</view>
								<view class="jsq-item flex justify-center align-center" @tap="onClickNum('4')">4</view>
								<view class="jsq-item flex justify-center align-center" @tap="onClickNum('5')">5</view>
								<view class="jsq-item flex justify-center align-center border-right-none"
									@tap="onClickNum('6')">6</view>
								<view class="jsq-item flex justify-center align-center" @tap="onClickNum('7')">7</view>
								<view class="jsq-item flex justify-center align-center" @tap="onClickNum('8')">8</view>
								<view class="jsq-item flex justify-center align-center border-right-none"
									@tap="onClickNum('9')">9</view>
								<view class="jsq-item flex justify-center align-center" @tap="onClickNum('*')">*</view>
								<view class="jsq-item flex justify-center align-center" @tap="onClickNum('0')">0</view>
								<view class="jsq-item flex justify-center align-center border-right-none"
									@tap="onClickNum('.')">.</view>
								<view class="jsq-item flex justify-center align-center" @tap="onClickNum('-')">-</view>
								<view class="jsq-item flex justify-center align-center" @tap="onClickNum('clear')">清除
								</view>
								<view class="jsq-item flex justify-center align-center border-right-none"
									@tap="onClickNum('del')">
									<image src="../../static/image/icon-jsq-close.png"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="sendReport flex align-center justify-end">
						<view class="edit-btn flex align-center justify-center">
							<view @tap="toEditCard" class="inputContent flex align-center justify-around"
								:class="inputIndex == -1?'checkOut':''">
								<input type="number" v-model="emploId" @blur="toFocus" @confirm="onSureEdit"
									:focus="getFocus" placeholder="员工卡号" placeholder-class="place-class">
								<image class="input-close" @tap.stop="onDelInput"
									src="../../static/image/input-close.png">
								</image>
							</view>
							<view class="submit-btn flex align-center justify-center" @click="onSureEdit">提交</view>
						</view>
						<view class="face-check flex align-center justify-center" @click="toCheckFace">
							人脸识别
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹窗 -->
		<view class="dialog-order" v-if="showOrderList" ref="msk" @click="closeOrderList">
			<!-- 订单 -->
			<view class="order-info" @click.stop="onEgg">
				<view class="order-header flex align-end justify-between">
					<view class="header-tex">共计：{{totalRow}}条</view>
					<image @click="showOrderList = false" class="img-close"
						src="../../static/image/right-back-close.png">
					</image>
				</view>
				<view class="order-list">
					<block v-for="(item,index) in dataList" :key="index">
						<view class="order-list-item flex align-center" :class="orderIndex == index?' item-selected':''"
							@click.stop="onEditOrder(item,index)">
							<view class="order-tags" v-if="item.mobsop_line_data_title"
								:style="'background-color:'+item.mobsop_line_data_bgcolor+';'">
								{{item.mobsop_line_data_title}}
							</view>
							<view :style="item.mobsop_line_data_title?'':'margin-left:1vw;'">
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

				<view class="list-footer flex align-center justify-end">
					<!-- <view class="list-btn" @click="onSureLink" style="background-color:green;">
						确认环节
					</view> -->
					<view class="footer-right-btn"
						style=" display: flex;align-items:center;width:65%;justify-content: flex-end;">
						<view class="list-btn" @click="onPageListCit('pre')">上一页</view>
						<view>{{orderPageIndex}}/{{orderTotalPage}}</view>
						<view class="list-btn" @click="onPageListCit('next')">下一页</view>
					</view>
				</view>
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
				<image v-if="vuex_Wifi" src="../../static/image/icon-wifi.png" @click="settingWifi = true"></image>
				<image v-else src="../../static/image/no-wifi.png" @click="settingWifi = true"></image>
				<view class="time flex">
					<text class="time-moment">{{time}}</text>
					<text class="time-date">{{date}} {{week}}</text>
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
						<view class="btm-steps flex align-center justify-center" v-for="(item,index) in stepsList"
							:key="index">
							<view class="btn steps-btn flex align-center justify-between"
								:class="index==stepsIndex ?'steps-btn-selected':''">
								<view class="step-name" @click="onShowDetail(item,index,'add')">{{item.table_name_be}}
								</view>
								<view class="step-record flex align-center justify-center"
									@click="onShowDetail(item,index,'log')">记录</view>
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
				<view class="data-none none-img flex align-center justify-center"
					v-if="(showSGD&&!shiGongDImg)||(!showSGD&&tuGaoImgList.length<=0) ">
					暂无图片
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import previewImage from '@/components/kxj-previewImage/kxj-previewImage.vue';
	import infoSureModal from '../../components/info-sure-modal.vue'
	// wifi设置弹窗
	import wifiModal from '../../components/main/wifiModel.vue'
	// 自定义键盘
	import vKeyboard from '@/components/VKeyboard/VKeyboard.vue'
	// 人脸识别窗口
	import checkFace from '../../components/main/checkFace.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			previewImage,
			infoSureModal,
			wifiModal,
			vKeyboard,
			checkFace
		},
		data() {
			return {
				appVersion: '', // 系统版本信息
				time: '', // 当前时间
				date: '', // 当前日期
				week: '', //当前星期

				settingWifi: false, // 是否正在设置wifi

				showSetting: false,
				showShiGongDH: true,
				shigongDH2: '230202002',
				getFocus: true,

				orderDetail: {
					orderTitle: '',
					orderNum: '',
					orderTime: '',
					customerInfo: '',
					orderRang: [],
					order_id: '',
				},

				tableInfoLink: {}, //关联表（有a表和b表）

				stepsIndex: -1, //报工步骤选中下标
				stepsList: [], // 报工步骤列表

				showSGD: false,
				shiGongDImg: '', //施工单图片
				tuGaoImgList: [], // 图稿列表
				imgs: [], //预览图片

				showOrderList: false,
				totalRow: 0, // 需要报工的单据条数
				dataList: [],
				orderIndex: -1,
				orderPageIndex: 1, //右侧弹框分页
				orderTotalPage: 1, //总页数

				showLink: false,
				rowData: {},
				linkTitle: '',

				dataDetailAllList: {
					yieldInfo: {
						all: 0,
						curr: 0
					}
				}, //点击新增所有信息
				dataDetailList: [],
				formulaeList: [],
				inputIndex: -1,
				showOrderDetail: false,
				emploId: '', // 报工员工卡号
				Value: [],
				equimpArr: [], // 报工设备选择列表
				pickerArr: [], // 报工表单可选择的数据
				timer: null, //右上角时间循环器
				versionTimer: null, //版本信息循环器
				setLineDataType: '', //add or update

				checkIngFace: true, // 人脸识别窗口
			}
		},
		onLoad() {
			// 获取报工表格
			this.getPackTable()
			// 获取右上角时间值
			this.getNowDate()
			// 每分钟获取右上角时间值
			this.timer = setInterval(() => {
				this.getNowDate()
			}, 1000);
			// 进入页面获取一次版本信息
			this.checkVersion()
			// 每小时获取一次版本信息
			this.versionTimer = setInterval(() => {
				this.checkVersion()
			}, 60 * 60 * 1000)
			// 获取APP版本信息
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				this.appVersion = wgtinfo.version;
			})
			// #endif
		},
		onHide() {
			this.faceInitTimeout && clearTimeout(this.faceInitTimeout);
			this.snapshTimeout && clearTimeout(this.snapshTimeout);
		},
		computed: {
			...mapState(['vuex_Wifi'])
		},
		watch: {
			// 每次报工表单修改目标更改就进行工资计算
			inputIndex() {
				let tempLineInfo = {};
				for (let item of this.dataDetailList) {
					tempLineInfo['th_' + item.config_table_head_id] = item.this_value
				}
				let getNewLine = this.$utils.LineDataFormulae("updata", this.dataDetailList, tempLineInfo,
					this.formulaeList, 'table');
				for (let index in getNewLine) {
					for (let key in this.dataDetailList) {
						if ('th_' + this.dataDetailList[key].config_table_head_id == index) {
							this.dataDetailList[key].this_value = getNewLine[index];
						}
					}
				}
			}
		},
		methods: {
			// 获取当前时间和日期
			getNowDate() {
				this.time = this.$moment().format('HH:mm:ss')
				this.date = this.$moment().format('YYYY-MM-DD')
				this.week = this.$moment().format('dddd')
			},
			// 获取报工表格
			getPackTable() {
				if (!uni.getStorageSync('mySysId')) {
					// 跳转至登录页面
					return uni.reLaunch({
						url: '../login/login'
					})
				}
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
				}, (res) => {
					if (res.data.sign == -99) {
						// 跳转至登录页面
						return uni.reLaunch({
							url: '../login/login'
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 选择报工步骤
			onShowDetail(item, index, type) {
				//是报工还是修改记录
				this.setLineDataType = type;
				this.tableInfoLink = item;
				// 设置报工步骤选中的下标
				this.stepsIndex = index
				// 未填写施工单号则无订单编号（order_id），因此打开输入施工单号弹窗
				if (this.orderDetail.order_id == '') {
					return this.showShiGongDH = true
				}
				// 获取需要报工的单据
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_sopEquipmentClass',
						need_type: 'getMobTableList',
						mySysId: uni.getStorageSync('mySysId'),
						loginsession_sop: uni.getStorageSync('loginsession'),
						config_table_id: this.setLineDataType == 'log' ? this.tableInfoLink.config_table_id_be :
							this.tableInfoLink.config_table_id_main,
						order_id: this.orderDetail.order_id
					}
				}).then(res => {
					this.dealTableList(res)
				}, () => {

				}).catch(err => {
					console.log(err)
				})
			},
			// 处理getMobTableList接口返回值
			dealTableList(res) {
				const {
					tableHeadList,
					tableInfo
				} = res.data.data
				const list = res.data.data.dataInfo.list
				this.totalRow = list.row
				this.showOrderList = true
				let getHtmlList = []
				//处理一下表单表头数据
				let getDataList = this.$utils.processingTableData('normal', list.dataList, tableHeadList);
				for (let index in getDataList) {
					var dataInfo = getDataList[index];
					var tempInfo = {
						'th_com_name': dataInfo['th_com_name'],
						'order_index': dataInfo['order_index'],
						'tb_auto_id': dataInfo['tb_auto_id'],
						'config_table_id': dataInfo['config_table_id'],
						'order_id': dataInfo['order_id'],
						'title': "",
						'descA': "",
						'descB': "",
						'descC': "",
						'descD': ""
					}
					//如果后台没有返回颜色那么这里就要用是否完成来判断，当前返回给前端是是否完成
					if (dataInfo['mobsop_line_data_bgcolor'] == undefined || dataInfo[
							'mobsop_line_data_title'
						] ==
						undefined) {
						if (dataInfo['list_status'] != 100 && dataInfo['list_status'] != -100) {
							tempInfo['mobsop_line_data_bgcolor'] = '#ababec';
							tempInfo['mobsop_line_data_title'] = '未完成'
						} else if (dataInfo['list_status'] == 100) {
							tempInfo['mobsop_line_data_bgcolor'] = 'green';
							tempInfo['mobsop_line_data_title'] = '完成'
						}
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
			},
			// 打开施工单号输入框
			onSetReCode() {
				// 清空施工单号
				this.shigongDH2 = ''
				// 重置报工步骤选中下标
				this.stepsIndex = -1
				// 清空订单信息编号
				this.orderDetail.order_id = ''
				// 显示输入施工单号弹窗
				this.showShiGongDH = true
			},
			// 确认施工单号输入框
			onInputSure() {
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_sopEquipmentClass',
						need_type: 'checkScanCodeFun',
						mySysId: uni.getStorageSync('mySysId'),
						loginsession_sop: uni.getStorageSync('loginsession'),
						code: this.shigongDH2
					}
				}).then(res => {
					const {
						orderInfo,
						customerInfo,
						orderFilesList,
						go_config_table_id,
						go_tb_auto_id
					} = res.data.data
					if (go_config_table_id) {
						// 获取需要报工的单据
						this.$api({
							url: '/api/data.php',
							method: 'post',
							data: {
								api_class: 'Open_sopEquipmentClass',
								need_type: 'getMobTableList',
								mySysId: uni.getStorageSync('mySysId'),
								loginsession_sop: uni.getStorageSync('loginsession'),
								config_table_id: go_config_table_id,
								order_id: orderInfo.order_id,
								tb_auto_id: go_tb_auto_id
							}
						}).then(res => {
							this.offInputSure()
							this.dealTableList(res)
						}).catch(err => {
							console.log(err)
						})
					} else {
						this.orderDetail.order_id = orderInfo.order_id
						this.orderDetail.orderTitle = orderInfo.order_title
						this.orderDetail.orderNum = orderInfo.order_index
						this.orderDetail.orderTime = this.$moment(Number(orderInfo.timen_end * 1000)).format(
							'YYYY-MM-DD')
						this.orderDetail.customerInfo = orderInfo.company_name_str
						this.orderDetail.orderRang = JSON.parse(orderInfo.now_range_show)
						this.shiGongDImg = orderInfo.order_img || ''
						this.tuGaoImgList = orderFilesList
						this.offInputSure()
						if (this.stepsIndex != -1) {
							this.onShowDetail(this.stepsList[this.stepsIndex], this.stepsIndex)
						}
					}
				}, () => {
					// 请求的施工单号不存在，清空施工单号
					this.shigongDH2 = ''
				}).catch(err => {
					console.log(err)
				})
			},
			// 取消施工单号输入框
			offInputSure() {
				this.showShiGongDH = false
			},
			// 失焦后立即聚焦
			toFocus() {
				let that = this
				this.getFocus = false
				let time = setTimeout(() => {
					that.getFocus = true
					clearTimeout(time)
				}, 100)

			},
			// 关闭右侧弹窗
			closeOrderList() {
				this.showOrderList = false
				this.orderIndex = -1
			},
			// 选中右侧弹窗订单
			onEditOrder(item, index) {
				// 清空员工卡号
				this.onDelInput()
				this.orderIndex = index
				this.showOrderDetail = true
				this.dataDetailAllList.order_index = item.order_index
				this.dataDetailAllList.tb_auto_id = item.tb_auto_id
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_sopEquipmentClass',
						need_type: 'getTableDataInfoFun',
						mySysId: uni.getStorageSync('mySysId'),
						loginsession_sop: uni.getStorageSync('loginsession'),
						kyle_data: JSON.stringify({
							order_id: this.orderDetail.order_id,
							config_table_id: this.tableInfoLink.config_table_id_be,
							tb_auto_id: this.setLineDataType == 'add' ? '0' : item.tb_auto_id,
							src_tb_auto_id: item.tb_auto_id,
							src_config_table_id: item.config_table_id,
							table_about_job: 'report',
						})
					}
				}).then(res => {
					this.formulaeList = res.data.data.formulaeList
					this.dataDetailList = res.data.data.tableHeadList
					this.dataDetailAllList.lineInfo = res.data.data.lineInfo
					this.dataDetailAllList.yieldInfo = res.data.data.yieldInfo
					this.dataDetailAllList.subToken = res.data.data.sub_token
				}).catch(err => {
					console.log(err)
				})
			},
			//取消input调起键盘事件
			onFocusValue(index) {
				//报工时候set_job_submission，编辑时isedit
				if (this.dataDetailList[index].comm_set_json['set_job_submission'] != undefined || this.dataDetailList[
						index].comm_set_json[
						'isedit'] != undefined) {
					return;
				}
				this.Value = []
				this.inputIndex = index || 0
			},
			// 获取报工表单可选列表
			getPickerArr(index) {
				//报工时候set_job_submission，编辑时isedit
				if (this.dataDetailList[index].comm_set_json['set_job_submission'] != undefined || this.dataDetailList[
						index].comm_set_json[
						'isedit'] != undefined) {
					return;
				}
				if (this.dataDetailList[index]['head_style'] != 0) {
					//除了设备可以选择操作，其他暂时不可以
				} else {
					if (this.dataDetailList[index]['head_input_set'] == 20) {
						this.inputIndex = index || 0
						this.pickerArr = this.dataDetailList[index].head_input_setjson
					} else {
						if ((this.dataDetailList[index]['head_input_save'] == 1 || this.dataDetailList[index][
								'head_input_save'
							] == 2) &&
							this.dataDetailList[index]['head_input_set'] != 30 && this.dataDetailList[index][
								'head_input_set'
							] != 31) {
							// this.setData({
							// 	setNumSign: true,
							// 	setNumString: selectHeadInfo.this_value == 0 || isNaN(selectHeadInfo.this_value) ?
							// 		'' : selectHeadInfo.this_value
							// });
						}
					}
				}
			},
			bindPickerArr(item) {
				// 赋值选中的可选值
				this.$set(this.dataDetailList[this.inputIndex], 'this_value', item.value)
				this.$set(this.dataDetailList[this.inputIndex], 'this_str', item.label)
				this.pickerArr = []
			},
			// 获取设备列表
			getEquimp(index) {
				this.inputIndex = index || 0
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: {
						api_class: 'Open_sopEquipmentClass',
						need_type: 'getEquipmentList',
						mySysId: uni.getStorageSync('mySysId'),
						loginsession_sop: uni.getStorageSync('loginsession'),
						ass_equipment_type_id: this.dataDetailList[index].comm_set_json.select_accurate_type_id
					}
				}).then(res => {
					this.equimpArr = res.data.data.equipmentList.list.dataList
				}).catch(err => {
					console.log(err)
				})
			},
			// 修改选中设备值
			bindPickerEquip(item) {
				// 赋值选中设备的名称及设备id
				this.$set(this.dataDetailList[this.inputIndex], 'this_value', item.ass_equipment_id)
				this.$set(this.dataDetailList[this.inputIndex], 'this_str', item.equipment_name)
				// 
				let tempLineInfo = {};
				for (let item of this.dataDetailList) {
					tempLineInfo['th_' + item.config_table_head_id] = item.this_value
				}
				let getNewLine = this.$utils.LineDataFormulae("updata", this.dataDetailList, tempLineInfo,
					this.formulaeList, 'table');
				for (let index in getNewLine) {
					for (let key in this.dataDetailList) {
						if ('th_' + this.dataDetailList[key].config_table_head_id == index) {
							this.dataDetailList[key].this_value = getNewLine[index];
						}
					}
				}
				this.equimpArr = []
			},
			//键盘
			onClickNum(num) {
				let headValue
				if (this.inputIndex == -1) {
					headValue = this.emploId
				} else {
					headValue = this.dataDetailList[this.inputIndex].head_input_value
				}
				if (num == 'del') {
					headValue = headValue.substring(0, headValue.length - 1)
					this.Value = headValue.split(',')
				} else if (num == 'clear') {
					this.Value = []
					headValue = ''
				} else {
					this.Value.push(num)
					headValue = this.Value.join('')
				}
				if (this.inputIndex == -1) {
					this.emploId = headValue
				} else {
					this.$set(this.dataDetailList[this.inputIndex], 'this_value', headValue)
					this.$set(this.dataDetailList[this.inputIndex], 'this_str', headValue)
				}
			},
			// 编辑员工卡号
			toEditCard() {
				this.inputIndex = -1
				this.Value = this.emploId.split('')
			},
			// 清空员工卡号
			onDelInput() {
				this.emploId = '';
				this.Value = []
			},
			// 提交报工信息
			onSureEdit(data) {
				console.log(data)
				return
				// 让员工卡号输入框失焦
				this.inputIndex = -2
				// 计算上报工资，以防用户自行虚假填写
				let tempLineInfo = {};
				for (let item of this.dataDetailList) {
					tempLineInfo['th_' + item.config_table_head_id] = item.this_value
				}
				let getNewLine = this.$utils.LineDataFormulae("updata", this.dataDetailList, tempLineInfo,
					this.formulaeList, 'table');
				for (let index in getNewLine) {
					for (let key in this.dataDetailList) {
						if ('th_' + this.dataDetailList[key].config_table_head_id == index) {
							this.dataDetailList[key].this_value = getNewLine[index];
						}
					}
				}
				let dataList = []
				for (let item of this.dataDetailList) {
					// 判断是否列入传参列表中
					if (item.comm_set_json['set_job_submission_src_head_id'] ==
						undefined && (item.comm_set_json['set_job_submission'] !=
							undefined || item.comm_set_json['isedit'] != undefined)) {
						// 停止循环执行下一个循环
						continue;
					}
					// 对列表数据进行非空判断
					if (item.comm_set_json['set_not_null'] != undefined && item.comm_set_json['set_not_null'] == '1' && (
							item
							.this_value == 0 || item.this_value == '')) {
						return uni.showModal({
							title: item.head_name + '未输入',
							success: (res) => {
								if (res.confirm) {
									console.log('用户点击确定')
								} else if (res.cancel) {
									console.log('用户点击取消')
								}
							}
						})
					}
					// 构建需要提交的表单数据
					dataList.push({
						name: item.config_table_head_id,
						value: item.this_value,
						str: item.this_str
					})
				}
				// 构建发送参数结构
				var sendData = {
					api_class: 'Open_sopEquipmentClass',
					need_type: 'mobSetTableDataInfoFun',
					mySysId: uni.getStorageSync('mySysId'),
					loginsession_sop: uni.getStorageSync('loginsession'),
					//tb_auto_id: this.setLineDataType=='add'?'0':this.dataDetailAllList.lineInfo.tb_auto_id,
					//set_from_config_table_id: this.tableInfoLink.config_table_id_main,
					//set_from_tb_auto_id: this.dataDetailAllList.tb_auto_id,
					//order_id: this.orderDetail.order_id,
					//config_table_id: this.tableInfoLink.config_table_id_be,
					data_list: dataList,
					finger_print: this.emploId
				};
				if (this.setLineDataType == 'add') {
					sendData['tb_auto_id'] = 0;
					sendData['set_from_config_table_id'] = this.tableInfoLink.config_table_id_main;
					sendData['set_from_tb_auto_id'] = this.dataDetailAllList.tb_auto_id;
					sendData['order_id'] = this.orderDetail.order_id;
					sendData['config_table_id'] = this.tableInfoLink.config_table_id_be;
				} else {
					sendData['tb_auto_id'] = this.dataDetailAllList.lineInfo.tb_auto_id;
					sendData['config_table_id'] = this.dataDetailAllList.lineInfo.config_table_id;
					sendData['order_id'] = this.dataDetailAllList.lineInfo.order_id;
				}
				this.$api({
					url: '/api/data.php',
					method: 'post',
					data: sendData
				}).then(res => {
					uni.showToast({
						title: '报工成功',
						icon: 'success',
						duration: 2000
					})
					// 聚焦至员工卡号输入框
					this.inputIndex = -1
					// 清空员工卡号
					this.onDelInput()
				}, () => {
					// 聚焦至员工卡号输入框
					this.inputIndex = -1
					// 清空员工卡号
					this.onDelInput()
				}).catch(err => {
					console.log(err)
				})
			},
			// 进行人脸识别
			toCheckFace() {
				this.checkIngFace = true
			},
			stopCheckFace() {
				this.checkIngFace = false
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
			onInitSet() {
				// 清除持久化数据
				uni.removeStorageSync('loginsession')
				uni.removeStorageSync('mySysId')
				// 跳转至登陆页面
				uni.reLaunch({
					url: '../login/login'
				})
			},
			// 检查版本信息
			checkVersion() {
				this.$api({
						url: '/api/data.php',
						method: 'post',
						data: {
							api_class: 'Open_sopEquipmentClass',
							need_type: 'getSopVersionFun',
							mySysId: uni.getStorageSync('mySysId')
						}
					}).then(res => {
						plus.runtime.getProperty(plus.runtime.appid, (appData) => {
							console.log(appData)
							// 版本不同则进行更新
							let url = res.data.data.downloadLink
							if (res.data.data.versionNum != appData.version) {
								// 下载更新文件
								uni.downloadFile({
									url,
									success: (res) => {
										if (res.statusCode != 200) {
											return uni.showToast({
												title: '下载安装包失败',
												icon: 'error',
												duration: 2000
											})
										}
										// 安装更新文件
										plus.runtime.install(res.tempFilePath, {
												force: true
											},
											() => {
												uni.showModal({
													title: '程序已更新是否重启',
													success: (res) => {
														if (res.confirm) {
															plus.runtime.restart()
														}
													}
												})
											}, (err) => {
												uni.showModal({
													title: '更新失败',
													content: err.message,
													showCancel: false
												})
											})
									}
								})
							}
						})
					})
					.catch(err => {
						console.log(err)
					})
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
				this.showLink = true
				// this.linkTitle = this.dataList[this.orderIndex]
			},
			typing() {},
			enter() {},
			onEgg() {}
		},
		onUnload() {
			clearInterval(this.timer)
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		// padding-top: 5vh;
		flex-direction: column;
		position: relative;

		.data-none {
			color: #A6C4E6;
			font-size: 1.5vw;
			text-align: center;
			width: 100%;
			padding: 10vh 0;
		}

		.none-img {
			width: 31vw;
			height: 57%;
			margin: 2vh 0;
			background-color: #224C7B;
			color: #9FC4E1;
			border-radius: 1vw;
			font-size: 3vw;
		}

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
				height: 65%;
				background: #061830;
				border-radius: 10rpx;
				padding: 3vh;

				.card-num,
				input {
					width: 100%;
					height: 12%;
					background: #081E39;
					border-radius: 1vh;
					text-indent: 20rpx;
					border: 1rpx solid #9CC8ED;
					font-weight: bold;
					color: #9CC8ED;
					font-size: 1.5vw;

					image {
						width: 2vw;
						height: 2vw;
					}
				}

				.place-class {
					font-size: 1.5vw;
					font-weight: 500;
					color: #9CC8ED;
				}

				.detail {
					width: 100%;
					height: 86%;
					margin-top: 2%;

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

							&:active {
								background: #00d4d4;
							}

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

					.card-operate {
						width: 100%;
						height: 21%;
						margin-top: 2%;

						.edit-btn {
							width: 45%;
							height: 90%;
							color: #FFFFFF;
							font-size: 1.7vw;
							background-color: #73C7EF;
						}

						.cancel {
							background: #666;
						}
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
				height: 75%;
				border: 1rpx solid #42B5F1;
				border-radius: 11rpx;
				background-color: #090E21;

				.detail-header {
					height: 10%;
					background: #081D38;
					border-radius: 11rpx 11rpx 0rpx 0rpx;
					padding: 0 2vw;

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
					height: 90%;

					.sendReport {
						width: 100%;
						height: 15%;

						.face-check {
							width: 20%;
							height: 70%;
							color: #fff;
							font-size: 1.5vw;
							background: #73C7EF;
							border-radius: 0.5vh;
							text-align: center;
							margin: 0 20rpx;
						}

						.edit-btn {
							width: 60%;
							height: 100%;
							color: #FFFFFF;
							font-size: 1.5vw;

							.inputContent {
								width: 60%;
								height: 70%;
								color: #9CC8ED;
								background: #0A223B;
								border-top-left-radius: 0.5vh;
								border-bottom-left-radius: 0.5vh;
								box-sizing: border-box;

								input {
									width: 60%;
									height: 100%;
									font-size: 1.5vw;
								}

								.place-class {
									font-size: 1.5vw;
									font-weight: 500;
									color: #9CC8ED;
								}
							}

							.checkOut {
								border: 1rpx solid #00FFFF;
							}

							.input-close {
								width: 2.5vw;
								height: 2.5vw;
							}

							.submit-btn {
								width: 20%;
								height: 70%;
								font-size: 1.5vw;
								background: #73C7EF;
								border-radius: 0 0.5vh 0.5vh 0;
								text-align: center;
							}
						}
					}

					.detail-con-out {
						width: 100%;
						height: 85%;

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

							.left-item {
								margin: 3vh 0;

								.eachInput {
									width: 17vw;
									height: 2vw;
									line-height: 2vw;
									background: #0A223B;
									border: 1rpx solid #0A223B;
									border-radius: 5rpx;
									padding: 5rpx 16rpx;
									outline: 0;
									font-size: 1.5vw;
									font-weight: bold;
									color: #A4CEF4;
								}

								.input-selected {
									border: 1rpx solid #00FFFF;
									box-sizing: border-box;
								}

								.type-btn {
									width: 70%;
									flex-wrap: wrap;
									position: relative;

									.equipmOut {
										position: absolute;
										top: 8vh;
										width: 85%;
										max-height: 30vh;
										background: #fff;
										flex-wrap: wrap;
										z-index: 99;
										border-radius: 10rpx;
										overflow: auto;

										.eachEquip {
											background: #A4CEF4;
											color: #5d5d5d;
											// width: 44%;
											text-align: center;
											border-radius: 10rpx;
											padding: 10rpx 20rpx;
											margin: 15rpx;
										}
									}

									.triangle {
										position: absolute;
										bottom: -1vh;
										left: 40%;
										width: 1vw;
										height: 1vw;
									}

									input {
										font-size: 1.5vw;
									}

									.type-item {
										width: 100%;
										margin: 10rpx;
										padding: 10rpx 12rpx;
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
						}

						.detail-con-right {
							width: 37%;
							height: 100%;
							background-color: #061830;
							border-radius: 0rpx 11rpx 11rpx 0rpx;
							border-left: 1rpx solid #42B5F1;
							box-sizing: border-box;

							.jsq {
								width: 100%;
								height: 100%;
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
					padding: 0 10rpx 10rpx 20rpx;
					background-color: #96CDF7;
					height: 7%;

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
					color: #002d5f;
					height: 83%;
					overflow: auto;

					.order-list-item {
						padding: 8rpx 0 4rpx 0;
						border-bottom: 1rpx solid #DCDFE7;

						.order-tags {
							width: 3.5vw;
							min-width: 3.5vw;
							padding: 6vh 0;
							border-radius: 2vw 0 0 2vw;
							-webkit-writing-mode: vertical-lr;
							writing-mode: vertical-lr;
							font-size: 2vw;
							text-align: center;
							font-weight: bold;
							color: #FFFFFF;
							margin: 0 1vw;
							padding-left: 0.6vh;
						}

						view {
							margin-bottom: 6rpx;
							margin-right: 6rpx;
							opacity: 0.6;
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
							height: 10vh;

							.steps-btn {
								font-size: 2vw;
								width: 80%;
								height: 100%;
								text-align: center;
								background: rgba($color: #9FC4E1, $alpha: .4);
								border-radius: 10rpx;
								margin: 0;
								color: #fff;

								.step-name {
									width: 70%;
								}

								.step-record {
									width: 30%;
									height: 100%;
									color: #000;
									border-top-right-radius: 10rpx;
									border-bottom-right-radius: 10rpx;
									background: #9FC4E1;
								}
							}

							.steps-btn-selected {
								box-sizing: border-box;
								border: 1rpx solid #9FC4E1;
								box-shadow: 2rpx 0 8rpx -1rpx #9FC4E1;
								color: #111b40;

								.step-name {
									font-weight: bold;
								}
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