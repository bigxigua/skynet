<template>
  <div class="membership">
    <div class="inputs">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="赛事名:">
          <el-input v-model="match_name"></el-input>
        </el-form-item>
        <el-form-item label="赛事时间:" style="margin-left: 20px;">
          <el-col :span="11">
            <el-date-picker
              v-model="from_date"
              type="datetime"
              value-format="timestamp"
              placeholder="开始时间">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="--" style="margin-left: -45px;">
          <el-col :span="11">
            <el-date-picker
              v-model="to_date"
              type="datetime"
              value-format="timestamp"
              placeholder="结束时间">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="赛事状态" style="margin-left: 14px;">
          <el-select v-model="match_state" placeholder="全部">
            <el-option label="启用" value="1"></el-option>
            <el-option label="未启用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报名状态" style="margin-left: 14px;">
          <el-select v-model="enroll_state" placeholder="全部">
            <el-option label="未过期" value="1"></el-option>
            <el-option label="已过期" value="0"></el-option>
          </el-select>
        </el-form-item>
        <div class="search" style="float: left; margin-left: 20px">
          <el-button type="primary" @click="searchMatch">点击搜索</el-button>
          <el-button type="primary" @click="addMatch">新增</el-button>
        </div>
      </el-form>
    </div>
    <div class="details" ref="details" v-if="showBox">
      <div class="close-btn-content" v-if="showBox" @click="showBox = false">
      <i class="el-icon-circle-close"></i>
      </div>
      <el-tabs v-model="activeName" type="card">
        <Progress :stage="activeName" />
        <el-tab-pane label="用户管理" name="first" :disabled="isEmptyObject(tab1Data)">
          <Tab1 @updata="updataTabData"
                :games="myGames"
                :data="tab1Data"
                @close="toggleShowBox"
                @upload="getAllMatches" />
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second" :disabled="isEmptyObject(tab2Data)">
          <Tab2 @updata="updataTabData"
                @switch="switchTab"
                :activename="activeName"
                v-if="activeName === 'second'"
                :curgame="curGame"
                @close="toggleShowBox" />
        </el-tab-pane>
        <el-tab-pane label="角色管理" name="third" :disabled="isEmptyObject(tab2Data)" >
          <Tab3 @updata="updataTabData"
                :data2="tab2Data"
                :activename="activeName"
                @close="toggleShowBox"
                @reload="getLitleMatch"
                @switch="switchTab" />
        </el-tab-pane>
      </el-tabs>
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
          prop="title"
          label="赛事名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="game_name"
          label="游戏名">
          <template slot-scope="scope">
            <div class="el-tag" v-for="game in scope.row.gameList"
                 @click="getLitleMatch(scope.row, game)">
              {{ game.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="matchTime"
          label="赛事时间">
        </el-table-column>
        <el-table-column
          prop="baomingTime"
          label="报名时间">
        </el-table-column>
        <el-table-column
          prop="stateDesc"
          label="赛事状态">
        </el-table-column>
        <el-table-column
          prop="enrollStatus"
          label="报名状态">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="editMatch(scope.row)" style="margin: 10px;">编辑/查看大赛</el-button>
            <el-button type="danger" size="small" @click="enableMatchProject(scope.row)">
              {{ scope.row.stateDesc === '启用' ? '禁用' : '启用' }}
            </el-button>
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
    <div class="litle-games" v-show="showLitleMatch">
      <div class="tables tables_small_game" >
        <el-button type="success" class="add-small-game" @click="updataGame(false)">新增小赛</el-button>
        <el-button type="success" class="close-small-game" @click="showLitleMatch = false">关闭</el-button>
        <el-table
          :data="LitleMatch"
          border
          style="width: 100%">
          <el-table-column
            prop="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="match_title"
            label="大赛名"
            width="140">
          </el-table-column>
          <el-table-column
            prop="project_title"
            label="小赛名"
            width="140">
          </el-table-column>
          <el-table-column
            prop="game_name"
            label="游戏名">
          </el-table-column>
          <el-table-column
            prop="matchTime"
            label="赛事时间">
          </el-table-column>
          <el-table-column
            prop="baomingTime"
            label="报名时间">
          </el-table-column>
          <el-table-column
            prop="match_status"
            label="赛事状态" >
            <template slot-scope="scope">
              {{ ENROLL_STATE[scope.row.match_status - 1] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="enroll_status"
            label="报名状态">
            <template slot-scope="scope">
              {{ MATCH_STATE[scope.row.match_status - 1] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="build_flag_desc"
            label="构建状态">
          </el-table-column>
          <el-table-column
            prop="assign_flag_desc"
            label="分配状态">
          </el-table-column>
          <el-table-column
            prop="status_desc"
            label="启用状态">
          </el-table-column>
          <el-table-column
            prop="address"
            width="160"
            label="操作">
            <template slot-scope="scope">

              <router-link
                  :to="'/?page=shenhe&matchName=' + scope.row.match_title + '&project_id=' + scope.row.project_id"
                  style="margin: 10px">
                 <el-button type="warning" size="small" style="margin-bottom: 10px">审核报名</el-button>
              </router-link>

              <el-button type="primary" size="small" @click="ensureBuild(scope.row)"
                         style="margin-bottom: 10px"
                         v-if="!scope.row.build_flag && scope.row.status_desc !== '禁用'">构建赛事</el-button>

              <el-button type="success" size="small" style="margin-bottom: 10px" @click="updataGame(true,scope.row)">编辑小赛</el-button>

              <el-button type="warning" size="small"
                         v-if="scope.row.match_status == 3"
                         @click="editBonusDetails(scope.row)" style="margin: 10px;">奖金明细</el-button>

              <el-button type="danger" size="small" @click="enableGame(scope.row)">
                {{ scope.row.status_desc === '禁用' ? '启用' : '禁用' }}</el-button>

              <el-button type="text" size="small" @click="distributionHandle(scope.row)"
                         v-if="!scope.row.assign_flag && scope.row.status_desc !== '禁用' && scope.row.build_flag">分配</el-button>

              <router-link v-if="scope.row.assign_flag && scope.row.build_flag && scope.row.status_desc !== '禁用'"
                           :to="'/?page=fenpei&isAuto=true&gameId=' + scope.row.game_id + '&engineId=' + scope.row.engine_id +'&matchId=' + scope.row.match_id + '&project_id=' + scope.row.project_id">
                <el-button type="success" size="small" plain style="margin-top: 10px">维护赛程</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="distribution-box" v-if="showDistribution">
        <div class="distribution">
          <el-button type="success" plain @click="Randomlydistribu">随机分配</el-button>
          <router-link :to="'/?page=fenpei&matchId='+ this.smallGames.match_id
          +'&gameId=' + this.smallGames.game_id + '&gameName=' + this.smallGames.game_name + '&engineId=' + this.smallGames.engine_id">
            <el-button type="success" plain>手动分配</el-button>
          </router-link>
        </div>
    </div>
    <!-- 编辑奖金明细 -->
    <div class="bouns-details-box" v-if="showEditBouns">
      <div class="bouns-details">
        <el-button type="success" plain style="margin: 20px" @click="showEditBouns = false">关闭</el-button>
        <el-button type="success" plain style="margin: 20px">只需要修改你需要改的</el-button>
        <el-table
          :data="winnerLists"
          style="width: 100%;margin-bottom: 20px">
          <el-table-column
            prop="name"
            label="奖项"
            width="180">
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="value"
            label="获奖名单">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.value" v-if="isArray(scope.row.value)">
                <img :src="parse(item).logo" alt="" style="width: 20px;height: 20px">
                <span style="margin-left: 10px">战队名：{{ parse(item).name }}</span>
                <span style="margin-left: 10px">奖品：{{ parse(item).bonus }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-transfer
          v-for="(item, index) in bonus_lists"
          @left-check-change="leftCheckChange"
          v-model="winner_lists[index]"
          filterable
          :render-content="renderFunc"
          :titles="['所有队伍', item.name + '数量：' + item.num + '个']"
          :button-texts="['删除', '添加']"
          @change="bonusListsChange(index)"
          :data="allEnrollTeams">
        </el-transfer>
        <el-button type="success" plain style="margin: 20px" @click="confirmSetBonus">确认提交</el-button>
        <el-button type="success" plain style="margin: 20px" @click="showEditBouns = false">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Tab1 from './tab1.vue';
  import Tab2 from './tab2.vue';
  import Tab3 from './tab3.vue';
  import Progress from './progress.vue';
  export default {
    name: 'saishiManage',
    components: {
      Tab1,
      Tab2,
      Tab3,
      Progress
    },
    data () {
      return {
        isArray: Array.isArray,
        MATCH_STATE: ['未开始', '进行中','已结束'],
        ENROLL_STATE: ['待报名', '报名中','已结束'],
        form: {},
        match_name: '', //赛事名
        from_date: '', //开始时间
        to_date: '', //结束时间
        enroll_state: '', //报名状态
        match_state: '', // 赛事状态
        curGame: '', //当前修改的游戏信息
        activeName: 'first',
        showBox: false,
        myGames: [],
        gameInfo: {},
        tableData: [],
        tab1Data: {},
        tab2Data: {},
        tab3Data: {},
        pageNum: 1, //当前第几页
        total: 1, //总共有多少页
        showLitleMatch: false,
        LitleMatch: [], //小赛数据
        distribution: '1', //分配方式
        showDistribution: false,
        smallGames: {}, //用来保存选择的小赛的信息
        match_id: '', //比赛id
        smallMatchInfo: {},
        showEditBouns: false,
        allEnrollTeams: [], //报名参赛的选手
        bonus_lists: [], //奖金预设
        selectedOptions2: '',
        winnerRewards: [],
        winner_lists: [],
        project_id: '',
        winnerLists: [],
        parse: JSON.parse,
        leftCheckedLists: [],
        renderFunc: function (h, option) {
          return (
            <div>
                <img
                style="width:20px;border-radius: 100%;vertical-align: middle;"
                src={option.logo} />
                <span style="margin-left:4px">{ option.teamName }</span>
            </div>
          );
        },
      }
    },
    watch: {
      'showBox': function () {
        if(this.showBox) {
          setTimeout(() => {
            this.$refs.details.scrollTop = 0;
          }, 0);
        }
      }
    },
    created: function () {
      this.getAllMatches()
    },
    methods: {
      isEmptyObject: function (obj) {
        return Object.keys(obj).length === 0;
      },
      switchTab: function (value) {
        this.activeName = value
      },
      updataTabData: function (value) {
        this[value.type] = value.data;
      },
      getAllMatches: function (from_date, to_date, game_id, match_name, match_state, enroll_state) {
        const data = {
          'match_id': null,
          'page_num': this.pageNum,
          'page_size': 10,
          'from_date': from_date || null,
          'to_date': to_date || null,
          'game_id': null,
          'match_name': match_name || null,
          'match_state': match_state || null,
          'enroll_state': enroll_state || null,

        };
        this.$http.post('/v1/match/manage/allMatchInfo', data).then(data => {
          if(data && data.data && data.data.data) {
            this.tableData = this.prefixData(data.data.data);
            this.total = +data.data.data.totalPages;
          }
        })
      },
      searchMatch: function () {
        this.getAllMatches(this.from_date, this.to_date, this.game_id, this.match_name, this.match_state, this.enroll_state)
      },
      prefixData: function (data) {
        data.list.map((item, index) => {
          item.index = index+1;
          item.matchTime = new Date(+item.startTime).toLocaleDateString() + '--' + new Date(+item.endTime).toLocaleDateString();
          item.baomingTime = new Date(+item.enrollStartTime).toLocaleDateString() + '--' + new Date(+item.enrollEndTime).toLocaleDateString();
        });
        return data.list
      },
      handleCurrentChange: function (index) {
        if(this.pageNum === index) return;
        this.pageNum = index;
        this.getAllMatches();
      },
      //编辑大赛
      editMatch: function (items) {
        if(this.showBox){
          alert('请先关闭或保存用户管理，才可切换');
          return;
        }
        this.tab1Data = items;
        this.tab1Data.isUpdate = true;
        this.myGames = items.gameList;
        this.activeName = 'first';
        this.toggleShowBox(true, true);
      },
      //新增赛事
      addMatch: function () {
        if(this.showBox){
          alert('请先关闭或保存用户管理，才可切换');
          return;
        }
        this.tab1Data = {};
        this.activeName = 'first';
        this.getAllGames().then(data => {
          this.myGames = data.data.data.list;
          this.toggleShowBox(true, true);
        });
      },
      //启用/禁用大赛
      enableMatchProject: function (item) {
        const state = item.stateDesc === '启用' ? 0 : 1;
        this.$http.post('/v1/match/manage/enableMatch?status=' + state + '&match_id='+ item.id).then(data => {
          if(data && data.data && data.data.msg === 'success') {
            this.$set(this.tableData[item.index-1], 'stateDesc', item.stateDesc === '启用' ? '禁用' : '启用');
            if(this.showLitleMatch){
              this.getLitleMatch(item);
            }
          } else {
            alert(data.data.data)
          }
        })
      },
      //启用/禁用游戏下的小赛
      enableGame: function (item) {
        const status = item.status_desc === '启用' ? 0 : 1;
        this.$http.post('/v1/match/manage/enableMatchProject?status=' + status + '&project_id='+ item.project_id).then(data => {
          if(data && data.data && data.data.msg === 'success') {
            this.$set(this.LitleMatch[item.index-1], 'status', !item.status);
            this.$set(this.LitleMatch[item.index-1], 'status_desc', item.status ? '禁用' : '启用');
          } else {
            alert(data.data.data || 'ERROR')
          }
        })
      },
      getAllGames: function () {
        let params = {
          page_num: 1,
          page_size: 10,
          list_flag: 1
        };
        return this.$http.get('/v1/match/manage/allGames', params);
      },
      updataGame: function (isAdd, info) {
        if(this.showBox){
          alert('请先关闭或保存用户管理，才可切换');
          return;
        }
        this.showLitleMatch = false;
        this.fetchAllMatchProjects(this.smallMatchInfo.id, this.gameInfo.id).then(data => {
          const list = data.data.data.list;
          let properties = {}, defalutValue = {};
          this.activeName = 'second';
          this.toggleShowBox(true);
          this.curGame = this.gameInfo;
          try {
            properties = JSON.parse(this.smallMatchInfo.properties);
          } catch(e) {
            console.log(e)
          }
          if(info) {
            defalutValue = list.find(item => item.project_id === info.project_id);
          }
          this.curGame = Object.assign({}, this.gameInfo, {
            isUpdate: isAdd,
            properties: properties,
            match_id: this.smallMatchInfo.id,
            defalutValue: defalutValue || {}
          })
        });

      },
      toggleShowBox: function (value, showLitleMatch) {
        let $box = document.querySelector('.content');
        $box.scrollTop = 0;
        this.showBox = value;
        this.showLitleMatch = !showLitleMatch;
      },
      //显示小赛
      getLitleMatch: function (item, gameInfo) {
        item ? (this.match_id = item.id, this.smallMatchInfo = item) : {};
        gameInfo ? (this.gameInfo = gameInfo) : {};
        this.fetchAllMatchProjects(this.match_id, this.gameInfo.id).then(data => {
          this.LitleMatch = data.data.data.list || [];
          this.LitleMatch.forEach((list, i) => {
            list.index = i+1;
            list.matchTime = new Date(+list.start_time).toLocaleDateString() + '--' + new Date(+list.end_time).toLocaleDateString();
            list.baomingTime = new Date(+list.enroll_start_time).toLocaleDateString() + '--' + new Date(+list.enroll_end_time).toLocaleDateString();
          });
          this.showLitleMatch = true;
        })
      },
      fetchAllMatchProjects: function (match_id,gameId) {
        return this.$http.post('/v1/match/manage/allMatchProjects', {
          match_id: match_id,
          game_id: gameId || null
        })
      },
      //构建赛事
      ensureBuild: function (game) {
        this.$confirm('只能构建一次不可取消，确定吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.buildMatch(game.engine_id).then((d) => {
            if(d && d.data && d.data.code === '0') {
              this.$message({
                type: 'success',
                message: '构建成功!'
              });
              this.getLitleMatch(this.smallMatchInfo);
            } else {
              this.$message({
                type: 'error',
                message: '构建失败!' + d.data.data
              });
            }
          })
        })
      },
      buildMatch: function (engine_id) {
        return this.$http.get('/v1/match/manage/buildMatch?engine_id=' + engine_id)
      },
      //分配
      distributionHandle: function (game) {
        this.smallGames = game;
        this.showDistribution = true;
      },
      //随机分配
      Randomlydistribu: function () {
        this.$http.get('/v1/match/manage/assignPlayer?engine_id=' + this.smallGames.engine_id).then(data => {
          this.showDistribution = false;
          if(data && data.data && data.data.code === '0') {
            this.getLitleMatch(this.smallMatchInfo);
            alert('随机分配成功')
          } else {
            alert(data.data.data)
          }
        })
      },
      //编辑奖金明细
      editBonusDetails: function (item) {
        this.project_id = item.project_id;
        this.winner_lists = [];
        this.bonus_lists = [];
        let winner_list;

        try{
          let project_properties = JSON.parse(item.project_properties);
          let bonus_lists = project_properties.bonus_lists || [];
              winner_list = project_properties.winner_list || [];
          if(winner_list.length === 0) {
            this.winnerLists = bonus_lists;
          } else {
            this.winnerLists = winner_list;
          }

          bonus_lists.forEach((bonu) => {
            if(bonu.name && bonu.value) {
              this.bonus_lists.push(bonu)
            }
          })
        }catch(e) {console.log(e)}

        let params = {
          "project_id": item.project_id,
          "state": 3
        };
        this.$http.post('/v1/match/manage/allEnrollTeams', params).then(data => {
          if(data && data.data && data.data.data && data.data.data.list) {
            this.allEnrollTeams = data.data.data.list;
            this.allEnrollTeams.forEach(list => {
              list.key = list.groupId;
            });
            if(winner_list.length > 0) {
              winner_list.forEach((win, _index_) => {
                if(!this.winner_lists[_index_]) {
                    this.winner_lists[_index_] = [];
                }
                if(!this.winnerRewards[_index_]) {
                  this.winnerRewards[_index_] = [];
                }
                if(!win.value) {
                  win.value = [];
                }
                win.value.forEach(val => {
                  let _val_ = JSON.parse(val);
                  this.winner_lists[_index_].push(_val_.groupId);
                  this.winnerRewards[_index_].push(val)
                });
              });
            }
            this.showEditBouns = true;
          } else {
            alert('获取报名选手失败')
          }
        })
      },
      //左边被check
      leftCheckChange: function (value) {
        this.leftCheckedLists = value;
      },
      //弹出一个输入奖品内容的输入框
      bonusListsChange: function (index) {
        if(!this.winnerRewards[index]) {
          this.winnerRewards[index] = [];
        }
        if(this.winner_lists[index].length <= this.winnerRewards[index].length) {
          this.removeBonusLists(this.winner_lists[index],this.winnerRewards[index], index);
          return;
        };
        this.$prompt('请输入单个奖品内容(必填)', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          inputPattern: /[^\s+$]/,
          inputErrorMessage: '不可以为空'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '设置成功'
          });
          let length = this.leftCheckedLists.length;
          try{
            let winnerRewards = [];
            this.winnerRewards[index].forEach(data => {
              winnerRewards.push(JSON.parse(data))
            });
            for(let i = 0; i < length; i++) {
              let groupId = this.leftCheckedLists[i];
              let curIndex = winnerRewards.findIndex(winner => winner.groupId === groupId);
              let curTeamInfo = this.allEnrollTeams.find(team => team.groupId === groupId) || {};
              if(curIndex < 0) {
                this.winnerRewards[index].push(JSON.stringify({
                  groupId: groupId,
                  bonus: value,
                  name: curTeamInfo.teamName,
                  logo: curTeamInfo.logo
                }))
              } else {
                let obj = winnerRewards[index][curIndex];
                obj.groupId = groupId;
                obj.bonus = value;
                obj.name = curTeamInfo.teamName;
                obj.logo = curTeamInfo.logo;
                this.winnerRewards[index][curIndex] = JSON.stringify(obj);
              }
            }
          }catch(e){console.log(e)}
        })
      },
      //删除已经添加的奖项
      removeBonusLists: function (groupIds, lists, index) {
        let _lists_ = [];
        if(groupIds.length === 0) {
          this.winnerRewards[index] = [];
          return;
        }
        lists.forEach((list, i) => {
          try{
            let id = JSON.parse(list).groupId;
            if(groupIds.find(_id_ => _id_ === id)) {
              _lists_.push(list)
            }
          }catch(e){console.log(e)}
        })
        this.winnerRewards[index] = _lists_;
      },
      //提交奖品设置
      confirmSetBonus: function () {
        let arrayLists = [];
        this.bonus_lists.forEach((item, index) => {
          arrayLists.push({
            name: item.name,
            num: item.num,
            value: this.winnerRewards[index]
          })
        });
        let params = {
          id: this.project_id || null,
          properties: {
            winner_list: arrayLists
          }
        };

        this.$http.post('/v1/match/manage/updateMatchProject', params).then(data => {
          this.winnerLists = arrayLists;
          this.fetchAllMatchProjects(this.match_id, this.gameInfo.id).then(data => {
            this.LitleMatch = data.data.data.list || [];
            this.LitleMatch.forEach((list, i) => {
              list.index = i+1;
              list.matchTime = new Date(+list.start_time).toLocaleDateString() + '--' + new Date(+list.end_time).toLocaleDateString();
              list.baomingTime = new Date(+list.enroll_start_time).toLocaleDateString() + '--' + new Date(+list.enroll_end_time).toLocaleDateString();
            });
          });
          if(data.data.code === '0') {
            alert('奖品明细保存成功')
          } else {
            alert('保存失败，请检查填写内容或网络')
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "saishimanage.scss";
</style>
