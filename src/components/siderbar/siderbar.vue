<template>
  <div class="siderbar" :class="{'siderbar-small' : !showSiderbar}">
      <ul>
          <li v-for="(item, index) in siderbarMaps" class="item"
              :class="item.show ? 'siderbar-item-chose' : ''"
              :style="{'height': (item.show ? (item.children.length+1)*46 : 46) + 'px'}"
              @click="toggleMenu(index, item, $event)">
              <i :class="item.icon"></i>
              <router-link :to="'/?page=' + item.href" v-if="item.href">
                <span :style="{'color': item.show ? '#fff' : ''}">{{ item.name }}</span>
              </router-link>
              <a href="javascript:void(0)" v-else>
                <span :style="{'color': item.show ? '#fff' : ''}">{{ item.name }}</span>
              </a>
              <div class="two-menu" v-for="menu in item.children">
                <router-link :to="'/?page=' + menu.href" :class="checkActived(menu.href) ? 'actived' : ''">
                  {{ menu.name }}
                  <i class="el-icon-arrow-left" v-if="checkActived(menu.href)"></i>
                </router-link>
              </div>
          </li>
      </ul>
  </div>
</template>

<script>
  const siderbarMaps = [{
    icon: 'el-icon-d-arrow-left',
    name: '收起',
    children: []
    },{
      icon: 'el-icon-menu',
      name: '会员管理',
      href: 'membership',
      children: []
    },{
      icon: 'el-icon-star-on',
      name: '战队管理',
      href: 'warteam',
      children: []
    },{
      icon: 'el-icon-mobile-phone',
      name: '游戏管理',
      children: [{
        name: '管理游戏',
        href: 'addGame'
      },{
        name: '维护地图',
        href: 'weihuMap'
      },{
        name: '维护区服',
        href: 'weihuArea'
      }]
    },{
      icon: 'el-icon-printer',
      name: '赛事',
      children: [{
        name: '赛事管理',
        href: 'saishi'
      },{
        name: '审核报名',
        href: 'shenhe'
      },{
        name: '维护赛程',
        href: 'fenpei&isAuto=true&customize=true'
      }]
    },{
      icon: 'el-icon-edit-outline',
      name: '运营',
      href: '404',
      children: []
    },{
      icon: 'el-icon-printer',
      name: '报表',
      href: '404',
      children: []
    }];
  export default {
    name: 'Siderbar',
    data: function () {
      return {
        siderbarMaps: siderbarMaps,
        showSiderbar: true
      }
    },
    computed: {

    },
    created: function () {
      const page = this.$route.query.page;
      if(!page) {
        this.siderbarMaps[1].show = true;
      }
      this.siderbarMaps.forEach(item => {
        item.href === page ? (item.show = true) : {};
        if(item.children.length > 0) {
          item.children.forEach(child => {
            child.href === page ? (item.show = true) : {};
          })
        }
      });
    },
    methods: {
      checkActived: function (page) {
        let _page_ = page.split('&');
        return this.$route.query.page === _page_[0];
      },
      toggleMenu: function (index, item, e) {
        this.siderbarMaps.map(list => {
          this.$set(list, 'show', false);
        });
        if(index === 0) {
          this.showSiderbar = !this.showSiderbar;
        } else {
          this.$set(this.siderbarMaps[index], 'show', !item.show);
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "siderbar.scss";
</style>
