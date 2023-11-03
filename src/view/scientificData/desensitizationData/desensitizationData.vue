<template>
  <div class="desensitizationData">
    <div class="tabItemCon">
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
          </div>
          <div class="filterItem">
            <div class="label">是否结束治疗</div>
            <div>
              <Select style="width: 180px">
                <Option value="是">是</Option>
                <Option value="否">否</Option>
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
        <template #isdrop="{ row }">
          {{ row.isdrop === 'N' ? '否' : '是' }}
        </template>
        <template #isforget="{ row }">
          {{ row.isforget === 'N' ? '否' : '是' }}
        </template>
        <template #dropmark="{ row }">
          {{ row.dropmark || '-' }}
        </template>
        <template #forgetmark="{ row }">
          {{ row.forgetmark || '-' }}
        </template>
        <template #action="{ row }">
          <span class="tableAdd" @click="exportSingle(row)">导 出</span>
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
  </div>
</template>

<script>
import { tuominData } from '@/api/scientificData/index'
import { common } from '@/api/index'
export default {
  name: 'desensitizationData',
  data () {
    return {
      tabList: ['点刺试验', '斑点试验', '肠道菌群', 'HAE', '奥马珠单抗'],
      activeTab: '0',
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      loading: false,
      showXZ: false,
      filename: '',
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
          minWidth: 80
        },
        {
          title: '性别',
          key: 'gender',
          minWidth: 80
        },
        // {
        //   title: '年龄',
        //   key: 'age',
        //   width: 100
        // },
        {
          title: '诊断结果',
          key: 'diagnose',
          minWidth: 300
        },
        {
          title: '脱敏药物',
          key: 'medicine',
          minWidth: 150
        },
        {
          title: '脱敏初始日期',
          key: 'firstdate',
          minWidth: 150
        },
        {
          title: '脱敏周期',
          key: 'tmweek',
          minWidth: 100
        },
        {
          title: '是否脱落',
          slot: 'isdrop',
          minWidth: 100
        },
        {
          title: '脱落原因',
          slot: 'dropmark',
          minWidth: 150
        },
        {
          title: '延误/忘记脱敏',
          slot: 'isforget',
          minWidth: 150
        },
        {
          title: '延误/忘记时间',
          key: 'forgetdate',
          minWidth: 180
        },
        {
          title: '延误/忘记原因',
          slot: 'forgetmark',
          minWidth: 150
        },
        {
          title: '操作',
          width: 80,
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
      this.getList()
    },
    exportSingle (row) {
      tuominData
        .export({
          projectid: row.projectid
        })
        .then(res => {
          let data = res.data
          this.showXZ = true
          this.filename = data
        })
        .catch(err => {
          console.log('脱敏数据导出：', err)
        })
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
      tuominData.list(param).then(res => {
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
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './desensitizationData.less';
</style>
<style scoped>
.desensitizationData >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
