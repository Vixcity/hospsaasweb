<template>
  <div class="testData">
    <!-- <div class="tab_header">
      <div
        :class="tab_index === item.value ? 'tab_header_active tab_header_item' : 'tab_header_item'"
        v-for="(item, index) in tabList"
        :key="index"
        @click="tab_index = item.value"
      >
        {{ item.label }}
      </div>
    </div> -->
    <div style="padding: 0 8px">
      <!-- <div v-for="(item, index) in tabList" :label="item" :name="index + ''" :key="index">
        <div class="tabItemCon" v-if="tabList[index].value === tab_index"> -->
      <div class="filterCtn">
        <div class="itemFather">
          <!-- <div class="filterItem">
                <div class="label">诊断结果</div>
                <div>
                  <Select style="width: 180px" filterable>
                    <Option value="良好">良好</Option>
                    <Option value="不好">不好</Option>
                    <Option value="健康">健康</Option>
                  </Select>
                </div>
              </div> -->
          <div class="filterItem">
            <div class="label">搜索</div>
            <div>
              <Input v-model="keyword" search placeholder="人员姓名/人员账号" />
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
            <!-- <Button type="primary">导 入</Button> -->
            <Button type="primary" @click="getList(true)">导 出</Button>
          </div>
        </div>
      </div>
      <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
        <template #action="{ row }">
          <span v-if="row.jcresult === '-'" class="gray" style="cursor: not-allowed">
            查看报告单
          </span>
          <span v-else class="tableAdd" @click="openEdit('edit', row)">查看报告单</span>
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
      <!-- </div>
      </div> -->
    </div>
    <!-- 报告单 -->
    <el-image
      ref="watchReport"
      style="display: none"
      :src="showImgPath"
      :preview-src-list="watchImgList"
    ></el-image>
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
  </div>
</template>

<script>
import { check } from '@/api/check/index'
import { testData } from '@/api/scientificData/index'
import { common } from '@/api/index'
export default {
  name: 'testData',
  data () {
    return {
      report: '',
      keyword: '',
      loading: false,
      showXZ: false,
      filename: '',
      showImgPath: '',
      watchImgList: [],
      pageSize: 10,
      // tabList: [
      //   {
      //     label: '点刺试验',
      //     value: '点刺试验'
      //   },
      //   {
      //     label: '斑点试验',
      //     value: '斑点试验'
      //   },
      //   {
      //     label: '肠道菌群',
      //     value: '肠道菌群'
      //   },
      //   {
      //     label: 'HAE',
      //     value: 'HAE'
      //   },
      //   {
      //     label: '奥马珠单抗',
      //     value: '奥马珠单抗'
      //   }
      // ],
      // tab_index: '点刺试验',
      pageNum: 0,
      currentPageIdx: 1,
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
        // {
        //   title: '年龄',
        //   key: 'age'
        // },
        {
          title: '诊断结果',
          key: 'diagnose',
          minWidth: 300
        },
        {
          title: '检测项目',
          key: 'jcname',
          minWidth: 120
        },
        {
          title: '检测时间',
          key: 'jcdate',
          width: 170
        },
        {
          title: '检测结果',
          key: 'jcresult',
          minWidth: 120
        },
        {
          title: '操作',
          width: 120,
          fixed: 'right',
          slot: 'action'
        }
      ],
      tableData: []
    }
  },
  methods: {
    changePage (page) {
      this.currentPageIdx = page
      this.getList()
    },
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    reset () {
      this.keyword = ''
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
    getList (isExport) {
      let param = {
        page: this.currentPageIdx,
        limit: this.pageSize,
        keyword: this.keyword
      }
      if (isExport) {
        param.export = true
      } else {
        this.loading = true
      }
      testData.list(param).then(res => {
        let data = res.data
        if (isExport) {
          this.filename = data
          this.showXZ = true
        } else {
          this.pageNum = data.total
          this.tableData = data.lists
          this.loading = false
        }
      })
    },
    openEdit (type, row) {
      check
        .getReport({
          checkid: row.insid
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
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './testData.less';
</style>
<style scoped>
.testData >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
