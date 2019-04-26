<template>
  <section class="content">
    <el-breadcrumb separator>
      <el-breadcrumb-item :to="{ path: '/marketing' }">
        <a>智能营销</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>新粉有礼</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="new-fans">
      <el-form class="el-col-12">
        <el-form-item>
          <el-col :span="8">{{brand.shopName}}公众号关注送券</el-col>
          <el-col :span="4" v-show="localIsChain">
            <el-switch v-model="form.evalSwitch" @change="openNewFansCoupon"></el-switch>
          </el-col>

          <el-col :span="4" class="margin-right font-color-red" v-show="!configOpen">活动进行时</el-col>
          <el-col :span="10" class="margin-right" v-show="!configOpen && activeCreatTime">
            <span>【开启时间：{{thisMoment(activeCreatTime).format('YYYY-MM-DD')}}】</span>
          </el-col>
          <el-col :span="4" class="margin-right font-color-theme" v-show="configOpen">活动关闭中</el-col>
          <!-- <el-col :span="4" v-show="configOpen && localIsChain">
            <el-button type="primary" class="theme-btn" @click.native.prevent="openNewFansCoupon">开启关注送券</el-button>
          </el-col>-->
        </el-form-item>

        <el-form-item label="选择礼券:" v-if="form.evalSwitch">
          <el-col :span="22" class="margin-right">
            <ChooseCoupon :coupons="coupons" v-if="localIsChain" :callBack="couponSelectCallBack" :openCreateCoupon="openCreateCoupon" chooseText="选择礼券"></ChooseCoupon>
            <el-col :span="20" class="margin-right">
              <ShowCoupon v-for="domain in form.gifts" :key="domain.id" :domain="domain" :canDelete="localIsChain" :deleteCallBack="deleteGift"></ShowCoupon>
            </el-col>
            <br>
          </el-col>
        </el-form-item>
        <el-form-item v-if="form.evalSwitch" label="标题:">
          <el-col :span="16" class="margin-right">
            <el-input :maxlength="20" placeholder="一个礼物正在砸向你接住" :disabled="!localIsChain" v-model="article.title"></el-input>
            <div class="limit">{{article.title.length}}/20</div>
          </el-col>
        </el-form-item>
        <el-form-item v-if="form.evalSwitch" label="内容:">
          <el-col :span="16" class="margin-right">
            <el-input :maxlength="40" placeholder="感谢您的关注，点击领取礼券" :disabled="!localIsChain" v-model="article.description"></el-input>
            <div class="limit">{{article.description.length}}/40</div>
          </el-col>
        </el-form-item>
        <el-form-item v-if="form.evalSwitch" label="自定义配图:">
          <el-upload
            class="avatar-uploader el-col-offset-4"
            action="//up.qbox.me/"
            drag
            :thumbnail-mode="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
            :data="form1"
            :disabled="!localIsChain"
          >
            <i v-if="article.picUrl&&localIsChain" class="el-icon-upload"></i>
            <div v-if="article.picUrl&&localIsChain" class="el-upload__text">
              将文件拖到此处，</br>
              或<em>点击上传</em>
            </div>
            <img v-if="article.picUrl" :src="article.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="font-color-orange el-col-offset-4">图片标准60:60规格 jpg/png文件，且不超过2M</div>
        </el-form-item>
        <el-form-item>
          <div v-show="localIsChain ">
            <el-col :span="4">
              <el-button type="primary" class="theme-btn" @click.native.prevent="submit">保存</el-button>
            </el-col>
          </div>

          <!-- <div v-show="form.gifts.length>0 && localIsChain && !canEdition">
            <el-col :span="6">
              <el-button type="primary" class="theme-btn" @click.native.prevent="changeActive">修改活动</el-button>
            </el-col>
            <el-col :span="6">
              <el-button class="default-btn" @click.native.prevent="offNewConfig">关闭活动</el-button>
            </el-col>
          </div>-->
        </el-form-item>
      </el-form>
      <br>
      <br>
    </div>

    <el-form class="wechat-article el-col-12" v-show="form.evalSwitch">
      <div style="width:300px;flex:none;">
        <div class="preview-container">
          <div class="preview-box preview-box-core">
            <div class="title">公众号关注推送预览</div>
            <div class="wx-box">
              <div class="header-bg">
                <span class="shopname">{{brand.shopName}}</span>
              </div>
              <div class="showgzhgz">
                <div class="showgzhgz-box">
                  <div class="showgzhgz-content" v-if="!configOpen">
                    <img src="https://asset.imuge.net/FlwhXXjG2N52OZN-6kZKKuOpYqMn" class="avator">
                    <span class="title">
                      <i class="el-icon-caret-left"></i>
                      你好，欢迎关注XXX！
                    </span>
                  </div>
                  <div v-if="!configOpen" class="showgzhgz-body">
                    <p class="title">{{article.title || '请输入图文推送标题'}}</p>
                    <div class="desc">
                      <p class="info">{{article.description || '请输入图文推送描述'}}</p>
                      <img :src="article.picUrl" class="bg">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <el-form-item>
        <div class="el-col-20 article">
          <div class="el-col-6">通知模版</div>
          <div v-show="localIsChain" class="el-col-4 el-col-offset-10 edit" @click="showNewConfig = true">
            <span class="el-icon-edit"></span>自定义
          </div>
        </div>
      </el-form-item>-->
      <!-- <el-form-item>
        <div class="wechat-back">
           <div class="time">{{thisMoment(new Date).format('MM月DD日')}}</div>
          <div class="main-title">{{article.title}}</div>
          <div style="display:flex;">
            <img src="./../../../images/newFans/wechatBack.png">
            <img class="active-img" :src="article.picUrl">
          </div>

           <div class="description">{{article.description}}</div>
        </div>
      </el-form-item>-->
    </el-form>
    <CreateCoupon v-model="couponDialogVisible" :shopId="localShopId" :localIsChain="localIsChain" :shops="shops" :callBack="couponCallBack"></CreateCoupon>
  </section>
