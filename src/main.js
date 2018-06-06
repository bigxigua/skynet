import Vue from 'vue'
import App from './App'
import store from './store/index'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './common/reset.css'
import './common/common.scss'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './util/util'



Vue.use(ElementUI);

Vue.use(VueQuillEditor);

Vue.config.productionTip = false;



import titleMixin from './util/title'
Vue.mixin(titleMixin);


Vue.directive('hover', {
  bind: function (el, binding) {
    const value = binding.value;
    el.addEventListener('mouseover', function (e) {
      hoverHandle(e, 'add', value)
    });
    el.addEventListener('mouseleave', function (e) {
      hoverHandle(e, 'remove', value)
    })
  }
});

const hoverHandle = function (e,type, classnames) {
  let oRect = e.currentTarget.children[0];
  let eles = document.querySelectorAll('.' + oRect.classList[0]);
  Array.from(eles).forEach((item) => {
    item.classList[type](classnames);
  })
};


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
