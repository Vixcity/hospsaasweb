<template>
  <div class="adjustment" style="padding-top: 16px">
    <Button type="primary" @click="openEdit">新增调班</Button>
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
      :title="isAdd ? '新增调班' : '编辑排班'"
      :visible.sync="showEdit"
      width="350px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form ref="ruleForm" :model="ruleForm" :rules="rules" :label-width="60">
        <FormItem label="调整日期" prop="date">
          <DatePicker
            :editable="false"
            type="date"
            format="yyyy-MM-dd"
            placeholder="请选择"
            style="width: 100%"
            :value="ruleForm.classdate"
            @on-change="ruleForm.classdate = $event"
            :transfer="true"
          ></DatePicker>
        </FormItem>
        <FormItem label="上周几班" prop="title">
          <Select v-model="ruleForm.weekly" placeholder="请选择" :transfer="true">
            <Option
              v-for="(item, index) in weekList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></Option>
          </Select>
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
import { deepClone } from '@/libs/util'
export default {
  name: 'jqtb',
  data () {
    return {
      loading: false,
      columns: [
        {
          title: '调整日期',
          key: 'classdate'
        },
        {
          title: '上周几班',
          key: 'weekly'
        },
        {
          title: '操作',
          width: 80,
          fixed: 'right',
          render: (h, rowObj) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    color: '#F75559',
                    cursor: 'pointer'
                  },
                  on: {
                    click: obj => {
                      this.$confirm('确认是否删除?', '提示', {
                        confirmButtonText: '确 定',
                        cancelButtonText: '取 消',
                        type: 'warning'
                      }).then(() => {
                        pbgl.changeDelete({ id: rowObj.row.id }).then(res => {
                          this.$Message.success('删除成功')
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
      weekList: [
        {
          value: '1',
          label: '周一'
        },
        {
          value: '2',
          label: '周二'
        },
        {
          value: '3',
          label: '周三'
        },
        {
          value: '4',
          label: '周四'
        },
        {
          value: '5',
          label: '周五'
        },
        {
          value: '6',
          label: '周六'
        },
        {
          value: '0',
          label: '周日'
        }
      ],
      isAdd: true,
      showEdit: false,
      loadingSaveEdit: false,
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
      this.pageIndex = 1
      this.getList()
    },
    openEdit () {
      this.isAdd = true
      this.ruleForm = {
        id: '',
        classdate: '',
        weekly: ''
      }
      this.showEdit = true
    },
    // 确 定
    saveEdit () {
      this.loadingSaveEdit = true
      let param = deepClone(this.ruleForm)
      param.classdate = param.classdate ? this.$moment(param.classdate).format('YYYY-MM-DD') : ''
      pbgl
        .changeSave(param)
        .then(res => {
          if (res.msg === '新增成功' || res.msg === '更新成功' || res.msg === '保存成功') {
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
        .changeList({
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
