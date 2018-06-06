<template>
    <div class="svg-single">
        <svg :width="this.patterns.rounds.length * 300"
             :height="singleList.length*40 + 100" :viewBox="'0 0 '+ (this.patterns.rounds.length * 300) + ' ' + (singleList.length*40 + 100)">
            <g class="title_svg_round">
                <rect x="0" y="0" height="40" width="2220" style="fill: rgb(52, 72, 96);"></rect>
                <text v-for="(item, index) in patterns.rounds" :x="171+ 268*index" y="25"
                      font-size="13" text-anchor="middle" style="fill: rgb(238, 238, 238);font-weight:bold;">
                    {{ '第' + item.round + '轮' }}</text>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#roundIcon1"
                     v-for="(item, index) in patterns.rounds" :x="312+ 268*index" y="15" width="10" height="10"></use>
            </g>
            <g v-for="(item, index) in singleList"
               @click="editHandle(item.vss[0])"
               class="content_svg_round" :transform="getPosition(item, index)">
              <text font-size="13" text-anchor="end" x="57" y="98"
                      style="fill: rgb(225, 225, 225);">{{index+1}}</text>
                <polyline :points="getPolylinepoint(item, index)" style="fill: none; stroke: rgb(63, 130, 158); stroke-width: 2; fill-opacity: 0;"></polyline>
                <g class="player" v-for="(player, pos) in sortByIndex(item.node_vss)"
                   v-hover="'svg_rect_hover'"
                   :transform="'translate(0 ' + (pos*25) + ')'"
                   @drop="dropHandle($event, player)" @dragover="dragoverHandle">
                    <rect x="62" y="68" width="200" height="25" style="fill: rgb(52, 72, 96);" :class="'rect1' + player.team_name"></rect>
                    <image v-if="isAuto" x="67" y="71" height="20" width="30" xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="player.team_logo || 'http://djq-img.dianjingquan.cn/country/0.jpg'"></image>
                    <text x="102" :y="85" font-size="13" class="normal" style="fill: rgb(255, 255, 255);">
                        {{ isAuto ? player.team_name || '暂无' : '' }}
                    </text>
                    <text x="232" y="85" font-size="13" style="fill: rgb(255, 255, 255);">
                      {{ player.score }}
                    </text>
                </g>
            </g>
        </svg>
    </div>
</template>

<script>

  export default {
    name: 'user-view',
    props: {
      patterns: {
        type: Object,
        default: {
          rounds: [{
            groups: []
          }]
        }
      }
    },
    data: function () {
      return {
        roundLength: {0:0},
        dialogVisible: false,
        isAuto: false
      }
    },
    created: function () {
      this.isAuto = !!util.getParameterByName('isAuto');
    },
    computed: {
      singleList: function () {
        let lists = [];
        this.patterns.rounds.sort((a,b) => {
          return a.round >= b.round;
        });
        this.roundLength = {0:0};
        this.patterns.rounds.forEach(item => {
          lists.push(...item.groups);
          if(!this.roundLength[item.round]) {
            this.roundLength[item.round] = 0;
            this.roundLength[item.round] += item.groups.length;
          }
        });
        return this.quickSort(lists);
      }
    },
    methods:{
      quickSort: function (arr) {
        for(let i = 0; i < arr.length-1; i++) {
          for(let j = i+1; j < arr.length; j++) {
            if(arr[i].round === arr[j].round) {
              if(arr[i].index >= arr[j].index) {
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
              }
            }
          }
        }
        return arr
      },
      showPolyline: function (item, index) {
        return true;
      },
      getPosition: function (item, index) {
        let round = item.round;
        let _round_ = round;
        let x = 268 * (round-1);
        let len = 0;
        for(let i = round - 1; i >= 0; i--) {
          len += this.roundLength[i]
        }
        round <= 1 ? (_round_ = 1) : {};
        let y = (index-len)*70*(Math.pow(2, _round_-1)) + ((Math.pow(2, round-1) - 1))*35;
        return 'translate(' + x + ' ' + y + ')';
      },
      getPolylinepoint: function (item, index) {
        let round = item.round;
        if(round === this.patterns.rounds.length) {
          return '0,0 0,0 0,0'
        }
        let mapX = [113,143,220,363, 640];
        let mapY = [72,43, -32, -174, -454];
        if(round === this.allRounds) {
          return '0,0 0,0 0,0';
        } else {
          let endPoint = index%2 === 0 ? mapX[round - 1] : mapY[round - 1];
          return ' 262,93 321,93 321,' + endPoint;
        }
      },
      dropHandle: function (e, item) {
        e.preventDefault();
        if(e.currentTarget.children.length === 4 || item.round > 1) return;
        e.currentTarget.innerHTML = e.dataTransfer.getData('text');
        this.$emit('addnode', item);
        this.$emit('toggle', e.dataTransfer.getData('index'))
      },
      dragoverHandle: function (e) {
        e.preventDefault();
      },
      editHandle: function (data) {
        if(!data) return;
        this.$emit('edit', data)
      },
      sortByIndex: function (arr) {
        let _arr = [].concat(arr);
        return _arr.sort((a,b) => a.index - b.index)
      }
    }
  }
</script>

<style lang="scss">
  .svg-single svg{
    background: #222d39;
  }
  .player{
    cursor: pointer;
  }
  .svg_rect_hover{
    fill: rgb(255, 84, 84) !important;
    opacity: 1 !important;
  }
</style>
