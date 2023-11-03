<template>
  <div class="useMedicData">
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
    <Table
      v-loading="loading"
      :columns="columns"
      :data="tableData"
      style="margin-top: 16px"
    ></Table>
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
import { useMedic } from '@/api/scientificData/index'
import { common } from '@/api/index'
export default {
  name: 'useMedicData',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSzie: 10,
      keyword: '',
      filename: '',
      showXZ: false,
      loading: false,
      columns: [
        {
          title: '就诊卡号',
          minWidth: 120,
          key: 'jzcard'
        },
        {
          title: '姓名',
          minWidth: 80,
          key: 'realname'
        },
        {
          title: '性别',
          minWidth: 80,
          key: 'gender'
        },
        {
          title: '诊断结果',
          minWidth: 300,
          key: 'diagnose'
        },
        {
          title: '用药',
          minWidth: 150,
          key: 'medicine'
        },
        {
          title: '规格',
          minWidth: 120,
          key: 'spec'
        },
        {
          title: '剂量',
          minWidth: 80,
          key: 'dose'
        },
        {
          title: '服用频率',
          minWidth: 100,
          key: 'rate'
        },
        {
          title: '单价',
          minWidth: 80,
          key: 'price'
        },
        {
          title: '起始时间',
          minWidth: 120,
          key: 'createdate'
        },
        {
          title: '持续时间（天）',
          minWidth: 130,
          key: 'days'
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
      this.pageSzie = pageSize
      this.changeFilter()
    },
    reset () {
      this.keyword = ''
      this.changeFilter()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
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
        limit: this.pageSzie,
        keyword: this.keyword
      }
      if (isExport) {
        param.export = true
      } else {
        this.loading = true
      }
      useMedic.list(param).then(res => {
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
@import './useMedicData.less';
</style>
