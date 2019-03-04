//https://github.com/jackiewillen/build-your-own-vuex/blob/master/my-own-vuex/src/myVuex/store.js

let Vue;
export class Store {
  constructor(options = {}) {
    this.getters = {};
    // this._wrappedGetters = {};
    this._mutations = {};
    this._actions = {};
    this._modules = new ModuleCollection(options)
    const {
      dispatch,
      commit
    } = this;
    this.commit = (type) => {
      return commit.call(this, type);
    }
    this.dispatch = (type) => {
      return dispatch.call(this, type);
    }

    const state = options.state;
    const path = [];
    this._vm = new Vue({
      data: {
        state: state
      }
    })
    installModule(this, state, path, this._modules.root);

  }

  get state() {
    // return this.options.state; // 无法完成页面中的双向绑定，所以改用this._vm的形式
    return this._vm._data.state;
  }
  commit(type) {
    this._mutations[type].forEach(handler => handler());
  }
  dispatch(type) {
    //为什么不触发全部actions？是不是和异步有关，无法确定执行先后？
    return this._actions[type][0]();
  }
}

class ModuleCollection {
  constructor(rawRootModule) {
    this.register([], rawRootModule)
  }
  register(path, rawModule) {
    const newModule = {
      _children: {},
      _rawModule: rawModule,
      state: rawModule.state
    }

    if (path.length === 0) {
      this.root = newModule
    } else {
      //多层嵌套{modules:{state,actions,modules:{state}}}，返回的是整理过的module
      const parent = path.slice(0, -1).reduce((module, key) => {
        return module._children(key)
      }, this.root);

      parent._children[path[path.length - 1]] = newModule;
    }

    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule)
      })
    }
  }
}

function installModule(store, rootState, path, module) {
  if (path.length > 0) {
    const parentState = rootState;
    const moduleName = path[path.length - 1]
    Vue.set(parentState, moduleName, module.state)
  }
  const context = {
    dispatch: store.dispatch,
    commit: store.commit
  }
  const local = Object.defineProperties(context, {
    getters: {
      get: () => store.getters
    },
    state: {
      get: () => {
        let state = store.state; //问题2：怎么返回多个state？  闭包，state值和module模块有关，挂在对应模块下。
        return path.length ? path.reduce((state, key) => state[key], state) : state
      }
    }
  })

  if (module._rawModule.actions) {
    forEachValue(module._rawModule.actions, (actionFn, actionName) => {
      registerAction(store, actionName, actionFn, local);
    })
  }
  if (module._rawModule.getters) {
    forEachValue(module._rawModule.getters, (getterFn, getterName) => {
      registerGetter(store, getterName, getterFn, local);
    });
  }
  if (module._rawModule.mutations) {
    forEachValue(module._rawModule.mutations, (mutationFn, mutationName) => {
      registerMutation(store, mutationName, mutationFn, local)
    });
  }

  forEachValue(module._children, (child, key) => {
    installModule(store, rootState, path.concat(key), child)
  })


}

function registerMutation(store, mutationName, mutationFn, local) {
  const entry = store._mutations[mutationName] || (store._mutations[mutationName] = []);
  entry.push(() => {
    mutationFn.call(store, local.state);
  })
}

function registerGetter(store, getterName, getterFn, local) {
  //和computed对应，可以直接通过store.getters.getterName直接获得计算值
  Object.defineProperty(store.getters, getterName, {
    get: () => {
      return getterFn(local.state, local.getters, store.state)
    }
  })
}

function registerAction(store, actionName, actionFn, local) {
  const entry = store._actions[actionName] || (store._actions[actionName] = [])
  entry.push(() => {
    actionFn.call(store, {
      commit: local.commit,
      state: local.state
    })
  })

}
// 将对象中的每一个值放入到传入的函数中作为参数执行
function forEachValue(obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

// function vuexInit() {
//   const options = this.$options;
//   if (options.store) {
//     // 组件内部设定了store,则优先使用组件内部的store
//     this.$store = typeof options.store === 'function' ? options.store() : options.store;
//   } else if (options.parent && options.parent.$store) {
//     // 组件内部没有设定store,则从根App.vue下继承$store方法
//     this.$store = options.parent.$store
//   }
// }


export function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate: function vuexInit() {
      const options = this.$options;
      if (options.store) {
        this.$store = options.store;
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store;
      }
    }
  })
}