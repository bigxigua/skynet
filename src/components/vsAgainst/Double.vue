<template>
    <div class="svg-double">
        <svg :width="400*victoryRoundLen" :height="(roundLength[1] + failRounds[1] + 2)*75"
             :viewBox="'0 0 ' + (400*victoryRoundLen) + ' ' + ((roundLength[1] + failRounds[1] + 2)*75)">
            <!--胜者组-->
            <g>
                <rect x="0" y="0" height="40" :width="290*victoryRoundLen" style="fill: rgb(52, 72, 96)"></rect>
                <g v-for="(round, i) in victoryRoundLen">
                    <text :x="171 + i*268" y="25" text-anchor="middle" font-size="14" style="fill: rgb(238, 238, 238);">{{ i === victoryRoundLen - 1 ? '决赛' : '胜者组第' + (i+1) + '轮' }}</text>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#roundIcon1" :x="312 + i*268" :y="15" width="10" height="10"></use>
                </g>
                <g v-for="(item, index) in doubleLists[0]" :transform="getPosition(item, index)">
                    <text font-size="13" text-anchor="end" x="57" y="98" style="fill: rgb(255, 255, 255);"
                          >{{ index+1 }}</text>
                    <polyline :points="getPolylinepoint(item, index)"
                              v-if="showPolyline(item, index)"
                              style="fill: none; stroke: rgb(63, 130, 158); stroke-width: 2; fill-opacity: 0;"></polyline>
                    <g v-for="(player, pos) in item.node_vss" :transform="'translate(0 ' + (pos*24) + ')'" class="sb_sub">
                        <rect  x="62" y="68" width="200" height="25" style="fill: rgb(52, 72, 96) ; opacity: 1;" :class="'rect1' + player.winner_next_id"></rect>
                        <image x="67" y="71" height="20" width="30" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://djq-img.dianjingquan.cn/country/0.jpg"></image>
                        <text  x="102" y="85" font-size="13" style="fill: rgb(184, 186, 188);">{{ '暂无' }}</text>
                        <text  x="232" y="85" font-size="13" style="fill: rgb(184, 186, 188);">--</text>
                        <!--<text  x="10" y="38" font-size="13" style="fill: red; opacity: 0" class="sb">-->
                          <!--{{ player.winner_next_id + '-&#45;&#45;&#45;&#45;' + player.id + '-&#45;&#45;&#45;&#45;&#45;&#45;' + (player.lose_next_id || '空的') }}-->
                        <!--</text>-->
                    </g>
                </g>
            </g>
            <!--败者组-->
            <g :transform="'translate(0 '+ getHeight(victoryRoundLen) +')'">
                <rect x="0" y="0" height="40" :width="290*loserRoundLen" style="fill: rgb(52, 72, 96);"></rect>
                <g v-for="(round, i) in loserRoundLen">
                    <text :x="171 + i*268" y="25" text-anchor="middle" font-size="13" style="fill: rgb(238, 238, 238);">败者组第{{ i+1 }}轮</text>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#roundIcon2" :x="312 + i*268" :y="15" width="10" height="10"></use>
                </g>
                <g v-for="(item, index) in doubleLists[1]" :transform="getPositionFail(item, index)">
                    <text font-size="13" text-anchor="end" x="57" y="98" style="fill: rgb(125, 125, 125);"
                          >{{ doubleLists[0].length + index + 1 }}</text>
                    <polyline :points="getFailPolylinepoint(item, index)"
                              v-if="showPolyline(item, index)"
                              style="fill: none; stroke:rgb(63, 130, 158); stroke-width: 2; fill-opacity: 0;"></polyline>
                    <g v-for="(player, pos) in item.node_vss" :transform="'translate(0 ' + (pos*24) + ')'" class="sb_sub">
                        <rect  x="62" y="68" width="200" height="25" style="fill: rgb(52, 72, 96); opacity: 1;" :class="'rect1' + player.id"></rect>
                        <image x="67" y="71" height="20" width="30" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://djq-img.dianjingquan.cn/country/0.jpg"></image>
                        <text  x="102" y="85" font-size="13" style="fill: rgb(184, 186, 188);">{{ '暂无' }}</text>
                        <text  x="232" y="85" font-size="13" style="fill: rgb(184, 186, 188);">--</text>
                        <!--<text  x="10" y="38" font-size="13" style="fill: red; opacity: 0" class="sb">-->
                          <!--{{ player.winner_next_id + '-&#45;&#45;&#45;&#45;' + player.id + '-&#45;&#45;&#45;&#45;&#45;&#45;' + (player.lose_next_id || '空的') }}-->
                        <!--</text>-->
                    </g>
                </g>
            </g>
        </svg>
    </div>
