<template>
  <div class="login-container">
      <Header />
      <div class="login-box">
          <div class="login-form">
            <div class="form-item">
              <label for="password">密码：</label>
              <el-input v-model="password" placeholder="请输入密码" id="password"></el-input>
            </div>
            <div class="form-item">
              <el-button type="success" @click="ensurePassword">登陆</el-button>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
  import Header from '@/components/header/header.vue';
  import { password } from '@/config/local.js';
  export default {
    name: 'Login',
    components: {
      Header
    },
    data () {
      return {
        viewName: this.$route.query.page,
        password: ''
      }
    },
    title: function () {
      return '登陆'
    },
    methods: {
      ensurePassword: function () {
        if(!this.password) return;
        if(this.password !== password) {
          alert('密码错误');
          return;
        }
        localStorage.setItem('password', this.password);
        window.location.href = '/';
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "login.scss";
</style>
