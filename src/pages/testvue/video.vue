<!--视频播放-->
<template>

    <div class="container">
        <div class='content'>
           <div class="layout">
                <div class="location">
                    <router-link :to="{name:'index'}" >首页</router-link>
                    <span> >  课程 </span>
                </div>
                <div class="player">
                    <!-- <video id="my-video" class="video-js vjs-default-skin vjs-big-play-centered"
                       poster="videojs/eguidlogo.png" width="800" height="600">
                       <source src='http://jdvodsbhzc9vj.vod.126.net/jdvodsbhzc9vj/5815f6d9-823f-4538-acd4-cd9486d8d22b.flv' type='rtmp/flv'/>
                    </video> -->

                    <video-player class="video-player vjs-custom-skin"
                        ref="videoPlayer" :playsinline="true" :options="playerOptions" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" >
                    <source src="http://jdvodsbhzc9vj.vod.126.net/jdvodsbhzc9vj/5815f6d9-823f-4538-acd4-cd9486d8d22b.flv" type="video/x-flv">
                    </video-player>
                    <!-- <video src="static/01.avi" controls="controls">
                    
                    </video> -->
                </div>
            </div>
        </div>
    </div>



    
</template>
<script>
    videojs.options.flash.swf = "videojs/video-js.swf";//flash路径，有一些html播放不了的视频，就需要用到flash播放。这一句话要加在在videojs.js引入之后使用
</script>
<script src="https://cdn.jsdelivr.net/npm/videojs-flash@2/dist/videojs-flash.min.js"></script>
<script src="videojs/videojs-media-sources.min.js"></script>
<script src="videojs/videojs.hls.min.js"></script>

<script>
import { videoPlayer } from 'vue-video-player';
export default {
    name:'HelloWorld',
    data () {

        return {
            CourseGroupId:this.$route.query.courseGroupId,
            videodetail:'',

            playerOptions: {
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "application/x-mpegURL",
                    type:"video/mp4",
                    //type:"video/flv",
                    //src: "https://media.w3.org/2010/05/sintel/trailer.mp4" //你的m3u8地址（必填）
                    src:'http://jdvodsbhzc9vj.vod.126.net/jdvodsbhzc9vj/5815f6d9-823f-4538-acd4-cd9486d8d22b.flv',
                    
                }],
                poster: "poster.jpg", //你的封面地址
                width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                  timeDivider: true,
                  durationDisplay: true,
                  remainingTimeDisplay: false,
                  fullscreenToggle: true //全屏按钮
                
                }
            },


        }
    },
    mounted(){
        let that = this;
        let videodetailurl = this.URL.requestUrl + '/api/app/course/CourseSchedule';
        this.$axios.get(videodetailurl,{
            params:{
                CourseGroupId:this.CourseGroupId,
                page:1,
                rows:2
            }
        }).then(function(res) {
            if (res.data.message === 'success') {
                that.videodetail = res.data.data;
                that.playerOptions.sources.src =  res.data.data.courseUrl;
            }
        })

        var player = videojs('my-video');
        player.play();

    },
    methods:{
        onPlayerPlay(player) {
           
        },
        onPlayerPause(player){
            
        },
    },
    components: {
        videoPlayer
    },
    
    computed: {
        // player() {
        //     return this.$refs.videoPlayer.player
        // }
    }
}
</script>

<style>

</style>
