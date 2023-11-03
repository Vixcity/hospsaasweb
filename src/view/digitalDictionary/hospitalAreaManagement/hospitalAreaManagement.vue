<template>
  <div class="hospitalAreaManagement">
    <Button type="primary" @click="openEdit('add')">新增院区</Button>
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
      :title="isAdd ? '新增院区' : '编辑院区'"
      :visible.sync="showEdit"
      width="430px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex aic">
            <div class="itemLabel">院区名称</div>
            <div class="itemContent" style="margin-left: 8px; width: 80%">
              <Input v-model="chooseHospital.name" placeholder="请填写院区名称" />
            </div>
          </div>
          <div class="flex aic" style="margin-top: 16px">
            <div class="itemLabel">院区简称</div>
            <div class="itemContent" style="margin-left: 8px; width: 80%">
              <Input v-model="chooseHospital.shorter" placeholder="请输入院区简称" />
            </div>
          </div>
          <div class="flex aic" style="margin-top: 16px">
            <div class="itemLabel">院区地址</div>
            <div class="itemContent" style="margin-left: 8px; width: 80%">
              <Input v-model="chooseHospital.address" placeholder="请填写院区地址" />
            </div>
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
import { digitalDictionary } from '@/api/digitalDictionary/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'hospitalAreaManagement',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      isAdd: false,
      showEdit: false,
      loading: false,
      loadingSaveEdit: false,
      keyword: '',
      chooseHospital: {
        dataid: '',
        name: '',
        shorter: '',
        address: ''
      },
      columns: [
        {
          title: '院区名称',
          key: 'name',
          minWidth: 100
        },
        {
          title: '简称',
          key: 'shorter',
          minWidth: 80
        },
        {
          title: '地址',
          key: 'address',
          minWidth: 100
        },
        {
          title: '创建时间',
          key: 'time',
          minWidth: 130
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
      this.loadingSaveEdit = true
      let param = deepClone(this.chooseHospital)
      digitalDictionary
        .yuanSave(param)
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
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.chooseHospital = {
          dataid: '',
          name: '',
          shorter: '',
          address: ''
        }
      } else {
        this.isAdd = false
        digitalDictionary
          .yuanDetail({
            dataid: row.dataid
          })
          .then(res => {
            let data = res.data
            this.chooseHospital = data
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
          .yuanDelete({
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
        .yuanList({
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
          console.log('院区管理:', err)
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
@import './hospitalAreaManagement.less';
</style>
