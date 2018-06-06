<template>
  <div class="membership" style="margin-top: 20px;">
    <div class="inputs">
      <el-select v-model="match_name" clearable placeholder="请选择赛事">
          <el-option :label="item.name" :value="item.name" v-for="item in searchProjectContent"></el-option>
      </el-select>
      <el-select v-model="project_id" clearable placeholder="请选择赛事游戏">
        <el-option :label="item.game_name" :value="item.project_id"
                   v-for="item in searchGamesContent"></el-option>
      </el-select>
      <el-button type="primary" @click="queryMatches">点击搜索</el-button>
    </div>
    <div class="tables">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="matchName"
          label="赛事名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="gameName"
          label="游戏名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="小赛名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="teamName"
          label="战队名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="countryName"
          label="战队国籍">
        </el-table-column>
        <el-table-column
          prop="captainName"
          label="战队队长">
        </el-table-column>
        <el-table-column
          prop="captainContact"
          label="队长联系方式">
        </el-table-column>
        <el-table-column
          prop="stateDesc"
          label="审核状态">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="checkDesc(scope.row)" style="margin-bottom: 10px">战队详情</el-button>
            <el-button :type="shenheSate[scope.row.stateDesc].status == 1 ? 'danger' : 'success'" size="small" @click="toggleReview(scope.row)" v-if="shenheSate[scope.row.stateDesc]">{{ shenheSate[scope.row.stateDesc].content }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="total*10">
      </el-pagination>
    </div>
    <div class="details shenhe_details" v-if="showDesc">
      <h1>详情</h1>
      <ul class="warteam-desc">
        <li>战队名：{{ descData.bigData.teamName }}</li>
        <li>战队国籍：{{ descData.bigData.countryName }}</li>
        <li>战队队长：{{ descData.bigData.captainName }}</li>
        <li>队长联系方式： {{ descData.bigData.captainContact }}</li>
      </ul>
      <div class="tables shenhe_tables">
        <el-table
          :data="descData.descData.personalsList"
          border
          style="width: 100%">
          <el-table-column
            prop="index"
            label="头像"
            width="80">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" alt="" style="width: 50px;height: 50px;border-radius: 100%">
            </template>
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="平台昵称"
            width="140">
          </el-table-column>
          <el-table-column
            prop="personalName"
            label="真实姓名">
          </el-table-column>
          <el-table-column
            prop="countryName"
            label="国籍">
          </el-table-column>
          <el-table-column
            prop="cardType"
            label="证件类型">
          </el-table-column>
          <el-table-column
            prop="cardNo"
            width="180"
            label="证件号码">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号">
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="showDesc = false">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>


  export default {
    name: 'ShenheBaoming',
    data () {
      return {
        mathesName: '',
        gameName: '',
        match_name: '',
        match_id: '',
        game_id: '',
        tableData: [],
        project_id: '',
        descData: {
          bigData: {},
          descData: {}
        },
        pageNum: 1,
        total: 1,
        showDesc: false,
        shenheSate: {
          '未审核': {
            content: '审核通过',
            status: 3,
          },
          '已审核': {
            content: '不许通过',
            status: 1,
          },
          '未通过': {
            content: '审核通过',
            status: 3,
          }
        },
        searchProjectContent: [],
        searchGamesContent: [],
      }
    },
    watch: {
      'match_name': function () {
        const result = this.searchProjectContent.find(item => item.name === this.match_name);
        this.match_id = result ? result.content.match_id : '';
        this.project_id = '';
        if(result && result.content) {
          this.searchGamesContent = result.content.project_list;
          this.searchGamesContent.forEach((item) => {
            item.game_name += '---【' + item.project_name + '】'
          })
        }
      },
      'project_id': function () {
        const result = this.searchGamesContent.find(item => item.project_id === this.project_id)
        if(result) {
          this.game_id = result.game_id;
        }
      }
    },
    created: function () {
      this.getAllMatched();
    },
    methods: {
      getAllTeams: function () {
        let params = {
          "game_id": this.game_id || null,
          "id": null,
          "match_id": this.match_id || null,
          "page_num": this.pageNum,
          "page_size": 10,
          "project_id": this.project_id,
          "sort_flag": null,
          "state": null,
          "team_name": null
        };
        this.$http.post('/v1/match/manage/allEnrollTeams', params).then(data => {
          if(data && data.data && data.data.data && data.data.data.list) {
            this.tableData = this.prefixData(data.data.data.list);
            this.total = +data.data.data.totalPages;
          }
        })
      },
      //获取下拉框的赛事信息
      getAllMatched: function () {
        this.$http.get('/v1/match/manage/cascadeMatch').then(data => {
          let lists = data.data.data;
          Object.keys(lists).forEach(key => {
            this.searchProjectContent.push({
              name: key,
              content: lists[key]
            })
          });
          this.match_name = util.getParameterByName('matchName');
          const result = this.searchProjectContent.find(item => item.name === this.match_name);
          if(result) {
            this.searchGamesContent = result.content.project_list;
            this.match_id = result.content.match_id;
          }
          setTimeout(() => {
            this.project_id = +util.getParameterByName('project_id') || '';
            this.getAllTeams();
          }, 10)

        })
      },
      prefixData: function (data) {
        data.map((item, index) => {
          item.index = index+1;
        });
        return data
      },
      queryMatches: function () {
        this.getAllTeams()
      },
      checkDesc: function (item) {
        this.descData.bigData = item;
        this.$http.get('/v1/match/manage/enrollTeamDetail?enroll_id=' + item.enrollId).then(data => {
          this.showDesc = true;
          if(data && data.data && data.data.data) {
            this.descData.descData = data.data.data;
          }
        })
      },
      toggleReview: function (item) {
        this.$http.post('/v1/match/manage/changeStatus?enroll_id=' + item.enrollId + '&status=' + this.shenheSate[item.stateDesc].status)
          .then(data => {
          if(data && data.data && data.data.code === '0') {
            this.getAllTeams();
            alert('操作成功')
          } else {
            alert(data.data.data)
          }
        }).catch(err => {
          alert('操作失败')
        })
      },
      handleCurrentChange: function (index) {
        if(this.pageNum === index) return;
        this.pageNum = index;
        this.getAllTeams();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "shenhebaoming.scss";
</style>
