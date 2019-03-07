
<template>
  <div>
    <!--  自定义全局状态后的应用首页 -->
    vue 主页测试
    <div class="th1 th2">主题11</div>
    <h1>{{msg}}</h1>
    <p>
      hello,
      <span data-title="frontend develop">fed</span>
    </p>
    <div class="choose">
      <label>
        <input type="checkbox">苹果
      </label>
      <label>
        <input type="checkbox">香蕉
      </label>
      <label>
        <input type="checkbox">梨
      </label>
    </div>
    <p>
      您选择梨
      <span class="count"></span>种水果
    </p>
    <p>浏览器通知</p>
    <button @click="notiy">通知</button>
    <div></div>
    <div>kk</div>
    <page-a></page-a>
    <page-b></page-b>
  </div>
</template>
<script>
import pageA from './pageA.vue';
import pageB from './pageB.vue';
export default {
  name:'app',
  components:{
    pageA,
    pageB
  },
  data() {
    return {
      msg: '小子再这里'
    };
  },
  created() {
    console.log('打印出this.$store.getters.getStatePlusOne的结果', this.$store.getters.getStatePlusOne);
  },
  mounted() {
    setTimeout(() => {
      this.$store.commit('incrementFive');
      console.log('store state自增5后的结果', this.$store.state.count);
    }, 2000);

    setTimeout(()=>{
      this.$store.dispatch('countPlusSix');
       console.log('store dispatch自增6后的结果', this.$store.state.count);

    },3000)
  },
  computed: {
    count() {
      return this.$store.state.count;
    }
  },
  methods: {
    notiy() {
      if (Notification.permission == 'granted') {
        this.popNoti();
      } else if (Notification.permission != 'denied') {
        Notification.requestPermission(permission => {
          this.popNoti();
        });
      }
    },
    popNoti() {
      var notification = new Notification('你好啊~提示', {
        //dir: 'auto',
        body: '特别的厉害',
        // tag:new Date().getTime,
        icon: '//image.zhangxinxu.com/image/study/s/s128/mm1.jpg'
      });
      notification.onclick = function() {
        notification.close();
      };
    }
  }
};
</script>
<style>
.choose {
  counter-reset: fruit;
}
.choose input:checked {
  counter-increment: fruit;
}
.count::before {
  content: counter(fruit);
}
.th2 {
  color: blueviolet;
  font-weight: bold;
}
.th1 {
  color: aqua;
  font-weight: bold;
}

span[data-title] {
  position: relative;
}
span[data-title]:hover:before {
  content: attr(data-title);
  position: absolute;
  top: -150%;
  left: 50;
  transform: translateX(-50%);
  white-space: nowrap;
}
</style>


