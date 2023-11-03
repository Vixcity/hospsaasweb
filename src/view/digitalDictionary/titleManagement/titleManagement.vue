<template>
  <div class="titleManagement">
    <Button type="primary" @click="openEdit('add')">新增职称</Button>
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
      :title="isAdd ? '新增职称' : '编辑职称'"
      :visible.sync="showEdit"
      width="430px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex aic">
            <div class="itemLabel">职称名称</div>
            <div class="itemContent" style="margin-left: 8px; width: 80%">
              <Input v-model="chooseTitle.name" placeholder="请填写职称名称" />
            </div>
          </div>
          <div class="flex aic" style="margin-top: 16px">
            <div class="itemLabel">职称所属</div>
            <div class="itemContent" style="margin-left: 8px; width: 80%">
              <Select v-model="chooseTitle.type" placeholder="请选择职称所属">
                <Option value="doctor">医生</Option>
                <Option value="nurse">护士</Option>
              </Select>
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
  name: 'titleManagement',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      isAdd: false,
      showEdit: false,
      loading: false,
      keyword: '',
      chooseTitle: {
        dataid: '',
        name: '',
        type: ''
      },
      columns: [
        {
          title: '职称名称',
          key: 'name'
        },
        {
          title: '职称所属',
          key: 'type'
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
      let param = deepClone(this.chooseTitle)
      digitalDictionary.titleSave(param).then(res => {
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
        this.chooseTitle = {
          dataid: '',
          name: '',
          type: ''
        }
      } else {
        this.isAdd = false
        digitalDictionary
          .titleDetail({
            dataid: row.dataid
          })
          .then(res => {
            let data = res.data
            this.chooseTitle = data
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
          .titleDelete({
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
        .titleList({
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
          console.log('职称管理:', err)
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
@import './titleManagement.less';
</style>
