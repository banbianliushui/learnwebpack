<template>
  <div class="pane">
    <transition name="pane-fade" @enter="enter" @before-leave="beforeLeave" @leave="leave">
      <div class="pane-body" v-show="showBody">
        <slot></slot>
      </div>
    </transition>
    <div>
      <slot name="foot-l"></slot>

      <i v-if="moreIcon" class="iconfont" :class="moreIcon" @click="moreClick"></i>
      <span v-if="moreText" @click="moreClick">{{moreText}}</span>
      <slot name="foot-r"></slot>
    </div>
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
    }
  },
  data() {
    return {
      iconClass: 'up',
      bodyHeight: 0
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
    enter(el, done) {
      var self = this
      velocity(
        el,
        { height: self.bodyHeight + 'px' },
        { duration: 500, complete: done }
      )
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
<style lang="stylus" rel="stylesheet/stylus" scoped></style>