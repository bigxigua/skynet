<template>
  <div class="progress">
    <el-progress :percentage="percent[stage]" status="exception"></el-progress>
    <ul>
      <li>1.创建赛事基本信息</li>
      <li>2.创建赛事游戏信息</li>
      <li>3.创建赛事推广信息</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Progress',
    props: ['stage'],
    data: function () {
      return {
        percent: {
          'first': 33,
          'second': 66,
          'third': 100
        }
      }
    }
  }
</script>
<style scoped lang="css">
  .progress{
    width: 95%;
    margin: auto;
  }
  .progress ul{
    overflow: hidden;
  }
  .progress ul>li{
    float: left;
    width: 33%;
    text-align: left;
    font-size: 16px;
    box-sizing: border-box;
    padding-left: 20px;
    padding-top: 10px;
    color: #333;
    font-weight: bold;
  }
</style>
