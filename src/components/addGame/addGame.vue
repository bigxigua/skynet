<template>
  <div class="addGame_container">
    <el-input v-model="searchName" placeholder="请输入游戏名进行搜索" class="search"></el-input>
    <el-button type="primary" @click="searchGame">点击搜索</el-button>
    <el-button type="primary"
      @click="_addGame_"
      style="margin-top: 20px"
      v-if="!showEditBox">添加游戏</el-button>
    <div class="inputBox_cover" v-if="showEditBox">
      <div class="inputBox">
        <div class="item">
          <h1>游戏名称</h1>
          <div class="box">
            <el-input v-model="gameName" placeholder="请输入游戏名称"></el-input>
          </div>
        </div>
        <div class="item">
          <h1>赛制类型</h1>
          <div class="box">
            <el-select v-model="matchType" placeholder="请选择">
              <el-option
                v-for="item in matchTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <h1>竞技类型</h1>
          <div class="box">
            <el-select v-model="sportsType" placeholder="请选择">
              <el-option
                v-for="item in sportsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <h1>游戏LOGO</h1>
          <div class="box">
            <el-upload
              action="/v1/match/h5/uploadFilePc"
              list-type="picture-card"
              :show-file-list="false"
              :on-success="uploadSuccess">
              <img v-if="logoUrl" :src="logoUrl" class="avatar">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <div class="item">
          <h1>游戏简介</h1>
          <div class="box">
            <el-input v-model="gameDesc" placeholder="请输入游戏简介"></el-input>
          </div>
        </div>
        <div class="item">
          <h1>游戏排序</h1>
          <div class="box">
            <el-input v-model="gameOrder" placeholder="游戏排序从1开始"></el-input>
          </div>
        </div>
        <div class="item" style="justify-content: center">
          <el-button type="primary" @click="addGame">
            {{ isUpdate ? '更新游戏' : '添加游戏' }}
          </el-button>
          <el-button type="danger" @click="showEditBox = false">关闭</el-button>
        </div>
      </div>
    </div>
    <div class="tables">
        <el-table
          :data="allGameLists"
          style="width: 100%">
          <el-table-column
            prop="listOrder"
            label="游戏排序"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="游戏名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="logo"
            label="游戏logo"
            width="180">
            <template slot-scope="scope">
              <img :src="scope.row.logo" alt="" style="width: 50px">
            </template>
          </el-table-column>
          <el-table-column
            prop="desc"
            label="游戏简介">
          </el-table-column>
           <el-table-column
            prop="typeDesc"
            label="赛制">
          </el-table-column>
          <el-table-column
            prop="model"
            label="竞技类型(BO)">
          </el-table-column>
          <el-table-column
            prop="enabledDesc"
            label="游戏状态">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
               <el-button type="success" size="small"
                @click="editGame(scope.row)">编辑/排序</el-button>
               <el-button type="warning" size="small"
                style="margin: 10px"
                @click="enabledGame(scope.row)">
                {{ scope.row.enabledDesc === '启用' ? '禁用' : '启用' }}
              </el-button>
              <router-link :to="'/?page=weihuMap&id=' + scope.row.id">
                <el-button type="primary" size="small">维护地图</el-button>
              </router-link>
              <router-link :to="'/?page=weihuArea&id=' + scope.row.id">
                <el-button type="success" size="small" style="margin-top: 10px">维护区服</el-button>
              </router-link>
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
  </div>
</template>

<script>
  export default {
    name: 'addGame',
    data: function () {
      return {
        gameName: '',
        searchName: '', //搜索输入的游戏名
        matchTypeOptions: [{
          value: 1,
          label: '单淘赛'
        },{
          value: 2,
          label: '小组赛'
        },{
          value: 3,
          label: '双败赛'
        }],
        matchType: '',
        sportsOptions: [{
          value: 1,
          label: 'BO1'
        },{
          value: 3,
          label: 'BO3'
        },{
          value: 5,
          label: 'BO5'
        }],
        sportsType: '',
        gameDesc: '',
        logoUrl: '',
        allGameLists: [],
        total: 1,
        pageNum: 1,
        showEditBox: false,
        isUpdate: false,
        gameId: null,
        gameOrder: ''
      }
    },
    created: function () {
      this.getAllGames();
    },
    methods: {
      //获取所有游戏
      getAllGames: function (game_name) {
        let params = {
          page_size: 10,
          game_name: game_name || null,
          page_num: this.pageNum,
          list_flag: null //  null或不传显示禁用游戏 为1显示启用的游戏列表
        };
        this.$http.get('/v1/match/manage/allGames', {
          params: params
        }).then(data => {
          try{
            this.allGameLists = data.data.data.list;
            this.total = data.data.data.totalPages || 1
          }catch(e){
            alert('获取所有游戏失败' + JSON.stringify(e))
          }
        })
      },
      //切换分页
      handleCurrentChange: function (index) {
        if(this.pageNum === index) return;
        this.pageNum = index;
        this.getAllGames();
      },
      //修改游戏
      editGame: function (item) {
        this.showEditBox = true;
        this.gameName = item.name;
        this.logoUrl = item.logo;
        this.gameDesc = item.desc;
        this.sportsType = item.model;
        this.matchType = item.type;
        this.gameId = item.id;
        this.gameOrder = item.listOrder || '';
        this.isUpdate = true;
      },
      _addGame_: function () {
        this.showEditBox = true;
        this.isUpdate = false;
        this.gameId = null;
        this.gameName = '';
        this.logoUrl = '';
        this.gameDesc = '';
        this.sportsType = '';
        this.matchType = '';
        this.gameOrder = '';
      },
      updateGameApi: function (params) {
        return this.$http.post('/v1/match/manage/updateGame', params);
      },
      addGameApi: function (params) {
        return this.$http.post('/v1/match/manage/addGame', params)
      },
      //新增/编辑游戏
      addGame: function () {
        let params = {
          model: this.sportsType,
          name: this.gameName,
          properties: {
            logo: this.logoUrl,
            desc: this.gameDesc
          },
          regions: 0,
          id: this.gameId,
          type: this.matchType,
          list_order: parseInt(this.gameOrder) || ''
        };
        if(!this.sportsType) {
          alert('请填写竞技类型');
          return
        }
        if(!this.gameName) {
          alert('游戏名称');
          return
        }
        if(!this.logoUrl) {
          alert('请上传游戏LOGO');
          return
        }
        if(!this.gameDesc) {
          alert('请填写游戏简介');
          return
        }
        if(!this.matchType) {
          alert('请填写赛制类型');
          return
        }
        let handle = this.isUpdate ? this.updateGameApi : this.addGameApi;
        handle(params).then(data => {
          if(data.data.data) {
            this.showEditBox = false;
            this.getAllGames();
            alert('保存成功')
          } else {
            alert('保存失败')
          }
        })
      },
      //启用/禁用游戏
      enabledGame: function (item) {
        this.$http.post('/v1/match/manage/enabledGame?game_id=' + item.id + '&status=' + (item.enabledDesc === '启用' ? 0 : 1)).then(data => {
          this.getAllGames();
          if(data && data.data && data.data.code === '0') {
            alert('操作成功')
          } else {
            alert('操作失败')
          }
        })
      },
      uploadSuccess: function (d) {
        if(d && d.data && d.data.file_url) {
          this.logoUrl = d.data.file_url;
        }
      },
      //搜索游戏
      searchGame: function () {
        this.getAllGames(this.searchName)
      }
    }
  }
</script>
<style scoped lang="sass">
  @import "addGame.scss";
</style>
