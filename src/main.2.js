//自定义全局状态vuex的入口
require('./assets/main.css'); //直接写会报错，webpack不支持原生解析css文件,需要loader机制,或者用下面的方式
//require('style-loader!css-loader?minimize!./assets/main.css') 
require('./assets/base.scss');
require('./assets/newpostcss.css');

import Vue from 'vue'
import vueindex from './pages/vueindex.vue'
const show = require('./show.js')
//start import 测试vuex
import Vuex from './libs/myVuex/index'
//end import 测试vuex
show('Webpack')
//
//start import 测试vuex
const pageA = {
    state: {
        count: 100
    },
    mutations: {
        incrementA(state) {
            state.count++
        }
    },
    actions: {
        incrementAAction(context) {
            context.commit('incrementA')
        }
    }
}
const pageB = {
    state: {
        count: 500
    },
    mutations: {
        incrementA(state) {
            state.count++
        }
    },
    actions: {
        incrementAAction(context) {
            context.commit('incrementA')
        }
    }
}
let store = new Vuex.Store({
    modules: {
        a: pageA,
        b: pageB
    },
    state: {
        count: 0
    },
    mutations: {
        incrementFive(state) {
            // console.log('初始state', JSON.stringify(state));
            state.count = state.count + 5;
        },
        plusSix(state) {
            state.count = state.count + 6
        }
    },
    getters: {
        getStatePlusOne(state) {
            return state.count + 1
        }
    },
    actions: {
        countPlusSix(context) {
            context.commit('plusSix')
        }
    }
}, Vue)
//end import 测试vuex
new Vue({
    el: '#app',
    store,
    render: h => h(vueindex)
})

export var say = function () {
    console.log('i say')
    return 'i say'
}