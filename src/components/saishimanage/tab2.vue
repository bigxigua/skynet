<template>
  <div class="tab1 tab2">
      <div class="block">
        <h2>添加赛事游戏基本信息</h2>
      </div>
      <div class="block">
        <h2>添加赛事基本信息</h2>
        <el-button type="success" style="margin-left: 20px" v-if="curgame.name">当前游戏：{{ curgame.name }}</el-button>
        <ul class="tab_block">
          <li>
            <div class="tab_li_item">
              <h3>小赛排序</h3>
              <span class="tab_li_span">
                  <el-input
                    placeholder="请输入小赛排序"
                    v-model="baseData.list_order"
                    clearable>
                  </el-input>
              </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item">
              <h3>赛事名称<i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span">
                  <el-input
                    placeholder="请输入"
                    v-model="baseData.title"
                    clearable>
                  </el-input>
              </span>
            </div>
            <div class="tab_li_item">
              <h3>
                选择区服<i class="el-icon-star-on" style="color: red;"></i>
              </h3>
              <span class="tab_li_span">
                  <el-select v-model="baseData.region_id" placeholder="请选择">
                    <el-option
                      v-for="item in regions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.regionId">
                    </el-option>
                  </el-select>
              </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item">
              <h3>
                选择地图
                <i class="el-icon-star-on" style="color: red;"></i>
              </h3>
              <span class="tab_li_span">
                  <el-select v-model="baseData.map_id" placeholder="请选择">
                    <el-option
                      v-for="item in maps"
                      :key="item.mapName"
                      :label="item.mapName"
                      :value="item.mapId">
                    </el-option>
                  </el-select>
              </span>
            </div>
            <div class="tab_li_item">
              <h3>
                比赛模式
                <i class="el-icon-star-on" style="color: red;"></i>
              </h3>
              <span class="tab_li_span">
                  <el-select v-model="baseData.player_type" placeholder="请选择">
                    <el-option
                      v-for="item in player_type_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label">
                    </el-option>
                  </el-select>
              </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item">
              <h3>项目举办地点 <i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span">
                  <el-input
                    placeholder="请输入"
                    v-model="baseData.project_address"
                    clearable>
                  </el-input>
              </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item" style="width: 100%;">
              <h3>比赛时间 <i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span" style="width: 100%;margin-left: 12px;">
                      <el-date-picker
                        v-model="baseData.start_time"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="比赛开始时间">
                      </el-date-picker>
                      <el-date-picker
                        v-model="baseData.end_time"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="比赛截止时间">
                      </el-date-picker>
                  </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item" style="width: 100%;">
              <h3>报名时间 <i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span" style="width: 100%;margin-left: 12px;">
                      <el-date-picker
                        v-model="baseData.enroll_start_time"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="报名开始时间">
                      </el-date-picker>
                      <el-date-picker
                        v-model="baseData.enroll_end_time"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="报名截止时间">
                      </el-date-picker>
                  </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item" style="width: 100%;">
              <h3>签到时间 <i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span" style="width: 100%;margin-left: 12px;">
                       <el-date-picker
                         v-model="baseData.sign_start_time"
                         type="datetime"
                         value-format="timestamp"
                         placeholder="签到开始时间">
                      </el-date-picker>
                      <el-date-picker
                        v-model="baseData.sign_end_time"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="签到截止时间">
                      </el-date-picker>
                  </span>
            </div>
          </li>
         </ul>
      </div>
      <div class="block">
        <h2>奖品设置</h2>
        <ul class="tab_block">
          <li>
            <div class="tab_li_item">
              <h3>奖金总额 <i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span">
                  <el-input
                    placeholder="请输入内容"
                    v-model="baseData.bonus"
                    clearable>
                  </el-input>
              </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item tab_li_item_award" v-for="item in baseData.bonus_lists">
                <span class="tab_li_span">
                    <el-input
                      placeholder="请输入将项目（例如第几名)"
                      v-model="item.name"
                      clearable>
                    </el-input>
                </span>
              <span class="tab_li_span">
                    <el-input
                      placeholder="请输入数量"
                      v-model="item.num"
                      clearable>
                    </el-input>
                </span>
              <span class="tab_li_span">
                    <el-input
                      placeholder="请输入内容"
                      v-model="item.value"
                      clearable>
                    </el-input>
              </span>
              </div>
            <div class="tab_li_item" style="width: 100px;margin-top: 20px">
              <span class="tab_li_span">
                  <el-button type="success" icon="el-icon-circle-plus" circle @click="addAwards"></el-button>
                  <el-button type="success" icon="el-icon-remove" circle @click="removeAwards"></el-button>
              </span>
            </div>
          </li>
          <!-- <li v-if="curgame.isUpdate">
            <div class="tab_li_item" style="width: 100%;">
              <h3>获奖名单</h3>
              <span class="tab_li_span" style="width: 100%;">
                <quill-editor v-model="baseData.winner_list" ref="rewardList"></quill-editor>
              </span>
            </div>
          </li> -->
        </ul>
      </div>
      <div class="block">
        <h2>报名限制(选填)</h2>
        <ul class="tab_block">
          <li>
              <div class="tab_li_item">
                  <h3>密码设置</h3>
                  <span class="tab_li_span">
                    <el-input
                      placeholder="请输入密码"
                      v-model="baseData.pwd"
                      clearable>
                    </el-input>
                  </span>
              </div>
              <div class="tab_li_item">
                <h3>报名费用</h3>
                <span class="tab_li_span" style="height: 44px;">
                     <el-radio v-model="baseData.audits" label="现金(元)">现金(元)</el-radio>
                     <el-radio v-model="baseData.audits" label="平台积分">平台积分</el-radio>
                     <el-radio v-model="baseData.audits" label="不需要">不需要</el-radio>
                </span>
              </div>
          </li>
          <li>
            <div class="tab_li_item">
                <h3>性别限制</h3>
              <span class="tab_li_span" style="height: 44px;">
                     <el-radio v-model="baseData.gender_limit" label="0">不限</el-radio>
                     <el-radio v-model="baseData.gender_limit" label="1">男</el-radio>
                     <el-radio v-model="baseData.gender_limit" label="2">女</el-radio>
              </span>
            </div>
            <div class="tab_li_item">
                <h3>年龄限制</h3>
                <span class="tab_li_span">
                  <el-input v-model="baseData.age_limit" placeholder="类似(18-20),0为不限制"></el-input>
                </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="block">
        <h2>赛事游戏设置</h2>
        <ul class="tab_block">
          <li>
            <div class="tab_li_item">
              <h3>请选择赛事类型 <i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span" style="height: 44px;">
                 <el-radio :disabled="curgame.isUpdate" v-model="baseData.pattern_type" label="1">单淘赛</el-radio>
                 <el-radio :disabled="curgame.isUpdate" v-model="baseData.pattern_type" label="2">双败赛</el-radio>
                 <el-radio :disabled="curgame.isUpdate" v-model="baseData.pattern_type" label="3">小组赛</el-radio>
              </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item">
              <h3 style="width: 180px;">请选择每组参赛队伍数 <i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span" style="height: 44px;">
                <el-input :disabled="curgame.isUpdate || baseData.pattern_type < 3" v-model="baseData.group_players" placeholder="单淘和双败只能是2"></el-input>
              </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item">
              <h3 style="width: 180px;">请选择每组出线人数(小组赛时，每组参赛队伍数必须大于每组出线人数)<i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span" style="height: 44px;">
                <el-input :disabled="curgame.isUpdate || baseData.pattern_type < 3" v-model="baseData.promotions" placeholder="可选"></el-input>
              </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item">
              <h3>请选择参赛规模 <i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span" style="height: 44px;">
                 <el-select :disabled="curgame.isUpdate" v-model="baseData.max_enroller_team" placeholder="请选择">
                    <el-option
                      v-for="item in matcheScale"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </span>
            </div>
            <div class="tab_li_item">
              <h3>请选择每队报名人数<i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span">
                  <el-select :disabled="curgame.isUpdate" v-model="baseData.max_enroller_num" placeholder="请选择">
                    <el-option
                      v-for="item in max_enroller_options"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                  <span>以上</span>
                </span>
            </div>
          </li>
          <li>
            <div class="tab_li_item">
              <h3>请选择赛事类型<i class="el-icon-star-on" style="color: red;"></i></h3>
              <span class="tab_li_span" style="height: 44px;">
                 <el-radio :disabled="curgame.isUpdate" v-model="radio_match_type" label="1">赛制简易模式</el-radio>
                 <el-radio :disabled="curgame.isUpdate || baseData.pattern_type == 3" v-model="radio_match_type" label="2">自定义</el-radio>
              </span>
            </div>
          </li>
          <li>
            <div class="tab_chose_box">
              <div class="tab_chose_game tab_chose_game_2"
                   v-for="item in bo_lists"
                   v-if="radio_match_type === '1'"
                   :class="item.value == baseData.bo ? 'chose_game' : ''"
                   @click="choseGame($event, item)">
                <img src="" alt="">
                <h3>{{ item.name }}</h3>
              </div>
              <!--自定义赛制-->
              <div class="tab_chose_game" v-if="radio_match_type === '2'"
                   v-for="(list, index) in getRounds()">
                  <h3 style="height: 30px;margin-left: -27px">第{{ index+1 }}轮赛制</h3>
                  <el-select :disabled="curgame.isUpdate" v-model="baseData.custom_bo_lists[index].bo" placeholder="请选择">
                    <el-option
                      v-for="item in bo_lists"
                      :key="item.name"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </div>
            </div>
          </li>
          <li>
            <div class="tab_li_item" style="margin-left: 20px">
              <el-button type="primary" @click="previewVsMaps">预览对阵图</el-button>
            </div>
          </li>
          <li style="position:relative;" v-show="showVsBox">
            <VsAgainst :vsdata="vsDatas" />
            <div class="sider_icons">
              <div class="full-screen" @click="fullscreenHandle"></div>
              <div class="up-to-top"></div>
            </div>
          </li>
        </ul>
      </div>
      <div class="block">
        <h2>赛事选手须知</h2>
        <ul class="tab_block">
          <li>
            <div class="tab_li_item" style="width: 100%;">
              <h3>请填写赛事选手须知</h3>
              <quill-editor v-model="baseData.content" style="height: 300px; margin-bottom: 70px" ref="content"></quill-editor>
            </div>
          </li>
        </ul>
      </div>
      <div class="block" style="border: none;margin-top: 20px; text-align: center;">
        <el-button type="primary" @click="goNextHandle">下一步</el-button>
        <el-button type="primary" @click="closeBox">关闭</el-button>
      </div>
      <form action="" method="post" enctype="multipart/form-data" id="tab2_form">
        <input style="display: none" id="tab2_id_input" type="file" name="file" multiple accept="image/jpg,image/jpeg,image/png,image/gif"
               @change="uploadImg('tab2_form')">
      </form>
  </div>
