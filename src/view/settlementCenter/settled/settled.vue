<template>
  <div class="settled">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="患者名称" v-model="keyword" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #action="{ row }">
        <span class="btn" @click="openEdit(row)">查看明细</span>
        <!-- <span class="btn red" @click="deleteItem(row)">退款</span> -->
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
      title="结算"
      :visible.sync="showEdit"
      width="520px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="info black">
        <div class="flex">
          <div style="width: 44%">姓名：{{ choosePeoele.patname }}</div>
          <div style="width: 44%">性别：{{ choosePeoele.sex }}</div>
          <div style="width: 12%">年龄：{{ choosePeoele.age }}</div>
        </div>
        <div class="flex" style="margin-top: 4px">
          <div style="width: 44%">就诊卡号：{{ choosePeoele.jzcard }}</div>
          <div style="width: 56%">临床诊断：{{ choosePeoele.diagnose }}</div>
        </div>
      </div>
      <div class="line"></div>
      <div class="flexFrom black">
        <div style="width: 25%; font-size: 20px">Rp</div>
        <div class="from_right">
          <div class="from_right_item" v-for="(item, index) in preject.lists" :key="index">
            <div class="from_right_item_txt">{{ item.name }}</div>
            <div class="from_right_item_txt">{{ item.price || 0 }}元</div>
          </div>
          <div class="from_right_item">
            <div class="from_right_item_txt"></div>
            <div class="from_right_item_txt">
              合计：
              <span style="font-weight: 700">{{ preject.total }}元</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { settlementCenter } from '@/api/settlementCenter/index'
export default {
  name: 'settled',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      showEdit: false,
      loading: false,
      choosePeoele: {},
      columns: [
        {
          key: 'jzcard',
          title: '就诊卡号',
          minWidth: 120
        },
        {
          key: 'patname',
          title: '姓名',
          minWidth: 70
        },
        {
          key: 'sex',
          title: '性别',
          minWidth: 60
        },
        {
          key: 'age',
          title: '年龄',
          minWidth: 60
        },
        {
          key: 'docname',
          title: '接诊医生',
          minWidth: 90
        },
        {
          key: 'treattime',
          title: '就诊时间',
          width: 170
        },
        {
          key: 'price',
          title: '结算费用',
          minWidth: 90
        },
        {
          slot: 'action',
          title: '操作',
          width: 100,
          fixed: 'right'
        }
      ],
      tableData: [],
      pageSize: 10,
      keyword: '',
      preject: {}
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
    openEdit (row) {
      this.showEdit = true
      settlementCenter
        .ajaxGetYesDetail({
          appointid: row.appointid
        })
        .then(res => {
          this.choosePeoele = res.data.info
          this.preject = res.data
        })
    },
    saveEdit () {
      this.showEdit = false
    },
    deleteItem (row) {
      this.$confirm('是否确认退款?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(res => {
        this.tableData.splice(row._index, 1)
        this.$Message.success('退款成功')
      })
    },
    reset () {
      this.keyword = ''
      this.changeFilter()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    getList () {
      this.loading = true
      settlementCenter
        .settledList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          keyword: this.keyword
        })
        .then(res => {
          this.tableData = res.data.lists
          this.pageNum = res.data.total
          this.loading = false
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import '../settlementCenter.less';
.flexFrom {
  display: flex;
  justify-content: space-between;
  &:first-child {
    margin-top: 0;
  }
  .fromItem {
    .itemLabel {
      text-align: right;
      padding-right: 8px;
    }
    .itemContent {
      width: 236px;
      height: 32px;
    }
  }
  .fromItem > div {
    margin-top: 16px;
    &:first-child {
      margin-top: 0;
    }
  }
}
.info {
  font-size: 14px;
}
.line {
  border-bottom: 1px solid #d2d7e1;
  margin: 16px 0;
}

.from_right {
  flex: 1;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  .from_right_item {
    width: 100%;
    display: flex;
    margin-bottom: 4px;
    &:last-child {
      margin-bottom: 0;
    }
    .from_right_item_txt {
      width: 50%;
    }
  }
}
</style>
