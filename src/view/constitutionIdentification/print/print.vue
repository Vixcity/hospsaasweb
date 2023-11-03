<template>
  <div class="contentBlock" id="print">
    <div class="flex jcc">
      <myechart :option="radarData" style="width: 400px; height: 256px"></myechart>
    </div>
    <div class="line"></div>
    <div class="flex jcc">
      <div class="allTitle">中医鼻炎辩证结果</div>
    </div>
    <div v-for="(item, index) in bianShiList" :key="index + 'bianShiList'">
      <div class="title">{{ item.name }}</div>
      <div style="margin-top: 32px">
        <div class="flex itemFatherProcess">
          <div class="item" style="background: #00d48a; flex: 1; position: relative; height: 12px">
            <div
              v-if="item.score === 1"
              class="flex aic"
              style="
                display: flex;
                flex-direction: column;
                position: absolute;
                left: 50%;
                top: -35px;
              "
            >
              <span style="position: relative; top: 9px">1</span>
              <i class="iconfont icon-xiajiantou"></i>
            </div>
          </div>
          <div class="item" style="background: #ffbd38; flex: 1; position: relative; height: 12px">
            <div
              v-if="item.score === 2"
              class="flex aic"
              style="
                display: flex;
                flex-direction: column;
                position: absolute;
                left: 50%;
                top: -35px;
              "
            >
              <span style="position: relative; top: 9px">2</span>
              <i class="iconfont icon-xiajiantou"></i>
            </div>
          </div>
          <div class="item" style="background: #f75559; flex: 1; position: relative; height: 12px">
            <div
              v-if="item.score === 3"
              class="flex aic"
              style="
                display: flex;
                flex-direction: column;
                position: absolute;
                left: 50%;
                top: -35px;
              "
            >
              <span style="position: relative; top: 9px">3</span>
              <i class="iconfont icon-xiajiantou"></i>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 10px">
        <div class="flex">
          <div style="color: #282d3c; flex: 1.2">常见表现：</div>
          <div style="flex: 9; color: #7e828f">
            <div v-for="(itemShape, indexShape) in item.shape" :key="indexShape + 'item.shape'">
              {{ itemShape }}
            </div>
          </div>
        </div>
        <div class="flex" style="margin-top: 8px">
          <div style="color: #282d3c; flex: 1.2">饮食调理：</div>
          <div style="flex: 9; color: #7e828f">
            <div v-for="(itemFood, indexFood) in item.food" :key="indexFood + 'item.food'">
              {{ itemFood }}
            </div>
          </div>
        </div>
        <div class="flex" style="margin-top: 8px">
          <div style="color: #282d3c; flex: 1.2">治疗方法：</div>
          <div style="flex: 9; color: #7e828f">{{ item.cure.toString() }}</div>
        </div>
        <div class="flex" style="margin-top: 8px">
          <div style="color: #282d3c; flex: 1.2">汤药主方：</div>
          <div style="flex: 9; color: #7e828f">
            <div v-for="(itemDrug, indexDrug) in item.drug" :key="indexDrug + 'item.drug'">
              <a target="_blank" :href="itemDrug.url">
                {{ itemDrug.title }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myechart from '../../../components/charts/myechart'
import { TZBS } from '@/api/constitutionIdentification/index'
export default {
  name: 'print',
  components: {
    myechart
  },
  data () {
    return {
      bianShiList: [],
      radarData: {
        color: ['#3171FF', '#FFE434', '#56A3F1', '#FF917C'],
        radar: {
          indicator: [
            { text: '肺气虚寒', max: 3 },
            { text: '脾气虚弱', max: 3 },
            { text: '肾阳不足', max: 3 },
            { text: '肺经伏热', max: 3 }
          ],
          center: ['50%', '50%'],
          radius: 96,
          startAngle: 90,
          splitNumber: 4,
          shape: 'circle',
          // 上面的标题，就是坐标系
          axisName: {
            color: '#333333'
          },
          splitArea: {
            areaStyle: {
              // 背景颜色
              color: ['#E6EEFF']
            }
          },
          // 中间十字的颜色
          axisLine: {
            lineStyle: {
              color: '#5A8DFF',
              type: 2
            }
          },
          // 圆圈的环的颜色
          splitLine: {
            lineStyle: {
              color: '#5A8DFF',
              type: 2
            }
          }
        },
        series: [
          {
            type: 'radar',
            symbol: 'circle',
            emphasis: {
              lineStyle: {
                width: 4
              }
            },
            data: [
              {
                value: [],
                name: 'Data A',
                areaStyle: {
                  // 框选区域颜色
                  color: 'rgba(49,113,255,0.5)'
                }
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    print () {
      window.print()
    }
  },
  mounted () {
    TZBS.getResult({
      userid: this.$route.query.userid,
      nowcode: this.$route.query.nowcode
    }).then(res => {
      let data = res.data
      this.radarData.radar.indicator = data.options
      this.radarData.series[0].data[0].value = data.sdata
      this.bianShiList = data.lists
      setTimeout(function () {
        // alert(1)
        this.print()
      }, 1000)
      // this.$nextTick(item => {})
    })
  }
}
</script>

<style lang="less" scoped>
@import '../constitutionIdentification.less';
.title {
  position: relative;
  padding-left: 12px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 16px;
  &::after {
    width: 4px;
    height: 18px;
    display: block;
    position: absolute;
    top: 3px;
    left: 0;
    content: ' ';
    background: #3171ff;
  }
}
.itemFatherProcess {
  height: 12px;
  .item:first-child {
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
  }
  .item:last-child {
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
  }
}
.allTitle {
  position: relative;
  width: 148px;
  height: 42px;
  background: #3171ff;
  color: white;
  display: inline-block;
  padding: 12px 10px;
  font-weight: 500;
  font-size: 16px;
  margin-top: 16px;
  &::before {
    display: block;
    position: absolute;
    top: 6px;
    left: 4px;
    width: 148px;
    height: 40px;
    border: 1px solid #3171ff;
    content: '';
  }
}
.contentBlock {
  position: relative;
}
.bgImg {
  position: absolute;
  top: 0;
  left: 0;
}
.line {
  border-top: 1px solid #d2d7e1;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
