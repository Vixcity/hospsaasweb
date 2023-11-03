<template>
  <div class="EVAAdd" v-loading="loading">
    <div class="title">
      {{ isAdd ? '新增量表随访' : '编辑量表随访' }}
    </div>
    <div>
      <div>
        <div class="flex aic" style="margin-top: 16px">
          <div>随访名称</div>
          <div style="margin-left: 8px">
            <Input v-model="chooseSF.title" placeholder="请填写随访名称" style="width: 340px" />
          </div>
        </div>
        <div class="flex aic" style="margin-top: 16px">
          <div>随访模式</div>
          <div style="margin-left: 8px">
            <Select style="width: 340px" v-model="chooseSF.followmode">
              <Option value="week">固定周期随访</Option>
              <Option value="point">指定日期随访</Option>
              <!-- <Option value="仅一次随访">仅一次随访</Option> -->
            </Select>
          </div>
          <el-tooltip
            class="item"
            effect="dark"
            content="选择“固定周期”随访模式，将在选择患者后按随访频率在随访周期内进行随访任务。"
            placement="top"
            v-if="chooseSF.followmode === 'week'"
          >
            <i class="iconfont icon-tishi gray" style="margin-left: 8px; width: 18px"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="选择“指定日期”随访模式，只在指定日期对选择患者进行随访"
            placement="top"
            v-if="chooseSF.followmode === 'point'"
          >
            <i class="iconfont icon-tishi gray" style="margin-left: 8px; width: 18px"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="选择“仅一次”随访模式，当选择患者后并到达随访时间时仅执行一次随访任务"
            placement="top"
            v-if="chooseSF.followmode === '仅一次随访'"
          >
            <i class="iconfont icon-tishi gray" style="margin-left: 8px; width: 18px"></i>
          </el-tooltip>
        </div>
        <div class="flex aic" style="margin-top: 16px">
          <div>随访量表</div>
          <div style="margin-left: 8px">
            <Select
              style="width: 340px"
              v-model="chooseSF.evaids"
              multiple
              filterable
              remote
              :remote-method="getEvaList"
              @on-change="changeSelectEva"
              :loading="loadingSearchEva"
            >
              <Option
                v-for="(item, index) in evaList"
                :value="item.eid"
                :key="index + 'patList'"
                :label="item.etit"
              ></Option>
            </Select>
          </div>
        </div>
        <div class="flex aic" style="margin-top: 16px" v-if="chooseSF.followmode === 'week'">
          <div>随访频率</div>
          <div style="margin-left: 8px">
            <Input
              v-model="chooseSF.followrate"
              type="number"
              style="width: 340px"
              placeholder="请填写随访频率"
            >
              <div class="flex aic" slot="suffix" style="height: 100%">天/次</div>
            </Input>
          </div>
        </div>
        <div
          :class="chooseSF.dateList.length > 1 ? 'flex' : 'flex aic'"
          style="margin-top: 16px"
          v-if="chooseSF.followmode === 'week' || chooseSF.followmode === 'point'"
        >
          <div>随访{{ chooseSF.followmode === 'week' ? '周' : '日' }}期</div>
          <div style="margin-left: 8px" v-if="chooseSF.followmode === 'week'">
            <DatePicker
              :editable="false"
              :transfer="true"
              separator="至"
              type="daterange"
              placement="bottom-end"
              placeholder="请选择随访周期"
              v-model="chooseSF.weekDate"
              @on-change="chooseSF.weekDate = $event"
              format="yyyy-MM-dd"
              style="width: 340px"
            ></DatePicker>
          </div>
          <div v-if="chooseSF.followmode === 'point'">
            <div
              style="margin-left: 8px"
              :class="index === 0 ? 'flex' : 'flex mt16'"
              v-for="(item, index) in chooseSF.dateList"
              :key="index + 'dateList'"
            >
              <DatePicker
                :editable="false"
                type="date"
                :transfer="true"
                v-model="item.date"
                @on-change="item.date = $event"
                format="yyyy-MM-dd"
                placeholder="请选择随访日期"
                style="width: 340px"
              ></DatePicker>
              <div class="flex aic" style="margin-left: 8px; cursor: pointer">
                <i
                  class="iconfont icon-tianjia blue"
                  style="font-size: 18px"
                  @click="addDateList"
                  v-if="index === chooseSF.dateList.length - 1"
                ></i>
                <i
                  class="iconfont icon-shanchu red"
                  style="font-size: 18px"
                  @click="deleteDateList(index)"
                  v-if="index !== chooseSF.dateList.length - 1"
                ></i>
                <div
                  class="blue"
                  @click="addDateList"
                  style="margin-left: 8px"
                  v-if="index === chooseSF.dateList.length - 1"
                >
                  添加日期
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex aic" style="margin-top: 16px">
          <div>记录模式</div>
          <div style="margin-left: 8px">
            <Select style="width: 340px" v-model="chooseSF.modetype">
              <Option value="point">指定患者</Option>
              <Option value="dimen">患者纬度</Option>
            </Select>
          </div>
          <el-tooltip
            class="item"
            effect="dark"
            content="仅对选择的患者进行随访"
            placement="top"
            v-if="chooseSF.modetype === 'point'"
          >
            <i class="iconfont icon-tishi gray" style="margin-left: 8px; width: 18px"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="对选择纬度下的所有患者进行随访"
            placement="top"
            v-if="chooseSF.modetype === 'dimen'"
          >
            <i class="iconfont icon-tishi gray" style="margin-left: 8px; width: 18px"></i>
          </el-tooltip>
        </div>
        <div class="flex aic black" style="margin-top: 16px" v-if="chooseSF.modetype === 'point'">
          <div>添加患者</div>
          <div style="margin-left: 8px">
            <Select
              style="width: 340px"
              v-model="chooseSF.patientids"
              multiple
              filterable
              remote
              :remote-method="getPatList"
              @on-change="changeSelectPat"
              :loading="loadingSearch"
            >
              <Option
                v-for="(item, index) in patList"
                :value="item.patid"
                :key="index + 'patList'"
                :label="item.patname"
              ></Option>
            </Select>
          </div>
        </div>
        <div v-if="chooseSF.modetype === 'dimen'" style="margin-top: 16px">
          <div class="title black">患者纬度选择</div>
          <div class="flex aic black" style="margin-top: 16px">
            <div>
              <span class="transparent">*</span>
              年龄范围
            </div>
            <div class="flex aic" style="margin-left: 8px">
              <Input
                v-model="chooseSF.patientdimen.minage"
                type="number"
                placeholder="请填写年龄范围"
                style="width: 160px"
              />
              <div style="margin-left: 8px">-</div>
              <Input
                v-model="chooseSF.patientdimen.maxage"
                type="number"
                placeholder="请填写年龄范围"
                style="width: 160px; margin-left: 8px"
              />
            </div>
          </div>
          <div class="flex aic black" style="margin-top: 16px">
            <div>
              <span class="transparent">*</span>
              诊断结果
            </div>
            <div style="margin-left: 8px">
              <Select v-model="chooseSF.patientdimen.diagnose" multiple style="width: 340px">
                <Option
                  v-for="(item, index) in diagnoseList"
                  :key="index + 'diagnoseList'"
                  :value="item"
                  :label="item"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex aic black" style="margin-top: 16px">
            <div>
              <span class="transparent">*</span>
              患者类型
            </div>
            <div style="margin-left: 8px">
              <Select style="width: 340px" v-model="chooseSF.patientdimen.pattype">
                <Option value="yestm">全部脱敏患者</Option>
                <Option value="notm">未脱敏患者</Option>
                <Option value="tmalg">阿罗格</Option>
                <Option value="tmatd">安脱达</Option>
                <Option value="tmcd">畅迪</Option>
              </Select>
            </div>
          </div>
        </div>
        <div style="width: 100%; margin-top: 40px" class="flex aic jcc">
          <Button @click="toPrev">返回上一级</Button>
          <Button type="primary" @click="savePlan" :loading="loadingPlan">保 存</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eva } from '@/api/specialistFollowUp/index'
