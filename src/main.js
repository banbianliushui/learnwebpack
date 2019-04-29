//threejs直接操作html
require('./assets/main.css'); //直接写会报错，webpack不支持原生解析css文件,需要loader机制,或者用下面的方式
//require('style-loader!css-loader?minimize!./assets/main.css') 
require('./assets/base.scss');
require('./assets/newpostcss.css');

import Vue from 'vue'
//import vueindex from './pages/vueindex.vue'
import routerindex from './pages/routerindex.vue'
import screenpicvue from './pages/views/screenpic/index.vue'
import customVTranstion from './pages/views/customcomp/custom.vue'

const show = require('./show.js')
//const animate = require('./js/threejs/test.js')

//import videovue from './pages/testvue/video.vue'
//start import 测试vuex
import Vuex from './libs/myVuex/index'
//end import 测试vuex
import {VueRouter} from './libs/myRouter/vueRouteruse.js'
import FullScreenPic  from './components/fullScreenPic/index.js'

Vue.use(FullScreenPic);

show('Webpack')
//animate()



const Book = {
    template: '<div>book</div>'
};
const Movie = {
    template: '<div>movie</div>'
};
const routes = [{
        path: '/',
        component: screenpicvue
    },
    {
        path: '/book',
        component: customVTranstion
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
    render: h => h(routerindex)
})

export var say = function () {
    console.log('i say')
    return 'i say'
}