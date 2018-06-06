import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations.js'
import getters from './getters'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    showLoading: false
  },
  actions,
  mutations,
  getters
});

export default store;
