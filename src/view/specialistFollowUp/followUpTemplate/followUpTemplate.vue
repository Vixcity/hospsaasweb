<template>
  <div class="followUpTemplate">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">随访类型</div>
          <div>
            <Select v-model="type" placeholder="请选择" clearable style="width: 160px">
              <Option value="ai">AI随访</Option>
              <Option value="ren">人工随访</Option>
            </Select>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" search placeholder="模板名称" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset" style="margin-left: 0">重 置</Button>
        </div>
      </div>
    </div>
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button
            type="primary"
            @click="
              showEdit = true
              tempid = ''
            "
          >
            新增模板
          </Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #action="{ row }">
        <span
          class="btn"
          @click="
            showEdit = true
            tempid = row.tempid
          "
        >
          编辑
        </span>
        <span class="btn red" @click="deleteItem(row)">删除</span>
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
    <addFollowUpTem
      :showEdit="showEdit"
      :tempid="tempid"
      @save="saveEdit"
      @close="close"
    ></addFollowUpTem>
  </div>
</template>

<script>
import addFollowUpTem from '@/components/addFollowUpTem/addFollowUpTem'
import { sfmb } from '@/api/specialistFollowUp/index'
export default {
  name: 'followUpTemplate',
  components: {
    addFollowUpTem
  },
  data () {
    return {
      tempid: '',
      loading: false,
      type: '',
      keyword: '',
      pageSize: 10,
      pageNum: 0,
      currentPageIdx: 1,
      showEdit: false,
      columns: [
        {
          title: '序号',
          key: 'tempid'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '随访类型',
          key: 'typename'
        },
        {
          title: '创建时间',
          key: 'time'
        },
        {
          title: '操作',
          slot: 'action',
          width: 120,
          fixed: 'right'
        }
      ],
      tableData: []
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
      this.pageSize = pageSize
      this.currentPageIdx = 1
      this.getList()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    reset () {
      this.keyword = ''
      this.type = ''
      this.changeFilter()
    },
    getList () {
      this.loading = true
      sfmb
        .list({
          page: this.currentPageIdx,
          limit: this.pageSize,
          type: this.type,
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.pageNum = data.total
          this.tableData = data.lists
          this.loading = false
        })
        .catch(err => {
          console.log('随访模板:', err)
          this.loading = false
        })
    },
    saveEdit () {
      this.close()
      this.getList()
    },
    close () {
      this.showEdit = false
    },
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        sfmb
          .delete({
            tempid: row.tempid
          })
          .then(res => {
            this.$Message.success('删除成功')
            this.getList()
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
@import './followUpTemplate.less';
</style>
