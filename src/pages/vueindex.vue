<template>
    <div>
        vue 主页测试
        <div class="th1">主题11</div>
        <h1>{{msg}}</h1>
        <p>hello,<span data-title="frontend develop">fed</span></p>
        <div class="choose">
            <label><input type="checkbox">苹果</label>
            <label><input type="checkbox">香蕉</label>
            <label><input type="checkbox">梨</label>
        </div>
        <p>您选择梨<span class="count"></span>种水果</p>
        <p>浏览器通知</p><button @click="notiy">通知</button>
        <div></div>
        <div> kk</div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '小子再这里'
    }
  },
  methods: {
    notiy() {
      if (Notification.permission == 'granted') {
        this.popNoti()
      } else if (Notification.permission != 'denied') {
        Notification.requestPermission(permission => {
          this.popNoti()
        })
      }
    },
    popNoti() {
      var notification = new Notification('你好啊~提示', {
        //dir: 'auto',
        body: '特别的厉害',
        // tag:new Date().getTime,
        icon: '//image.zhangxinxu.com/image/study/s/s128/mm1.jpg'
      })
      notification.onclick = function() {
        notification.close()
      }
    }
  }
}
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


