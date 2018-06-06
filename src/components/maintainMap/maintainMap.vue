<template>
  <div class="warteam-container">
    <el-select v-model="gameName" clearable placeholder="请选择" style="margin-top: 20px">
      <el-option
        v-for="item in allGameLists"
        :key="item.name"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-button type="success"
               style="margin-left: 20px"
               @click="searchMaps">搜索地图</el-button>
    <el-button
              type="success"
              style="margin-left: 20px"
              @click="showEditBox = true, isUpdate = false, mapName = ''">新增地图</el-button>
    <div class="details_cover" v-if="showEditBox">
      <div class="details" >
        <h1>{{ isUpdate ? '编辑' : '新增' }}地图</h1>
        <div class="content">
          <div class="col row">
            <p>当前游戏</p>
            <p>{{ getGameName() }}</p>
          </div>
          <div class="col row">
            <p>地图名</p>
            <el-input style="width: 200px;" v-model="mapName"></el-input>
          </div>
          <!-- <div class="col row">
            <p>地图简介</p>
            <span style="width: 600px;">
               <el-input
                 type="textarea"
                 :rows="5"
                 placeholder="请输入内容"
                 v-model="mapDesc">
                </el-input>
            </span>
          </div> -->
          <div class="buttons">
            <el-button type="success" @click="addMap">保存</el-button>
            <el-button type="info" @click="showEditBox = false">关闭</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="tables">
      <el-table
        :data="gameMaps"
        border
        style="width: 100%">
        <el-table-column
          prop="gameName"
          label="游戏名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="mapName"
          label="地图名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="createTime"
          width="170"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间">
        </el-table-column>
        <el-table-column
          prop="statusDesc"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="editMap(scope.row)">编辑</el-button>
            <el-button type="danger" size="small"
                       @click="deleteMap(scope.row)">删除</el-button>
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
    name: 'WeihuPage',
    data: function () {
      return {
        mapDesc: '',
        mapName: '',
        showEditBox: false,
        allGameLists: [],
        gameMaps: [],
        gameName: +util.getParameterByName('id') || '',
        pageNum: 1,
        total: 1,
        mapId: '',
        isUpdate: false //是新增还是编辑
      }
    },
    created: function () {
      this.getAllGames();
      this.getGameMapLists(this.gameName);
    },
    methods: {
      getGameName: function () {
        const result = this.allGameLists.find(item => item.id === +this.gameName);
        return result ? result.name : '当前未选择游戏'
      },
      //获取所有游戏名
      getAllGames: function (game_name) {
        let params = {
          game_name: game_name || null,
        }
        this.$http.get('/v1/match/manage/allGames', {
          params: params
        }).then(data => {
          try{
            this.allGameLists = data.data.data.list;
          }catch(e){
            alert('获取所有游戏失败' + JSON.stringify(e))
          }
        })
      },
      //查询游戏的地图 game_id不传默认显示全部
      getGameMapLists:function (game_id) {
        this.$http.get('/v1/match/manage/gameMapList', {
          params: {
            game_id: game_id,
            role: 1,
            page_num: this.pageNum,
            page_size: 10
          }
        }).then(data => {
          try{
            this.gameMaps = data.data.data.list;
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
        this.getGameMapLists();
      },
      //根据游戏搜索地图
      searchMaps: function () {
        this.getGameMapLists(this.gameName)
      },
      deleteMapApi: function (mapId) {
        return this.$http.delete('/v1/match/manage/deleteGameMaps?map_id=' + mapId)
      },
      addMapApi: function (query) {
        return this.$http.post('/v1/match/manage/addGameMaps' + query);
      },
      //新增地图
      addMap: function () {
        if(!this.gameName) {
          alert('请选选择游戏');
          return;
        };
        if(!this.mapName) {
          alert('请输入地图名');
          return;
        }
        let query = '?map_name=' + this.mapName + '&game_id=' + this.gameName;
        let requestHandle = this.isUpdate ? this.updateMapApi : this.addMapApi;
        this.isUpdate ? (query+='&map_id=' + this.mapId) : {};
        requestHandle(query).then(data => {
          if(data.data.code === '0') {
            alert('操作成功');
            this.showEditBox = false;
            this.getGameMapLists(this.gameName);
          } else {
            alert('操作失败')
          }
        })
      },
      //编辑地图
      updateMapApi: function (query) {
        return this.$http.post('/v1/match/manage/updateGameMaps' + query)
      },
      editMap: function (item) {
        this.showEditBox = true;
        this.isUpdate = true;
        this.mapName = item.mapName;
        this.gameName = item.gameId
        this.mapId = item.mapId;
      },
      //删除地图
      deleteMap: function (item) {
        this.$confirm('确定删除该地图吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteMapApi(item.mapId).then(data => {
            if(data && data.data && data.data.code === '0') {
              alert('删除成功');
              this.getGameMapLists(this.gameName ? item.gameId : '');
            } else {
              alert('删除失败')
            }
          })
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "maintainMap.scss";
</style>
