<template>
  <div class="stop">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">医生姓名</div>
          <div>
            <Input v-model="doctor" placeholder="医生姓名" icon="ios-search"></Input>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">停诊日期</div>
          <div>
            <DatePicker
              :editable="false"
              type="date"
              style="width: 100%"
              placeholder="请选择"
              v-model="ruleForm.repairTime"
            ></DatePicker>
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
          <Button type="primary" @click="openEdit('add')">新增停诊</Button>
        </div>
      </div>
    </div>
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
      width="470px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form ref="ruleForm" :model="ruleForm" :rules="rules" :label-width="60">
        <FormItem label="医生" prop="doctorid">
          <Select
            v-model="ruleForm.doctorid"
            filterable
            placeholder="请输入医生的名字进行搜索"
            remote
            :remote-method="getDoctorList"
            :loading="loadingSearch"
          >
            <Option
              v-for="(item, index) in docList"
              :key="index + 'docList'"
              :value="item.doctorid"
              :label="item.docname"
            ></Option>
          </Select>
        </FormItem>
        <FormItem label="停诊日期" prop="stopdate">
          <DatePicker
            :editable="false"
            type="date"
            style="width: 100%"
            placeholder="请选择"
            :transfer="true"
            :value="ruleForm.stopdate"
            format="yyyy-MM-dd"
            @on-change="ruleForm.stopdate = $event"
          ></DatePicker>
        </FormItem>
        <FormItem label="停诊时间" prop="period">
          <Select v-model="ruleForm.period" :transfer="true" placeholder="请选择">
            <Option value="all">全天</Option>
            <Option value="am">上午</Option>
            <Option value="pm">下午</Option>
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
import { common } from '@/api/index'
import { debounce } from '@/libs/util'
export default {
  name: 'tzjh',
  data () {
    return {
      doctor: '',
      date: '',
      docList: [],
      columns: [
        {
          title: '医生',
          key: 'doctorname'
        },
        {
          title: '停诊日期',
          key: 'stopdate'
        },
        {
          title: '停诊时间',
          key: 'periodname'
        },
        {
          title: '操作',
          width: 120,
          fixed: 'right',
          render: (h, obj) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    color: '#3171FF',
                    cursor: 'pointer',
                    marginRight: '16px'
                  },
                  on: {
                    click: () => {
                      this.openEdit('edit', obj.row)
                    }
                  }
                },
                '编辑'
              ),
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
                          .stopDelete({
                            id: obj.row.id
                          })
                          .then(res => {
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
      loading: false,
      loadingSearch: false,
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
      this.pageIndex = 1
      this.getList()
    },
    reset () {
      this.doctor = ''
      this.changeFilter()
    },
    // 新增
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.ruleForm = {
          doctorid: '',
          id: '',
          stopdate: '',
          period: ''
        }
      } else {
        this.isAdd = false
        this.docList = [
          {
            doctorid: row.doctorid,
            docname: row.doctorname
          }
        ]
        this.ruleForm = {
          doctorid: row.doctorid,
          id: row.id,
          stopdate: row.stopdate,
          period: row.period
        }
      }
      this.showEdit = true
    },
    // 确 定
    saveEdit () {
      this.loadingSaveEdit = true
      pbgl
        .stopSave({
          doctorid: this.ruleForm.doctorid,
          id: this.ruleForm.id,
          stopdate: this.ruleForm.stopdate
            ? this.$moment(this.ruleForm.stopdate).format('YYYY-MM-DD')
            : '',
          period: this.ruleForm.period
        })
        .then(res => {
          this.$Message.success(res.msg)
          this.showEdit = false
          this.getList()
          this.loadingSaveEdit = false
        })
        .catch(() => {
          this.loadingSaveEdit = false
        })
    },
    getList () {
      this.loading = true
      pbgl
        .stopList({
          doctor: this.doctor,
          page: this.currentPageIdx,
          limit: this.pageSize,
          date: this.date
        })
        .then(res => {
          let data = res.data
          this.pageNum = data.total
          this.tableData = data.lists
          this.loading = false
        })
        .catch(err => {
          console.log('停诊计划:', err)
          this.loading = false
        })
    },
    getDoctorList: debounce(function (val) {
      if (val === '') {
        this.docList = []
        return
      }
      this.loadingSearch = true
      common
        .getDocList({
          keyword: val || ''
        })
        .then(res => {
          let data = res.data
          this.docList = data
          this.loadingSearch = false
        })
    }, 500)
  },
  mounted () {
    this.getList()
  }
}
</script>
