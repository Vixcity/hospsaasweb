<template>
  <div class="ZDJG">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <Input placeholder="模板名称" v-model="keyword" style="width: 230px" search />
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
          <Button type="primary" @click="openEdit('add')">新增模板</Button>
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
    <el-dialog
      :title="isAdd ? '新增诊断模板' : '编辑诊断模板'"
      :visible.sync="showEdit"
      width="300px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic black">
            <div style="width: 34px; text-align: right; margin-right: 8px">名称</div>
            <Input v-model="chooseZD.name" placeholder="请填写诊断模板名称" />
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit" :loading="loadingSaveEdit">保 存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { templateSettings } from '@/api/templateSettings/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'ZDJG',
  data () {
    return {
      pageNum: 5,
      currentPageIdx: 1,
      pageSize: 10,
      isAdd: false,
      showEdit: false,
      loading: false,
      loadingSaveEdit: false,
      keyword: '',
      chooseZD: {
        dataid: '',
        name: ''
      },
      columns: [
        {
          title: '序号',
          key: 'dataid'
        },
        {
          title: '诊断名称',
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
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.chooseZD = {
          dataid: '',
          name: ''
        }
      } else {
        this.isAdd = false
        templateSettings
          .resultDetail({
            dataid: row.dataid
          })
          .then(res => {
            let data = res.data
            this.chooseZD = data
          })
      }

      this.showEdit = true
    },
    saveEdit () {
      let param = deepClone(this.chooseZD)
      this.loadingSaveEdit = true
      templateSettings.resultSave(param).then(res => {
        if (res.msg === '新增成功' || res.msg === '更新成功') {
          this.showEdit = false
          this.$Message.success(res.msg)
          this.getList()
        } else {
          this.$Message.error(res.msg)
        }
        this.loadingSaveEdit = false
      }).catch(() => {
        this.loadingSaveEdit = false
      })
    },
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        templateSettings
          .resultDelete({
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
      templateSettings
        .resultList({
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
          console.log('诊断结果:', err)
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
@import '../medicalRecordTemplate.less';
</style>