</template>

<script>
  import VsAgainst from '../vsAgainst/vsAgainst';
  const DEFAULT_AWARD = {
    name: '',
    num: '',
    value: ''
  };
  const AUDITS = ['现金(元)','平台积分','不需要'];
  export default {
    name: 'Tab2',
    props: ['curgame', 'activename'],
    components: {
      VsAgainst
    },
    data: function () {
      return {
        baseData: {
          title: '', //赛事名称
          map_id: '', //对应地图ID
          region_id: '', //对应游戏区服ID
          audits: '现金(元)', //报名费用 1=现金 2=平台积分 3=不需要
          pwd: '', //密码
          group_players: '2', //参赛每组数 默认2
          player_type: '', //比赛模式
          start_time: '', //比赛开始时间
          end_time: '', //比赛结束时间
          enroll_start_time: '', //报名开始时间
          enroll_end_time: '',//报名结束时间
          bonus: '', //奖金总额
          pattern_type: '1', //赛制类型 1.单淘 2.双败 3.小组
          max_enroller_team: '4', //参赛规模
          max_enroller_num: '5', //每队报名人数
          bo: '', //赛制类型
          project_address: '', //项目举办地址
          promotions: 1, //每组出线人数
          sign_end_time: '',//签到结束时间
          sign_start_time: '', //签到开始时间
          content: '<h2>请输入赛事选手须知</h2>',
          gender_limit: '0', //性别限制，value=0为不限制，1-限制性别男，2-限制性别女
          age_limit: '0', //年龄限制
          bonus_lists: [DEFAULT_AWARD], //具体奖
          custom_bo_lists: [],
          winner_list: '', //奖金明细
          list_order: '', //小赛排序
        },
        vsDatas: {}, //对阵图数据
        maps: [], //所有地图
        regions: [], //所有区服

        player_type_options: [{
          value: '1',
          label: '个人'
        }, {
          value: '2',
          label: '团队'
        }],

        matcheScale: [{
          value: '4',
          label: '4队'
        },{
          value: '8',
          label: '8队'
        },{
          value: '16',
          label: '16队'
        },{
          value: '32',
          label: '32队'
        },{
          value: '64',
          label: '64队'
        }],
        max_enroller_options: [5,6,7,8,9,10],
        radio_match_type: '1', //请选择赛事类型时选择的哪个
        bo_lists: [{
          name: '全程BO1',
          value: '1'
        },{
          name: '全程BO3',
          value: '3'
        },{
          name: '全程BO5',
          value: '5'
        }],
        customRounds: 0, //自定义时有多少轮
        tipMessage: '',
        showVsBox: false, //是否展示对阵图
        curQuillElement: null //当前
      }
    },
    watch: {
      'customRounds': function () {
        if(!this.customRounds || this.curgame.isUpdate) return;
        this.baseData.custom_bo_lists = [];
        for(let i = 0; i < this.customRounds; i++) {
          this.baseData.custom_bo_lists.push({
            round: i+1,
            bo: ''
          })
        }
      }
    },
    created: function () {
      if(this.activename === 'second') {
        this.getGameMaps();
        this.getGameRegions();
      }
      let defalutValue = this.curgame.defalutValue;
      this.baseData.bonus_lists = [];
      this.baseData.bonus_lists.push({
        name: '',
        num: '',
        value: ''
      });
      if(!util.isEmptyObject(defalutValue) && this.curgame.isUpdate) {
        let project_properties = {};
        try {
          project_properties = JSON.parse(defalutValue.project_properties)
        } catch (e){}
        defalutValue = Object.assign({},defalutValue, project_properties);
        for(let key in defalutValue) {
          if(defalutValue.hasOwnProperty(key)) {
            this.baseData[key] = defalutValue[key]
          }
        }
        this.baseData.pattern_type += '';
        this.baseData.title += defalutValue.project_title;
        this.baseData.audits = AUDITS[defalutValue.audits-1];
        this.baseData.custom_bo_lists = project_properties.custom_bo_lists;
        if(project_properties.custom_bo_lists.length > 0 || !defalutValue.bo) {
          this.radio_match_type = '2';
        }
        this.baseData.player_type = this.player_type_options[this.baseData.player_type-1].label;
      }
    },
    mounted: function () {
      this.$refs.content.quill.getModule('toolbar')
        .addHandler('image', (state) => this.base64ToUrl(state, 'tab2_id_input', this.$refs.content));
    },
    methods: {
      base64ToUrl: function (state, id, ele) {
        if(state) {
          this.curQuillElement = ele;
          let fileInput = document.getElementById(id);
          fileInput.click();
        }
      },
      uploadImg: function (formId) {
        let formData = new FormData(document.getElementById(formId));
        try {
          this.uploadImageHandle(formData).then(data => {
            if(data && data.data && data.data.data && data.data.data.file_url) {
              const fileUrl = data.data.data.file_url;
              this.addImgRange = this.curQuillElement.quill.getSelection();
              this.curQuillElement.quill.insertEmbed(this.addImgRange ? this.addImgRange.index : 0, 'image', fileUrl)
            } else {
              alert('文件上传失败，可能太大了？？2M')
            }
          })
        } catch (e) {
          console.log('error', e)
        }
      },
      uploadImageHandle: function (formData) {
        return this.$http.post('/v1/match/h5/uploadFilePc', formData);
      },
      getRounds: function () {
        const _rounds_ = Math.log2(this.baseData.max_enroller_team)*(this.baseData.pattern_type);
        this.customRounds = _rounds_;
        return _rounds_;
      },
      addAwards: function () {
        this.baseData.bonus_lists.push({
          name: '',
          num: '',
          value: ''
        })
      },
      removeAwards: function () {
        this.baseData.bonus_lists.pop();
      },
      choseGame: function (e,item) {
        if(this.curgame.isUpdate) return;
        const ele = document.querySelectorAll('.tab_chose_game_2');
        const target = e.currentTarget;
        for(let i = 0; i < ele.length; i++) {
          ele[i].classList.remove('chose_game')
        }
        target.classList.add('chose_game');
        this.baseData.bo = item.value;
      },
      getGameMaps: function () {
        this.$http.get('/v1/match/manage/gameMapList?game_id=' + this.curgame.id).then(data => {
          if(data && data.data && data.data.data) {
            this.maps = data.data.data.list || [];
          }
        })
      },
      getGameRegions: function () {
        this.$http.get('/v1/match/manage/gameRegionList?game_id=' + this.curgame.id).then(data => {
          if(data && data.data && data.data.data) {
            this.regions = data.data.data.list || [];
          }
        })
      },
      goNextHandle: function () {
        let required_obj = {
          project_desc: this.curgame.properties.match_desc || '1',
          project_notice: this.curgame.properties.match_notic || '1',
          index: 0,
          match_id: this.curgame.match_id,
          game_id: this.curgame.id,

          map_id: this.baseData.map_id,
          region_id: this.baseData.region_id,
          audits: AUDITS.indexOf(this.baseData.audits) + 1,
          has_pwd: this.baseData.pwd ? 1 : 0,
          group_players: this.baseData.group_players,

          player_type: this.baseData.player_type === '个人' ? 1: 2,
          start_time: this.baseData.start_time,
          end_time: this.baseData.end_time,
          enroll_start_time: this.baseData.enroll_start_time,
          enroll_end_time: this.baseData.enroll_end_time,
          bonus: this.baseData.bonus,

          pattern_type: +this.baseData.pattern_type,
          max_enroller_team: this.baseData.max_enroller_team,
          max_enroller_num: this.baseData.max_enroller_num,

          bo: this.baseData.bo || null, //若选择赛制自定义模式才要求可选
          project_address: this.baseData.project_address,
          title: this.baseData.title,

          promotions: +this.baseData.promotions || 1, //可选
          sign_end_time: this.baseData.sign_end_time,
          sign_start_time: this.baseData.sign_start_time,
          isUpdate: this.curgame.isUpdate,
          id: this.baseData.project_id, //更新
          setting_properties: this.baseData.setting_properties, //默认显示
          list_order: parseInt(this.baseData.list_order) || null
        };
        let isOK = true;
        let properties = {
          content: this.baseData.content,
          gender_limit: this.baseData.gender_limit,
          age_limit: this.baseData.age_limit,
          pwd: this.baseData.pwd,
          bonus_lists: this.baseData.bonus_lists,
          custom_bo_lists: this.radio_match_type === '2' ? this.baseData.custom_bo_lists : []
        };

        let _arr_ = ['list_order', 'has_pwd', 'index', 'isUpdate', 'id', 'setting_properties'];
        this.radio_match_type === '2' ? _arr_.push('bo') : {};

        if(this.radio_match_type === '2') {
          this.baseData.custom_bo_lists.forEach(item => {
            !item.bo ? (isOK = false) : {};
          });
        }

        Object.keys(required_obj).forEach(key => {
          if(!required_obj[key] && _arr_.indexOf(key) === -1) {
            console.log(key, required_obj[key]);
            isOK = false;
          }
        });
        if(!isOK) {
          alert('您还有必填项没填写');
          return;
        }
        this.$emit('updata', {
          type: 'tab2Data',
          data: Object.assign({}, required_obj, {
            properties: properties
          })
        });
        document.querySelector('.content').scrollTop = 0;
        this.$emit('switch', 'third');
      },
      //预览对阵图
      previewVsMaps: function () {
        let params = {
          max_players: this.baseData.max_enroller_team,
          patterns: [{
            bo: this.baseData.bo,
            group_players: this.baseData.group_players,
            index: 0,
            match_id: '2',
            promotions: this.baseData.promotions,
            properties: {
              content: this.baseData.content,
              gender_limit: this.baseData.gender_limit,
              age_limit: this.baseData.age_limit,
              pwd: this.baseData.pwd,
              bonus_lists: this.baseData.bonus_lists,
              custom_bo_lists: this.baseData.custom_bo_lists
            },
            title: this.baseData.title,
            type: this.baseData.pattern_type
          }]
        };
        this.$http.post('/v1/match/manage/preview', params).then(d => {
          if(d && d.data && d.data.data && d.data.data && d.data.data.patterns) {
            this.vsDatas = d.data.data.patterns || [];
            this.showVsBox = true;
          } else {
            alert('获取预览图失败')
          }
        })
      },
      closeBox: function () {
        this.$emit('close', false)
      },
      fullscreenHandle: function () {
        const element = document.querySelector('.vs_Against_container');
        if(element.requestFullscreen) {
          element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if(element.msRequestFullscreen){
          element.msRequestFullscreen();
        } else if(element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen();
        }
      }
    }
  }
</script>
