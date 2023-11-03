<template>
  <div class="holidays" style="padding-top: 16px">
    <Button type="primary" @click="addHolidays">新增节假日停诊</Button>
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

    <!-- 新增/编辑 -->
    <el-dialog
      :title="isAdd ? '新增停诊计划' : '编辑停诊计划'"
      :visible.sync="showEdit"
      width="350px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form ref="ruleForm" :model="ruleForm" :rules="rules" :label-width="72">
        <FormItem label="节假日日期" prop="stopdate">
          <DatePicker
            :editable="false"
            type="date"
            placeholder="请选择"
            :value="ruleForm.stopdate"
            @on-change="ruleForm.stopdate = $event"
            :transfer="true"
            style="width: 100%"
          ></DatePicker>
        </FormItem>
        <FormItem label="节假日名称" prop="name">
          <Input v-model="ruleForm.name" placeholder="请输入节假日名称"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveEdit" :loading="loadingSaveEdit">保 存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pbgl } from '@/api/systemSetting/pbgl'
export default {
  name: 'jjrtz',
  data () {
    return {
      columns: [
        {
          title: '节假日日期',
          key: 'stopdate'
        },
        {
          title: '节假日名称',
          key: 'name'
        },
        {
          title: '操作',
          width: 80,
          fixed: 'right',
          render: (h, obj) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    color: '#F75559',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.$confirm('确认是否删除?', '提示', {
                        confirmButtonText: '确 定',
                        cancelButtonText: '取 消',
                        type: 'warning'
                      }).then(() => {
                        pbgl
                          .feastDelete({
                            id: obj.row.id
                          })
                          .then(res => {
                            this.showEdit = false
                            this.$Message.success(res.msg)
                            this.getList()
                          })
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      tableData: [],
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      keyword: '',
      stopdate: '',
      loading: false,
      loadingSaveEdit: false,
      isAdd: true,
      showEdit: false,
      ruleForm: {},
      rules: {}
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
      this.changeFilter()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    // 新增
    addHolidays () {
      this.isAdd = true
      this.showEdit = true
      this.ruleForm = {
        name: '',
        stopdate: ''
      }
    },
    // 确 定
    saveEdit () {
      this.loadingSaveEdit = true
      pbgl
        .feastSave(this.ruleForm)
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
    getList () {
      this.loading = true
      pbgl
        .feastList({
          keyword: this.keyword,
          page: this.currentPageIdx,
          limit: this.pageSize
        })
        .then(res => {
          let data = res.data
          this.pageNum = data.total
          this.tableData = data.lists
          this.loading = false
        })
        .catch(err => {
          console.log('假期调班:', err)
          this.loading = false
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
