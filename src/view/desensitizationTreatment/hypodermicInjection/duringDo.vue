<template>
  <div class="duringDo">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" search placeholder="患者姓名/手机号" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #realdose="{ row }">
        <span :style="row.zsdose == row.realdose ? '' : 'color: red;'">{{ row.realdose }}</span>
      </template>
      <template #pefq="{ row }">
        <span>{{ row.pefq }}</span>
        <span
          v-if="row.pefyj && row.pefyj != '-'"
          :style="`color: ${$percentage(row.pefq, row.pefyj).color}`"
        >
          ({{ $percentage(row.pefq, row.pefyj).val }})
        </span>
      </template>
      <template #fenzhen="{ row }">
        {{ row.fenzhen === 'Y' ? '是' : '否' }}
      </template>
      <template #keepend="{ row }">
        <countDown :datetime="row.keepend"></countDown>
      </template>
      <template #action="{ row }">
        <div class="flex">
          <!-- <div class="btn">编辑</div> -->
          <div class="btn" @click="doEdit(row)">留观完成</div>
        </div>
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
      title="留观完成-记录反应"
      :visible.sync="showJLFY"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flex info">
        <div>姓名：{{ chooseZSJL.realname }}</div>
        <div>性别：{{ chooseZSJL.gender }}</div>
        <div>年龄：{{ chooseZSJL.age }}</div>
        <div>脱敏药物：{{ chooseZSJL.medicine }}</div>
        <div>脱敏方案：{{ chooseZSJL.scheme }}</div>
        <div>注射瓶号：{{ chooseZSJL.zsnum }}</div>
        <div>注射剂量（ml）：{{ chooseZSJL.zsdose }}</div>
        <div>实际注射剂量（ml）：{{ chooseZSJL.realdose }}</div>
        <div>剩余针数：{{ chooseZSJL.synum }}</div>
        <div>PEF预计值：{{ chooseZSJL.pefyj }}</div>
      </div>
      <div class="line"></div>
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div
              class="itemLabel"
              :style="{ width: `calc(100% - ${chooseZSJL.isdevice === 'Y' ? 215 : 236}px)` }"
            >
              PEF(后)
            </div>
            <div class="itemContent">
              <Input
                v-model="chooseZSJL.pefh"
                placeholder="请填写PEF(后)"
                type="number"
                style="width: 100%"
              />
            </div>
            <div
              v-if="chooseZSJL.isdevice === 'Y'"
              style="width: calc(100% - 310px)"
              v-loading="loadingTest"
            >
              <div class="injection_edit" @click="willPolling">检测</div>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">PEF(后)%</div>
            <div class="itemContent">
              <input
                :value="$percentage(chooseZSJL.pefh || 0, chooseZSJL.pefyj).val"
                :style="`width: 100%; height: 100%; padding-left: 7px; color: ${
                  $percentage(chooseZSJL.pefh || 0, chooseZSJL.pefyj).color
                }`"
                disabled
              />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应风团大小</div>
            <div class="itemContent">
              <div
                @click="showFT = true"
                style="
                  display: block;
                  height: 30px;
                  line-height: 30px;
                  font-size: 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  padding-left: 8px;
                  padding-right: 24px;
                  background-color: #fff;
                  border-radius: 4px;
                  border: 1px solid #dcdee2;
                  position: relative;
                  cursor: pointer;
                "
                :class="chooseZSJL.jkftsize ? 'black' : 'disabled'"
              >
                {{ chooseZSJL.jkftsize || '请选择' }}
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
              </div>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应时间</div>
            <div class="itemContent">
              <TimePicker
                :editable="false"
                format="HH:mm"
                v-model="chooseZSJL.jktime"
                placeholder="请选择即刻反应时间"
                style="width: 100%"
              ></TimePicker>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应记录</div>
            <div class="itemContent">
              <div class="itemContent">
                <div
                  @click="showJKRec = true"
                  style="
                    display: block;
                    height: 30px;
                    line-height: 30px;
                    font-size: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding-left: 8px;
                    padding-right: 24px;
                    background-color: #fff;
                    border-radius: 4px;
                    border: 1px solid #dcdee2;
                    position: relative;
                    cursor: pointer;
                  "
                  :class="chooseZSJL.jkrecord ? 'black' : 'disabled'"
                >
                  {{ chooseZSJL.jkrecord || '请选择' }}
                  <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应记录处理</div>
            <div class="itemContent">
              <div
                @click="showHandle = true"
                style="
                  display: block;
                  height: 30px;
                  line-height: 30px;
                  font-size: 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  padding-left: 8px;
                  padding-right: 24px;
                  background-color: #fff;
                  border-radius: 4px;
                  border: 1px solid #dcdee2;
                  position: relative;
                  cursor: pointer;
                "
                :class="chooseZSJL.jkhandle ? 'black' : 'disabled'"
              >
                {{ chooseZSJL.jkhandle || '请选择' }}
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
              </div>
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="fromItem">
          <div class="flex jcsb aic" v-if="chooseZSJL.isend === 'Y'">
            <div class="itemLabel" style="width: calc(100% - 236px)">下次注射日期</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                v-model="chooseZSJL.nextdate"
                type="date"
                format="yyyy-MM-dd"
                @on-change="chooseZSJL.nextdate = $event"
                placeholder="下次注射日期"
                style="width: 100%"
              ></DatePicker>
            </div>
          </div>
          <div class="flex jcsb aic" v-if="chooseZSJL.isend === 'Y'">
            <div class="itemLabel" style="width: calc(100% - 236px)">下次注射时间</div>
            <div class="itemContent">
              <Select v-model="chooseZSJL.nexttime" style="width: 100%">
                <Option value="上午">上午</Option>
                <Option value="下午">下午</Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">备注</div>
            <div class="itemContent">
              <Input
                v-model="chooseZSJL.remark"
                placeholder="请填写备注"
                type="textarea"
                :rows="4"
              />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <span v-if="chooseZSJL.deviceno" class="blue" style="margin-right: 8px">
          设备号：{{ chooseZSJL.deviceno }}
        </span>
        <Button
          type="primary"
          v-if="chooseZSJL.isdevice === 'Y'"
          @click="openBind"
          style="margin-right: 8px"
        >
          绑定设备
        </Button>
        <Button type="primary" @click="finishJL" :loading="loadingLGWC">留观完成</Button>
      </div>
    </el-dialog>
    <!-- 即刻反应风团大小 -->
    <ftSizeModal
      type="jk"
      :show="showFT"
      :size="chooseZSJL.jkftsize"
      @close="closeFT"
      @save="saveFT"
    />
    <!-- 即刻反应记录 -->
    <ftReactionRecord
      type="jk"
      :show="showJKRec"
      :info="chooseZSJL.jkrecord"
      @close="closeJKRec"
      @save="saveJKRec"
    />
    <el-dialog
      title="即刻反应处理方式"
      :visible.sync="showHandle"
      width="630px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <CheckboxGroup v-model="chooseHandle.fyclfs" style="margin-bottom: 22px">
        <div class="gray" style="margin-bottom: 8px">反应处理方式</div>
        <Checkbox style="margin-right: 40px" label="抗组胺药"></Checkbox>
        <Checkbox style="margin-right: 40px" label="糖皮质激素"></Checkbox>
        <Checkbox style="margin-right: 40px" label="局部处理（冰敷）"></Checkbox>
        <Checkbox style="margin-right: 40px" label="β受体激动剂（雾化）"></Checkbox>
      </CheckboxGroup>
      <CheckboxGroup v-model="chooseHandle.zdy" style="margin-bottom: 22px">
        <div class="gray" style="margin-bottom: 8px">自定义</div>
        <Checkbox style="margin-right: 40px" label="外涂尤卓尔"></Checkbox>
        <Checkbox style="margin-right: 40px" label="口服：留观1小时"></Checkbox>
        <Checkbox style="margin-right: 40px" label="万托林2吸吸入"></Checkbox>
        <Checkbox style="margin-right: 40px" label="氯雷他定1片口服"></Checkbox>
        <Checkbox style="margin-right: 40px" label="舒利迭1吸"></Checkbox>
      </CheckboxGroup>
      <div class="gray" style="margin-bottom: 8px">其他</div>
      <Input type="textarea" v-model="chooseHandle.text"></Input>
      <div slot="footer">
        <Button type="primary" @click="closeHandle">确 定</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="绑定设备"
      :visible.sync="isShowBind"
      width="320px"
      :close-on-click-modal="false"
      :before-close="closeBind"
      class="vertical-center-modal"
    >
      <div>
        <div class="flex jcsb aic">
          <div class="itemLabel" style="width: calc(100% - 220px)">设备号</div>
          <div class="itemContent">
            <Select style="width: 220px" clearable v-model="deviceno" placeholder="请选择设备号">
              <Option
                v-for="(item, index) in devicenoList"
                :key="index + 'devicenoList'"
                :label="item"
                :value="item"
              ></Option>
            </Select>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveBind">保存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pxzs } from '@/api/desensitizationTreatment/index'
import countDown from '@/components/countdown/countdown'
import ftSizeModal from '../../../components/ftSizeModal/ftSizeModal.vue'
import ftReactionRecord from '../../../components/ftReactionRecord/ftReactionRecord.vue'
export default {
  name: 'duringDo',
  components: {
    countDown,
    ftSizeModal,
    ftReactionRecord
  },
  data () {
    var showjzno = JSON.parse(localStorage.getItem('userInfo')).showjzno
    var columns = showjzno === 'Y' ? [
      {
        key: 'jzcard',
        title: '就诊卡号',
        width: 110
      },
      {
        key: 'jzno',
        title: '编号',
        width: 110
      },
      {
        key: 'realname',
        title: '姓名',
        width: 100
      },
      {
        key: 'zsweek',
        title: '周次',
        width: 80
      },
      {
        key: 'zsnum',
        title: '注射瓶号',
        width: 100
      },
      {
        key: 'zsdose',
        title: '注射剂量（ml）',
        width: 140
      },
      {
        title: '实际注射（ml）',
        slot: 'realdose',
        width: 140
      },
      {
        key: 'synum',
        title: '剩余针数',
        minWidth: 100
      },
      {
        key: 'pefq',
        title: 'PEF（前）',
        slot: 'pefq',
        minWidth: 100
      },
      // {
      //   key: 'pefh',
      //   title: 'PEF（后）',
      //   width: 120
      // },
      {
        slot: 'fenzhen',
        title: '分针',
        minWidth: 80
      },
      {
        key: 'zssite',
        title: '注射部位',
        minWidth: 100
      },
      {
        slot: 'keepend',
        title: '留观时间',
        width: 100
      },
      {
        slot: 'action',
        title: '操作',
        fixed: 'right',
        width: 90
      }
    ] : [
      {
        key: 'jzcard',
        title: '就诊卡号',
        width: 110
      },
      {
        key: 'realname',
        title: '姓名',
        width: 100
      },
      {
        key: 'zsweek',
        title: '周次',
        width: 80
      },
      {
        key: 'zsnum',
        title: '注射瓶号',
        width: 100
      },
      {
        key: 'zsdose',
        title: '注射剂量（ml）',
        width: 140
      },
      {
        title: '实际注射（ml）',
        slot: 'realdose',
        width: 140
      },
      {
        key: 'synum',
        title: '剩余针数',
        minWidth: 100
      },
      {
        key: 'pefq',
        title: 'PEF（前）',
        slot: 'pefq',
        minWidth: 100
      },
      // {
      //   key: 'pefh',
      //   title: 'PEF（后）',
      //   width: 120
      // },
      {
        slot: 'fenzhen',
        title: '分针',
        minWidth: 80
      },
      {
        key: 'zssite',
        title: '注射部位',
        minWidth: 100
      },
      {
        slot: 'keepend',
        title: '留观时间',
        width: 100
      },
      {
        slot: 'action',
        title: '操作',
        fixed: 'right',
        width: 90
      }
    ]
    return {
      pageNum: 0,
      showJLFY: false,
      loading: false,
      showFT: false,
      showJKRec: false,
      showHandle: false,
      loadingLGWC: false,
      isShowBind: false,
      loadingTest: false,
      currentPageIdx: 1,
      pageSize: 10,
      keyword: '',
      devicenoList: [],
      deviceno: '',
      pollingInterval: null,
      pollCount: 0,
      chooseHandle: {},
      recList: [
        {
          title: '即刻局部反应',
          list: ['注射部位肿胀', '热', '疼痛', '瘙痒', '活动受限', '红斑']
        },
        {
          title: '全身非特异性反应',
          list: ['发热', '疲倦', '关节痛', '头痛', '头晕', '嗜睡', '上腹痛']
        },
        {
          title: '哮喘症状',
          list: ['喘息', '咳嗽', '胸闷', '气闭', '咽痒不适']
        },
        {
          title: '鼻炎症状',
          list: ['鼻痒', '喷嚏', '流涕', '鼻塞', '鼻干']
        },
        {
          title: '过敏性结膜炎症状',
          list: ['眼痒', '流泪', '结膜充血', '畏光', '眼肿']
        },
        {
          title: '过敏性皮炎',
          list: ['荨麻疹', '湿疹', '皮肤瘙痒', '血管性水肿']
        }
      ],
      columns,
      tableData: [],
      chooseZSJL: {
        nexttime: '上午'
      }
    }
  },
  methods: {
    openBind () {
      this.isShowBind = true

      pxzs
        .initBind({ projectid: this.chooseZSJL.projectid })
        .then(res => {
          this.devicenoList = res.data.device
          this.deviceno = res.data.deviceno
        })
        .catch(err => {
          console.log('初始化绑定设备出错：', err)
        })
    },
    closeBind () {
      this.deviceno = ''
      this.isShowBind = false
      this.stopPolling()
    },
    saveBind () {
      if (!this.deviceno) {
        this.$Message.error('请选择设备号')
        return
      }
      pxzs
        .saveBind({ projectid: this.chooseZSJL.projectid, deviceno: this.deviceno })
        .then(res => {
          this.isShowBind = false
          this.$Message.success(res.msg)
          this.chooseZSJL.deviceno = this.deviceno
        })
        .catch(err => {
          console.log('保存设备出错：', err)
        })
    },
    polling () {
      this.pollingInterval = setInterval(() => {
        if (this.pollCount < 20) {
          pxzs
            .getLungs({ projectid: this.chooseZSJL.projectid })
            .then(res => {
              if (res.data) {
                // 有值：赋值，且停止轮询
                this.chooseZSJL.pefh = res.data
                this.$forceUpdate()
                this.stopPolling()
              }

              this.pollCount++
            })
            .catch(err => {
              console.log('获取pef数值出错，停止轮询，出错原因：\n', err)
              this.stopPolling()
            })
        } else {
          this.stopPolling()
        }
      }, 5000)
    },
    stopPolling () {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
      }
      this.loadingTest = false
      this.pollCount = 0
    },
    willPolling () {
      this.loadingTest = true
      pxzs
        .renewTime({ projectid: this.chooseZSJL.projectid })
        .then(res => {
          // console.log(res.data.data)
          this.polling()
        })
        .catch(err => {
          console.log('获取PEF接口前初始化：', err)
          this.loadingTest = false
        })
    },
    // 当前页数发生改变
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.getList()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    // 每页数量发生改变
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    },
    reset () {
      this.keyword = ''
      this.changeFilter()
    },
    closeFT () {
      this.showFT = false
    },
    saveFT (e) {
      this.chooseZSJL.jkftsize = e
      this.closeFT()
    },
    closeJKRec () {
      this.showJKRec = false
    },
    saveJKRec (str) {
      this.chooseZSJL.jkrecord = str
      this.closeJKRec()
    },
    closeHandle () {
      let str = ''

      str += this.chooseHandle.fyclfs ? this.chooseHandle.fyclfs.toString() : ''
      str =
        str && (this.chooseHandle.zdy ? this.chooseHandle.zdy.toString() : '')
          ? str + ',' + (this.chooseHandle.zdy ? this.chooseHandle.zdy.toString() : '')
          : str + (this.chooseHandle.zdy ? this.chooseHandle.zdy.toString() : '')
      str =
        str && this.chooseHandle.text
          ? str + ',' + (this.chooseHandle.text || '')
          : str + (this.chooseHandle.text || '')

      this.chooseZSJL.jkhandle = str
      this.showHandle = false
    },
    getList () {
      this.loading = true
      pxzs
        .duringDoList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
        })
        .catch(err => {
          console.log('皮下注射-留观中:', err)
          this.loading = false
        })
    },
    doEdit (row) {
      pxzs.duringDoInit({ recordid: row.recordid }).then(res => {
        let data = res.data
        this.chooseZSJL = data
        this.chooseZSJL.recordid = row.recordid
        this.chooseZSJL.realdose = row.realdose
        this.chooseZSJL.projectid = row.projectid
        this.showJLFY = true
      })
    },
    finishJL () {
      if (!this.chooseZSJL.jkftsize) {
        this.chooseZSJL.jkftsize = ''
      }
      if (!this.chooseZSJL.jkrecord) {
        this.chooseZSJL.jkrecord = ''
      }
      if (!this.chooseZSJL.jkhandle) {
        this.chooseZSJL.jkhandle = ''
      }
      if (!this.chooseZSJL.jktime) {
        this.chooseZSJL.jktime = ''
      }

      if (!this.chooseZSJL.pefh) {
        this.$Message.error('请填写PEF(后)')
        return
      } else if (!this.chooseZSJL.nextdate) {
        this.$Message.error('请选择下次注射日期')
        return
      } else if (!this.chooseZSJL.nexttime) {
        this.$Message.error('请选择下次注射时间')
        return
      }

      let param = {
        recordid: this.chooseZSJL.recordid,
        jsondata: JSON.stringify({
          pefh: this.chooseZSJL.pefh,
          jkftsize: this.chooseZSJL.jkftsize,
          jkrecord: this.chooseZSJL.jkrecord,
          jkhandle: this.chooseZSJL.jkhandle,
          jktime: this.chooseZSJL.jktime,
          nextdate: this.chooseZSJL.nextdate
            ? this.$moment(this.chooseZSJL.nextdate).format('YYYY-MM-DD')
            : '',
          nexttime: this.chooseZSJL.nexttime,
          remark: this.chooseZSJL.remark
        })
      }

      this.loadingLGWC = true

      pxzs
        .duringDoSave(param)
        .then(res => {
          this.$Message.success('保存成功')
          this.showJLFY = false
          if (this.chooseZSJL.isend === 'Y') {
            this.$emit('changeTab', 'finishDo')
          } else {
            this.$emit('changeTab', 'willDo')
          }
          this.loadingLGWC = false
        })
        .catch(() => {
          this.loadingLGWC = false
        })

      // console.log(this.chooseZSJL)
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './hypodermicInjection.less';
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
      height: 32px;
    }
  }
  .fromItem > div {
    margin-top: 16px;
    &:first-child {
      margin-top: 0;
    }
  }
}
.line {
  border-bottom: 1px solid #d2d7e1;
  margin: 8px 0 24px;
}
.info {
  width: 100%;
  flex-wrap: wrap;
  div {
    // width: 140px;
    margin-right: 40px;
    font-size: 14px;
    line-height: 30px;
  }
}

.injection_edit {
  text-align: right;
  font-size: 14px;
  font-weight: 400;
  color: #3171ff;
  cursor: pointer;
}
</style>
