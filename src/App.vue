<template>
  <div id="app">
    <transition name="slide">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import createAxios from './api/index'
  export default {
    name: 'App',
    created: function () {
      createAxios(this)
    }
  }
</script>

<style>
  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .alert-cover{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 300;
    background: rgba(0,0,0,0.6);
  }
  .alert-message-box{
    display: inline-block;
    width: 420px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    overflow: hidden;
    backface-visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    height: 100px;
    text-align: center;
    color: #333;
    box-sizing: border-box;
    font-size: 15px;
    line-height: 100px;
    /*padding-left: 20px;*/
  }
</style>
