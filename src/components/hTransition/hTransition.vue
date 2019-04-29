<template>
  <div class="pane">
   <div>
    
    </div>
    <transition name="pane-fade" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
      <div ref="htransitionbody" class="pane-body" >
        <slot></slot>
      </div>
    </transition>
    
  </div>
</template>
<script type="text/ecmascript-6">
//https://segmentfault.com/q/1010000011359250   方法二
import velocity from 'velocity-animate'
export default {
  name: 'ezy-pane',
  props: {
    moreIcon: {
      type: String
    },
    tabs:{
      type:Array
    }

  },
  data() {
    return {
      iconClass: 'up',
      bodyHeight: 0,
      itemIndex: 0
    }
  },
  computed: {
    showBody() {
      var c = true
      switch (this.iconClass) {
        case 'up':
          c = true
          break
        case 'down':
          c = false
          break
      }
      return c
    }
  },
  methods: {
    moreClick() {
      var self = this
      switch (this.iconClass) {
        case 'up':
          this.iconClass = 'down'

          break
        case 'down':
          this.iconClass = 'up'

          break
      }
    },
    beforeEnter(el,done){
      console.log(el)
     let children = this.$refs.htransitionbody.children
    },
    enter(el, done) {
      var self = this
      // velocity(
      //   el,
      //   { height: self.bodyHeight + 'px' },
      //   { duration: 500, complete: done }
      // )
    },
    beforeLeave(el, done) {
      this.bodyHeight = el.clientHeight
    },
    leave(el, done) {
      el.style.height = el.clientHeight + 'px'
      velocity(el, { height: '0px' }, { duration: 500, complete: done })
    }
  }
}
</script>
<style lang="css" rel="stylesheet/css" scoped></style>