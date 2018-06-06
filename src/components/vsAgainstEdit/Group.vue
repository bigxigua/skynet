<template>
    <div class="svg-group">
        <div class="svg-group_item" v-for="(item, index) in this.patterns.rounds[0].groups">
            <svg x="57" y="0" width="500" :height="(item.node_vss.length + item.vss.length + 2)*36">
                <rect x="0" y="0" height="30" width="500" style="fill: rgb(48, 47, 53);"></rect>
                <text x="130" y="20" font-size="13" style="fill: rgb(255, 255, 255);">第{{ index+1 }}组</text>
                <text x="270" y="20" font-size="13" text-anchor="middle" style="fill: rgb(125, 125, 125);">胜</text>
                <text x="350" y="20" font-size="13" text-anchor="middle" style="fill: rgb(125, 125, 125);">负</text>
                <text x="400" y="20" font-size="13" text-anchor="middle" style="fill: rgb(125, 125, 125);">积分</text>

                <g v-for="(team, i) in item.node_vss"
                   :transform="'translate(' + 0 + ' ' + i*36 + ')'"
                   @drop="dropHandle($event, team)" @dragover="dragoverHandle">
                    <rect x="0" y="30" height="36" width="500" style="fill: rgb(34, 33, 38);"></rect>
                    <line x1="0" y1="30" x2="500" y2="30" style="stroke: rgb(25, 25, 25); stroke-width: 1;"></line>
                    <text x="20" font-size="13" y="53" style="fill: rgb(184, 186, 188);">{{ i+1 }}.</text>
                    <image x="45" :y="38" height="20" width="30" xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="team.team_logo" class="flag"></image>
                    <text x="90" :y="53" font-size="13" style="fill: rgb(184, 186, 188);">
                      {{ isAuto ? team.team_name : '' }}
                    </text>
                    <text x="270" y="53" font-size="13" text-anchor="middle" style="fill: rgb(184, 186, 188);">
                      {{ item.stage_rows[i] ? item.stage_rows[i].wins : 0 }}
                    </text>
                    <text x="350" y="53" font-size="13" text-anchor="middle" style="fill: rgb(184, 186, 188);">
                      {{ item.stage_rows[i] ? item.stage_rows[i].loses : 0 }}
                    </text>
                    <text x="400" y="53" font-size="13" text-anchor="middle" style="fill: rgb(184, 186, 188);">
                      {{ item.stage_rows[i] ? item.stage_rows[i].scores : 0 }}
                    </text>
                </g>

                <g v-if="isAuto" style="cursor: pointer">
                    <rect x="0" :y="(item.node_vss.length+1)*36 - 6" height="30" width="500" style="fill: rgb(48, 47, 53);"></rect>
                    <text x="25" :y="(item.node_vss.length+1)*36 + 13" font-size="13" style="fill: rgb(255, 255, 255);">详细对阵循环</text>
                    <g v-for="(t, pos) in item.vss" fill="rgb(184, 186, 188)"
                       :transform="'translate(' + 0 + ' ' + pos*36 + ')'"
                       @click="editPlayersHandle(t)">
                      <rect x="0" y="204" height="36" width="500" style="fill: rgb(34, 33, 38);"></rect>
                      <line x1="0" y1="204" x2="500" y2="204" style="stroke: rgb(25, 25, 25); stroke-width: 1;"></line>
                      <text x="20" y="227" font-size="13" text-anchor="start" style="fill: rgb(184, 186, 188);">{{ pos+1 }}.</text>
                      <g class="player" v-hover="'svg_group_hover'">
                        <rect x="120" y="205" width="140" height="34" style="fill: rgb(43, 42, 48); stroke: rgb(57, 56, 62); opacity: 0;"
                              :class="'group_rectmoon_' + t.left_team_name"></rect>
                        <text x="190" y="227" font-size="13" text-anchor="middle" class="normal">{{ t.left_team_name }}</text>
                      </g>
                      <g class="player" v-hover="'svg_group_hover'">
                        <rect x="350" y="205" width="140" height="34" style="fill: rgb(43, 42, 48); stroke: rgb(57, 56, 62); opacity: 0;"
                              :class="'group_rectmoon_' + t.right_team_name"></rect>
                        <text x="420" y="227" font-size="13" text-anchor="middle" class="normal">{{ t.right_team_name }}</text>
                      </g>
                      <text x="290" y="227" font-size="13" text-anchor="middle" style="fill: rgb(184, 186, 188);">{{ t.left_score }}</text>
                      <text x="310" y="227" font-size="14" text-anchor="middle" style="fill: rgb(242, 135, 35);">vs</text>
                      <text x="330" y="227" font-size="13" text-anchor="middle">{{ t.right_score }}</text>
                    </g>
                </g>
            </svg>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'vs-group',
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
        isAuto: util.getParameterByName('isAuto')
      }
    },
    created: function () {

    },
    methods:{
      dropHandle: function (e, item) {
        e.preventDefault();
        const $text = e.currentTarget.children[4];
        const $image = e.currentTarget.children[3];
        if($text.innerHTML.trim()) return;
        $text.innerHTML = e.dataTransfer.getData('teamName');
        $image.href.baseVal = e.dataTransfer.getData('image');
        // $image.setAttribute('xlink:href', e.dataTransfer.getData('image'));
        this.$emit('addnode', item);
        this.$emit('toggle', e.dataTransfer.getData('index'))
      },
      dragoverHandle: function (e) {
        e.preventDefault();
      },
      //维护比分等等
      editPlayersHandle: function (data) {
        data.isGroup = true;
        this.$emit('edit', data)
      }
    }
  }
</script>

<style>
  .svg-group_item{
    width: 500px;
    float: left;
    margin-left: 57px;
    margin-bottom: 40px;
  }
  .svg-group{
    width: 1200px;
    overflow: hidden;
  }
  .svg_group_hover{
    opacity: 1 !important;
  }
</style>
