<template>
  <div class="constitutionIdentification">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="请输入患者姓名" v-model="keyword" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary" @click="getList(true)">导 出</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #action="{ row }">
        <span class="btn" @click="openEdit('dtjl', row)">答题记录</span>
        <span class="btn" @click="openEdit('bsjg', row)">辨识结果</span>
        <!-- <span class="btn red" @click="deleteItem(row)">删除</span> -->
      </template>
    </Table>
    <!-- 答题记录 -->
    <el-dialog
      title="答题记录"
      :visible.sync="showDati"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div v-loading="datiLoading">
        <div
          v-for="(item, index) in datiList"
          :key="index + 'datiList'"
          class="datiItem"
          :style="index === 0 ? 'margin-top: 0' : ''"
        >
          <div style="margin-bottom: 10px">{{ index + 1 }}.{{ item.title }}</div>
          <div>答：{{ item.quesval }}</div>
        </div>
      </div>
    </el-dialog>
    <!-- 辨识结果 -->
    <div class="bsjgContent">
      <el-dialog
        title="辨识结果"
        :visible.sync="showBianShi"
        width="768px"
        :close-on-click-modal="false"
        class="vertical-center-modal"
      >
        <img class="bgImg" src="@/assets/images/TZBS/bgImg.png" alt="" style="width: 100%" />
        <div class="contentBlock" id="print">
          <myechart :option="radarData" style="width: 100%; height: 256px"></myechart>
          <div class="line"></div>
          <div class="flex jcc">
            <div class="allTitle">中医鼻炎辩证结果</div>
          </div>
          <div v-for="(item, index) in bianShiList" :key="index + 'bianShiList'">
            <div class="title">{{ item.name }}</div>
            <div style="margin-top: 32px">
              <div class="flex itemFatherProcess">
                <div
                  class="item"
                  style="background: #00d48a; flex: 1; position: relative; height: 12px"
                >
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
                <div
                  class="item"
                  style="background: #ffbd38; flex: 1; position: relative; height: 12px"
                >
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
                <div
                  class="item"
                  style="background: #f75559; flex: 1; position: relative; height: 12px"
                >
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
                  <div
                    v-for="(itemShape, indexShape) in item.shape"
                    :key="indexShape + 'item.shape'"
                  >
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
        <span slot="footer" class="dialog-footer">
          <Button v-show="!isMobile" style="margin-left: 8px" type="primary" v-print="'#print'">打 印</Button>
          <Button v-show="isMobile" style="margin-left: 8px" type="primary" @click="jqPrint">打 印</Button>
        </span>
      </el-dialog>
    </div>
    <!-- 导出结果 -->
    <el-dialog
      title="导出结果"
      :visible.sync="showXZ"
      width="320px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flex aic" style="margin-left: 40px">
        <i class="iconfont icon-a-EXCEL green" style="font-size: 18px; margin-right: 8px"></i>
        <span style="font-size: 14px" class="black">{{ filename }}</span>
      </div>
      <div slot="footer">
        <Button type="primary" @click="download">下 载</Button>
      </div>
    </el-dialog>
    <div class="pageWrapper">
      <Page
        :total="pageNum"
        :current="currentPageIdx"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        prev-text="上一页"
        next-text="下一页"
        show-sizer
        show-elevator
        show-total
      ></Page>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
// import print from 'print-js'
import { TZBS } from '@/api/constitutionIdentification/index'
import { common } from '@/api/index'
// import '@/assets/js/jquery.PrintArea'
import myechart from '../../components/charts/myechart'
export default {
  name: 'ZLJY',
  components: {
    myechart
  },
  data () {
    return {
      keyword: '',
      pageNum: 0,
      choosePat: {},
      currentPageIdx: 1,
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
      },
      pageSize: 10,
      datiList: [],
      bianShiList: [],
      isMobile: false,
      showDati: false,
      datiLoading: false,
      showBianShi: false,
      bianShiLoading: false,
      loading: false,
      filename: '',
      showXZ: false,
      columns: [
        {
          title: '姓名',
          key: 'realname'
        },
        {
          title: '性别',
          key: 'gender'
        },
        {
          title: '生日',
          key: 'birthday'
        },
        {
          title: '肺经伏热',
          key: 'fjfr'
        },
        {
          title: '肺气虚寒',
          key: 'fqxh'
        },
        {
          title: '脾气虚弱',
          key: 'pqxr'
        },
        {
          title: '肾阳不足',
          key: 'sybz'
        },
        {
          title: '操作',
          slot: 'action',
          width: 160,
          fixed: 'right'
        }
      ],
      tableData: []
    }
  },
  methods: {
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.getList()
    },
    reset () {
      this.keyword = ''
      this.changeFilter()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    },
    download () {
      common
        .downloadExcel({
          filename: this.filename
        })
        .then(res => {
          this.showXZ = false
        })
    },
    jqPrint () {
      window.open('/#/print?userid=' + this.choosePat.userid + '&nowcode=' + this.choosePat.nowcode)
    },
    getList (isExport) {
      let param = {
        page: this.currentPageIdx,
        limit: this.pageSize,
        content: this.keyword
      }
      if (isExport) {
        param.export = true
      } else {
        this.loading = true
      }
      TZBS.getPatLists(param).then(res => {
        let data = res.data
        if (isExport) {
          this.filename = data
          this.showXZ = true
        } else {
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
        }
      })
    },
    openEdit (type, row) {
      this.choosePat = row
      if (type === 'dtjl') {
        this.showDati = true
        this.datiLoading = true
        TZBS.getQuesLists({
          userid: row.userid,
          nowcode: row.nowcode
        }).then(res => {
          this.datiList = res.data
          this.datiLoading = false
        })
      } else if (type === 'bsjg') {
        this.showBianShi = true
        this.bianShiLoading = true
        TZBS.getResult({
          userid: row.userid,
          nowcode: row.nowcode
        }).then(res => {
          let data = res.data
          this.radarData.radar.indicator = data.options
          this.radarData.series[0].data[0].value = data.sdata
          this.bianShiList = data.lists
          this.bianShiLoading = false
        })
      }
    }
  },
  mounted () {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      // 当前设备是移动设备
      this.isMobile = true
    }
    this.getList()
  }
}
</script>

<style>
.bsjgContent .el-dialog {
  position: relative;
}
.bsjgContent .el-dialog__body {
  padding-top: 0 !important;
  position: relative;
}
.bsjgContent .el-dialog__header {
  position: relative;
  background: url('../../assets/images/TZBS/headBgImg.png');
  background-size: 100% auto;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  border-bottom: unset !important;
  z-index: 1;
}
.bsjgContent .el-dialog__close {
  color: #4d5465;
}
.bsjgContent .el-dialog__title {
  font-size: 16px !important;
}
</style>
<style lang="less" scoped>
@import './constitutionIdentification.less';
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
