<template>
  <div class="tab1">
      <div class="block">
          <h2>赛事信息确认</h2>
      </div>
      <div class="block">
          <h2>添加赛事封面(规格： 900*360，2M以下，只能上传一张)<i class="el-icon-star-on" style="color: red;"></i></h2>
          <el-upload
            action="/v1/match/h5/uploadFilePc"
            list-type="picture-card"
            :file-list="fileList2"
            :on-success="handleSuccess"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
      </div>
      <div class="block">
          <h2>添加赛事基本信息</h2>
          <ul class="tab_block">
            <li>
              <div class="tab_li_item">
                  <h3>赛事名称<i class="el-icon-star-on" style="color: red;"></i></h3>
                  <span class="tab_li_span">
                     <el-input
                       placeholder="请输入内容"
                       v-model="title"
                       clearable>
                      </el-input>
                  </span>
              </div>
              <div class="tab_li_item">
                  <h3>大赛排序</h3>
                  <span class="tab_li_span">
                     <el-input
                       placeholder="请输入排序"
                       v-model="list_order"
                       clearable>
                      </el-input>
                  </span>
              </div>
            </li>
            <li>
              <div class="tab_li_item">
                <h3>比赛总时间<i class="el-icon-star-on" style="color: red;"></i></h3>
                <span class="tab_li_span">
                  <el-date-picker
                    value-format="timestamp"
                    v-model="start_time"
                    type="datetime"
                    placeholder="选择日期">
                  </el-date-picker>
                  <el-date-picker
                    value-format="timestamp"
                    v-model="end_time"
                    type="datetime"
                    placeholder="选择日期">
                  </el-date-picker>
                </span>
              </div>
              <div class="tab_li_item">
                <h3>报名总时间<i class="el-icon-star-on" style="color: red;"></i></h3>
                <span class="tab_li_span">
                    <el-date-picker
                      value-format="timestamp"
                      v-model="enroll_start_time"
                      type="datetime"
                      placeholder="选择日期">
                    </el-date-picker>
                    <el-date-picker
                      value-format="timestamp"
                      v-model="enroll_end_time"
                      type="datetime"
                      placeholder="选择日期">
                    </el-date-picker>
                </span>
              </div>
            </li>
            <li>
              <div class="tab_li_item">
                <h3>主办方信息<i class="el-icon-star-on" style="color: red;"></i></h3>
                <span class="tab_li_span">
                     <el-input
                       placeholder="请输入内容"
                       v-model="organizer"
                       clearable>
                      </el-input>
                  </span>
              </div>
              <div class="tab_li_item">
                <h3>协办方信息</h3>
                <span class="tab_li_span">
                     <el-input
                       placeholder="请输入内容"
                       v-model="co_organizer"
                       clearable>
                      </el-input>
                  </span>
              </div>
            </li>
            <li>
              <div class="tab_li_item">
                <h3>执行方信息</h3>
                <span class="tab_li_span">
                     <el-input
                       placeholder="请输入内容"
                       v-model="exec_info"
                       clearable>
                      </el-input>
                  </span>
              </div>
              <div class="tab_li_item">
                <h3>比赛地点<i class="el-icon-star-on" style="color: red;"></i></h3>
                <span class="tab_li_span">
                     <el-input
                       placeholder="请输入内容"
                       v-model="match_address"
                       clearable>
                      </el-input>
                  </span>
              </div>
            </li>
          </ul>
      </div>
      <h3>赛事介绍<i class="el-icon-star-on" style="color: red;"></i></h3>
      <div class="block block_editor">
        <quill-editor v-model="match_desc" style="height: 300px" ref="match_desc"></quill-editor>
      </div>
      <h3>赛事公告<i class="el-icon-star-on" style="color: red;"></i></h3>
      <div class="block block_editor">
        <quill-editor v-model="match_notic" style="height: 300px" ref="match_notic"></quill-editor>
      </div>
      <div class="block" style="border: none;">
        <h2>选择赛事游戏(多选)<i class="el-icon-star-on" style="color: red;"></i></h2>
        <div class="tab_chose_box">
            <div class="tab_chose_game tab_chose_game_1" v-for="(item, index) in games"
                 :data-id="item.id"
                 @click="choseGame($event, item)">
              <img :src="item.logo" alt="">
              <h3>{{ item.name }}</h3>
            </div>
        </div>
      </div>
      <div class="block" style="text-align: center; padding-top: 20px;border: none;">
        <el-button type="primary" @click="saveData">保存</el-button>
        <el-button type="primary" @click="closeHandle">关闭</el-button>
      </div>
      <form action="" method="post" enctype="multipart/form-data" id="match_desc_id_form">
        <input style="display: none" id="match_desc_id_input" type="file" name="file" multiple accept="image/jpg,image/jpeg,image/png,image/gif"
               @change="uploadImg('match_desc_id_form')">
      </form>
  </div>
</template>

