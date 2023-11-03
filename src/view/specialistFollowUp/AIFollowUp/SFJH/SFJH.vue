<template>
  <div class="SFJH">
    <div v-if="!showEdit">
      <div class="filterCtn">
        <div class="itemFather">
          <div class="filterItem">
            <div class="label">搜索</div>
            <div>
              <Input v-model="keyword" search placeholder="计划名称" />
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
            <Button type="primary" @click="openEdit('add')">添加随访计划</Button>
          </div>
        </div>
      </div>
      <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
        <template #action="{ row }">
          <span class="btn" @click="openEdit('edit', row)">编辑</span>
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
    </div>
    <SFJHAdd
      v-else
      :isAdd="isAdd"
      :chooseSF="chooseSF"
      @back="
        showEdit = false
        getList()
      "
    ></SFJHAdd>
  </div>
</template>

<script>
import { ai } from '@/api/specialistFollowUp/index'
import SFJHAdd from './SFJHAdd/SFJHAdd.vue'
import { deepClone } from '@/libs/util'
export default {
  name: 'SFJH',
  components: {
    SFJHAdd
  },
  data () {
    return {
      isAdd: false,
      showEdit: false,
      keyword: '',
      loading: false,
      pageNum: 0,
      pageSize: 10,
      currentPageIdx: 1,
      chooseSF: {},
      columns: [
        {
          title: '计划名称',
          key: 'title'
        },
        {
          title: '随访频率',
          key: 'followrate'
        },
        {
          title: '随访模板',
          key: 'tempname'
        },
        // {
        //   title: '随访量表',
        //   key: 'sflb'
        // },
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
      this.changeFilter()
    },
    getList () {
      this.loading = true
      ai.planList({
        page: this.currentPageIdx,
        limit: this.pageSize,
        keyword: this.keyword
      })
        .then(res => {
          let data = res.data
          this.pageNum = data.total
          this.tableData = data.lists
          this.loading = false
        })
        .catch(err => {
          console.log('AI随访计划:', err)
          this.loading = false
        })
    },
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.chooseSF = {
          dataList: [{}]
        }
      } else {
        this.isAdd = false
        row.dataList = [{}]
        this.chooseSF = deepClone(row)
      }

      this.showEdit = true
    },
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        ai.deletePlan({
          planid: row.planid
        }).then(res => {
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
@import '../AIFollowUp.less';
</style>
