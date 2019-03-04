export class Store {
  constructor(options = {}, Vue) {
    Vue.mixin({
      beforeCreate: vuexInit
    })
    this.options = options;
    this.getters = {};
    this.mutations = {};
    this.actions = {};
    const {
      dispatch,
      commit
    } = this;

    // this.commit = (type) => {//问题1.为什么这里多这一步
    //   return commit.call(this, type)
    // }
    // this.dispatch = (type) => {
    //   return dispatch.call(this, type);
    // }
    forEachValue(options.actions, (actionFn, actionName) => {
      registerAction(this, actionName, actionFn)
    })
    forEachValue(options.getters, (getterFn, getterName) => {
      registerGetter(this, getterName, getterFn)
    })

    forEachValue(options.mutations, (mutationFn, mutationName) => {
      registerMutations(this, mutationName, mutationFn)
    })
    this._vm = new Vue({
      data: {
        state: options.state
      }
    })
  }

  get state() {
    // return this.options.state; // 无法完成页面中的双向绑定，所以改用this._vm的形式
    return this._vm._data.state;
  }
  commit(type) {
    this.mutations[type]();
  }
  dispatch(type) {
    return this.actions[type]();
  }
}

function registerMutations(store, mutationName, mutationFn) {
  store.mutations[mutationName] = () => {
    mutationFn.call(store, store.state);
  }
}

function registerGetter(store, getterName, getterFn) {
  //和computed对应，可以直接通过store.getters.getterName直接获得计算值
  Object.defineProperty(store.getters, getterName, {
    get: () => {
      return getterFn(store.state)
    }
  })
}

function registerAction(store, actionName, actionFn) {
  store.actions[actionName] = () => {
    actionFn.call(store, store)
  }
}
// 将对象中的每一个值放入到传入的函数中作为参数执行
function forEachValue(obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

function vuexInit() {
  const options = this.$options;
  if (options.store) {
    // 组件内部设定了store,则优先使用组件内部的store
    this.$store = typeof options.store === 'function' ? options.store() : options.store;
  } else if (options.parent && options.parent.$store) {
    // 组件内部没有设定store,则从根App.vue下继承$store方法
    this.$store = options.parent.$store
  }
}