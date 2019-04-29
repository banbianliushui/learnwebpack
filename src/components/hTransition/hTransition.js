function hTransition(props){
  let hTransitionStr = props.duration +' width ease-in-out'
  return {
    'before-enter'(el){
      el.style.transition = hTransitionStr
      if(!el.dataset) el.dataset = {}
      el.dataset.oldPaddingLeft = el.style.
    }
  }
}

export default {
  name: 'hTransition',
  functional: true,//没有管理任何状态，也没有监听任何传递给它的状态，也没有生命周期方法。实际上，它只是一个接受一些 prop 的函数。
  props:{
    duration: {
      type: String,
      default: '1s'
    }
  },
  render(h,{children,props}){
    const data = {
      on: hTransition(props)
    }
    return h('transition',data,children)
  }
}