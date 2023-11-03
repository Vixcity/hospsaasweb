<template>
  <div class="treated">
    <div class="filterCtn" style="flex: 1150px">
      <div class="itemFather">
        <!-- <div class="filterItem">
          <div class="label">患者</div>
          <div>
            <Select v-model="pattype" style="width: 160px">
              <Option v-for="item in hzList" :value="item.value" :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </div>
        </div> -->
        <div class="filterItem">
          <div class="label">就诊类型</div>
          <div>
            <Select v-model="type" placeholder="请选择就诊类型" style="width: 160px">
              <Option v-for="item in jzlxList" :value="item.value" :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">预约时间</div>
          <div>
            <DatePicker
              :editable="false"
              type="daterange"
              :value="chooseDate"
              @on-change="chooseDate = $event"
              format="yyyy-MM-dd"
              :options="dateList"
              :clearabled="false"
              placement="bottom-end"
              placeholder="请选择就诊时间"
            ></DatePicker>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" placeholder="请输入患者姓名/手机" icon="ios-search"></Input>
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #action="{ row }">
        <span v-if="row.status == '1' || row.status == '2'">
          <span @click="getJZ(row)" class="btn">
            {{ row.status == '1' ? '接诊' : '继续就诊' }}
          </span>
          <span @click="cancel(row)" class="btn">
            {{ row.status == '1' ? '就诊完成' : '取消接诊' }}
          </span>
        </span>
        <span v-else>
          <span @click="getDetail(row)" class="btn">详情</span>
        </span>
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
      title="取消原因"
      :visible.sync="showCancel"
      width="370px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom flex">
        <!-- 左边 -->
        <div class="fromItem black">
          <div class="flex aic">
            <div class="itemLabel" style="width: 60px; text-align: right">取消原因</div>
            <div class="itemContent">
              <Input
                v-model="reason"
                placeholder="请输入取消原因"
                style="width: 260px; margin-left: 8px"
              />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="conformCancel">确认取消</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treated } from '@/api/treated/index'
