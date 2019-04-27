import FullScreenPic from './fullScreenPic.vue';
FullScreenPic.install = function(Vue) {
    //Vue.component(FullScreenPic.name, FullScreenPic);
    const fullScreenPicVue = Vue.extend(FullScreenPic);
    Vue.prototype.$fullScreenPic = function(options) {
        let instance = new fullScreenPicVue({
            el: document.createElement('div'),
            data: {}
        });
        // instance.isShow = options.isShow;
        instance.imgList = options.imgList;
        if (options.srcField) {
            instance.srcField = options.srcField;
        }

        let oldele = document.querySelector('.' + instance.$el.className);
        oldele != null ? oldele.parentNode.removeChild(oldele) : '';
        document.body.appendChild(instance.$el);
        instance.show();
        if (options.defaultIndex) {
            instance.toIndexImg(options.defaultIndex);
        }
    };
};
export default FullScreenPic;