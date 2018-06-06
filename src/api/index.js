import Vue from 'vue'

import axios from 'axios';


axios.defaults.timeout =  2000;
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

let loading_map = [];

export default function (vm) {
  axios.interceptors.request.use(config => {
    let curIndex = loading_map.findIndex(item => item.url === config.url);
    let curReq = {
      url: config.url,
      timestamp: Date.now(),
      timer: setTimeout(() => {
        vm.$store.commit('TOGGLE_SHOW_LOADING', true);
      }, 400)
    }
    curIndex !== -1 ? (loading_map[curIndex] = curReq, config.curIndex = curIndex) 
                    : (loading_map.push(curReq), config.curIndex = loading_map.length - 1);
    return config;
  }, error => {
    vm.$store.commit('TOGGLE_SHOW_LOADING', false);
    return Promise.reject(error)
  });

  axios.interceptors.response.use(response => {
    let curRes = loading_map[response.config.curIndex];
    vm.$store.commit('TOGGLE_SHOW_LOADING', false);
    if(curRes) {
      if(Date.now() - curRes.timestamp <= 400) {
        clearTimeout(curRes.timer)
      }
    }
    return response;
  }, error => {
    loading_map.forEach(item => {
      clearTimeout(item.timer);
      vm.$store.commit('TOGGLE_SHOW_LOADING', false);
    })
    return Promise.reject(error);
  });

  Vue.prototype.$http = axios;

  return axios;
};
