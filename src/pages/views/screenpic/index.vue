<template>
  <div>
    <button @click="showthumbPic">大图展示</button>
  </div>
</template>
<script type='text/ecmascript-6'>
export default {
  name: 'component_name',
  data() {
    return {};
  },
  methods: {
    /**缩略图预览 */
    showthumbPic(imgsrcs, index) {
      let imgs = [
        'https://yyb.gtimg.com/aiplat/page/product/visionimgidy/img/demo6-16a47e5d31.jpg?max_age=31536000',
        'http://img.wxcha.com/file/201603/07/7ec4c7c1f7.jpg',
        'https://t1.hddhhn.com/uploads/tu/201612/357/7.png'
      ];
      let imgList = [];
      imgs.forEach((item, index) => {
        imgList.push({ src: item, id: index });
      });
      this.$fullScreenPic({
        isShow: true,
        defaultIndex: index,
        // srcField: this.screenImg.srcField,
        imgList: imgList
      });
    }
  }
};
</script>
<style lang="css" rel="stylesheet/css" scoped>
</style>