<template>
  <div>
    <vTransition>
      <div v-if="isshow" class>
        <p>非常荣幸为这篇论文写了解读，发在BioArt公众号上: Nature | 脑机接口重大进展——深度学习解码脑电波合成语音。本人不是神经科学领域的博士生，但对深度学习神经网络略有所知，为了写这篇解读也翻阅了不少文献。如有谬误还请各位脑科学和信号处理方面的大佬不吝指正。</p>
        <p>Nature | 脑机接口重大进展——深度学习解码脑电波合成语音</p>
        <p>
          英国著名理论物理学家史蒂芬·霍金因其对广义相对论和黑洞理论等物理学重大课题的巨大贡献和终身与疾病斗争的不屈精神而为世人敬仰。霍金从21岁起即饱受肌萎缩侧索硬化（ALS）的折磨，并在43岁时因患肺炎行气管切开术而丧失了语言能力。为了帮助霍金与外界正常交流，几十年来科学家们持续为其开发、改进了多套辅助交流系统。从最初的拼写板到单键鼠标打字再到眼部红外探测器打字，霍金所使用的交流工具的衍变也见证了人类在辅助交流和语音合成上的不懈努力。然而，迄今为止，辅助交流系统的主流仍然是以拼写为基础，这种方法使用起来不仅十分缓慢，且严重受限于操作者本身机体运动能力。更重要的是，由文本拼写转译为合成语音完全丢失了讲话者的音色和音调变化特征。为回应这一关切，脑机接口领域的一个重要课题便是如何直接由脑皮层相应区域的电信号解码合成语音。
          作者：知乎用户
          链接：https://www.zhihu.com/question/321658258/answer/664590679
          来源：知乎
          著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
        </p>
      </div>
    </vTransition>
    <button @click="show">不定高收起和展开</button>
    <div>

    </div>
    <div  ref="slidepane" @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    @touchcancel="touchcancel">
      <p style="background:red;height:200px;"> 英国著名理论物理学家史蒂芬·霍金因其对广义相对论和黑洞理论等物</p>
        <p style="background:green;height:150px;"> 
          著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处</p>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import VTransition from 'Components/vTransition/vTransition.js';
import {all } from 'Mock/mock.js'
export default {
  name: 'custom',
  components: {
    VTransition
  },
  data() {
    return {
      isshow: false,
      nameobj: ''
    };
  },
  created() {
   // let alldata = all
    let str = [];

    //this.formdata(all.data);//文案数据获取
   
  },
  methods: {
    touchstart(e){
      //被监听元素
      console.log("touchstart",e)
    },
    touchmove(e){
       console.log("touchmove",e)
    },
    touchend(e){
       console.log("touchend",e)
    },
    touchcancel(e){
       console.log("touchcancel",e)
    },
    /**缩略图预览 */
    formdata(data) {
      for (var i = 0; i < data.length; i++) {
        this.formdataitem(data[i]);
      }
      //  this.nameobj += ','+ data.parentCode+'-'+data.name
      //   if(!data.children){
      //     return
      //   }
    },
    formdataitem(data) {
      this.nameobj += '\n' + data.parentCode + '-' + data.code + '-' + data.name;
      if (!data.children) {
        return;
      } else {
        for (var i = 0; i < data.children.length; i++) {
          this.formdataitem(data.children[i]);
        }
      }
    },
    show() {
      this.isshow = !this.isshow;
    }
  }
};
</script>
<style lang="css" rel="stylesheet/css" scoped>
</style>