export default {
  name: 'treated',
  data () {
    var showjzno = JSON.parse(localStorage.getItem('userInfo')).showjzno
    var columns =
      showjzno === 'Y'
        ? [
          {
            title: '就诊卡号',
            key: 'jzcard',
            minWidth: 120
          },
          {
            title: '编号',
            key: 'jzno',
            minWidth: 120
          },
          {
            title: '姓名',
            key: 'patname',
            minWidth: 80
          },
          {
            title: '年龄',
            key: 'age',
            minWidth: 80
          },
          {
            title: '性别',
            key: 'sex',
            minWidth: 80
          },
          {
            title: '就诊类型',
            key: 'visittype',
            minWidth: 120
          },
          {
            title: '就诊时间',
            key: 'jztime',
            minWidth: 200
          },
          {
            title: '预约时间',
            key: 'yytime',
            minWidth: 200
          },
          {
            title: '就诊医生',
            key: 'docname',
            minWidth: 100
          },
          {
            title: '状态',
            key: 'status',
            minWidth: 120,
            render: (h, obj) => {
              return h('div', [
                h('div', {
                  style: {
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor:
                        obj.row.status === 1
                          ? '#FFBD38'
                          : obj.row.status === 2
                            ? '#00D48A'
                            : obj.row.status === 3
                              ? '#D2D7E1'
                              : '#F75559',
                    display: 'inline-block',
                    marginRight: '10px'
                  }
                }),
                obj.row.status === 1
                  ? '待接诊'
                  : obj.row.status === 2
                    ? '接诊中'
                    : obj.row.status === 3
                      ? '已完成'
                      : '已取消'
              ])
            }
          },
          {
            title: '操作',
            key: 'do',
            slot: 'action',
            fixed: 'right',
            minWidth: 180
          }
        ]
        : [
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
            title: '年龄',
            key: 'age',
            minWidth: 80
          },
          {
            title: '性别',
            key: 'sex',
            minWidth: 80
          },
          {
            title: '就诊类型',
            key: 'visittype',
            minWidth: 120
          },
          {
            title: '就诊时间',
            key: 'jztime',
            minWidth: 200
          },
          {
            title: '预约时间',
            key: 'yytime',
            minWidth: 200
          },
          {
            title: '就诊医生',
            key: 'docname',
            minWidth: 100
          },
          {
            title: '状态',
            key: 'status',
            minWidth: 120,
            render: (h, obj) => {
              return h('div', [
                h('div', {
                  style: {
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor:
                        obj.row.status === 1
                          ? '#FFBD38'
                          : obj.row.status === 2
                            ? '#00D48A'
                            : obj.row.status === 3
                              ? '#D2D7E1'
                              : '#F75559',
                    display: 'inline-block',
                    marginRight: '10px'
                  }
                }),
                obj.row.status === 1
                  ? '待接诊'
                  : obj.row.status === 2
                    ? '接诊中'
                    : obj.row.status === 3
                      ? '已完成'
                      : '已取消'
              ])
            }
          },
          {
            title: '操作',
            key: 'do',
            slot: 'action',
            fixed: 'right',
            minWidth: 180
          }
        ]
    return {
      showCancel: false,
      appointid: '',
      reason: '',
      hzList: [
        {
          value: 'all',
          label: '全部患者'
        },
        {
          value: '1',
          label: '待接诊患者'
        },
        {
          value: '2',
          label: '接诊中患者'
        },
        {
          value: '3',
          label: '已完成患者'
        },
        {
          value: '4',
          label: '已取消患者'
        }
      ],
      pattype: 'all',
      jzlxList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'second',
          label: '复诊'
        },
        {
          value: 'first',
          label: '初诊'
        }
      ],
      type: 'all',
      dateList: {
        shortcuts: [
          {
            text: '今天',
            value: () => {
              const start = this.$moment().startOf('day')._d
              return [start, start]
            }
          },
          {
            text: '本周',
            value: () => {
              const start = this.$moment().startOf('week').add(1, 'day')._d
              const end = this.$moment().endOf('week').add(1, 'day')._d
              return [start, end]
            }
          },
          {
            text: '本月',
            value: () => {
              const start = this.$moment().startOf('month')._d
              const end = this.$moment().endOf('month')._d
              return [start, end]
            }
          },
          {
            text: '今年',
            value () {
              const start = new Date().getFullYear() + '01-01'
              const end = new Date().getFullYear() + '12-31'
              return [start, end]
            }
          }
        ]
      },
      chooseDate: [
        this.$moment().startOf('day').format('YYYY-MM-DD'),
        this.$moment().startOf('day').format('YYYY-MM-DD')
      ],
      keyword: '',
      columns,
      tableData: [],
      pageNum: 0,
      currentPageIdx: 1,
      loading: false,
      pageSize: 10
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
    changeFilter () {
      this.currentPageIdx = 1
      this.changeQuery()
    },
    changeQuery () {
      localStorage.setItem(
        'treatedQuery',
        JSON.stringify({
          currentPageIdx: this.currentPageIdx,
          pageSize: this.pageSize,
          type: this.type,
          startdate: this.chooseDate[0]
            ? this.$moment(this.chooseDate[0]).format('YYYY-MM-DD')
            : '',
          enddate: this.chooseDate[1] ? this.$moment(this.chooseDate[1]).format('YYYY-MM-DD') : '',
          keyword: this.keyword
        })
      )
      this.getList()
    },
    reset () {
      this.type = 'all'
      this.pattype = 'all'
      this.keyword = ''
      this.currentPageIdx = 1
      this.chooseDate = [
        this.$moment().startOf('day').format('YYYY-MM-DD'),
        this.$moment().startOf('day').format('YYYY-MM-DD')
      ]
      this.changeQuery()
    },
    // 接诊
    getJZ (row) {
      if (row.status === 1) {
        treated
          .diagroomAccept({
            appointid: row.appointid
          })
          .then(res => {
            this.loading = true
            this.$router.push({
              path: '/patient?patid=' + row.patid + '&appointid=' + row.appointid
            })
          })
      } else {
        this.$router.push({
          path: '/patient?patid=' + row.patid + '&appointid=' + row.appointid
        })
      }
    },
    // 详情
    getDetail (row) {
      this.$router.push({ path: '/detail?patid=' + row.patid })
    },
    getList () {
      this.loading = true
      let {
        currentPageIdx = this.currentPageIdx,
        pageSize = this.pageSize,
        type = this.type,
        startdate = this.chooseDate[0] ? this.$moment(this.chooseDate[0]).format('YYYY-MM-DD') : '',
        enddate = this.chooseDate[1] ? this.$moment(this.chooseDate[1]).format('YYYY-MM-DD') : '',
        keyword = this.keyword
      } = localStorage.getItem('treatedQuery')
        ? JSON.parse(localStorage.getItem('treatedQuery'))
        : {}
      this.currentPageIdx = currentPageIdx
      this.pageSize = pageSize
      this.type = type
      this.chooseDate = [startdate, enddate]
      this.keyword = keyword
      treated
        .treatedList({
          page: currentPageIdx,
          limit: pageSize,
          // pattype: this.pattype === 'all' ? '' : this.pattype,
          patid: '',
          type: type === 'all' ? '' : type,
          startdate: startdate === 'Invalid date' ? '' : startdate,
          enddate: enddate === 'Invalid date' ? '' : enddate,
          keyword
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
        })
    },
    cancel (row) {
      this.appointid = row.appointid

      if (row.status === 2) {
        this.showCancel = true
      } else if (row.status === 1) {
        this.$confirm('是否确认完成就诊?', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          common
            .ajaxConfirmFinish({
              appointid: row.appointid
            })
            .then(res => {
              this.$Message.success('就诊完成')
              this.getList()
              // this.$router.go(-1)
            })
          // row.status = '4'
        })
      }
    },
    conformCancel () {
      treated
        .cancel({
          reason: this.reason,
          appointid: this.appointid
        })
        .then(res => {
          // let data = res.data
          // console.log(data)
          this.showCancel = false
          this.getList()
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './treated.less';
</style>
<style scoped>
.btn {
  font-size: 14px;
  font-weight: 400;
  color: #3171ff;
  line-height: 14px;
  cursor: pointer;
  margin-right: 16px;
}
</style>
