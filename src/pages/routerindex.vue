
<template>
  <div>
    <!--  自定义路由后的应用首页 -->
    <router-link to="#/">home</router-link>
    <router-link to="#/book">book</router-link>
    <router-view></router-view>
  </div>
</template>
<script>

export default {
  name: 'app',
  data() {
    return {

    };
  },
  created() {
    
  },
  mounted() {
   
  },
  computed: {
   
  },
  methods: {
    
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


