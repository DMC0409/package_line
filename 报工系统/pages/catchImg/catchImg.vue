<template>
    <view>
        <button style="margin-top: 500px;background-color: #3c96f3" @click="snapshotPusher">
                拍照
        </button>
		<view class="" @click="a">
			aaa
		</view>
    </view>
</template>

<script>
    import permission from '../../utils/permission.js'
    export default {
        data() {
            return {
                imgData: '',
                pusher: null,
                scanWin: null,
                faceInitTimeout: null,
                snapshTimeout: null,
                uploadFileTask: null,
                cilckSwitch: false, //防止多次点击
            };
        },
        methods: {
			a(){
				uni.reLaunch({
					url: '../index/index'
				})
			},
            //初始化
             faceInit() {

                this.faceInitTimeout = setTimeout(async () => {
                    //创建livepusher
                    if (uni.getSystemInfoSync().platform === 'android') {
                        const data1 = await permission.requestAndroidPermission(
                            "android.permission.RECORD_AUDIO")
                        const data2 = await permission.requestAndroidPermission("android.permission.CAMERA")
                        if (data1 == 1 && data2 == 1) {
                            this.pusherInit();
                        }
                    } else {
                        this.pusherInit();
                    }
                    // 覆盖在视频之上的内容，根据实际情况编写
                    // 利用plus.webview.create将扫描框页面及扫描动画（xxx.html）覆盖在视频之上；
                    // this.scanWin = plus.webview.create('/static/456.html', '', {
                    //  background: 'transparent'
                    // });
                    // //新引入的webView显示
                    // this.scanWin.show();
                }, 2000);
            },
            //初始化播放器
            pusherInit() {
            	// 获取当前窗口
                const currentWebview = this.$mp.page.$getAppWebview();
                // 创建推流，url不填写代表不上传
                this.pusher = plus.video.createLivePusher('livepusher', {
                    url: '',
                    top: '10%',
                    left: '20%',
                    width: '300px',
                    height: '300px',
                    position: 'absolute',
                    aspect: '9:16',
                    muted: false,
                    'z-index': 999,
                });
                // 将推流对象加到当前页面中
                currentWebview.append(this.pusher);
                //反转摄像头
                this.pusher.switchCamera();
                //开始预览
                this.pusher.preview();
            },
            //快照
            snapshotPusher() {
                if (this.cilckSwitch) {
                    uni.showToast({
                        title: '请勿频繁点击',
						icon: 'none'
                    })
                    return
                }
                this.cilckSwitch = true
                let that = this
                this.snapshTimeout = setTimeout(() => {
                    this.pusher.snapshot(
                        e => {
                            //拿到本地文件路径
                            var src = e.tempImagePath;
                            console.log(src)
                            //获取图片base64
                            this.getMinImage(src);
							that.cilckSwitch = false
                        },
                        function(e) {
                            plus.nativeUI.alert('snapshot error: ' + JSON.stringify(e));
                            that.cilckSwitch = false
                        }
                    );
                }, 3000);
            },

            //使用plus.zip.compressImage压缩图片
            getMinImage(imgPath) {
                plus.zip.compressImage({
                        src: imgPath,
                        dst: imgPath,
                        overwrite: true,
                        quality: 40
                    },
                    zipRes => {
                        setTimeout(() => {
                            var reader = new plus.io.FileReader();
                            reader.onloadend = res => {
                           		 //获取图片base64	
                                var speech = res.target.result; //base64图片
   								console.log(speech)
                                this.imgData = speech;
                            };
                            //一定要使用plus.io.convertLocalFileSystemURL将target地址转换为本地文件地址，否则readAsDataURL会找不到文件
                            reader.readAsDataURL(plus.io.convertLocalFileSystemURL(zipRes.target));
                        }, 1000);
                    },
                    function(error) {
                        console.log('Compress error!', error);
                    }
                );
            },
        },
        onLoad(option) {
            //#ifdef APP-PLUS
			this.faceInit();
            //#endif
        },
        onHide() {
            console.log('hide')
            this.faceInitTimeout && clearTimeout(this.faceInitTimeout);
            this.snapshTimeout && clearTimeout(this.snapshTimeout);
            //this.scanWin.hide();
        },
    };
</script>

<style lang="scss" scoped>

</style>


