<template>
  <div class="operate-container">
    <Header />
    <div class="centent-container">
        <Siderbar />
      <div class="content">
        <div class="tags">
          <el-tag type="success">当前位置：{{ title }}</el-tag>
        </div>
        <transition name="fade-transverse">
          <component v-bind:is="currentView(viewName)"></component>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/header/header.vue';
  import Siderbar from '@/components/siderbar/siderbar.vue';
  import Membership from '@/components/membership/membership.vue';
  import Warteam from '@/components/warteam/warteam.vue';
  import WeihuMap from '@/components/maintainMap/maintainMap.vue';
  import WeihuArea from '@/components/maintainArea/maintainArea.vue';
  import SaishiManage from '@/components/saishimanage/saishimanage.vue';
  import ShengheBaoming from '@/components/shenhebaoming/shenhebaoming.vue';
  import Distribution from '@/components/manualAssignment/manualAssignment.vue';
  import AddGame from '@/components/addGame/addGame.vue';
  import Welcome from '@/components/welcome.vue';
  import { password } from '@/config/local.js';

  const viewMaps = {
    'membership': {
      title: '会员管理',
      component: Membership
    },
    'warteam': {
      title: '战队管理',
      component: Warteam
    },
    'weihuMap': {
      title: '维护地图',
      component: WeihuMap
    },
    'weihuArea': {
      title: '维护区服',
      component: WeihuArea
    },
    'saishi': {
      title: '赛事管理',
      component: SaishiManage
    },
    'shenhe': {
      title: '审核报名',
      component: ShengheBaoming
    },
    'fenpei': {
      title: '维护赛程',
      component: Distribution
    },
    'addGame': {
      title: '新增游戏',
      component: AddGame
    }
  };


  export default {
    name: 'operate',
    components: {
      Header,
      Siderbar,
      Membership,
      Warteam,
      SaishiManage,
      Distribution,
      AddGame,
      Welcome
    },
    beforeRouteEnter (to, from, next) {
     if(localStorage.getItem('password') === password) {
       next();
     } else {
       window.location.href = window.location.origin + '/login';
     }
    },
    watch: {
      '$route.query': function (query) {
        this.viewName = query.page;
      }
    },
    data () {
      return {
          viewName: this.$route.query.page
      }
    },
    title: function () {
      if(util.isEmptyObject(this.$route.query)) {
        return '会员管理'
      }
      if(!viewMaps[this.$route.query.page]) return '欢迎使用龙讯电竞后台管理，有bug联系我';
      return viewMaps[this.$route.query.page].title;
    },
    methods: {
      currentView: function (type) {
        if(util.isEmptyObject(this.$route.query)) {
          return Membership
        }
        return viewMaps[type] ? viewMaps[type].component : Welcome;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "operate.scss";
</style>
