<template>
  <div class="FLLB">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="请输入分类名称" v-model="keyword" />
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
          <Button type="primary" @click="openEdit('add')">新增类型</Button>
        </div>
      </div>
    </div>
    <Table :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #isshow="{ row }">
        {{ row.isshow === 'Y' ? '是' : '否' }}
      </template>
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
      :title="isAdd ? '新增类型' : '编辑类型'"
      :visible.sync="showEdit"
      width="430px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex aic">
            <div class="itemLabel">类型名称</div>
            <div class="itemContent" style="margin-left: 8px; width: 80%">
              <Input v-model="cooseCate.title" placeholder="请填写类型名称" />
            </div>
          </div>
          <div class="flex aic" style="margin-top: 16px">
            <div class="itemLabel">是否显示</div>
            <div class="itemContent" style="margin-left: 8px; width: 80%">
              <RadioGroup v-model="cooseCate.isshow">
                <Radio label="Y">是</Radio>
                <Radio label="N">否</Radio>
              </RadioGroup>
            </div>
          </div>
          <div class="flex aic" style="margin-top: 16px">
            <div class="itemLabel">排列序号</div>
            <div class="itemContent" style="margin-left: 8px; width: 80%">
              <Input v-model="cooseCate.sortnum" type="number" placeholder="请填写排列序号" />
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
import { healthEducation } from '@/api/healthEducation/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'FLLB',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      isAdd: false,
      showEdit: false,
      loadingSaveEdit: false,
      keyword: '',
      cooseCate: {
        title: '',
        isshow: 'Y',
        sortnum: 0,
        cateid: ''
      },
      columns: [
        {
          title: '类型名称',
          key: 'title'
        },
        {
          title: '是否显示',
          slot: 'isshow'
        },
        {
          title: '排列序号',
          key: 'sortnum'
        },
        {
          title: '创建时间',
          key: 'time',
          width: 170
        },
        {
          title: '操作',
          slot: 'action',
          width: 120,
          fixed: 'right'
        }
      ],
      tableData: [],
      pageSize: 10
    }
  },
  methods: {
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.getList()
    },
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.currentPageIdx = 1
      this.getList()
    },
    saveEdit () {
      let param = deepClone(this.cooseCate)
      if (param.sortnum === '') {
        param.sortnum = 0
      }

      this.loadingSaveEdit = true

      healthEducation
        .cateSave({
          ...param
        })
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
        this.cooseCate = {
          title: '',
          isshow: 'Y',
          sortnum: 0,
          cateid: ''
        }
      } else {
        this.cooseCate = deepClone(row)
        healthEducation
          .cateDetail({
            cateid: row.cateid
          })
          .then(res => {
            this.cooseCate = res.data
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
        healthEducation
          .cateDelete({
            cateid: row.cateid
          })
          .then(res => {
            if (res.msg === '删除成功') {
              this.$Message.success(res.msg)
              this.getList()
            } else {
              this.$Message.error(res.msg)
            }
          })
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
    getList () {
      healthEducation
        .cateList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import '../healthEducation.less';
</style>
