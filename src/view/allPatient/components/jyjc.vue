<template>
  <div>
    <!-- <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem" style="margin-top: 0">
          <div class="label">检验项目</div>
          <div>
            <Select v-model="jyxm" placeholder="请选择" style="width: 150px">
              <Option v-for="(item,index) in jcList" :value="item" :key="index+'jcList'">
                {{ item }}
              </Option>
            </Select>
          </div>
        </div>
        <div class="filterItem" style="margin-top: 0">
          <div class="label">检查时间</div>
          <div>
            <Select v-model="time" placeholder="请选择" style="width: 150px">
              <Option v-for="item in timeList" :value="item.value" :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </div>
        </div>
        <div class="filterItem" style="margin-top: 0">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary">导 入</Button>
          <Button type="primary">导 出</Button>
        </div>
      </div>
    </div> -->
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #result="{ row }">
        {{ row.result || '-' }}
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

    <!-- 报告单 -->
    <el-image
      ref="watchReport"
      style="display: none"
      :src="showImgPath"
      :preview-src-list="watchImgList"
    ></el-image>
  </div>
</template>

<script>
import { check } from '@/api/check/index'
import { treated } from '@/api/treated/index'
export default {
  name: 'jyjc',
  data () {
    return {
      pageSize: 10,
      loading: false,
      patid: this.$route.query.patid,
      showImgPath: '',
      watchImgList: [],
      jyxm: '',
      jcList: [
        '血常规',
        '血沉',
        '吸入物变应原筛查',
        '变应原检测',
        '食入物变应原筛查',
        '食物特异性IgG4抗体检测',
        '肺功能',
        '耳鼻喉内窥镜检查'
      ],
      time: '',
      timeList: [
        {
          value: '今天',
          label: '今天'
        },
        {
          value: '三天内',
          label: '三天内'
        },
        {
          value: '一周内',
          label: '一周内'
        }
      ],
      columns: [
        {
          title: '序号',
          key: 'insid'
        },
        {
          title: '项目名称',
          key: 'insname'
        },
        {
          title: '缴费时间',
          key: 'paydate',
          width: 156
        },
        // {
        //   title: '操作时间',
        //   key: 'operateTime'
        // },
        // {
        //   title: '操作人',
        //   key: 'name'
        // },
        {
          title: '就诊医生',
          key: 'docname'
        },
        {
          title: '检验结果',
          slot: 'result'
        },
        {
          title: '操作',
          width: 120,
          render: (h, obj) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    color: '#3171FF',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      check
                        .getReport({
                          checkid: obj.row.insid
                        })
                        .then(res => {
                          let data = res.data
                          this.showImgPath = data.jcfiles[0]
                          this.watchImgList = data.jcfiles
                          this.$nextTick(() => {
                            this.$refs.watchReport.clickHandler()
                          })
                        })
                    }
                  }
                },
                obj.row.result === null ? '' : '查看报告单'
              )
            ])
          }
        }
      ],
      tableData: [],
      pageNum: 0,
      currentPageIdx: 1,
      report: ''
    }
  },
  methods: {
    // 当前页数发生改变
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.getList()
    },
    // 每页数量发生改变
    changeSize (pageSize) {
      this.currentPageIdx = 1
      this.pageSize = pageSize
      this.getList()
    },
    getList () {
      this.loading = true
      treated
        .checkHist({
          page: this.currentPageIdx,
          limit: this.pageSize,
          patid: this.patid
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
