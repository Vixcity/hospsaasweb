<template>
  <div class="scaleEvaluation">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="医嘱名称" v-model="keyword" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary">查 询</Button>
          <Button>重 置</Button>
        </div>
      </div>
    </div>
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary" @click="openEdit('add')">新增医嘱</Button>
        </div>
      </div>
    </div>
    <Table :columns="columns" :data="tableData" style="margin-top: 16px">
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
      :title="isAdd ? '新增医嘱模板' : '编辑医嘱模板'"
      :visible.sync="showEdit"
      width="496px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flex aic black" style="font-size: 12px">
        <div style="width: 100px; text-align: right">规避医嘱名称</div>
        <div style="margin-left: 8px; width: 100%">
          <Input v-model="chooseYZ.name" placeholder="请填写规避医嘱名称" />
        </div>
      </div>
      <div class="flex black" style="margin-top: 16px; font-size: 12px">
        <div style="width: 100px; text-align: right">医嘱详情</div>
        <div style="margin-left: 8px; width: 100%">
          <Input
            v-model="chooseYZ.content"
            type="textarea"
            :rows="5"
            placeholder="请填写医嘱详情"
          />
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
export default {
  name: 'scaleEvaluation',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      isAdd: false,
      showEdit: false,
      loadingSaveEdit: false,
      keyword: '',
      columns: [
        {
          title: '序号',
          key: 'dataid',
          minWidth: 60
        },
        {
          title: '医嘱名称',
          key: 'name',
          minWidth: 120
        },
        {
          title: '详情',
          key: 'content',
          minWidth: 500
        },
        {
          title: '创建医生',
          key: 'createuser',
          minWidth: 120
        },
        {
          title: '操作',
          slot: 'action',
          width: 120,
          fixed: 'right'
        }
      ],
      tableData: [],
      chooseYZ: {
        name: '',
        content: '',
        dataid: ''
      }
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
    saveEdit () {
      this.loadingSaveEdit = true
      templateSettings
        .evadeSave(this.chooseYZ)
        .then(res => {
          if (res.msg === '新增成功' || res.msg === '更新成功') {
            this.showEdit = false
            this.$Message.success(res.msg)
            this.getList()
          } else {
            this.$Message.error(res.msg)
          }
          this.loadingSaveEdit = false
        })
        .catch(() => {
          this.loadingSaveEdit = false
        })
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
        this.chooseYZ = {
          name: '',
          content: '',
          dataid: ''
        }
      } else {
        templateSettings
          .evadeDetail({
            dataid: row.dataid
          })
          .then(res => {
            let data = res.data
            this.chooseYZ = data
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
        templateSettings
          .evadeDelete({
            dataid: row.dataid
          })
          .then(res => {
            this.$Message.success(res.msg)
            this.getList()
          })
      })
    },
    getList () {
      templateSettings
        .evadeList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.pageNum = data.total
          this.tableData = data.lists
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './avoidingMedicalAdvice.less';
</style>
