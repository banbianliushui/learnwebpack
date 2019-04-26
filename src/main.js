//threejs直接操作html
require('./assets/main.css'); //直接写会报错，webpack不支持原生解析css文件,需要loader机制,或者用下面的方式
//require('style-loader!css-loader?minimize!./assets/main.css') 
require('./assets/base.scss');
require('./assets/newpostcss.css');

import Vue from 'vue'
//import vueindex from './pages/vueindex.vue'
import routerindex from './pages/routerindex.vue'
const show = require('./show.js')
const animate = require('./js/threejs/test.js')

import videovue from './pages/testvue/video.vue'
//start import 测试vuex
import Vuex from './libs/myVuex/index'
//end import 测试vuex
import {VueRouter} from './libs/myRouter/vueRouteruse.js'

show('Webpack')
animate()

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

const Home = {
    template: '<div>home</div>'
};
const Book = {
    template: '<div>book</div>'
};
const Movie = {
    template: '<div>movie</div>'
};
const routes = [{
        path: '/',
        component: Home
    },
    {
        path: '/book',
        component: Book
    },
    {
        path: '/movie',
        component: Movie
    }
];
const router = new VueRouter(Vue, {
    routes
});
//end import 测试vuex
new Vue({
    el: '#app',
    store,
    render: h => h(routerindex)
})

export var say = function () {
    console.log('i say')
    return 'i say'
}