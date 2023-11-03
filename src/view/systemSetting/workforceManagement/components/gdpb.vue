<template>
  <div class="fixed" ref="gdpb" style="height: 100%; overflow-y: auto; padding: 16px 0">
    <Button type="primary" @click="openEdit('add')">新增排班</Button>
    <Table
      v-loading="loading"
      :columns="columns"
      :data="tableData"
      :disabled-hover="true"
      :max-height="containHeight"
      :span-method="handleSpan"
      style="margin-top: 16px"
    >
      <template #type="{ row }">
        <div v-for="(item, index) in classcateList" :key="index + 'showClasscateList'">
          <span v-if="row.type === item.type">{{ item.name }}</span>
        </div>
      </template>
      <template #period="{ row }">
        {{ row.period === 'am' ? '上午' : '下午' }}
      </template>
    </Table>

    <!-- 新增/编辑 -->
    <el-dialog
      :title="isAdd ? '新增固定排班' : '编辑固定排班'"
      :visible.sync="showEdit"
      width="648px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form class="flex jcsb" ref="ruleForm" :model="ruleForm" :rules="rules" :label-width="60">
        <div style="width: 48%">
          <FormItem label="类别">
            <Select v-model="ruleForm.type" :transfer="true">
              <Option
                v-for="(item, index) in classcateList"
                :value="item.type"
                :label="item.name"
                :key="index + 'classcateList'"
              ></Option>
            </Select>
          </FormItem>
          <FormItem label="时间">
            <Select v-model="ruleForm.period" @on-change="changePeriod" :transfer="true">
              <Option value="am">上午</Option>
              <Option value="pm">下午</Option>
            </Select>
          </FormItem>
          <FormItem label="周次">
            <Select v-model="ruleForm.weekly" :transfer="true">
              <Option value="1">周一</Option>
              <Option value="2">周二</Option>
              <Option value="3">周三</Option>
              <Option value="4">周四</Option>
              <Option value="5">周五</Option>
              <Option value="6">周六</Option>
              <Option value="0">周日</Option>
            </Select>
          </FormItem>
          <FormItem label="医生" prop="doctorid">
            <Select
              v-model="ruleForm.doctorid"
              @on-change="changeDoctor"
              filterable
              placeholder="请输入或选择医生"
            >
              <Option
                v-for="(item, index) in docList"
                :key="index + 'docList'"
                :value="item.doctorid"
                :label="item.docname"
              ></Option>
            </Select>
          </FormItem>
          <FormItem label="预约价格">
            <Input v-model="ruleForm.price" placeholder="请填写预约价格" type="number" />
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
        </div>
        <div style="width: 48%">
          <FormItem label="地址">
            <Input v-model="ruleForm.address" placeholder="请输入地址" />
          </FormItem>
          <FormItem label="开始时段">
            <TimePicker
              :editable="false"
              v-model="ruleForm.kssd"
              confirm
              :steps="[1, 5]"
              format="HH:mm"
              placeholder="请选择开始时段"
            ></TimePicker>
          </FormItem>
          <FormItem label="结束时段">
            <TimePicker
              :editable="false"
              v-model="ruleForm.jssd"
              confirm
              :steps="[1, 5]"
              format="HH:mm"
              placeholder="请选择结束时段"
            ></TimePicker>
          </FormItem>
          <FormItem label="号源个数">
            <Input v-model="ruleForm.hynum" placeholder="请填写号源个数" type="number" />
          </FormItem>
          <FormItem label="生效日期">
            <DatePicker
              :editable="false"
              :value="ruleForm.validdate"
              @on-change="changeDate($event, 'validdate')"
              format="yyyy-MM-dd"
              type="date"
              placeholder="请选择生效日期"
            ></DatePicker>
          </FormItem>
        </div>
        <!-- <FormItem label="停班日期">
          <DatePicker :editable="false" v-model="ruleForm.suspdate" @on-change='changeDate($event, "suspdate")' format="yyyy-MM-dd" type="date" placeholder="请选择停班日期"></DatePicker>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button v-if="!isAdd" type="error" ghost @click="showTB = true">停 班</Button>
        <Button v-if="!isAdd" type="primary" ghost style="margin-left: 8px" @click="deleteItem">
          删 除
        </Button>
        <Button
          type="primary"
          @click="saveEdit"
          style="margin-left: 8px"
          :loading="loadingSaveEdit"
        >
          保 存
        </Button>
      </div>
    </el-dialog>
    <el-dialog
      title="停班终止"
      :visible.sync="showTB"
      width="380px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flex aic">
        <div style="font-size: 14px; width: 70px; margin-right: 8px">停班终止</div>
        <DatePicker
          :editable="false"
          type="date"
          :value="suspdate"
          @on-change="suspdate = $event"
          placeholder="请选择终止日期"
          style="width: 100%"
        ></DatePicker>
      </div>
      <div slot="footer">
        <Button type="primary" @click="stopItem" :loading="loadingStop">保 存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pbgl } from '@/api/systemSetting/pbgl'
