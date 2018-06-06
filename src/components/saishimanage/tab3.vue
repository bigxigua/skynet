<template>
  <div class="tab1 tab2">
    <div class="block">
      <h2>推广信息设置</h2>
    </div>
    <div class="block" style="border: none;">
      <ul class="tab_block">
        <li>
        <div class="tab_li_item">
          <h3>裁判</h3>
          <span class="tab_li_span" style="height: 44px;">
                <el-radio v-model="has_umpire" label="1">需要</el-radio>
                <el-radio v-model="has_umpire" label="0">不需要</el-radio>
            </span>
        </div>
      </li>
        <li style="margin-top: -30px" v-if="has_umpire === '1'">
          <div class="tab_li_item">
            <h3>裁判姓名</h3>
            <span class="tab_li_span">
              <el-input v-model="umpire_name" placeholder="请输入内容"></el-input>
            </span>
          </div>
        </li>
        <li>
          <div class="tab_li_item">
            <h3>直/录播</h3>
            <span class="tab_li_span" style="height: 44px;">
                <el-radio v-model="has_live" label="1">需要</el-radio>
                <el-radio v-model="has_live" label="0">不需要</el-radio>
            </span>
          </div>
        </li>
        <li style="margin-top: -30px" v-if="has_live === '1'">
          <div class="tab_li_item">
            <h3>平台名称/房间号</h3>
            <span class="tab_li_span">
              <el-input v-model="live_info" placeholder="请输入内容"></el-input>
            </span>
          </div>
        </li>
        <li>
          <div class="tab_li_item">
            <h3>解说</h3>
            <span class="tab_li_span" style="height: 44px;">
                <el-radio v-model="has_narrater" label="1">需要</el-radio>
                <el-radio v-model="has_narrater" label="0">不需要</el-radio>
            </span>
          </div>
        </li>
        <li style="margin-top: -30px" v-if="has_narrater === '1'">
          <div class="tab_li_item">
            <h3>解说姓名</h3>
            <span class="tab_li_span">
              <el-input v-model="narrater" placeholder="请输入内容"></el-input>
            </span>
          </div>
        </li>
        <li>
          <div class="tab_li_item">
            <h3>赞助商</h3>
            <span class="tab_li_span" style="height: 44px;">
                <el-radio v-model="has_sponsor" label="1">需要</el-radio>
                <el-radio v-model="has_sponsor" label="0">不需要</el-radio>
            </span>
          </div>
        </li>
        <li style="margin-top: -30px" v-if="has_sponsor === '1'">
          <div class="tab_li_item">
            <h3>赞助商姓名</h3>
            <span class="tab_li_span">
              <el-input v-model="sponsor" placeholder="请输入内容"></el-input>
            </span>
          </div>
        </li>
        <li>
          <div class="tab_li_item">
            <h3>线下观赛</h3>
            <span class="tab_li_span" style="height: 44px;">
                <el-radio v-model="has_watch" label="1">需要</el-radio>
                <el-radio v-model="has_watch" label="0">不需要</el-radio>
            </span>
          </div>
        </li>
        <li style="margin-top: -30px" v-if="has_watch === '1'">
          <div class="tab_li_item">
            <h3>观赛地址</h3>
            <span class="tab_li_span">
              <el-input v-model="watch_address" placeholder="请输入内容"></el-input>
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div class="block" style="border: none;margin-top: 20px; text-align: center;">
      <el-button type="primary" @click="goBack">上一步</el-button>
      <el-button type="primary" @click="saveHandle">保存</el-button>
      <el-button type="primary" @click="close">关闭</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Tab3',
    props: ['switch', 'data2', 'activename'],
    data: function () {
      return {
        has_umpire: '0', //是否需要裁判 0-不需要 1-需要
        has_live: '0', //是否需要直/录播
        has_narrater: '0', //是否需要解说
        has_sponsor: '0', //是否需要赞助商
        has_watch: '0',//是否需要线下观赛
        umpire_name: '', //裁判
        live_info: '', //直/录播
        narrater: '',//解说
        sponsor: '',//赞助
        watch_address: '',//线下观赛
        data3: {},
      }
    },
    watch: {
      'activename': function () {
        if(this.activename === 'third') {
          let setting_properties = {};
          try{
            setting_properties = JSON.parse(this.data2.setting_properties);
            Object.keys(setting_properties).forEach(key => {
              this[key] = setting_properties[key];
            });
            this.has_umpire = setting_properties.umpire_name ? '1' : '0';
            this.has_live = !!setting_properties.live_info ? '1' : '0';
            this.has_narrater = !!setting_properties.narrater ? '1' : '0';
            this.has_sponsor = !!setting_properties.narrater ? '1' : '0';
            this.has_watch = !!setting_properties.watch_address ? '1' : '0';
          }catch (e){
            console.log(e)
          }
        }
      }
    },
    methods: {
      close: function () {
        this.$emit('close', false);
      },
      goBack: function () {
        this.$emit('switch', 'second')
      },
      saveHandle: function () {
        this.getData3();
        if(this.data2.isUpdate) {
          this.data3.project_id = this.data2.id;
          Promise.all([this.updateMatchProject(), this.updateExtensionSetting()]).then(data => {
            if(data[0].status === 200 && data[1].status === 200) {
              this.$emit('close', false);
              this.$emit('reload');
              alert('更新小赛事成功');
            } else {
              alert('出错了')
            }
          }).catch(err => {
            alert('出错了' + JSON.stringify(err))
          });
          return;
        }
        this.addMatchProjectSetting().then(d => {
          this.data3.project_id = d.data.data;
          this.addExtensionSetting().then(res => {
            if(res && res.data && res.data.msg === 'success') {
              this.$emit('close', false);
              alert('增加小赛事成功');
              this.$emit('reload');
            } else {
              alert('增加小赛事失败' + res.data.msg)
            }
          });
        });
      },
      //第二阶段配置管理
      addMatchProjectSetting: function () {
        return this.$http.post('/v1/match/manage/matchProjectSetting', this.data2)
      },
      //第二阶段 更新
      updateMatchProject: function () {
        return this.$http.post('/v1/match/manage/updateMatchProject', this.data2)
      },
      //第三阶段 角色管理
      addExtensionSetting: function () {
        return this.$http.post('/v1/match/manage/addExtensionSetting', this.data3);
      },
      //第三阶段 更新
      updateExtensionSetting: function () {
        return this.$http.post('/v1/match/manage/updateExtensionSetting', this.data3);
      },
      getData3: function () {
        this.data3 = {
          has_umpire: this.has_umpire,
          has_live: this.has_live,
          has_narrater: this.has_narrater,
          has_sponsor: this.has_sponsor,
          has_watch: this.has_watch,
          notice_type: this.data2.content,
          project_id: '',
          properties: {
            umpire_name: this.umpire_name,
            live_info: this.live_info,
            narrater: this.narrater,
            sponsor: this.sponsor,
            watch_address: this.watch_address
          }
        }
      }
    }
  }
</script>

