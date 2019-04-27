<template>
  <!-- <transition name="el-alert-fade"> -->
  <div class="fullScreenPic" v-show="visible">
    <i class="el-icon-close" @click="close"></i>
    <!-- <div class="cover" @click="close"></div> -->
    <div class="screen-pane" @click="close">
      <div class="screen-wrap">
        <div class="pull-bar" @click="mainclick">
          <i class="icon-arrow-left" :class="{disable:defaultIndex==0}" @click="toPrev"></i>
          <i class="icon-arrow-right" :class="{disable:imgData.length==defaultIndex+1}" @click="toNext"></i>
        </div>
        <div class="screen-main-wrap">
          <div class="screen-main" @click="mainclick">
            <div class="img-wrap" v-for="(item,index) in imgData" :key="'main'+index" v-show="defaultIndex==index">
              <img :src="item.src" @click="openImg(item.src)">
            </div>
          </div>
          <div class="screen-data">{{defaultIndex+1}}/{{imgData.length}}</div>
        </div>
      </div>
      <!-- <div class="screen-small-slot">
         <i class="sm-left" @click="toSmPrev"></i>
          <div class="sm-main-wrap">
            <div class="sm-main">
              <div class="sm-img-wrap" v-for="(item,index) in imgData" :key="'sm'+index" :class="{active:defaultIndex==index}" @click="toIndexImg(index)">
                <img :src="item.src" class="sm-img">
                <div class="sm-cover"></div>
              </div>
            </div>
          </div>

          <i class="sm-right" @click="toSmNext"></i> 
      </div>-->
    </div>
  </div>
  <!-- </transition> -->
</template>

<script>
export default {
  name: 'fullScreenPic',
  props: {
    imgList: Array,
    srcField: String
    // isShow:Boolean,
  },
  data() {
    return {
      imgData: [],
      visible: false,
      defaultIndex: 0,
      smSIndex: 0,
      smEIndex: 4
    };
  },
  created() {},

  mounted() {},
  watch: {
    // isShow(value) {
    //   this.visible = value;
    //   this.defaultIndex = 0;
    // },
    imgList(value) {
      if (this.srcField != null && this.srcField != 'src') {
        this.imgList.forEach(item => {
          item['src'] = item[this.srcField];
        });
      }
      this.imgData = this.imgList;
    }
  },

  methods: {
    mainclick(e) {
      e.stopPropagation();
    },
    show() {
      this.visible = true;
      this.defaultIndex = 0;
      // let instance = new fullScreenPicVue({
      //   el: document.createElement('div'),
      //   data: {}
      // });
      // instance.isShow = options.isShow;
      // instance.imgList = options.imgList;
      // if (options.srcField) {
      //   instance.srcField = options.srcField;
      // }
      // let oldele = document.querySelector('.' + instance.$el.className);
      // oldele != null ? oldele.parentNode.removeChild(oldele) : '';
      //  document.body.appendChild(instance.$el);
    },
    close() {
      this.visible = false;
    },
    toSmPrev() {},
    toSmNext() {},
    resizeMain() {
      //
      let clientH = document.body.clientHeight;
      let clientW = document.body.clientWidth;
    },
    toPrev() {
      if (this.defaultIndex != 0) {
        this.defaultIndex--;
      }
    },
    toNext() {
      if (this.defaultIndex + 1 != this.imgData.length) {
        this.defaultIndex++;
      }
    },
    openImg(url) {
      window.open(url);
    },
    toIndexImg(index) {
      this.defaultIndex = index;
    }
  }
};
</script>

<style type="text/less" lang="less" rel="stylesheet/less"  scoped>
.fullScreenPic {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99994;
  overflow: auto;
  /* padding-top: 40px;*/
  .cover {
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .el-icon-arrow-left.disable:before {
    background: #888;
  }
  .el-icon-arrow-left:before {
    content: '\E600';
    background: #555;
    border-radius: 50%;
    padding: 5px;
    color: white;
    // margin-left: 50px;
  }
  .el-icon-arrow-right:before {
    content: '\E604';

    background: #555;
    border-radius: 50%;
    padding: 5px;
    color: white;
    // margin-right: 50px;
  }
  .el-icon-arrow-right.disable:before {
    background: #888;
  }
  .pull-bar {
    top: 40%;
    width: 80%;
    /* -webkit-box-sizing: border-box; */
    /* box-sizing: border-box; */
    /* padding: 0px 20px; */
    position: absolute;
    display: flex;
    justify-content: space-between;
    // margin-right: -20px;
     margin-left: 10%;
    i {
      z-index: 9999;
      font-size: 28px;
      cursor: pointer;
    }
    .el-icon-arrow-right {
      float: right;
    }
  }
  .screen-main-wrap {
    // background: white;
    height: 100%;
    position: relative;
  }
  .screen-data {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    color: #999;
    font-size: 16px;
  }
  .screen-pane {
    text-align: center;
    height: 100%;
    .img-wrap {
      display: inline-block;
      vertical-align: middle;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-width: 98%;
        max-height: 100%;
      }
    }
  }
  .el-icon-close {
    position: fixed;
    right: 80px;
    top: 30px;
    font-size: 34px;
    cursor: pointer;
    z-index: 9999;
    color: white;
  }
  img {
    cursor: pointer;
  }
  .sm-img {
    width: 80px;
    height: 80px;

    border: 1px solid #ccc;
    border-radius: 3px;
  }
  .sm-main-wrap {
    overflow: auto;
  }
  .screen-small-slot {
    width: 50%;
    margin: auto;
    position: relative;
    border: 1px solid #aaa;
    border-radius: 5px;
    /* padding: 10px; */
    padding-top: 10px;
    padding-bottom: 10px;
    box-sizing: border-box;
    overflow: auto;
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    box-shadow: 0px 0px 5px #999 inset;
  }
  .sm-left {
    position: absolute;
    left: 0;
    background: #aaa;
    top: 0;
    bottom: 0;
    width: 1px;
    cursor: pointer;
    &:before {
      top: 35%;
      left: 0px;
      font-size: 24px;
      color: white;
      position: absolute;
      background: transparent;
      border-radius: initial;
    }
  }

  .screen-main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: white;
    padding-bottom: 40px;
    padding-top: 10px;
    box-sizing: border-box;
    border-radius: 5px;
    width: 60%;
    margin: auto;
    /*opacity:0.9;*/
  }

  .screen-wrap {
    height: 100%;
    // margin-bottom: -150px;
    // padding: 20px;
    padding-top: 60px;
    padding-bottom: 60px;
    // padding-bottom: 150px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .sm-main {
    margin-left: 5px;
    white-space: nowrap;
  }
  .sm-right {
    position: absolute;
    right: 0;
    background: #aaa;
    top: 0;
    bottom: 0;
    width: 1px;
    cursor: pointer;
    &:before {
      top: 37%;
      left: 0px;
      font-size: 24px;
      color: white;
      position: absolute;
      background: transparent;
      border-radius: initial;
    }
  }

  .sm-img-wrap {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    font-size: 0;
    cursor: pointer;
    .sm-cover {
      opacity: 0.8;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.5);
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
    &.sm-cover:hover {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
    }
  }

  .active {
    .sm-cover {
      display: none;
    }
  }
}
</style>