import { deepClone } from '@/libs/util'
import { common } from '@/api/index'
export default {
  name: 'gdpb',
  data () {
    return {
      containHeight: 0,
      colorList: [
        {
          color: '#eaf1ff',
          border_color: '#3171FF'
        },
        {
          color: '#eefafb',
          border_color: '#55D2D4'
        },
        {
          color: '#fff5f0',
          border_color: '#FF9C6E'
        },
        {
          color: '#fff8eb',
          border_color: '#FFBD38'
        }
      ],
      columns: [
        {
          title: '类别',
          slot: 'type',
          width: 90
        },
        {
          title: '时间',
          slot: 'period',
          width: 90
        },
        {
          title: '周一',
          key: 'monday',
          render: (h, obj) => {
            var arr = []
            obj.row.monday.map((item, index) => {
              arr.push(
                h(
                  'div',
                  {
                    style: {
                      backgroundColor: this.colorList[index % 4].color,
                      borderLeft: `4px solid ${this.colorList[index % 4].border_color}`
                    },
                    class: 'fixed_cont_active',
                    on: {
                      click: e => {
                        e.stopPropagation()
                        this.openEdit('edit', obj.row, '1', item)
                      }
                    }
                  },
                  `${item.doctorname}`
                )
              )
            })
            return h(
              'div',
              {
                class: 'fixed_txt',
                on: {
                  click: () => {
                    this.openEdit('add', obj.row, '1')
                  }
                }
              },
              [
                h(
                  'div',
                  {
                    class: 'fixed_cont'
                  },
                  arr
                )
              ]
            )
          }
        },
        {
          title: '周二',
          key: 'tuesday',
          render: (h, obj) => {
            var arr = []
            obj.row.tuesday.map((item, index) => {
              arr.push(
                h(
                  'div',
                  {
                    style: {
                      backgroundColor: this.colorList[index % 4].color,
                      borderLeft: `4px solid ${this.colorList[index % 4].border_color}`
                    },
                    class: 'fixed_cont_active',
                    on: {
                      click: e => {
                        e.stopPropagation()
                        this.openEdit('edit', obj.row, '2', item)
                      }
                    }
                  },
                  `${item.doctorname}`
                )
              )
            })
            return h(
              'div',
              {
                class: 'fixed_txt',
                on: {
                  click: () => {
                    this.openEdit('add', obj.row, '2')
                  }
                }
              },
              [
                h(
                  'div',
                  {
                    class: 'fixed_cont'
                  },
                  arr
                )
              ]
            )
          }
        },
        {
          title: '周三',
          key: 'wednesday',
          render: (h, obj) => {
            var arr = []
            obj.row.wednesday.map((item, index) => {
              arr.push(
                h(
                  'div',
                  {
                    style: {
                      backgroundColor: this.colorList[index % 4].color,
                      borderLeft: `4px solid ${this.colorList[index % 4].border_color}`
                    },
                    class: 'fixed_cont_active',
                    on: {
                      click: e => {
                        e.stopPropagation()
                        this.openEdit('edit', obj.row, '3', item)
                      }
                    }
                  },
                  `${item.doctorname}`
                )
              )
            })
            return h(
              'div',
              {
                class: 'fixed_txt',
                on: {
                  click: () => {
                    this.openEdit('add', obj.row, '3')
                  }
                }
              },
              [
                h(
                  'div',
                  {
                    class: 'fixed_cont'
                  },
                  arr
                )
              ]
            )
          }
        },
        {
          title: '周四',
          key: 'thursday',
          render: (h, obj) => {
            var arr = []
            obj.row.thursday.map((item, index) => {
              arr.push(
                h(
                  'div',
                  {
                    style: {
                      backgroundColor: this.colorList[index % 4].color,
                      borderLeft: `4px solid ${this.colorList[index % 4].border_color}`
                    },
                    class: 'fixed_cont_active',
                    on: {
                      click: e => {
                        e.stopPropagation()
                        this.openEdit('edit', obj.row, '4', item)
                      }
                    }
                  },
                  `${item.doctorname}`
                )
              )
            })
            return h(
              'div',
              {
                class: 'fixed_txt',
                on: {
                  click: () => {
                    this.openEdit('add', obj.row, '4')
                  }
                }
              },
              [
                h(
                  'div',
                  {
                    class: 'fixed_cont'
                  },
                  arr
                )
              ]
            )
          }
        },
        {
          title: '周五',
          key: 'friday',
          render: (h, obj) => {
            var arr = []
            obj.row.friday.map((item, index) => {
              arr.push(
                h(
                  'div',
                  {
                    style: {
                      backgroundColor: this.colorList[index % 4].color,
                      borderLeft: `4px solid ${this.colorList[index % 4].border_color}`
                    },
                    class: 'fixed_cont_active',
                    on: {
                      click: e => {
                        e.stopPropagation()
                        this.openEdit('edit', obj.row, '5', item)
                      }
                    }
                  },
                  `${item.doctorname}`
                )
              )
            })
            return h(
              'div',
              {
                class: 'fixed_txt',
                on: {
                  click: () => {
                    this.openEdit('add', obj.row, '5')
                  }
                }
              },
              [
                h(
                  'div',
                  {
                    class: 'fixed_cont'
                  },
                  arr
                )
              ]
            )
          }
        },
        {
          title: '周六',
          key: 'saturday',
          render: (h, obj) => {
            var arr = []
            obj.row.saturday.map((item, index) => {
              arr.push(
                h(
                  'div',
                  {
                    style: {
                      backgroundColor: this.colorList[index % 4].color,
                      borderLeft: `4px solid ${this.colorList[index % 4].border_color}`
                    },
                    class: 'fixed_cont_active',
                    on: {
                      click: e => {
                        e.stopPropagation()
                        this.openEdit('edit', obj.row, '6', item)
                      }
                    }
                  },
                  `${item.doctorname}`
                )
              )
            })
            return h(
              'div',
              {
                class: 'fixed_txt',
                on: {
                  click: () => {
                    this.openEdit('add', obj.row, '6')
                  }
                }
              },
              [
                h(
                  'div',
                  {
                    class: 'fixed_cont'
                  },
                  arr
                )
              ]
            )
          }
        },
        {
          title: '周日',
          key: 'sunday',
          render: (h, obj) => {
            var arr = []
            obj.row.sunday.map((item, index) => {
              arr.push(
                h(
                  'div',
                  {
                    style: {
                      backgroundColor: this.colorList[index % 4].color,
                      borderLeft: `4px solid ${this.colorList[index % 4].border_color}`
                    },
                    class: 'fixed_cont_active',
                    on: {
                      click: e => {
                        e.stopPropagation()
                        this.openEdit('edit', obj.row, '0', item)
                      }
                    }
                  },
                  `${item.doctorname}`
                )
              )
            })
            return h(
              'div',
              {
                class: 'fixed_txt',
                on: {
                  click: () => {
                    this.openEdit('add', obj.row, '0')
                  }
                }
              },
              [
                h(
                  'div',
                  {
                    class: 'fixed_cont'
                  },
                  arr
                )
              ]
            )
          }
        }
      ],
      tableData: [],
      isAdd: true,
      showEdit: false,
      loading: false,
      loadingSaveEdit: false,
      loadingStop: false,
      showTB: false,
      suspdate: '',
      yuanList: [],
      classcateList: [],
      docList: [],
      ruleForm: {},
      rules: {}
    }
  },
  methods: {
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0 && columnIndex === 0) {
        return {
          rowspan: 2,
          colspan: 1
        }
      } else if (rowIndex % 2 === 1 && columnIndex === 0) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    changePeriod (e) {
      if (e === 'am') {
        this.ruleForm.kssd = '08:00'
        this.ruleForm.jssd = '12:00'
      } else {
        this.ruleForm.kssd = '13:30'
        this.ruleForm.jssd = '17:00'
      }
    },
    // 新增
    openEdit (type, row, weekly, item) {
      if (type === 'add') {
        this.isAdd = true
        if (!row) {
          this.ruleForm = {
            ids: '',
            type: 'pt',
            period: 'am',
            kssd: '08:00',
            jssd: '12:00',
            validdate:
              new Date().getFullYear() +
              '-' +
              (new Date().getMonth() + 1) +
              '-' +
              new Date().getDate(),
            doctorid: '',
            weekly: '',
            price: '',
            address: '',
            hospital: '',
            hosptag: '',
            hosparea: ''
          }
        } else {
          this.ruleForm = {
            ids: '',
            type: row.type,
            period: row.period,
            kssd: row.period === 'am' ? '08:00' : '13:30',
            jssd: row.period === 'am' ? '12:00' : '17:00',
            validdate:
              new Date().getFullYear() +
              '-' +
              (new Date().getMonth() + 1) +
              '-' +
              new Date().getDate(),
            doctorid: '',
            weekly,
            price: '',
            address: '',
            hospital: '',
            hosptag: '',
            hosparea: ''
          }
        }
        this.showEdit = true
      } else {
        this.isAdd = false
        pbgl
          .classesDetail({
            id: item.id
          })
          .then(res => {
            let data = res.data
            // this.docList = [{ doctorid: data.doctorid, docname: data.docname }]
            data.hospitalIndex = this.yuanList.findIndex(item => item.name === data.hospital)
            data.ids = data.id
            data.hosptag = this.yuanList[data.hospitalIndex]
              ? this.yuanList[data.hospitalIndex].shorter
              : ''
            data.hosparea = ''
            this.ruleForm = data
            this.showEdit = true
          })
      }
    },
    changeDate (e, index) {
      this.ruleForm[index] = e
    },
    compareDate (first, second) {
      var date = new Date(first)
      var date1 = new Date(second)
      if (date.getTime() - date1.getTime() <= 0) {
        return false
      } else {
        return true
      }
    },
    // 确 定
    saveEdit () {
      if (!this.ruleForm.weekly) {
        this.$Message.error('请选择周次')
        return
      }

      if (this.ruleForm.doctorid === '') {
        this.$Message.error('请选择医生')
        return
      }

      if (this.ruleForm.price === '') {
        this.$Message.error('请填写预约价格')
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

      if (!this.ruleForm.kssd) {
        this.$Message.error('请选择开始时段')
        return
      }

      if (!this.ruleForm.jssd) {
        this.$Message.error('请选择结束时段')
        return
      }

      if (!this.ruleForm.hynum) {
        this.$Message.error('请填写号源个数')
        return
      }

      if (!this.ruleForm.validdate) {
        this.$Message.error('请选择生效日期')
        return
      }

      // if (!this.ruleForm.suspdate) {
      //   this.$Message.error('请选择停班日期')
      //   return
      // }

      // if (this.compareDate(this.ruleForm.validdate, this.ruleForm.suspdate)) {
      //   this.$Message.error('停班日期必须大于等于生效日期')
      //   return
      // }

      this.loadingSaveEdit = true

      let param = deepClone(this.ruleForm)
      delete param.hospitalIndex
      delete param.docname
      delete param.id

      pbgl
        .classesSave({
          jsondata: JSON.stringify(param)
        })
        .then(res => {
          this.$Message.success(res.msg)
          this.showEdit = false
          this.getList()
          this.loadingSaveEdit = false
        })
        .catch(err => {
          console.log('固定排班:', err)
          this.loading = false
          this.loadingSaveEdit = false
        })
    },
    resizeChange () {
      this.containHeight = this.$refs.gdpb.clientHeight - 64
    },
    changeDoctor () {
      let { type, period, doctorid } = this.ruleForm
      pbgl
        .getLastDoctorInfo({
          type,
          period,
          doctorid
        })
        .then(res => {
          let data = res.data
          data.hospitalIndex = this.yuanList.findIndex(item => item.name === data.hospital)
          data.hosptag = this.yuanList[data.hospitalIndex]
            ? this.yuanList[data.hospitalIndex].shorter
            : ''
          this.ruleForm = {
            ...this.ruleForm,
            ...data,
            hosptag: data.hospital
          }
        })
        .catch(err => {
          console.log('固定排班:', err)
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
    getClasscata () {
      common
        .getSelect({
          type: 'classcate'
        })
        .then(res => {
          let data = res.data
          this.classcateList = data.classcate
          data.classcate.forEach(item => {
            this.tableData.push(
              {
                type: item.type,
                typeName: item.name,
                period: 'am',
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: []
              },
              {
                type: item.type,
                typeName: item.name,
                period: 'pm',
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: []
              }
            )
          })
        })
    },
    getClassData () {
      var arr = [
        {
          name: '普通',
          type: 'pt'
        },
        {
          name: '专家',
          type: 'zj'
        },
        {
          name: '专科',
          type: 'zk'
        },
        {
          name: '治疗室',
          type: 'zls'
        }
      ]
      this.classcateList = arr
      arr.forEach(item => {
        this.tableData.push(
          {
            type: item.type,
            typeName: item.name,
            period: 'am',
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          },
          {
            type: item.type,
            typeName: item.name,
            period: 'pm',
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          }
        )
      })
    },
    changeHospital (val) {
      let data = this.yuanList[val]
      this.ruleForm.hosptag = data ? data.shorter : ''
      this.ruleForm.hospital = data ? data.name : ''
      this.ruleForm.address = data ? data.address : ''
      this.ruleForm.hosparea = ''
    },
    stopItem () {
      if (!this.suspdate) {
        this.$Message.error('请选择停班终止日期')
        return
      }

      if (this.compareDate(this.ruleForm.validdate, this.suspdate)) {
        this.$Message.error('停班日期必须大于等于生效日期')
        return
      }

      this.loadingStop = true

      pbgl
        .classesStop({
          ids: this.ruleForm.ids.toString(),
          suspdate: this.suspdate ? this.$moment(this.suspdate).format('YYYY-MM-DD') : ''
        })
        .then(res => {
          this.$Message.success(res.msg)
          this.showTB = false
          this.showEdit = false
          this.getList()
          this.loadingStop = false
        })
        .catch(() => {
          this.loadingStop = false
        })
    },
    deleteItem () {
      this.$confirm('确认是否删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        pbgl
          .dynaDelete({
            ids: this.ruleForm.ids.toString()
          })
          .then(res => {
            this.$Message.success(res.msg)
            this.showEdit = false
            this.getList()
          })
      })
    },
    getList () {
      this.loading = true
      pbgl
        .classesList()
        .then(res => {
          let data = res.data
          this.classcateList.forEach((item, index) => {
            for (const key in data) {
              // console.log('key:', key)
              // 第一层，星期几
              if (Object.hasOwnProperty.call(data, key)) {
                const objItem = data[key]
                // console.log(objItem, 'objItem')
                if (objItem.length === 0) {
                  this.tableData[index][key] = []
                }
                for (const type in objItem) {
                  // console.log('type:', type)
                  // 第二层，类型
                  if (Object.hasOwnProperty.call(objItem, type)) {
                    if (item.type === type) {
                      const itemType = objItem[type]
                      for (const time in itemType) {
                        // console.log('time:', time)
                        // 第三层，时间
                        if (Object.hasOwnProperty.call(itemType, time)) {
                          const itemTime = itemType[time]
                          if (time === 'am') {
                            this.tableData[(index + 1) * 2 - 2][key] = itemTime || []
                          } else if (time === 'pm') {
                            this.tableData[(index + 1) * 2 - 1][key] = itemTime || []
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          })

          this.loading = false
          this.$forceUpdate()
        })
        .catch(err => {
          console.log('固定排班:', err)
          this.loading = false
        })
    },
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
    // this.getClasscata()
    this.getClassData()
    this.getDoctorList()
    this.getHospitalArea()
    this.$nextTick(() => {
      this.getList()
    })

    window.onresize = () => {
      return (() => {
        this.resizeChange()
      })()
    }
    this.$nextTick(() => {
      this.resizeChange()
    })
  }
}
</script>

<style lang="less" scoped>
/deep/ .fixed_txt {
  padding-right: 18px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  .fixed_cont {
    margin: 16px 0;
    width: 100%;
    max-height: 130px;
    overflow-y: auto;
    overflow-x: hidden;
    .fixed_cont_active {
      width: 118px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      font-size: 14px;
      font-weight: 400;
      color: #282d3c;
      margin-bottom: 8px;
      padding-left: 8px;
      box-sizing: border-box;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.fixed {
  /deep/ .ivu-table {
    .ivu-table-header tr {
      th {
        border-right: 1px solid #fff;
        &:last-child {
          border-right: none;
        }
      }
    }
    .ivu-table-body .ivu-table-row:nth-of-type(even) {
      td {
        &:first-child {
          border-left: none;
        }
      }
    }
    .ivu-table-body .ivu-table-row {
      td {
        border-right: 1px solid #d2d7e1;
        &:first-child {
          border-left: 1px solid #d2d7e1;
        }
        .ivu-table-cell {
          height: 100%;
          display: flex;
          align-items: center;
          padding-right: 0;
        }
      }
    }
  }
}
.vertical-center-modal {
  /deep/ .ivu-date-picker {
    width: 100%;
  }
}
</style>
