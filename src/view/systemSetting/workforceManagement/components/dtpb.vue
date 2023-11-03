<template>
  <div class="dynamic" style="padding-top: 16px">
    <!-- <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem" style="margin-top: 0">
          <div class="label">搜索</div>
          <div>
            <Input v-model="searchText" placeholder="人员姓名/人员账号" icon="ios-search"></Input>
          </div>
        </div>
        <div class="filterItem" style="margin-top: 0">
          <Button type="primary">查 询</Button>
          <Button>重 置</Button>
        </div>
      </div>
    </div> -->
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem" style="margin-top: 0">
          <Button type="primary" @click="openEdit('add')">添加动态排班</Button>
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
      :title="isAdd ? '新增动态排班' : '编辑动态排班'"
      :visible.sync="showEdit"
      width="470px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form
        ref="ruleForm"
        v-loading="loadingEdit"
        :model="ruleForm"
        :rules="rules"
        :label-width="60"
      >
        <FormItem label="医生" prop="doctorid">
          <Select v-model="ruleForm.doctorid" filterable placeholder="请输入或选择医生">
            <Option
              v-for="(item, index) in docList"
              :key="index + 'docList'"
              :value="item.doctorid"
              :label="item.docname"
            ></Option>
          </Select>
          <!-- <Select
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
          </Select> -->
        </FormItem>
        <FormItem label="类型" prop="type">
          <Select v-model="ruleForm.type" placeholder="请选择类型">
            <Option value="pt">普通</Option>
            <Option value="zj">专家</Option>
            <Option value="tx">特需</Option>
          </Select>
        </FormItem>
        <FormItem label="号源个数" prop="hynum">
          <Input v-model="ruleForm.hynum" placeholder="请填写号源个数" type="number" />
        </FormItem>
        <FormItem label="日期" prop="classdate">
          <DatePicker
            :editable="false"
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="yyyy-MM-dd"
            :value="ruleForm.classdate"
            :transfer="true"
            @on-change="ruleForm.classdate = $event"
          ></DatePicker>
        </FormItem>
        <FormItem label="时间">
          <Select v-model="ruleForm.period" @on-change="changePeriod" :transfer="true">
            <Option value="am">上午</Option>
            <Option value="pm">下午</Option>
          </Select>
        </FormItem>
        <FormItem label="时间范围" prop="starttime">
          <TimePicker
            :editable="false"
            format="HH:mm"
            placeholder="请选择"
            style="width: 100%"
            type="timerange"
            :transfer="true"
            v-model="ruleForm.timerange"
          ></TimePicker>
        </FormItem>
        <FormItem label="院区" prop="hospital">
          <Select
            v-model="ruleForm.hospitalIndex"
            :transfer="true"
            placeholder="请选择"
            @on-change="changeHospital"
          >
            <Option
              v-for="(item, index) in yuanList"
              :key="index + 'hospital'"
              :value="index"
              :label="item.name"
            ></Option>
          </Select>
        </FormItem>
        <FormItem label="地址" prop="address">
          <Input v-model="ruleForm.address" placeholder="请输入地址"></Input>
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
import { deepClone } from '@/libs/util'
export default {
  name: 'dtpb',
  data () {
    return {
      searchText: '',
      columns: [
        {
          title: '医生',
          key: 'doctorname'
        },
        {
          title: '日期',
          key: 'classdate'
        },
        {
          title: '开始时间',
          key: 'starttime'
        },
        {
          title: '结束时间',
          key: 'endtime'
        },
        {
          title: '院区',
          key: 'hospital'
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
                          .dynaDelete({
                            ids: obj.row.id.toString()
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
      isAdd: true,
      showEdit: false,
      loadingEdit: false,
      loadingSearch: false,
      loadingSaveEdit: false,
      loading: false,
      docList: [],
      yuanList: [],
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
    changePeriod (e) {
      if (e === 'am') {
        this.ruleForm.timerange = ['08:00', '12:00']
      } else {
        this.ruleForm.timerange = ['13:30', '17:00']
      }
      this.$forceUpdate()
    },
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.showEdit = true
        this.ruleForm = {
          id: '',
          doctorid: '',
          type: '',
          period: 'am',
          classdate: '',
          starttime: '',
          timerange: ['08:00', '12:00'],
          hynum: '',
          endtime: '',
          address: '',
          hospital: '',
          hosptag: '',
          hosparea: ''
        }
      } else {
        this.isAdd = false
        pbgl
          .dynaDetail({
            id: row.id
          })
          .then(res => {
            let data = res.data
            // this.docList = [{ doctorid: data.doctorid, docname: data.doctorname }]
            data.timerange = [data.starttime, data.endtime]
            data.hospitalIndex = this.yuanList.findIndex(item => item.name === data.hospital)
            this.ruleForm = data
            this.loadingEdit = false
          })
        this.showEdit = true
        this.loadingEdit = true
      }
    },
    saveEdit () {
      if (this.ruleForm.doctorid === '') {
        this.$Message.error('请选择医生')
        return
      }

      if (!this.ruleForm.type) {
        this.$Message.error('请选择类型')
        return
      }

      if (!this.ruleForm.classdate) {
        this.$Message.error('请选择日期')
        return
      }

      if (!this.ruleForm.timerange || this.ruleForm.timerange === 0) {
        this.$Message.error('请选择时间范围')
        return
      }

      if (!this.ruleForm.hospital) {
        this.$Message.error('请选择院区')
        return
      }

      if (!this.ruleForm.address) {
        this.$Message.error('请填写地址')
        return
      }

      this.ruleForm.starttime = this.ruleForm.timerange[0]
      this.ruleForm.endtime = this.ruleForm.timerange[1]

      this.loadingSaveEdit = true

      let param = deepClone(this.ruleForm)
      delete param.timerange
      delete param.hospitalIndex
      delete param.weekname
      delete param.doctorname
      param.classdate = param.classdate ? this.$moment(param.classdate).format('YYYY-MM-DD') : ''

      pbgl
        .dynaSave({
          jsondata: JSON.stringify(param)
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
    getHospitalArea () {
      common
        .getSelect({
          type: 'yuan'
        })
        .then(res => {
          let data = res.data
          this.yuanList = data.yuan
        })
    },
    changeHospital (val) {
      let data = this.yuanList[val]
      this.ruleForm.hosptag = data ? data.shorter : ''
      this.ruleForm.hospital = data ? data.name : ''
      this.ruleForm.address = data ? data.address : ''
      this.ruleForm.hosparea = ''
    },
    getList () {
      this.loading = true
      pbgl
        .dynaList({
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
          console.log('动态排班:', err)
          this.loading = false
        })
    },
    // getDoctorList: debounce(function (val) {
    //   if (val === '') {
    //     this.docList = []
    //     return
    //   }
    //   this.loadingSearch = true
    //   common
    //     .getDocList({
    //       keyword: val || ''
    //     })
    //     .then(res => {
    //       let data = res.data
    //       this.docList = data
    //       this.loadingSearch = false
    //     })
    // }, 500),
    getDoctorList (val) {
      common
        .getDocList({
          keyword: val || ''
        })
        .then(res => {
          this.docList = res.data
        })
    }
  },
  mounted () {
    this.getList()
    this.getHospitalArea()
    this.getDoctorList()
  }
}
</script>
