<template>
  <div class="EVADetail">
    <div class="flex jcsb aic">
      <div class="title">随访详情</div>
      <Button type="primary" @click="toPrev">返回上一级</Button>
    </div>
    <div class="flex" style="margin-top: 16px; flex-wrap: wrap">
      <div style="margin-right: 40px">随访名称：{{ info.title }}</div>
      <div style="margin-right: 40px">随访模式：{{ info.followmodename }}</div>
      <div style="margin-right: 40px">随访频率：{{ info.followrate }}</div>
      <div style="margin-right: 40px">随访日期：{{ info.followdate }}</div>
      <div style="margin-right: 40px">患者模式：{{ info.modetype }}</div>
    </div>
    <div class="line"></div>
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" search placeholder="关键词搜索" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset" style="margin-left: 0">重 置</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #action="{ row }">
        <span class="btn" v-if="row.logid !== 0" @click="openEdit(row)">查看结果</span>
        <span class="gray" style="cursor: not-allowed" v-else>查看结果</span>
      </template>
    </Table>
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
    <el-dialog
      :title="fetit"
      :visible.sync="showEdit"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div v-for="(item, index) in list" :key="index + 'item'" class="questionItem black">
        <div class="title black flex jcsb aic" :class="index === 0 ? '' : 'dialogBlock'">
          <div>
            {{ item.medicalshorthand }}
            <span class="gray" style="font-size: 14px">（{{ item.title }}）</span>
          </div>
          <div style="font-size: 16px" v-if="item.score != ''">{{ item.score }}分</div>
        </div>
        <div class="slideBar" v-if="item.option.length">
          <div
            class="itemSlide"
            v-for="(itemOpt, indexOpt) in item.option"
            :key="index + '-' + indexOpt + 'item.option'"
            :style="{ background: itemOpt.color }"
          >
            {{ itemOpt.title }}
            <div class="scoreAndArrow" v-if="itemOpt.isselect == 1">
              <div class="black">{{ item.score }}</div>
              <i class="iconfont icon-xiajiantou gray"></i>
            </div>
          </div>
        </div>
        <myechart
          :option="item.itemOption"
          style="width: 100%; margin-top: 8px; height: 168px"
          v-if="item.ischart === 'Y'"
          class="dialogBlock"
        ></myechart>
        <div class="smallTitleDialog dialogBlock flex">
          <div class="smallTitle">结果解释：</div>
          <div class="smallLabel">{{ item.comment }}</div>
        </div>
        <div class="smallTitleDialog dialogBlock flex">
          <div class="smallTitle">辅导建议：</div>
          <div v-if="item.suggest.length">
            <div
              :class="suggest_index === 0 ? 'smallLabel' : 'dialogBlock smallLabel'"
              v-for="(suggest, suggest_index) in item.suggest"
              :key="index + '-' + suggest_index + 'suggest_index'"
            >
              {{ suggest }}
            </div>
          </div>
          <div v-else>
            <div class="smallLabel">暂无辅导建议</div>
          </div>
        </div>
        <div class="smallTitleDialog dialogBlock flex">
          <div class="smallTitle">日常生活建议：</div>
          <div v-if="item.advice.length">
            <div
              :class="advice_index === 0 ? 'smallLabel' : 'dialogBlock smallLabel'"
              v-for="(advice, advice_index) in item.advice"
              :key="index + '-' + advice_index + 'advice_index'"
            >
              {{ advice }}
            </div>
          </div>
          <div v-else>
            <div class="smallLabel">暂无日常生活建议</div>
          </div>
        </div>
        <div class="line" v-if="index !== list.length - 1"></div>
      </div>
      <div slot="footer"></div>
    </el-dialog>
  </div>
</template>

<script>
import { eva } from '@/api/specialistFollowUp/index'
import myechart from '../../../../components/charts/myechart'
import * as echarts from 'echarts'
export default {
  name: 'EVADetail',
  props: ['dataid'],
  components: { myechart },
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      showEdit: false,
      loading: false,
      info: {},
      keyword: '',
      columns: [
        {
          title: '就诊卡号',
          key: 'jzcard',
          minWidth: 120
        },
        {
          title: '姓名',
          key: 'realname',
          minWidth: 70
        },
        {
          title: '性别',
          key: 'gender',
          minWidth: 60
        },
        {
          title: '年龄',
          key: 'age',
          minWidth: 60
        },
        {
          title: '完成次数',
          key: 'finishnum',
          minWidth: 90
        },
        {
          title: '诊断结果',
          key: 'diagnose',
          minWidth: 150
        },
        {
          title: '上次填完成时间',
          key: 'lasttime',
          minWidth: 180
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 100
        }
      ],
      tableData: [],
      list: [],
      fetit: ''
    }
  },
  methods: {
    toPrev () {
      this.$emit('back')
    },
    getDetail () {
      eva
        .getInfo({
          dataid: this.dataid
        })
        .then(res => {
          let data = res.data
          this.info = data
        })
    },
    getList () {
      this.loading = true
      eva
        .detailList({
          dataid: this.dataid,
          keyword: this.keyword,
          page: this.currentPageIdx,
          limit: this.pageSize
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
        })
    },
    changeData (row) {
      let xaxis = []
      let yaxis = []
      let ymax = row.ymax

      row.detail.map(list => {
        xaxis.push(list.numbering)
        yaxis.push(list.score)
      })
      return {
        title: {
          subtext: '',
          x: 'right'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '5%',
          left: '3%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          data: xaxis,
          axisLine: {
            show: true,
            symbol: ['none', 'path://M5, 20 L5, 5 L8, 8 L5, 2 L2, 8 L5, 5 L5.3, 6 L5.3, 20'],
            symbolOffset: 10,
            symbolSize: [35, 36],
            lineStyle: {
              show: true,
              color: '#DFDFDF'
            }
          },
          axisLabel: {
            color: '#999999',
            fontSize: 8
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          name: '',
          axisLine: {
            show: true,
            symbol: ['none', 'arrow'],
            symbolOffset: 10,
            symbolSize: [8, 10],
            lineStyle: {
              show: true,
              color: '#DFDFDF'
            }
          },
          axisLabel: {
            color: '#999999',
            fontSize: 7
          },
          max: ymax
        },
        series: [
          {
            type: 'bar',
            barWidth: '18',
            barGap: '8',
            label: {
              show: true,
              position: 'top'
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#A2BCF4'
                    },
                    {
                      offset: 1,
                      color: '#3171FF'
                    }
                  ],
                  false
                )
              }
            },
            data: yaxis
          }
        ]
      }
    },
    openEdit (row) {
      eva
        .detailResult({
          logid: row.logid
        })
        .then(res => {
          let data = res.data
          console.log(JSON.stringify(data))
          data.lists.forEach(list => {
            if (list.ischart === 'Y') {
              list.itemOption = this.changeData(list)
            }
          })
          this.list = data.lists
          this.fetit = data.fetit
          this.showEdit = true
        })
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    changePage (index) {
      this.currentPageIdx = index
      this.getList()
    },
    reset () {
      this.keyword = ''
      this.changeFilter()
    },
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    }
  },
  mounted () {
    this.getDetail()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import '../EVAFollowUp.less';
</style>