</template>

<script>
  export default {
    name: 'vs-double',
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
        victoryRoundLen: 0,
        loserRoundLen: 0,
        roundLength: {
          0:0,
          1:0
        },
        failRounds: {
          0:0,
          1:0
        },
        doubleLists: []
      }
    },
    watch: {
      'patterns': function () {
        this.sortByRound()
      }
    },
    created: function () {
      this.sortByRound();
    },
    methods:{
      sortByRound: function () {
        let lists = this.getDoubleLists();
        lists[0].sort((a, b) => a.round - b.round);
        lists[1].sort((a, b) => a.round - b.round);
        this.doubleLists.push(this.quickSort(lists[0]));
        this.doubleLists.push(this.quickSort(lists[1]));
      },
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
      getDoubleLists: function () {
        //分两组，胜者组0和败者组1
        let data = {0: [], 1: []};
        this.roundLength = {0:0, 1:0};
        this.failRounds = {0:0, 1:0};
        this.doubleLists = [];
        this.patterns.rounds.sort((a,b) => {
          return a.round - b.round;
        });
        this.patterns.rounds.forEach(item => {
          if(item.category === 0) {
            data[0].push(...item.groups);
            if(!this.roundLength[item.round]) {
              this.roundLength[item.round] = 0;
              this.roundLength[item.round] += item.groups.length;
            }
          } else {
            data[1].push(...item.groups);
            if(!this.failRounds[item.round]) {
              this.failRounds[item.round] = 0;
              this.failRounds[item.round] += item.groups.length;
            }
          }
        });
        this.victoryRoundLen = this.getMaxLen(this.roundLength, true);
        this.loserRoundLen = this.getMaxLen(this.failRounds);
        return data;
      },
      getMaxLen: function (obj, isV) {
        let theMax = Math.max(...(Object.keys(obj)));
        if(isV) {
          //找出round>1的奇数（而且round不能是最后一个）的个数
          let oddNumber = 0;
          Object.keys(obj).forEach(key => {
            if(key > 1 && key%2 > 0 && key !== this.victoryRoundLen) {
              oddNumber++;
            }
          });
          theMax += oddNumber;
        }
        return theMax;
      },
      showPolyline: function () {
        return true;
      },
      getPositionX: function (item) {
        let round = item.round;
        if(round >= 3 && round !== this.victoryRoundLen) {
          round += round - 2;
          if(round > this.victoryRoundLen) {
            round -= 0.6;
          }
        }
        return 280 * (round-1)
      },
      getPosition: function (item, index) {
        let round = item.round;
        let _round_ = round;

        let len = 0;
        for(let i = round - 1; i >= 0; i--) {
          len += this.roundLength[i]
        }
        if(round <= 1) {
          _round_ = 1
        }
        let x = this.getPositionX(item);
        let y = (index-len)*70*(Math.pow(2, _round_-1)) + ((Math.pow(2, round-1) - 1))*30;
        return 'translate(' + x + ' ' + y + ')';
      },
      getHeight: function (round) {
        let oddNumber = 0;
        Object.keys(this.roundLength).forEach(key => {
          if(key > 1 && key%2 > 0 && key !== this.victoryRoundLen) {
            oddNumber++;
          }
        });
        round -= oddNumber;
        return ((Math.pow(2, round-1) - 1))*35 + 100;
      },
      getPositionFail: function (item, index) {
        let round = item.round;
        let temp_y = 0;
        let x = 280 * (round-1);
        let len = 0;
        let y;
        let roundReduce = [0];

        for(let i = round - 1; i >= 0; i--) {
          len += this.failRounds[i]
        }

        for(let j = 0; j < this.loserRoundLen; j++) {
          if(j >= 1) {
            if(j % 2 === 0){
              roundReduce.push(roundReduce[j-1] + j/2*7);
            } else {
              roundReduce.push(roundReduce[j-1] - 5);
            }
          }
        }
        let num = 70;
        let add = 25;

        if(round >= 7) {
          num = 100;
          index%2 === 0 ? (add = 60) : {};
        }
        if(round === 9 || round === 10) {
          add = 200;
        }

        if(round%2 > 0) {
          temp_y = (round-1 === 0 ? 1 : round-1)*num;
        } else {
          temp_y = (round-2 === 0 ? 1 : round-2)*num;
        }

        y = (index-len)*temp_y + roundReduce[round-1]*5 + add;
        return 'translate(' + x + ' ' + y + ')';
      },
      getPolylinepoint: function (item, index) {
        let a,b,c,d,e,f;
        let oddNumber = 0;
        let round = item.round;

        a = 262;
        b = 93;
        c = round === 1 ? 330 : 610;
        if(round > 1) {
          f = 93 + 20 * ((3 *(Math.pow(2,round-2))) - 1) + 10;
          index % 2 === 0 ? (f = 93 + 20 * ((3 *(Math.pow(2,round-2))) - 1) + 10)
            : (f = 66 - 26.5 * ((3 *(Math.pow(2,round-2))) - 1) + 10)
        } else {
          f = index % 2 === 0 ? 93 + 20 : 66;
        }

        Object.keys(this.roundLength).forEach(key => {
          if(key > 1 && key%2 > 0 && key !== this.victoryRoundLen) {
            oddNumber++;
          }
        });
        if(round === this.victoryRoundLen - oddNumber - 1) {
          if(this.victoryRoundLen !== 4) {
            c = 440;
          }
        }
        d = b;
        e = c;
        if(round === this.victoryRoundLen - oddNumber) {
          return '0,0 0,0 0,0';
        } else {
          return a + ',' + b + ' ' + c + ',' + d + ' ' + e + ',' + f
        }
      },
      getFailPolylinepoint: function (item, index) {
        let round = item.round;
        let a = 262,
            b = 93,

            c = 290,
            d = 93,

            e = 290,
            f = 68,

            g = 320,
            h = 68;
        if(round%2 === 0) {
          c = 330;
          e = 330;
          f = 0;
          if(round === 6) {
            index%2 === 0 ? f = -36 : f = 58;
          }
          if(round === 8) {
            index%2 === 0 ? f = -328 : f = 414;
          }
          if(index%2 === 0) {
            f += 120 + 3 * ((3 *(Math.pow(2,round-2))) - 1) - 6;
          } else {
            f += 70 - 3.5 * ((3 *(Math.pow(2,round-2))) - 1) + 5;
          }
        }
        if(round === this.loserRoundLen) {
          if(this.loserRoundLen === 2) {
            c = 610;
            e = 610;
            f = -12;
          } else if (this.loserRoundLen === 4) {
            c = 440;
            e = 440;
            f = -40;
          } else if (this.loserRoundLen === 6) {
            c = 440;
            e = 440;
            f = -124;
          } else if (this.loserRoundLen === 8) {
            c = 440;
            e = 440;
            f = -286;
          } else if (this.loserRoundLen === 10) {
            c = 440;
            e = 440;
            f = -736;
          }
        }
        // if(round === 6) {
        //   f = 200;
        // }
        // if(round === 9 || round === 10) {
        //
        // }
        if(round%2 === 0) {
          return a + ',' + b + ' ' + c + ',' + d + ' ' + e + ',' + f;
        } else {
          return a + ',' + b + ' ' + c + ',' + d + ' ' + e + ',' + f + ' ' + g + ',' + h;
        }
      },
      // sortByIndex: function (arr) {
      //   return arr.sort((a,b) => a.index - b.index)
      // }
    }
  }
</script>

<style>
  .sb_sub:hover .sb{
    opacity: 1 !important;
  }
</style>
