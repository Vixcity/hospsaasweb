<template>
  <div class="allpatient">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">诊断结果</div>
          <div>
            <Select v-model="diagnose" placeholder="请选择" filterable style="width: 160px">
              <Option
                v-for="(item, index) in diagnoseList"
                :value="item"
                :key="index + 'diagnoseList'"
                :label="item"
              ></Option>
            </Select>
          </div>
        </div>
        <!-- <div class="filterItem">
          <div class="label">脱敏类型</div>
          <div>
            <Select v-model="istuomin" placeholder="请选择" style="width: 150px">
              <Option v-for="item in ywList" :value="item.value" :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </div>
        </div> -->
        <div class="filterItem">
          <div class="label">就诊时间</div>
          <div>
            <Select v-model="time" placeholder="请选择" style="width: 160px">
              <Option v-for="item in timeList" :value="item.value" :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" placeholder="患者姓名/项目名称" icon="ios-search"></Input>
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <!-- <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary">导 入</Button>
          <Button type="primary">导 出</Button>
        </div>
      </div>
    </div> -->
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
    <el-dialog
      title="编辑分组"
      :visible.sync="showEditGroup"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div v-loading="loadingEdit" class="itemContent" style="margin-left: 8px">
        <div class="flex aic">
          <i
            class="iconfont icon-xiajiantou curpor gray"
            style="margin-right: 8px"
            v-if="isExpand"
            @click="isExpand = !isExpand"
          ></i>
          <i
            class="iconfont icon-youjiantou curpor gray"
            style="margin-right: 8px"
            v-else
            @click="isExpand = !isExpand"
          ></i>
          <Checkbox
            :value="checkAll"
            :indeterminate="indeterminate"
            @click.prevent.native="checkAllClick"
          >
            <span style="margin-left: 8px">全选</span>
          </Checkbox>
        </div>
        <div v-if="isExpand">
          <div
            style="margin-left: 16px; margin-top: 10px"
            v-for="(item, index) in groupList"
            :key="index + 'authority'"
          >
            <div class="flex aic" style="height: 18px">
              <i
                class="iconfont icon-xiajiantou curpor gray"
                style="margin-right: 8px"
                v-if="item.isExpand && item.checkAllGroup.length !== 0"
                @click="
                  item.isExpand = !item.isExpand
                  $forceUpdate()
                "
              ></i>
              <i
                class="iconfont icon-youjiantou curpor gray"
                style="margin-right: 8px"
                v-else-if="!item.isExpand && item.checkAllGroup.length !== 0"
                @click="
                  item.isExpand = !item.isExpand
                  $forceUpdate()
                "
              ></i>
              <i style="margin-left: 24px" v-else></i>
              <Checkbox
                :indeterminate="item.indeterminate"
                :value="item.checkAll"
                @click.prevent.native="handleCheckAll(index)"
              >
                <span style="margin-left: 8px">{{ item.title }}</span>
              </Checkbox>
            </div>
            <CheckboxGroup
              class="flex"
              style="padding-left: 40px; flex-direction: column"
              v-model="item.checkAllGroupList"
              v-if="item.checkAllGroup.length !== 0 && item.isExpand"
              @on-change="checkAllGroupChange($event, index)"
            >
              <Checkbox
                v-for="(itemCheck, indexCheck) in item.checkAllGroup"
                :key="indexCheck + 'group' + index"
                style="margin-top: 10px"
                :label="itemCheck.value"
              >
                <span style="margin-left: 8px">{{ itemCheck.label }}</span>
              </Checkbox>
            </CheckboxGroup>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit" :loading="loadingGroup">保 存</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="开具脱敏"
      :visible.sync="showEditTM"
      width="400px"
      @closed="closeEditTM"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <div v-loading="loadingEditTM" class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: 120px">初次治疗日期：</div>
            <DatePicker
              :editable="false"
              v-model="chooseKJTM.firstdate"
              class="itemContent"
              style="width: calc(100% - 120px)"
              type="date"
              :clearable="false"
              placeholder="请选择初次治疗日期"
            ></DatePicker>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: 120px">脱敏药物：</div>
            <Select
              filterable
              :transfer="true"
              style="width: calc(100% - 120px)"
              @on-change="changeMedic"
              v-model="chooseKJTM.tuomin_name"
              placeholder="请选择脱敏药物"
            >
              <Option
                :label-in-value="true"
                v-for="(item, index) in medicList"
                :key="index"
                :value="item.tuomin_name"
                :label="item.tuomin_name"
              ></Option>
            </Select>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: 120px">脱敏方案：</div>
            <Select
              :transfer="true"
              v-model="chooseKJTM.tuomin_tmfa"
              :disabled="chooseKJTM.tuomin_tag === 'cd'"
              style="width: calc(100% - 120px)"
              placeholder="请选择脱敏方案"
            >
              <Option
                v-if="chooseKJTM.tuomin_tag === 'atd' || chooseKJTM.tuomin_tag === 'alg'"
                value="cgfa"
                label="常规方案"
              ></Option>
              <Option value="jqfa" v-if="chooseKJTM.tuomin_tag === 'atd'" label="集群方案"></Option>
              <Option
                value="gmfa"
                v-if="chooseKJTM.tuomin_tag !== 'atd' && chooseKJTM.tuomin_tag !== 'alg'"
                label="高敏方案"
              ></Option>
            </Select>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: 120px">次数：</div>
            <Input
              type="number"
              v-model="chooseKJTM.tuomin_zstotal"
              style="width: calc(100% - 120px)"
              disabled
              placeholder="请先选择脱敏药物和脱敏方案"
            />
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEditTM" :loading="loadingSaveTm">保 存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { allPatient } from '@/api/allPatient/index'
import { treated } from '@/api/treated/index'
import { common } from '@/api/index'
export default {
  name: 'patientList',
  data () {
    return {
      diagnose: 'all',
      loading: false,
      loadingEdit: false,
      isExpand: true,
      showEditGroup: false,
      checkAll: false,
      indeterminate: false,
      showEditTM: false,
      loadingEditTM: false,
      loadingGroup: false,
      loadingSaveTm: false,
      choosePatid: '',
      diagnoseList: [],
      groupList: [],
      medicList: [],
      istuomin: 'all',
      chooseKJTM: {
        firstdate: new Date()
      },
      ywList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'N',
          label: '未脱敏'
        },
        {
          value: 'Y',
          label: '安脱达'
        },
        {
          value: 'Y',
          label: '阿罗格'
        },
        {
          value: 'Y',
          label: '畅迪'
        }
      ],
      time: '',
      timeList: [
        {
          value: 'today',
          label: '今天'
        },
        {
          value: 'week',
          label: '本周'
        },
        {
          value: 'month',
          label: '本月'
        },
        {
          value: 'year',
          label: '今年'
        },
        {
          value: 'all',
          label: '全部'
        }
      ],
      columns: [
        {
          title: '就诊卡号',
          key: 'jzcard',
          minWidth: 120
        },
        {
          title: '姓名',
          key: 'patname',
          minWidth: 80
        },
        {
          title: '分组',
          key: 'groups',
          minWidth: 340
        },
        {
          title: '性别',
          key: 'sex',
          minWidth: 60
        },
        {
          title: '年龄',
          key: 'age',
          minWidth: 60
        },
        // {
        //   title: '联系电话',
        //   key: 'phone',
        //   width: 134
        // },
        {
          title: '诊断',
          key: 'diagnose',
          minWidth: 340
        },
        {
          title: '脱敏类型',
          key: 'tuomin',
          minWidth: 120
        },
        // {
        //   title: '就诊日期',
        //   key: 'presentTime',
        //   width: 240
        // },
        {
          title: '初/复诊',
          key: 'jztype',
          minWidth: 80
        },
        // {
        //   title: '初次就诊日期',
        //   key: 'firstTime',
        //   width: 240
        // },
        {
          title: '操作',
          width: 180,
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
                      this.$router.push({ path: '/detail?patid=' + obj.row.patid })
                    }
                  }
                },
                '详情'
              ),
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
                      this.showEditGroup = true
                      this.loadingEdit = true
                      allPatient
                        .getPatientGroup({
                          patid: obj.row.patid
                        })
                        .then(res => {
                          let data = res.data
                          this.choosePatid = obj.row.patid
                          this.checkAll = false
                          this.indeterminate = false
                          let checkArr = []
                          let indeterminateArr = []
                          data.forEach(item => {
                            item.isExpand = true
                            item.checkAllGroupList = item.sub
                              .filter(itemSon => {
                                return itemSon.isselect === '1'
                              })
                              .map(itemSon => itemSon.id)
                            item.checkAllGroup = item.sub.map(itemSon => {
                              return {
                                label: itemSon.title,
                                value: itemSon.id
                              }
                            })
                            if (item.checkAllGroupList.length === item.checkAllGroup.length) {
                              item.checkAll = true
                              checkArr.push(true)
                            } else if (
                              item.checkAllGroupList.length > 0 &&
                              item.checkAllGroupList.length < item.checkAllGroup.length
                            ) {
                              item.indeterminate = true
                              indeterminateArr.push(true)
                            }
                          })

                          if (checkArr.length === data.length) {
                            this.checkAll = true
                          } else if (
                            indeterminateArr.length > 0 ||
                            (checkArr.length < data.length && checkArr.length > 0)
                          ) {
                            this.indeterminate = true
                          }
                          this.groupList = data
                          this.loadingEdit = false
                        })
                    }
                  }
                },
                '分组'
              ),
              h(
                'span',
                {
                  style: {
                    color: '#3171FF',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      let patid = obj.row.patid
                      this.loadingEditTM = true
                      this.showEditTM = true
                      this.chooseKJTM.patid = obj.row.patid
                      allPatient
                        .kjtmInit({
                          patid
                        })
                        .then(res => {
                          this.chooseKJTM.firstdate = res.data.firstdate
                          this.loadingEditTM = false
                        })
                        .catch(() => {
                          this.loadingEditTM = false
                          this.chooseKJTM.firstdate = this.$moment(new Date()).format('YYYY-MM-DD')
                        })
                    }
                  }
                },
                '开具脱敏'
              )
            ])
          }
        }
      ],
      tableData: [],
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      keyword: ''
    }
  },
  methods: {
    // 当前页数发生改变
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.changeQuery()
    },
    // 每页数量发生改变
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    },
    reset () {
      this.time = 'all'
      this.keyword = ''
      this.diagnose = 'all'
      this.istuomin = 'all'
      this.changeFilter()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.changeQuery()
    },
    changeQuery () {
      localStorage.setItem(
        'patientListQuery',
        JSON.stringify({
          currentPageIdx: this.currentPageIdx,
          pageSize: this.pageSize,
          time: this.time,
          diagnose: this.diagnose,
          istuomin: this.istuomin,
          keyword: this.keyword
        })
      )
      this.getList()
    },
    saveEdit () {
      let arr = []
      this.groupList.forEach(item => {
        arr = arr.concat(
          item.checkAllGroupList.map(itemSon => {
            return { id: itemSon, parentid: item.id }
          })
        )
      })

      this.loadingGroup = true

      allPatient
        .savePatientGroup({
          patid: this.choosePatid,
          groupdata: JSON.stringify(arr)
        })
        .then(res => {
          this.showEditGroup = false
          this.getList()
          this.$Message.success('保存成功')
          this.loadingGroup = false
        })
        .catch(() => {
          this.loadingGroup = false
        })
    },
    // 选择脱敏药物
    changeMedic (e) {
      /**
       * item => 当前选择药物内容
       * e => 药物名称
       */
      let item = this.medicList.find(item => item.tuomin_name === e)
      if (!item) return
      this.chooseKJTM.tuomin_name = item.tuomin_name
      this.chooseKJTM.tuomin_tag = item.tuomin_tag
      this.chooseKJTM.tuomin_tmfa = item.tuomin_tmfa
      this.chooseKJTM.tuomin_zstotal = item.tuomin_zstotal
    },
    saveEditTM () {
      if (!this.chooseKJTM.tuomin_tag) {
        this.$Message.error('请选择脱敏药物')
        return
      }
      if (!this.chooseKJTM.tuomin_tmfa) {
        this.$Message.error('请选择脱敏方案')
        return
      }

      this.loadingSaveTm = true

      allPatient
        .kjtm({
          patid: this.chooseKJTM.patid, // 患者ID
          tuomin_tag: this.chooseKJTM.tuomin_tag, // 脱敏药物
          tuomin_tmfa: this.chooseKJTM.tuomin_tmfa, // 脱敏方案
          tuomin_zstotal: this.chooseKJTM.tuomin_zstotal, // 针数
          firstdate: this.chooseKJTM.firstdate ? this.$moment(this.chooseKJTM.firstdate).format('YYYY-MM-DD') : '' // 初次注射日期
        })
        .then(res => {
          this.showEditTM = false
          this.$Message.success('保存成功')
          this.closeEditTM()
          this.loadingSaveTm = false
        })
        .catch(() => {
          this.loadingSaveTm = false
        })
    },
    closeEditTM () {
      this.chooseKJTM = {
        firstdate: new Date()
      }
    },
    isCheckAll () {
      let chooseLenth = this.groupList.filter(item => {
        return item.checkAll
      }).length

      if (chooseLenth === 0) {
        let chooseSonLenth = this.groupList.filter(item => {
          return item.indeterminate
        }).length

        if (chooseSonLenth === 0) {
          this.checkAll = false
          this.indeterminate = false
        } else {
          this.checkAll = false
          this.indeterminate = true
        }
      } else if (chooseLenth !== this.groupList.length) {
        this.checkAll = false
        this.indeterminate = true
      } else {
        this.checkAll = true
        this.indeterminate = false
      }

      this.$forceUpdate()
    },
    handleCheckAll (index) {
      let item = this.groupList[index]
      if (item.checkAll) {
        item.checkAllGroupList = []
        item.checkAll = false
        item.indeterminate = false
      } else {
        item.checkAllGroupList = JSON.parse(
          JSON.stringify(
            item.checkAllGroup.map(item => {
              return item.value
            })
          )
        )
        item.checkAll = true
        item.indeterminate = false
      }
      this.isCheckAll()
    },
    checkAllGroupChange (data, index) {
      let item = this.groupList[index]
      if (data.length === item.checkAllGroup.length) {
        item.indeterminate = false
        item.checkAll = true
      } else if (data.length > 0) {
        item.indeterminate = true
        item.checkAll = false
      } else {
        item.indeterminate = false
        item.checkAll = false
      }
      this.isCheckAll()
    },
    checkAllClick () {
      this.checkAll = !this.checkAll
      this.indeterminate = false
      this.groupList.forEach(item => {
        item.checkAll = this.checkAll
        item.indeterminate = false
        item.checkAllGroupList = this.checkAll
          ? item.checkAllGroup.map(itemSon => {
            return itemSon.value
          })
          : []
      })
    },
    getList () {
      this.loading = true
      let {
        currentPageIdx = this.currentPageIdx,
        pageSize = this.pageSize,
        time = this.time,
        diagnose = this.diagnose,
        istuomin = this.istuomin,
        keyword = this.keyword
      } = localStorage.getItem('patientListQuery')
        ? JSON.parse(localStorage.getItem('patientListQuery'))
        : {}
      this.currentPageIdx = currentPageIdx
      this.pageSize = pageSize || 10
      this.time = time || 'all'
      this.diagnose = diagnose
      this.istuomin = istuomin
      this.keyword = keyword
      allPatient
        .list({
          page: currentPageIdx,
          limit: pageSize,
          time: time === 'all' ? '' : time,
          keyword: keyword,
          diagnose: diagnose === 'all' ? '' : diagnose,
          istuomin: istuomin === 'all' ? '' : istuomin
        })
        .then(res => {
          let data = res.data
          data.lists.map(item => {
            item.groups = item.groups.join(' | ')
            return item
          })
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
        })
    }
  },
  mounted () {
    common
      .getSelect({
        type: 'diagnose'
      })
      .then(res => {
        this.diagnoseList = res.data.diagnose
      })

    treated
      .writeTMSearch({
        keyword: ''
      })
      .then(res => {
        this.medicList = res.data
      })

    this.getList()
  }
}
</script>
<style lang="less" scoped>
.allpatient {
  padding: 1px 8px 50px;
  box-sizing: border-box;
}
.flexFrom {
  display: flex;
  justify-content: space-between;
  &:first-child {
    margin-top: 0;
  }
  .fromItem {
    .itemLabel {
      text-align: right;
      padding-right: 8px;
      color: #282d3c;
    }
    .itemContent {
      width: 236px;
    }
  }
  .fromItem > div {
    margin-top: 16px;
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>