<script>
  export default {
    name: 'Tab1',
    props: ['games', 'data'],
    data: function () {
      return {
        title: '',
        img: '',
        start_time: Date.now(),
        end_time: Date.now(),
        enroll_start_time:  Date.now(),
        enroll_end_time: Date.now(),
        dialogVisible: false,
        $upLoader: null,
        organizer: '', //主办方信息
        co_organizer: '', //协办方信息
        match_notic: '', //公告
        match_desc: '', //简介
        match_address: '', //比赛地点
        exec_info: '', //执行方信息
        game_ids: [], //选择赛事游戏
        fileList2: [],
        addImgRange: null,
        curQuillElement: null,
        list_order: ''
      }
    },
    created: function () {
      let _properties_ = {};
      try {
        _properties_ = JSON.parse(this.data.properties)
      } catch (e) {}

      this.title = this.data.title;
      this.img = this.data.img;
      this.start_time = this.data.startTime;
      this.end_time = this.data.endTime;
      this.enroll_start_time = this.data.enrollStartTime;
      this.enroll_end_time = this.data.enrollEndTime;
      this.organizer = _properties_.organizer;
      this.co_organizer = _properties_.co_organizer;
      this.match_notic = _properties_.match_notic;
      this.match_desc = _properties_.match_desc;
      this.match_address = this.data.matchAddress;
      this.exec_info = _properties_.exec_info;
      this.list_order = this.data.listOrder || '';
      if(this.img) {
        this.fileList2.push({
          name: 'img',
          url: this.img
        });
      }
    },
    mounted: function () {
      if(this.data.gameIds) {
        this.game_ids  = this.data.gameIds;
        const gameIds = this.data.gameIds.split(',');
        this.game_ids = gameIds;
        let $box = document.querySelectorAll('.tab_chose_game_1');
        for(let i = 0, len = $box.length; i < len; i++) {
          let id = $box[i].getAttribute('data-id');
          if(gameIds.indexOf(id) !== -1) {
            $box[i].classList.add('chose_game')
          }
        }
      }
      this.$refs.match_desc.quill.getModule('toolbar')
        .addHandler('image', (state) => this.base64ToUrl(state, 'match_desc_id_input', this.$refs.match_desc));

      this.$refs.match_notic.quill.getModule('toolbar')
        .addHandler('image', (state) => this.base64ToUrl(state, 'match_desc_id_input', this.$refs.match_notic))
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
              // this.$refs
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
      handleRemove(file, fileList) {
        this.$upLoader.style.display = 'block';
      },
      handleSuccess: function (d) {
        this.$upLoader = document.querySelector('.tab1 .el-upload');
        this.$upLoader.style.display = 'none';
        if(d && d.data && d.data.file_url) {
          this.img = d.data.file_url
        }
      },
      choseGame: function (e,item) {
        const classList = e.currentTarget.classList;
        const classes = Array.from(classList);
        if(classes.indexOf('chose_game') !== -1) {
          let index = this.game_ids.indexOf(item.id);
          this.game_ids.splice(index, 1);
          classList.remove('chose_game')
        } else {
          this.game_ids.push(item.id);
          classList.add('chose_game')
        }
      },
      saveData: function () {
        let properties = {
          organizer: this.organizer,
          co_organizer: this.co_organizer,
          match_notic: this.match_notic,
          match_desc: this.match_desc,
          exec_info: this.exec_info
        };
        let isOk = true;

        Object.keys(properties).forEach(key => {
            if(!properties[key] && ['co_organizer', 'exec_info'].indexOf(key) === -1) {
              isOk = false;
            }
        });
        let data = {
          match_notic: this.match_notic,
          match_desc: this.match_desc,
          title: this.title,
          img: this.img,
          match_address: this.match_address,
          game_ids: this.game_ids.join(','),
          start_time: this.start_time,
          end_time: this.end_time,
          enroll_start_time:  this.enroll_start_time,
          enroll_end_time: this.enroll_end_time,
          properties: properties,
          match_id: this.data.id || null,
          list_order: parseInt(this.list_order) || null
        };
        Object.keys(data).forEach(key => {
          if(!data[key] && ['match_id', 'list_order'].indexOf(key) === -1) {
            console.log(key)
            isOk = false;
          }
        });
        if(!isOk) {
          alert('还有未填写的项，请继续，不要停');
          return;
        }
        let handle = this.data.isUpdate ? this.updataMatchInfo : this.addMatchInfo;
        handle(data).then(d => {
          if(d && d.data && d.data.data) {
            alert('保存成功');
            this.$emit('updata', {
              type: 'tab1Data',
              data: data
            });
            this.$emit('upload');
            this.closeHandle();
          } else {
            alert('保存失败');
          }
        })
      },
      addMatchInfo: function (data) {
        return this.$http.post('/v1/match/manage/addMatchInfo', data)
      },
      updataMatchInfo: function (data) {
        return this.$http.post('/v1/match/manage/updateMatchInfoByKey', data)
      },
      closeHandle: function () {
        this.$emit('close', false, true)
      }
    }
  }
</script>
<style lang="sass">
  @import "tab.scss";
</style>

