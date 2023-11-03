<template>
  <div class="rosterCategory">
    <Button type="primary" @click="openEdit('add')">新增类别</Button>
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
    <el-dialog
      :title="isAdd ? '新增类别' : '编辑类别'"
      :visible.sync="showEdit"
      width="430px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex aic">
            <div class="itemLabel" style="width: 84px; text-align: right">类别名称</div>
            <div class="itemContent" style="margin-left: 8px; width: 70%">
              <Input v-model="coosePB.name" placeholder="请填写类别名称" />
            </div>
          </div>
          <div class="flex aic" style="margin-top: 16px">
            <div class="itemLabel" style="width: 84px; text-align: right">类别唯一标识</div>
            <div class="itemContent" style="margin-left: 8px; width: 70%">
              <Input v-model="coosePB.code" placeholder="请填写类别唯一标识" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit">保 存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { digitalDictionary } from '@/api/digitalDictionary/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'rosterCategory',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      isAdd: false,
      showEdit: false,
      loading: false,
      keyword: '',
      coosePB: {
        dataid: '',
        name: '',
        code: ''
      },
      columns: [
        {
          title: '类别名称',
          key: 'name'
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
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
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
    saveEdit () {
      let param = deepClone(this.coosePB)
      digitalDictionary.pbSave(param).then(res => {
        if (res.msg === '新增成功' || res.msg === '更新成功') {
          this.showEdit = false
          this.$Message.success(res.msg)
          this.getList()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.coosePB = {
          dataid: '',
          name: '',
          code: ''
        }
      } else {
        this.isAdd = false
        digitalDictionary
          .pbDetail({
            dataid: row.dataid
          })
          .then(res => {
            let data = res.data
            this.coosePB = data
          })
      }

      this.showEdit = true
    },
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        digitalDictionary
          .pbDelete({
            dataid: row.dataid
          })
          .then(res => {
            this.$Message.success(res.msg)
            this.getList()
          })
      })
    },
    getList () {
      this.loading = true
      digitalDictionary
        .pbList({
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
          console.log('排班类别:', err)
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
@import './rosterCategory.less';
</style>
