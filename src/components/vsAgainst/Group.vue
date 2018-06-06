<template>
    <div class="svg-group" style="margin-bottom: 40px">
        <div class="svg-group_item" v-for="(item, index) in this.patterns.rounds[0].groups">
            <svg x="57" y="0" width="500" :height="item.node_vss.length*50">
                <rect x="0" y="0" height="30" width="500" style="fill: rgb(48, 47, 53);"></rect>
                <text x="130" y="20" font-size="14" style="fill: rgb(255, 255, 255);">第{{ index+1 }}组</text>
                <text x="270" y="20" font-size="13" text-anchor="middle" style="fill: rgb(125, 125, 125);">胜</text>
                <text x="310" y="20" font-size="13" text-anchor="middle" style="fill: rgb(125, 125, 125);">平</text>
                <text x="350" y="20" font-size="13" text-anchor="middle" style="fill: rgb(125, 125, 125);">负</text>
                <text x="390" y="20" font-size="13" text-anchor="middle" style="fill: rgb(125, 125, 125);">大场</text>
                <text x="430" y="20" font-size="13" text-anchor="middle" style="fill: rgb(125, 125, 125);">小场</text>
                <text x="470" y="20" font-size="13" text-anchor="middle" style="fill: rgb(125, 125, 125);">积分</text>
                <g v-for="(team, i) in item.node_vss">
                    <rect x="0" :y="30 + i*36" height="36" width="500" style="fill: rgb(34, 33, 38);"></rect>
                    <line x1="0" :y1="30 + i*36" x2="500" :y2="30 + i*36" style="stroke: rgb(25, 25, 25); stroke-width: 1;"></line>
                    <text x="20" font-size="13" :y="53 + i*36" style="fill: rgb(184, 186, 188);">{{ i+1 }}.</text>
                    <image x="45" :y="38 + i*36" height="20" width="30" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://djq-img.dianjingquan.cn/country/11.jpg" class="flag"></image>
                    <text x="90" :y="53 + i*36" font-size="13" style="fill: rgb(184, 186, 188);"></text>
                    <text x="270" :y="53 + i*36" font-size="13" text-anchor="middle" style="fill: rgb(184, 186, 188);">0</text>
                    <text x="310" :y="53 + i*36" font-size="13" text-anchor="middle" style="fill: rgb(184, 186, 188);">0</text>
                    <text x="350" :y="53 + i*36" font-size="13" text-anchor="middle" style="fill: rgb(184, 186, 188);">0</text>
                    <text x="390" :y="53 + i*36" font-size="13" text-anchor="middle" style="fill: rgb(184, 186, 188);">0-0</text>
                    <text x="430" :y="53 + i*36" font-size="13" text-anchor="middle" style="fill: rgb(184, 186, 188);">0-0</text>
                    <text x="470" :y="53 + i*36" font-size="13" text-anchor="middle" style="fill: rgb(184, 186, 188);">0</text>
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
    created: function () {
      console.log(this.patterns)
    },
    methods:{
      calcRounds: function (node_vss) {
        let len = node_vss.length;
        console.log(node_vss, '------')
      }
    }
  }
</script>

<style>
  .svg-group_item{
    width: 500px;
    float: left;
    margin-left: 57px;
  }
  .svg-group{
    width: 1200px;
    overflow: hidden;
  }
  .svg_group_hover{
    opacity: 1 !important;
  }
  .svg_rect_hover{
    fill: rgb(255, 84, 84) !important;
    opacity: 1 !important;
    cursor: pointer;
  }
</style>
