<template>
  <div class="fenpei-container">
    <div class="inputs">
      <el-select v-model="match_id" placeholder="请选择赛事">
        <el-option :label="item.match_name" :value="item.content.match_id" v-for="item in matchOptions"></el-option>
      </el-select>
      <el-select v-model="project_id" placeholder="请选择赛事游戏">
        <el-option :label="item.game_name" :value="item.project_id" v-for="item in project_list"></el-option>
      </el-select>
      <el-button type="primary" @click="searchMatch">点击搜索</el-button>
      <el-button v-if="!isAuto" type="danger" plain @click="dialogVisible=true">手动分配</el-button>
      <el-button v-if="isAuto" type="danger">请点击每组队伍进行赛程维护</el-button>
    </div>
    <div class="vs_Against_box">
      <VsAgainst :vsdata="vsDatas"
                 @toggleadd="togglePlayers"
                 @edit="editHandle"
                 @addplayernode="addPlayerNodes"/>
    </div>
    <div class="vs_players" v-if="!isAuto">
      <ul>
        <li v-for="(item, index) in players" draggable="true" @dragend="dragendHandle" @dragstart="dragstartHandle($event,index, item)">
          <svg width="262" height="93" viewBox="62 68 262 93">
            <rect x="62" y="68" width="200" height="25" class="rect57" style="fill: rgb(52, 72, 96);"></rect>
            <image x="67" y="71" height="20" width="30" xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="item.teamLogo"></image>
            <text x="102" y="85" font-size="13" class="normal" style="fill: rgb(255, 255, 255);">{{ item.teamName }}</text>
            <text x="232" y="85" font-size="13" style="fill: rgb(255, 255, 255);">0</text>
          </svg>
        </li>
      </ul>
    </div>
    <div class="tables" v-if="showCommentList && isAuto">
      <el-table
        :data="commentList"
        border
        style="width: 100%">
        <el-table-column
          prop="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="用户名"
          width="140">
        </el-table-column>
        <el-table-column
          width="160"
          prop="creatTime"
          label="评论时间">
        </el-table-column>
        <el-table-column
          prop="comment"
          label="内容">
        </el-table-column>
        <el-table-column
          prop="address"
          width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteComment(scope.row)">删除评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="width: 100%;text-align: center; margin-top: 20px"
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="total*10">
      </el-pagination>
    </div>
    <div class="match-edit-box" v-show="showEditbox">
      <div class="match-edit">
        <i class="el-icon-circle-close" @click="showEditbox = false"></i>
        <h1>赛程编辑</h1>
        <div class="edit-item">
          <h2>赛程时间</h2>
          <el-date-picker
            value-format="timestamp"
            v-model="matchStartTime"
            type="datetime"
            placeholder="选择开始时间">
          </el-date-picker>
          <span style="float: left; line-height: 40px;font-size: 20px;margin-left: 20px;">--</span>
          <el-date-picker
            value-format="timestamp"
            style="margin-left: 20px"
            v-model="matchEndTime"
            type="datetime"
            placeholder="选择结束时间">
          </el-date-picker>
        </div>
        <div class="edit-item">
          <h2>参赛队伍</h2>
          <svg width="600" height="25" viewBox="0 0 600 25" style="margin-top: 5px">
            <rect x="0" y="0" width="200" height="25" class="rect57" style="fill: rgb(52, 72, 96);"></rect>
            <image x="5" y="3" height="20" width="30" xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="teams.lteamLogo"></image>
            <text x="40" y="17" font-size="13" class="normal" style="fill: rgb(255, 255, 255);">{{ teams.lteamName }}</text>
            <text x="170" y="17" font-size="13" style="fill: rgb(255, 255, 255);">0</text>

            <text x="220" y="20" font-size="20" style="fill: #ba4c1e;">VS</text>

            <rect x="260" y="0" width="200" height="25" class="rect57" style="fill: rgb(52, 72, 96);"></rect>
            <image x="265" y="3" height="20" width="30" xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="teams.rteamLogo"></image>
            <text x="300" y="17" font-size="13" class="normal" style="fill: rgb(255, 255, 255);">{{ teams.rteamName }}</text>
            <text x="430" y="17" font-size="13" style="fill: rgb(255, 255, 255);">0</text>
          </svg>
        </div>
        <div class="edit-item">
          <h2>比分设置</h2>
          <el-input style="width: 200px;" v-model="left_score" placeholder="请输入分数"></el-input>
          <span style="color: #ba4c1e; float: left;font-size: 20px;margin:10px 12px 0 20px">VS</span>
          <el-input style="width: 200px;" v-model="right_score" placeholder="请输入分数"></el-input>
        </div>
        <div class="edit-item">
          <h2>谁赢了啊</h2>
          <el-select v-model="winner_id" placeholder="请选择">
            <el-option
              v-for="item in teamOptions"
              :key="item.team_name"
              :label="item.team_name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="edit-item">
          <h2>此轮比赛状态</h2>
          <div>
            <el-radio v-model="confirmed" label="true" style="margin-top: 12px">已结束</el-radio>
            <el-radio v-model="confirmed" label="false">未结束</el-radio>
          </div>
        </div>
        <div class="edit-item">
          <h2>查看评论</h2>
          <div>
            <el-button type="success" @click="checkComment">查看评论</el-button>
          </div>
        </div>
        <div class="edit-item" v-for="(item, index) in bo" v-if="videoUrl.length > 0">
            <h2>视频编辑(BO{{ item }})</h2>
            <div style="width: 410px;" v-if="videoUrl[index]">
              <el-input v-model="videoUrl[index].video_name" placeholder="请输入视频标题"></el-input>
              <el-input v-model="videoUrl[index].video_url" placeholder="请输入视频URL" style="margin-left: 10px;"></el-input>
            </div>
        </div>
        <div class="edit-item" style="text-align: center; margin-top: 40px;">
          <el-button type="primary" @click="saveEditHandle">保存</el-button>
          <el-button type="primary" style="" @click="showEditbox = false">关闭</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定这样分配吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureDistribution">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import VsAgainst from '../vsAgainstEdit/vsAgainst';
  export default {
    name: 'Distribution',
    components: {
      VsAgainst
    },
    data () {
      return {
        dialogVisible: false,
        match_id: '',
        matchOptions: [],
        game_id: '',
        project_list: [],
        project_id: '',
        vsDatas: [],
        engine_id: '',
        players: [],
        player_id: '',
        showEditbox: false, //显示编辑
        isAuto: false,
        matchStartTime: '', //参赛开始时间
        matchEndTime: '', //参赛结束时间
        videoUrl: [], //视频URL
        videoLists: [],
        left_score: 0,
        right_score: 0,
        teams: {}, //一组队伍
        groups: [], //所有group
        teamOptions: [],
        winner_id: '', //赢方设置
        confirmed: 'false',
        pageNum: 1,
        total: 1,
        commentList: [],
        showCommentList: false,
        customize: false, //是否是从侧边栏直接点过来的
        playerNodes: [],
        id: '',
        bo: 1 //BO多少
      }
    },
    watch: {
      'match_id': function () {
        let _content_ = this.matchOptions.find((item) => item.content.match_id === +this.match_id);
        this.project_list = _content_ ? _content_.content.project_list : [];
        this.project_list.forEach((item) => {
          item.game_name += '---【' + item.project_name + '】';
        });
        this.project_id = '';
      },
      'project_id': function () {
        let _list_ = this.project_list.find((list) => list.project_id === +this.project_id);
        if(_list_) {
          this.game_id = _list_.game_id;
          this.engine_id = _list_.engine_id
        }
      }
    },
    created: function () {
      this.engine_id = +util.getParameterByName('engineId') || '';
      this.game_id = util.getParameterByName('gameId') || '';
      this.isAuto = util.getParameterByName('isAuto');
      this.customize = util.getParameterByName('customize') || '';

      if(!this.isAuto && !this.customize) {
        this.getAllPlayers();
      }
      if(!this.customize) {
        this.getvsMaps();
      }
      if(this.isAuto && !this.customize) {
        this.getAllvsslist();
      }
      this.getAllMatched();

    },
    methods: {
      //获取下拉框中的所有赛事
      getAllMatched: function () {
        this.$http.get('/v1/match/manage/cascadeMatch').then(data => {
          this.matchOptions = [];
          this.match_id = +util.getParameterByName('matchId') || '';
          setTimeout(() =>{
            this.project_id = +util.getParameterByName('project_id') || '';
          }, 10)
          Object.keys(data.data.data).forEach(key => {
            this.matchOptions.push({
              match_name: key,
              content: data.data.data[key] || {}
            })
          });
        })
      },
      //获取所有的赛事选手
      getAllPlayers: function () {
        this.$http.get('/v1/match/manage/getMatchPlayers?engine_id=' + this.engine_id).then(data => {
          if(data && data.data && data.data.data){
            this.players = data.data.data;
          }
        })
      },
      //搜索赛事
      searchMatch: function () {
        if(!this.match_id) {
          alert('请选择赛事');
          return;
        }
        if(!this.engine_id || !this.game_id) {
          alert('请选择游戏');
          return;
        }
        this.getvsMaps();
        this.getAllvsslist();
      },
      //获取对阵图数据
      getvsMaps: function () {
        this.vsDatas = [];
        this.$http.get('/v1/match/manage/getMatchPlan?engine_id=' + this.engine_id).then(data => {
          if(data && data.data && data.data.data){
            this.vsDatas = data.data.data.patterns;
          } else {
            alert(data.data.msg)
          }
        })
      },
      togglePlayers: function (index) {
        this.players.splice(index, 1);
      },
      //拖拽
      dragstartHandle: function (ev,index, player) {
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData('text', ev.currentTarget.children[0].innerHTML);
        ev.dataTransfer.setData('index', index);
        ev.dataTransfer.setData('playerId', player.playerId);
        this.player_id = player.playerId;
        ev.dataTransfer.setData('image', player.teamLogo);
        ev.dataTransfer.setData('teamName', player.teamName);
      },
      //拖拽
      dragendHandle: function (ev) {
        ev.dataTransfer.clearData('text');
      },
      getAllvsslist: function () {
        let params = {
          gameId: this.game_id,
          matchId: this.match_id,
        };
        this.$http.get('/v1/match/manage/vssList', {
          params: params
        }).then(data => {
          if(data && data.data && data.data.data) {
            this.groups = data.data.data.list || [];
          }
        })
      },
      //接受修改时对阵图组件传过来的数据
      editHandle: function (data) {
        this.id = data.id;
        this.teamOptions = [];
        this.winner_id = data.winner_player_id;
        this.teams = this.groups.find(item => item.engineVsId === data.id);
        this.bo = 1;

        let custom_bo_lists = [];

        try{
          custom_bo_lists = JSON.parse(this.teams.projectProperties).custom_bo_lists || [];
        }catch(e){}

        if(custom_bo_lists.length > 0) {
          this.bo = custom_bo_lists[this.teams.round-1].bo/1;
        } else {
          this.bo = this.teams.bo || 1
        }
        this.teamOptions.push({
          team_name: data.left_team_name,
          id: data.left_player_id
        });
        this.teamOptions.push({
          team_name: data.right_team_name,
          id: data.right_player_id
        });
        this.matchStartTime = this.teams.startTime ? new Date(this.teams.startTime).getTime() : '';
        this.matchEndTime = this.teams.endTime ? new Date(this.teams.endTime).getTime() : '';
        let vsProperties = {};
        try {
          vsProperties = JSON.parse(this.teams.vsProperties)
        } catch (e) {}

        this.left_score = vsProperties.left_score || 0;
        this.right_score = vsProperties.right_score || 0;
        this.confirmed = vsProperties.confirmed ? vsProperties.confirmed + '' : 'false';
        let _videoUrl_ = vsProperties.video_url;
        if(_videoUrl_ && Array.isArray(_videoUrl_)) {
          this.videoUrl = _videoUrl_.slice(0, this.bo) || [];
        } else {
          this.videoUrl = Array.apply(null, Array(this.bo)).map(function(item, i) {
            return {
              video_url: '',
              video_name: '视频回放'
            };
          });
          this.videoUrl[0].video_url = vsProperties.video_url || ''
        }
        this.showEditbox  = true;
      },
      //保存修改
      saveEditHandle: function () {
        let videoUrl = [];
        this.videoUrl.forEach((item, index) => {
          item.video_num = index + 1;
          videoUrl.push(item)
        });
        let params = {
          end_time: this.matchEndTime,
          start_time: this.matchStartTime,
          vs_id: this.teams.vsId,
          is_live: this.teams.isLive,
          properties: {
            video_url: videoUrl
          },
          scores_request: {
            confirmed: this.confirmed === 'true' ? true : false,
            id: this.id,
            left_score: +this.left_score,
            right_score: +this.right_score,
            winner_node_id: this.winner_id
          }
        };
        this.$http.post('/v1/match/manage/updateMatchVss', params).then(data => {
          this.showEditbox = false;
          if(data.data.code === '0') {
            alert('更新成功');
            this.getvsMaps();
            this.getAllvsslist();
          } else {
            alert('更新失败')
          }
        })
      },
      //查看评论
      checkComment: function () {
        this.showEditbox = false;
        this.showCommentList = true;
        let params = {
          page_num: this.pageNum,
          page_size: 10,
          type: 2, //1表示赛事的 2//赛程
          id: this.teams.vsId
        };
        this.$http.get('/v1/match/manage/manageCommentList', {
          params: params
        }).then(data =>{
          this.commentList = data.data.data.list;
          this.total = data.data.data.totalPages;
          this.commentList.forEach((item, index) => {
            item.index = index+1;
          });
        })
      },
      handleCurrentChange: function (index) {
        if(this.pageNum === index) return;
        this.pageNum = index;
        this.checkComment();
      },
      //删除评论
      deleteComment: function (comment) {
        this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchDelete(comment).then(data => {
            if(data.data.code === '0') {
              this.checkComment();
              alert('删除成功')
            } else {
              alert('删除失败' + data.data.data)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      fetchDelete: function (comment) {
        return this.$http.delete('/v1/match/manage/deleteComment/' + comment.id);
      },
      //接受传过来的node
      addPlayerNodes: function (item) {
        this.playerNodes.push({
          nodeId: item.id,
          playerId: this.player_id || ''
        });
      },
      //手动分配
      ensureDistribution: function () {
        if(this.players.length > 0) {
          this.dialogVisible = false;
          alert('还有未添加的队伍，请继续');
          return;
        }
        this.$http.post('/v1/match/manage/manualAssignPlayer/' + this.engine_id, this.playerNodes).then(data => {
          this.dialogVisible = false;
          if(data.data.code === '0') {
            alert('构建成功');
            this.reloadPage();
          } else {
            alert(data.data.data)
          }
        })
      },
      //手动分配成功后刷新页面为维护的状态
      reloadPage: function () {
        let url = window.location.href;
        url += '&isAuto=true';
        window.location.href = url;
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "manualAssignment.scss";
</style>