import { debounce, deepClone } from '@/libs/util'
import { common } from '@/api/index'
export default {
  name: 'EVAAdd',
  props: ['isAdd', 'chooseSF'],
  data () {
    return {
      showEdit: false,
      loading: true,
      loadingSearch: false,
      loadingSearchEva: false,
      loadingPlan: false,
      diagnoseList: [],
      temList: [],
      patList: [],
      evaList: [],
      oldPatList: [],
      oldEvaList: [],
      tempid: ''
    }
  },
  methods: {
    saveEdit () {
      this.close()
    },
    close () {
      this.showEdit = false
    },
    changeSelectPat (val) {
      this.getPatList()
    },
    changeSelectEva (val) {
      this.getEvaList()
    },
    getEvaList: debounce(function (val, isFirst) {
      common
        .searchEva({
          keyword: val || ''
        })
        .then(res => {
          let data = res.data
          if (
            (JSON.stringify(this.oldEvaList) !== JSON.stringify(this.evaList) &&
              JSON.stringify(this.oldEvaList) !== '[]') ||
            isFirst
          ) {
            this.loadingSearchEva = true
            this.evaList = data
          }
          if (!val) {
            this.oldEvaList = data
          }
          this.loadingSearchEva = false
          this.loading = false
        })
    }, 500),
    getPatList: debounce(function (val, isFirst) {
      common
        .getPatList({
          keyword: val || ''
        })
        .then(res => {
          let data = res.data
          if (
            (JSON.stringify(this.oldPatList) !== JSON.stringify(this.patList) &&
              JSON.stringify(this.oldPatList) !== '[]') ||
            isFirst
          ) {
            this.loadingSearch = true
            this.patList = data
          }
          if (!val) {
            this.oldPatList = data
          }
          this.loadingSearch = false
        })
    }, 500),
    savePlan () {
      if (!this.chooseSF.title) {
        this.$Message.error('请填写计随访名称')
        return
      } else if (!this.chooseSF.followmode) {
        this.$Message.error('请选择随访模式')
        return
      } else if (this.chooseSF.evaids.length < 1) {
        this.$Message.error('请选择随访量表')
        return
      } else if (this.chooseSF.followmode === 'week') {
        if (!this.chooseSF.followrate) {
          this.$Message.error('请选择随访频率')
          return
        } else if (!this.chooseSF.weekDate) {
          this.$Message.error('请选择随访周期')
          return
        }
      } else if (
        this.chooseSF.followmode === 'point' &&
        this.chooseSF.dateList.findIndex(item => !item.date) !== -1
      ) {
        this.$Message.error('随访日期请勿留空')
        return
      }

      let param = deepClone(this.chooseSF)
      param.evaids = param.evaids.toString()
      param.patientids = param.patientids.toString()
      param.diagnose = param.patientdimen.diagnose.toString()
      param.maxage = param.patientdimen.maxage.toString()
      param.minage = param.patientdimen.minage.toString()
      param.pattype = param.patientdimen.pattype.toString()
      if (param.followmode === 'week') {
        param.startdate = param.weekDate[0]
          ? this.$moment(param.weekDate[0]).format('YYYY-MM-DD')
          : ''
        param.enddate = param.weekDate[1]
          ? this.$moment(param.weekDate[1]).format('YYYY-MM-DD')
          : ''
        param.followdate = ''
      } else {
        param.followdate = param.dateList
          .map(item => (item.date ? this.$moment(item.date).format('YYYY-MM-DD') : ''))
          .toString()
      }

      delete param.followtime
      delete param.patientary
      delete param.patientdimen
      delete param.weekDate
      delete param.dateList
      delete param.evaary

      this.loadingPlan = true

      eva
        .save({ jsondata: JSON.stringify(param) })
        .then(res => {
          this.$Message.success('保存成功')
          this.toPrev()
          this.loadingPlan = false
        })
        .catch(() => {
          this.loadingPlan = false
        })
    },
    toPrev () {
      this.$emit('back')
    },
    addDateList () {
      this.chooseSF.dateList.push({})
      this.$forceUpdate()
    },
    deleteDateList (index) {
      this.chooseSF.dateList.splice(index, 1)
      this.$forceUpdate()
    }
  },
  mounted () {
    common.getSelect({ type: 'diagnose' }).then(res => {
      let data = res.data
      this.diagnoseList = data.diagnose
    })
    this.getPatList('', true)
    this.getEvaList('', true)
  }
}
</script>

<style lang="less" scoped>
@import '../EVAFollowUp.less';
.mt16 {
  margin-top: 16px;
}
</style>
