<template>
  <div class="membership">
      <div class="inputs">
        <div class="input_item">
          <h1>用户昵称:</h1>
          <el-input v-model="nick_name" style="width: 200px;"></el-input>
        </div>
        <div class="input_item">
          <h1>真实姓名:</h1>
          <el-input v-model="person_name" style="width: 200px;"></el-input>
        </div>
        <div class="input_item">
          <h1>手机号码:</h1>
          <el-input v-model="mobile" style="width: 200px;"></el-input>
        </div>
        <div class="input_item">
          <h1>申请时间:</h1>
          <el-date-picker
            value-format="timestamp"
            v-model="from_date"
            type="datetime"
            placeholder="选择日期">
          </el-date-picker>
          <el-date-picker
            style="margin-left: 10px"
            value-format="timestamp"
            v-model="to_date"
            type="datetime"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="input_item">
          <h1>用户状态:</h1>
          <el-select v-model="state" placeholder="全部" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
          <el-button type="primary" @click="searchUser" style="margin-left: 20px">搜索用户</el-button>
        </div>
      </div>
      <div class="tables">
        <el-table
          :data="personLists"
          border
          style="width: 100%">
          <el-table-column
            prop="avatar"
            label="用户头像"
            width="100">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" alt="" style="width: 60px;height: 60px;">
            </template>
          </el-table-column>
          <el-table-column
            prop="uid"
            label="用户ID"
            width="100">
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="昵称">
          </el-table-column>
          <el-table-column
            prop="personalName"
            label="真实姓名">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="申请时间">
          </el-table-column>
          <el-table-column
            prop="stateDesc"
            label="用户状态">
          </el-table-column>
          <el-table-column
            prop="teamList"
            width="200"
            label="所在战队">
            <template slot-scope="scope">
              <el-button type="primary" style="margin: 4px" v-for="item in scope.row.teamList">{{ item.team_name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button :type="scope.row.state === 1 ? 'danger' : 'success'" size="small" @click="enabledPerson(scope.row)">{{ scope.row.state === 1 ? '禁用' : '启用' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page="pageNum"
          layout="prev, pager, next"
          :total="total*10">
        </el-pagination>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'membership',
    data () {
      return {
        form: {},
        pageNum: 1,
        from_date: '',
        to_date: '',
        state: '',
        total: 1,
        nick_name: '',
        person_name: '',
        mobile: '',
        personLists: [], //会员列表
      }
    },
    created: function () {
      this.getAllPerson();
    },
    methods: {
      //掉接口之前需要验证登陆
      getAllPerson: function () {
        let params = {
          page_num: this.pageNum,
          page_size: 10,
          from_date: this.from_date || null,
          to_date: this.to_date || null,
          state: this.state || null,
          mobile: this.mobile || null,
          nick_name: this.nick_name || null,
          person_name: this.person_name || null,
        };
        this.$http.get('/v1/match/manage/getAllPerson', {
          params
        }).then(data => {
          if(data && data.data && data.data.data) {
            this.personLists = data.data.data.list;
            this.total = data.data.data.totalPages
          }
        })
      },
      searchUser: function () {
        this.pageNum = 1;
        this.getAllPerson();
      },
      handleCurrentChange: function (val) {
        if(this.pageNum === val) return;
        this.pageNum = val;
        this.getAllPerson();
      },
      //启用禁用
      enabledPerson: function (item) {
        this.$http.post(`/v1/match/manage/enabledPerson?uid=${item.uid}&enabled=${item.state === 1 ? 'false' : 'true'}`,).then(data => {
          if(data && data.data && data.data.code === '0') {
            alert(item.state === 1 ? '禁用成功' : '启用成功');
            this.getAllPerson();
          } else {
            alert('设置失败')
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "membership.scss";
</style>
