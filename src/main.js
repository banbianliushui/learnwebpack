require('./assets/main.css');//直接写会报错，webpack不支持原生解析css文件,需要loader机制,或者用下面的方式
//require('style-loader!css-loader?minimize!./assets/main.css') 
require('./assets/base.scss');
require('./assets/newpostcss.css');

import Vue from 'vue'
import vueindex from './pages/vueindex.vue'
const show = require('./show.js')

show('Webpack')

new Vue({
    el: '#app',
    render: h => h(vueindex)
})

export var say = function(){
    console.log('i say')
    return 'i say'
}