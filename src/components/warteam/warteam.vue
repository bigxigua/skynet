<template>
  <div class="warteam-container">
      <el-form ref="form" :model="form" label-width="80px" style="overflow: hidden">
        <el-form-item label="战队名称">
          <el-input v-model="teamName"></el-input>
        </el-form-item>
        <el-form-item label="成立时间" style="margin-left: 20px;">
          <el-col :span="11">
            <el-date-picker
              value-format="timestamp"
              v-model="createStartTime"
              type="datetime"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="--" style="margin-left: -45px;">
          <el-col :span="11">
            <el-date-picker
              value-format="timestamp"
              v-model="createEndTime"
              type="datetime"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="战队状态" style="margin-left: 14px;">
          <el-select v-model="status" placeholder="正常">
            <el-option label="正常" value="1"></el-option>
            <el-option label="冻结" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参加赛事游戏" style="margin-left: 14px;"  label-width="100px">
          <el-select v-model="gameId" placeholder="全部" clearable>
            <el-option
              v-for="item in allGames"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" @click="searchTeam">搜索战队</el-button>
        </el-form-item>
      </el-form>
      <div class="tables">
      <el-table
        :data="teamLists"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="战队名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="game_name"
          label="游戏名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="country_name"
          label="战队国籍">
        </el-table-column>
        <el-table-column
          prop="captain"
          label="战队队长">
        </el-table-column>
        <el-table-column
          prop="captain_contact"
          label="队长联系方式">
        </el-table-column>
        <el-table-column
          prop="status_desc"
          label="战队状态">
        </el-table-column>
        <el-table-column
          prop="players"
          label="战队人数">
        </el-table-column>
        <el-table-column
          prop="create_date"
          label="成立时间">
        </el-table-column>
        <el-table-column
          prop="address"
          label="最后上线">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="checkDesc(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="width: 100%;text-align: center; margin-top: 20px"
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :current-page="pageNum"
        :total="total*10">
      </el-pagination>
    </div>
    <div class="team_desc" v-show="showDetail">
      <div class="details">
        <h1>{{ teamInfo.name }}战队详情</h1>
        <div class="content">
          <div class="col">
            <div>战队国籍：</div>
            <span class="info">{{ teamInfo.countryName }}</span>
            <img src="" alt="" />
          </div>
          <div class="col">
            <div>当前人数：</div>
            <span class="info">{{ teamInfo.players + '个人'  }}</span>
          </div>
          <div class="col">
            <div>战队队长：</div>
            <span class="info">{{ teamInfo.captain }}</span>
          </div>
          <div class="col">
            <div>队长联系方式：</div>
            <span class="info">{{ teamInfo.captainContact }}</span>
          </div>
          <div class="col row">
            <div>参赛项目(大赛名/具体小赛名)：</div>
            <span class="info">{{ joinMatch.join(',') }}</span>
          </div>
          <div class="col">
            <div>当前状态：</div>
            <span class="info">{{ teamInfo.stateDesc }}</span>
          </div>
          <div class="col row">
            <div>战队简介：</div>
            <span class="info">{{ parse(teamInfo.properties).desc }}</span>
          </div>
          <div class="col row">
            <div>战队公告：</div>
            <span class="info">{{ parse(teamInfo.properties).notice || '' }}</span>
          </div>
          <div class="col row">
            <div>战队成员(<++>)</div>
          </div>
          <div class="col row">
            <el-table
              :data="memberList"
              style="width: 100%">
              <el-table-column
                label="编号"
                prop="roleId"
                width="180">
              </el-table-column>
              <el-table-column
                label="头像"
                prop="index"
                width="180">
                <template slot-scope="scope">
                  <img :src="scope.row.avatar" alt="" style="width: 60px;height: 60px">
                </template>
              </el-table-column>
              <el-table-column
                label="平台昵称"
                prop="nickName"
                width="180">
              </el-table-column>
              <el-table-column
                label="真实姓名"
                prop="personalName"
                width="180">
              </el-table-column>
              <el-table-column
                label="国籍"
                prop="countryName"
                width="180">
              </el-table-column>
              <el-table-column
                label="证件类型"
                width="180" height="100">
                <template slot-scope="scope">
                  <span>身份证</span>
                </template>
              </el-table-column>
              <el-table-column
                label="证件号码"
                prop="cardNo"
                width="180">
              </el-table-column>
              <el-table-column
                label="手机号"
                prop="mobile"
                width="180">
              </el-table-column>
            </el-table>
          </div>
          <div class="buttons">
            <!--<el-button type="success">保存</el-button>-->
            <el-button type="info" @click="showDetail = false">关闭</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'warteam',
    data: function () {
      return {
        form: {},
        pageNum: 1,
        createEndTime: '',
        createStartTime: '',
        gameId: '',
        allGames: [],
        teamName: '',
        teamLists: [],
        total: 1,
        showDetail: false,
        teamInfo: {},
        joinMatch: [], //参加的项目
        memberList: [], //成员列表
        status: '1', //状态筛选 1-正常 0-冻结
      }
    },
    created: function () {
      this.getAllGames();
      this.queryAllTeams();
    },
    methods: {
      parse: function (string) {
        let obj = {};
        try {
          obj = JSON.parse(string)
        }catch(e) {}
        return obj;
      },
      getAllGames: function () {
        this.$http.get('/v1/match/manage/allGames').then(data => {
          this.allGames = data.data.data.list;
        })
      },
      searchTeam: function () {
        this.pageNum = 1;
        this.queryAllTeams();
      },
      queryAllTeams: function () {
        let params = {
          "createEndTime": this.createEndTime || null,
          "createStartTime": this.createStartTime || null,
          "gameId": this.gameId || null,
          "pageNum": this.pageNum,
          "pageSize": 10,
          "status": +this.status,
          "teamName": this.teamName || null
        };
        this.$http.post('/v1/match/manage/allTeams', params).then(data => {
          this.teamLists = data.data.data.list;
          this.total = data.data.data.totalPages || 1;
        })
      },
      //查看详情
      checkDesc: function (item) {
        this.showDetail = true;
        this.fetchTeamDesc(item.id);
      },
      fetchTeamDesc: function (group_id) {
        this.$http.get('/v1/match/manage/teamDetail?group_id=' + group_id).then(data => {
          const d = data.data.data;
          this.joinMatch = [];
          this.teamInfo = d.teamInfo;
          this.memberList = d.memberList;
          d.joinMatch.forEach(list => {
            this.joinMatch.push(`【${list.matchTitle}/${list.projectTitle}】`)
          })
        })
      },
      //切换分页
      handleCurrentChange: function (index) {
        if(this.pageNum === index) return;
        this.pageNum = index;
        this.queryAllTeams();
      },
    }
  }
</script>

<style lang="sass" scoped>
  @import "warteam.scss";
</style>
