<template>
    <div class="vs_Against_container">
        <div class="container">
            <ul class="tabTitle">
                <li v-for="(item, index) in patterns"
                    :class="{patActive : tabType === index}"
                    @click="switchPattern(index)">{{ item.title }}</li>
            </ul>
            <div class="svgs">
                <svg style="display:none;">
                    <symbol id="roundIcon2" viewBox="0 0 9 10"><image x="0" y="0" height="10" width="9" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://cdn2.dianjingquan.cn/vs/image/vs_green.png"></image></symbol>
                    <symbol id="roundIcon1" viewBox="0 0 9 10"><image x="0" y="0" height="10" width="9" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://cdn2.dianjingquan.cn/vs/image/vs_red.png"></image></symbol>
                    <symbol id="box1" viewBox="0 0 200 50"><rect x="0" y="0" width="200" height="50" style="fill: rgb(47, 47, 52);"></rect></symbol>
                </svg>
                <div class="svg-box" v-for="(item, index) in patterns" v-show="tabType === index">
                    <!--根据patterns item的type来判断显示哪个组件-->
                    <component v-bind:is="currentView(item)"
                               :patterns="item"
                               @toggle="toggleParentHandle"
                               @edit="editParentHandle"
                               @addnode="addNodeHandle"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Single from './Single';
  import Double from './Double';
  import Group from './Group';

  const vsMap = {
    'Single': Single,
    'Double': Double,
    'Group': Group
  };

  export default {
    name: 'vs-against',
    props: ['vsdata', 'len'],
    components: {
      Single,
      Double,
      Group
    },
    data: function () {
      return {
        tabType: 0, //patterns tab的默认选中
        patterns: []
      }
    },
    created: function(){

    },
    watch: {
      'vsdata': function () {
        (!this.vsdata || this.vsdata.length === 0) ? (this.patterns = []) : (this.patterns = this.vsdata);
      }
    },
    computed: {
      // patterns: function () {
      //   let patterns = this.vsdata || [];
      //   if(patterns.length === 0) return [];
      //   return patterns;
      // }
    },
    methods:{
      //获取当前显示哪种对阵图
      currentView: function (item) {
        return vsMap[item.type] || Single;
      },
      //切换对阵图
      switchPattern: function (index) {
        this.tabType = index;
      },
      toggleParentHandle: function (index) {
        this.$emit('toggleadd', index)
      },
      editParentHandle: function (data) {
        this.$emit('edit', data)
      },
      addNodeHandle: function (data) {
        this.$emit('addplayernode', data)
      }
    }
  }
</script>

<style lang="scss" scoped>
    @import "./vsAgainst.scss";
</style>