</template>

<script>
import * as apiRoutes from '../../../store/api_url_const';
import Vue from 'vue';
import moment from 'moment';
import _ from 'underscore';
import ChooseCoupon from '../../../components/chooseCoupon.vue';
import CreateCoupon from '../../../components/createCoupon.vue';
import ShowCoupon from '../../../components/showCoupon.vue';
export default {
  created() {
    this.$store.dispatch('navActive', 9);
    this.userId = window.localStorage.getItem('userId');
  },
  components: {
    ChooseCoupon,
    CreateCoupon,
    ShowCoupon
  },
  data() {
    return {
      inputFile: '',
      articleConfigControl: false,
      opendActive: false,
      canEdition: false,
      couponConfigOpen: false,
      showGiftList: false,
      configOpen: false,
      selectShop: {
        id: null
      },
      brand: {
        shopName: null,
        shopId: null
      },
      shops: [],
      selectShopId: '',
      selectShopName: '',
      totalFans: null,
      selectSend: '',
      showQueryTime: false,
      queryText: '根据粉丝关注公众号时间筛选',
      fansSummary: null,
      showQueryClose: false,
      coupons: [],
      form: {
        startDate: null,
        EndDate: null,
        name: null,
        gifts: [],
        evalSwitch: false
      },
      showNewConfig: false,
      imageUrl: 'https://asset.imuge.net/nomandy/Fssecq34Pto-dJWuIVEvKtad_5ww.png',
      form1: {},
      article: {
        title: '一个礼物正在砸向你，接住！',
        description: '感谢您的关注，点击领取礼物',
        picUrl: 'https://asset.imuge.net/nomandy/Fssecq34Pto-dJWuIVEvKtad_5ww.png',
        url: 'bindPage',
        shopId: null
      },
      activeCreatTime: '',
      couponDialogVisible: false,
      userId: null
    };
  },
  props: ['localIsChain', 'localShopId'],
  methods: {
    changeActive() {
      this.canEdition = true;
    },
    openNewFansCoupon(value) {
      if (value) {
        this.couponConfigOpen = true;
        this.configOpen = true;
        this.opendActive = true;
      this.canEdition = true;
      } else {
        this.couponConfigOpen = false;
        this.configOpen = false;
        this.opendActive = false;
      this.canEdition = false;
      }


    },
    sendArticleNews() {
      let _this = this;
      // _this.article.picUrl = _this.imageUrl;
      _this.article.shopId = _this.brand.shopId;
      let articleList = [];
      articleList.push(this.article);
      this.$http.post(apiRoutes.GET_NEW_FANS_COUPONS_ARTICLE_CONFIG_CREATE, articleList).then(
        res => {
          if (res.data.status == 1) {
            _this.showNewConfig = false;
            _this.$message({
              message: '信息保存成功',
              type: 'success'
            });
          } else {
            this.$message.error(res.data.message);
          }
        },
        res => {
          this.$message.error('连接服务器失败');
        }
      );
      _this.showNewConfig = false;
    },
    offNewConfig() {
      //GET_NEW_FANS_CONFIG_OFF
      //BEAUTY_SUBSCRIBE_SET_CLOSE
      let _this = this;

      this.$http.post(apiRoutes.GET_NEW_FANS_CONFIG_OFF, { shopId: _this.brand.shopId }, { emulateJSON: false }).then(
        res => {
          if (res.data.status == 1) {
            _this.$message({
              message: '关闭关注送券成功',
              type: 'success'
            });
            _this.getBrand();
            _this.form.gifts = [];
            _this.activeCreatTime = '';
          } else {
            this.$message.error(res.data.message);
          }
        },
        res => {
          this.$message.error('连接服务器失败');
        }
      );
      _this.showNewConfig = false;
      _this.opendActive = false;
    },
    offArticleConfig() {
      let _this = this;
      console.log(11);
      this.$http
        .post(apiRoutes.GET_NEW_FANS_ARTICLE_CONFIG_OFF, { shopId: _this.brand.shopId }, { emulateJSON: true })
        .then(
          res => {
            if (res.data.status == 1) {
              _this.showNewConfig = false;
              _this.$message({
                message: '关闭图文消息成功',
                type: 'success'
              });
              this.getBrand();
            } else {
              this.$message.error(res.data.message);
            }
          },
          res => {
            this.$message.error('连接服务器失败');
          }
        );
      _this.showNewConfig = true;
    },
    deleteGift(item) {
      let _this = this;

      _this
        .$confirm('此操作将删除该张礼券，是否继续？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          for (let i = 0; i < _this.form.gifts.length; i++) {
            if (_this.form.gifts[i].id === item.id) {
              _this.form.gifts.splice(i, 1);
              _this.$message({
                type: 'success',
                message: '删除成功!'
              });
              break;
            }
          }
          //                    _.each(_this.form.gifts, function (value, index) {
          //                        if (value.id === item.id){
          //                            _this.form.gifts.splice(index, 1);
          //                            _this.$message({
          //                                type: 'success',
          //                                message: '删除成功!'
          //                            });
          //                        }
          //                    });
        });
    },
    thisMoment(time) {
      return moment(time);
    },
    getShops() {
      let _this = this;
      this.$http.post(apiRoutes.GET_SHOPS).then(res => {
        _this.shops = res.data.result;
        if (_this.localIsChain) {
          //              _this.selectShopId = res.data.result[0].id;
          _this.selectShopName = res.data.result[0].name;
        } else {
          //              _this.selectShopId = this.localShopId;
          _this.selectShopName = res.data.result[0].name;
        }
      });
    },
    getBrand() {
      var _this = this;
      this.$http.post(apiRoutes.GET_SHOP_BRAND).then(res => {
        if (res.data.status === 1) {
          _this.brand = res.data.result;
          _this.getConfigCurrent();
          // _this.getArticleConfigCurrent();
        }
      });
    },
    handleAvatarSuccess(res, file) {
      let _this = this;
      _this.article.picUrl = 'https://asset.imuge.net/' + res.key;
      let image = new Image();
      image.src = _this.article.picUrl;
      image.onload = function() {
        let height = image.height;
        let width = image.width;
        let WHCompared = width / height;
        if (WHCompared < 60 / 60 || WHCompared > 60 / 60) {
          _this.$message.error('请上传60：60的图片');
          _this.articleConfigControl = true;
        } else {
          _this.articleConfigControl = false;
        }
      };
    },
    beforeAvatarUpload(file) {
      let _this = this;
      this.articleConfigControl = true;
      const isLtSize = file.size / 1024 / 1024 < 2;
      if (!isLtSize) {
        this.$message.error('上传图片大小不能超过 2M!');
        return false;
      }
      return _this.$http.post(apiRoutes.GET_UPLOAD_TOKEN).then(
        res => {
          _this.form1 = {
            token: res.data.uptoken
          };
        },
        res => {}
      );
    },
    getCoupons() {
      let _this = this;
      this.$http
        .post(apiRoutes.GET_SOUVENIR_SELECT_COUPON, { shopId: this.localShopId }, { emulateJSON: true })
        .then(res => {
          if (res.body.status === 1) {
            _this.coupons = res.data.result;
          } else {
            _this.$message({
              type: 'warning',
              message: res.data.message
            });
          }
        });
    },
    getConfigCurrent() {
      let _this = this;
      let params = {};
      params.shopId = _this.brand.shopId;
      this.$http.post(apiRoutes.BEAUTY_MARKETING_SUBSCRIBE_GET_CONFIG, params, { emulateJSON: true }).then(res => {
        let result = res.data.result;
        if (result && result.gifts && result.gifts.length > 0) {
          _this.form.gifts = result.gifts;
          _this.activeCreatTime = _this.form.gifts[0].createTime;
          _this.couponConfigOpen = false;
          _this.opendActive = true;
          _this.form.evalSwitch = true;
          _this.article.title = result.activityName;
          _this.article.description = result.activitySlogan;
          _this.article.picUrl = result.activityPicUrl;
          _.each(_this.form.gifts, function(gift) {
            gift.couponTimes = gift.timeList;
            gift.couponName && (gift.name = gift.couponName);
            if (gift.startDays || gift.expireDays) {
              gift.expireType = 'DAY';
            } else {
              gift.expireType = 'TIME';
            }
          });
        } else {
          _this.configOpen = true;
          _this.couponConfigOpen = true;
          _this.opendActive = false;
        }
      });
    },
    getArticleConfigCurrent() {
      let _this = this;
      let params = {};
      params.shopId = _this.brand.shopId;
      this.$http.post(apiRoutes.GET_NEW_FANS_ARTICLE_CURRENT_CONFIG, params, { emulateJSON: true }).then(res => {
        if (res.data.result.length > 0) {
          _this.article = res.data.result[0];
          // _this.imageUrl = _this.article.picUrl;
        } else {
          _this.article.picUrl = 'https://asset.imuge.net/FssZ3Vc5O20nkeprL1PXcB-bYSTm';
          // _this.imageUrl = 'https://asset.imuge.net/FssZ3Vc5O20nkeprL1PXcB-bYSTm';
          _this.article.title = '一个礼物正在砸向你，接住！';
          _this.article.description = '感谢您的关注，点击领取礼物';
        }
      });
    },
    submit() {
      if (this.form.evalSwitch) {
        if (!this.form.gifts || this.form.gifts.length <= 0) {
          this.$message.error('开关开启时，礼券必选');
          return;
        }
        if (!this.article.title) {
          this.$message.error('推送标题必填');
          return;
        }
        if (!this.article.description) {
          this.$message.error('推送图文描述必填');
          return;
        }
      }
      let params = new URLSearchParams();
      params.append('brandId', this.brand.shopId);
      params.append('shopId', this.brand.shopId);
      params.append('activityName', this.article.title); //推送标题
      params.append('activitySlogan', this.article.description);
      params.append('activityPicUrl', this.article.picUrl);
      //活动状态 ： 0(NEW)-未启用 1(ON)-已开启 2(OFF)-已关闭
      params.append('activityStatus', this.form.evalSwitch ? 1 : 2);
      //params.append('startTime', '');
      let giftIds = [];
      this.form.gifts.forEach(item => {
        let gift = {
          goodsId: item.couponId,
          activityType: 'NEW_FANS_GIFT',
          giftType: item.couponType,
          giftName: item.couponName,
          createBy: this.userId
        };
        giftIds.push(gift);
      });
      params.append('giftObject', JSON.stringify(giftIds));
      //brandId

      this.$http
        .post(apiRoutes.BEAUTY_MARKETING_SUBSCRIBE_CREATE_CONFIG, params)
        .then(res => {
          if (res.data.status === 1) {
            //let result = res.data.result;

            this.$message.success('保存成功');
            this.getConfigCurrent();
          } else {
            this.$message.error(res.data && res.data.message);
          }
          if (callback) {
            callback(false);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    configCreate() {
      let _this = this;
      let params = { packs: [] };
      _.each(_this.form.gifts, function(gift) {
        let coupon = {
          goodsId: gift.productId,
          shopId: gift.shopId,
          quantity: 1
        };
        if (gift.startDays || gift.expireDays) {
          coupon.startDays = gift.startDays;
          coupon.expiredDays = gift.expireDays;
        } else {
          coupon.startTime = gift.startTime;
          coupon.expiredTime = gift.expireTime;
        }

        params.packs.push(coupon);
      });
      params.shopId = _this.brand.shopId;
      this.$http.post(apiRoutes.GET_NEW_FANS_COUPONS_CONFIG_CREATE, params).then(
        res => {
          if (res.data.status == 1) {
            _this.$message({
              message: '信息保存成功',
              type: 'success'
            });
            this.canEdition = false;
            this.getBrand();
          } else {
            this.$message.error(res.data.message);
            this.getBrand();
          }
        },
        res => {
          this.$message.error('连接服务器失败');
        }
      );
    },
    couponSelectCallBack(couponId, type) {
      let items = _.where(this.coupons, { type: type })[0];
      let coupon = _.where(items.mkCouponList, { id: couponId })[0];
      coupon.couponRangPartners = coupon.mkCouponRangPartnerList;
      coupon.couponTimes = coupon.mkCouponTimeList;
      coupon.quantity = 1;
      coupon.goodsName = name;

      this.form.gifts.push(coupon);
    },
    openCreateCoupon() {
      this.couponDialogVisible = true;
    },
    couponCallBack() {
      this.getCoupons();
    }
  },
  mounted() {
    this.getShops();
    this.getBrand();
    this.getCoupons();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
@import '../../../assets/stylus/base.styl'
@import '../../../assets/fonts/iconfont.css'
.el-select-dropdown__item.selected, .el-select-dropdown__item.selected.hover
  background white
  color $theme
coupon(color1, color2)
.gift-l-t
  background linear-gradient(left, color2, color1)
  background -webkit-linear-gradient(left, color2, color1)
  &:after
    background linear-gradient(left, color1, color2)
    background -webkit-linear-gradient(left, color1, color2)
    content ''
    position absolute
    width 100%
    left 0
    bottom -0.2rem
    z-index 99
    border-bottom 0.3rem dotted color1
.gift-l-b
  span
    color color1
.content
  padding 1.8rem
  background #ffffff
  position relative
  .el-form
    background #ffffff
  .error-red-font
    color red
  .limit
    text-align right
    color #979797
  .wechat-article
    padding-left 2rem
    border-left 0.1rem solid #979797
  .wechat-back
    position relative
    .time
      position absolute
      top 6.5rem
      font-size 0.5rem
      left 1.2rem
      color #979797
    img
      width 15rem
    .description
      position absolute
      top 15.2rem
      left 1rem
      font-size 0.6rem
      color #979797
      width 12.5rem
      height 1.8rem
      overflow hidden
      display -webkit-box
      -webkit-box-orient vertical
      -webkit-line-clamp 2
      text-overflow ellipsis
    .active-img
      width 12.5rem
      position absolute
      left 1.2rem
      top 7.8rem
      height 7rem
    .main-title
      position absolute
      top 5.5rem
      left 1.2rem
      font-size 0.7rem
      font-weight 500
      color #000
      width 12.5rem
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
  .preview-wechat-back
    position relative
    .time
      position absolute
      top 4.2rem
      font-size 0.5rem
      left 0.6rem
      color #979797
      -webkit-transform scale(0.8)
      transform scale(0.8)
    img
      width 10rem
    .description
      position absolute
      top 10rem
      font-size 0.45rem
      color #8c939d
      width 10rem
      height 1.6rem
      overflow hidden
      display -webkit-box
      -webkit-box-orient vertical
      -webkit-line-clamp 2
      -webkit-transform scale(0.8)
      transform scale(0.8)
      text-overflow ellipsis
    .active-img
      width 8.4rem
      position absolute
      left 0.8rem
      top 5rem
      height 5rem
    .main-title
      position absolute
      top 3.4rem
      left 0.8rem
      font-size 0.6rem
      font-weight 500
      color #000
      width 8.4rem
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
  .font-color-theme
    color $theme
  .font-color-red
    color $red
  .article
    font-size 0.7rem
    font-weight 300
    border-bottom 0.1rem solid #D8D8D8
    .edit
      color $theme
  .avatar-uploader .el-upload
    border 1px dashed #d9d9d9
    border-radius 6px
    cursor pointer
    position relative
    overflow hidden
    width 8rem
    height 8rem
    .el-upload-dragger
      height 8rem
      width 8rem
      color white
      .el-icon-upload
        position: absolute;
        top: 1rem;
        color: #fff;
        left: 0;
        right: 0;
        text-align: center;
        width: 3rem;
        margin: auto;
        font-size: 40px;
      .el-upload__text
        color white
        font-size 0.65rem
        text-align center
        position absolute
        top 3.5rem
        left:0
        right 0
        em
          color $theme
  .avatar-uploader .el-upload:hover
    border-color #20a0ff
  .avatar-uploader-icon
    font-size 28px
    color #8c939d
    width 15.2rem
    height 8.45rem
    line-height 178px
    text-align center
  .avatar
    width 12rem
    height 12rem
    display block
  .font-color-orange
    font-size 0.6rem
    color #FF9F22
  .toOther
    position absolute
    top 1.8rem
    right 3.6rem
    color $theme
  .theme-font-btn
    color $theme
    cursor pointer
  .white-btn
    color $theme
    background white
    border 0.05rem solid $theme
  .theme-btn
    color white
    background $theme
    border 0.05rem solid $theme
  .theme-font-shallow-back-btn
    color $theme
    background #E3F6F8
    border 0.05rem solid $theme
.popper-class
  max-width 6rem
.el-dialog
  width 34rem
.el-dialog__header
  padding-bottom 0.5rem
  border-bottom 2px solid $theme
.btn-tag
  display inline-block
  color $theme
  border 1px solid $theme
  padding 0.2rem 0.5rem
  border-radius 1.5rem
  cursor pointer
  margin-right 0.3rem
  &.active
    background $theme
    color #fff
.margin-right
  margin-right 0.5rem
.connect-line
  width 0.6rem
  line-height 1.8rem
.query-time, .new-coupon-box
  background $bg-gray
.new-coupon-box
  padding 1rem 0.5rem
.oneGift
  border-radius 0.2rem
  overflow hidden
  isFlex()
  margin-bottom 0.5rem
  box-shadow 0 0 1px 1px #eee
  .gift-l
    flex 1
    .gift-l-t
      isFlex()
      background linear-gradient(left, #60a3ff, #8399fc)
      background -webkit-linear-gradient(left, #60a3ff, #8399fc)
      position relative
      &:after
        content ''
        position absolute
        width 100%
        left 0
        bottom -0.2rem
        z-index 99
        border-bottom 0.3rem dotted #8399fc
      .icon
        flex 0 0 3rem
        color white
        font-size 2rem
        text-align center
      .gift-info
        flex 1
        color #fff
        h3
          margin 0.5rem 0 0.2rem
          font-size 0.7rem
        p
          font-size 0.6rem
          font-weight 300
    .gift-l-b
      line-height 2rem
      padding 0 0.5rem
      font-size 0.6rem
      color $gray
      isFlex()
      justify-content-space-between()
      p
        line-height 2rem
      span
        color #8399fc
    &.BEER
      coupon(#31c8fe, #6dd6f8)
    &.FROWINE
      coupon(#31c8fe, #6dd6f8)
    &.COCKTAIL
      coupon(#31c8fe, #6dd6f8)
    &.WINE
      coupon(#31c8fe, #6dd6f8)
    &.DRINK
      coupon(#31c8fe, #6dd6f8)
    &.SUPERMARKET
      coupon(#a28fff, #c6a3ff)
    &.BOX
      coupon(#a28fff, #c6a3ff)
    &.FOOD_VOUCHER
      coupon(#a28fff, #c6a3ff)
    &.DISCOUNT
      coupon(#ff7888, #ff72ab)
    &.CASH_MALL
      coupon(#febd56, #ffd858)
    &.CASH_BOX
      coupon(#febd56, #ffd858)
    &.CASH_ALL
      coupon(#febd56, #ffd858)
    &.FOOD_CASH
      coupon(#febd56, #ffd858)
    &.DRINK
      .gift-l-t
        background linear-gradient(left, #31c8fe, #6dd6f8)
        background -webkit-linear-gradient(left, #31c8fe, #6dd6f8)
        &:after
          border-bottom 0.3rem dotted #31c8fe
      .gift-l-b
        span
          color #31c8fe
  .gift-r
    flex 0 0 2.5rem
    position relative
    div
      height 100%
      background $light-gray
      position relative
      cursor pointer
      i
        font-size 1.2rem
        position absolute
        top 50%
        left 0.65rem
        transform translateY(-50%)
        color #fff
    &:after
      content ''
      width 100%
      height 2px
      background #fff
      position absolute
      top 50%
      transform translateY(-50%)
      display none
.preview-container
  .preview-box
    display inline-block
    width 260px
    height 410px
    background #F5F6F7
    margin-right 30px
    overflow hidden
    &.preview-box-core
      height 453px
    &:nth-child(3n)
      margin-right 0
    .title
      font-size 12px
      color #333
      width 100%
      text-align center
      height 38px
      line-height 38px
    .wx-box
      display inline-block
      width 199px
      height 350px
      margin 0 31px
      line-height 0
      .header-bg
        display inline-block
        width 200px
        height 30px
        background url('https://asset.imuge.net/WeChat-page-title-img.png')
        background-size cover
        position relative
        &.core
          background url('https://asset.imuge.net/WeChat-page-title-img.png')
          background-size cover
        .shopname
          position absolute
          font-size 12px
          transform scale(0.7)
          color white
          width 100px
          /* height: 14px; */
          margin auto
          left 0
          right 0
          bottom 0px
          text-align center
      .showgzh
        display inline-block
        width 199px
        height 144px
        position relative
        background #EBEBEB
        margin-bottom 20px
        box-sizing border-box
        padding 5px
        &.core
          height 180px
        .showgzh-box
          width 250px
          height 160px
          position absolute
          transform scale(0.8)
          top -18px
          left -26px
          padding 10px
          .showxcxzf-body
            display inline-block
            background #fff
            position relative
            vertical-align top
            height 200px
            width 180px
            box-sizing border-box
            padding 10px 50px 10px 10px
            border-radius 4px
            left 2px
            .content
              color #666
              margin-bottom 5px
              img
                width 10px
                height 10px
            .el-icon-caret-left
              position absolute
              left -8px
              color #fff
              top 8px
            .title
              font-size 14px
              height 14px
              line-height 14px
              text-align left
              font-weight bold
              margin 8px 0
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
              width 137%
            .pic
              width 160px
              height 120px
            .bottom
              font-size 12px
              position absolute
              bottom 0px
              border-top 1px solid #dedede
              width 90%
              left 0
              height 14px
              display flex
              justify-items center
              align-items center
              padding 4px 10px
              img
                width 14px
                height 14px
                margin-right 5px
          .avator
            display inline-block
            width 40px
            height 40px
            position relative
          .showgzh-body
            display inline-block
            background #fff
            position relative
            vertical-align top
            height 120px
            width 180px
            box-sizing border-box
            padding 10px 50px 10px 10px
            border-radius 4px
            top 18px
            left 2px
            .el-icon-caret-left
              position absolute
              left -8px
              color #fff
              top 8px
            .title
              text-align left
              font-size 14px
              color #333
              word-break break-all
              text-overflow ellipsis
              display -webkit-box
              -webkit-box-orient vertical
              -webkit-line-clamp 2
              overflow hidden
              height 38px
              line-height 18px
              margin-bottom 5px
            .bottom
              font-size 12px
              position absolute
              bottom 0px
              border-top 1px solid #dedede
              width 90%
              left 0
              height 14px
              display flex
              justify-items center
              align-items center
              padding 4px 10px
              img
                width 14px
                height 14px
                margin-right 5px
            .info
              word-break break-all
              text-overflow ellipsis
              display -webkit-box
              -webkit-box-orient vertical
              -webkit-line-clamp 2
              overflow hidden
              height 34px
              line-height 16px
              font-size 12px
              color #666
              width 100px
            .pic
              position absolute
              width 40px
              height 40px
              bottom 30px
              right 10px
      .showgzhgz
        position relative
        width 100%
        height 186px
        background #EBEBEB
        margin-bottom 20px
        position relative
        .showgzhgz-box
          width 250px
          height 196px
          position absolute
          transform scale(0.8)
          top -18px
          left -26px
          padding 10px
          box-sizing border-box
          .showgzhgz-content
            .avator
              width 40px
              height 40px
            .title
              font-size 14px
              vertical-align bottom
              background #fff
              padding 8px 5px
              border-radius 4px
              position relative
              left 5px
              .el-icon-caret-left
                position absolute
                left -8px
                color #fff
                top 8px
          .showgzhgz-body
            background #fff
            margin-top 10px
            .desc
              display flex
              justify-content space-between
              padding 0 10px 10px 10px
            .bg
              width 40px
              height 40px
            .title
              padding 0 10px
              font-size 14px
              height 30px
              padding-top 2px
              color #333
              line-height 30px
              text-align left
              overflow hidden
              box-sizing border-box
              text-overflow ellipsis
              white-space nowrap
            .info
              font-size 12px
              color #666
              height 24px
              line-height 20px
              text-align left
      .wx-input
        width 199px
        display inline-block
        margin-bottom 10px
        .el-input__inner
          height 30px
          line-height 30px
          font-size 12px
      .xcxpyq-box
        display inline-block
        width 121px
        height 215px
        margin 0 40px 20px 40px
        .image
          width 121px
          height 121px
        .content
          width 121px
          height 94px
          background #fff
          text-align center
          .contentBox
            text-align left
            padding 5px 7px
            box-sizing border-box
            .avator
              width 20px
              height 20px
            span
              width 200px
              display inline-block
              font-size 12px
              vertical-align super
              transform scale(0.5)
              position relative
              top -10px
              left -25px
          .code
            width 40px
            height 40px
          .info
            width 242px
            font-size 12px
            color #999
            transform scale(0.4)
            margin-top 14px
            position relative
            left -61px
</style>
