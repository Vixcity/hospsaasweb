<template>
  <div class="SFJHAdd" v-loading="loading">
    <div class="title">
      {{ isAdd ? '新增随访计划' : '编辑随访计划' }}
    </div>
    <div>
      <div>
        <div class="flex aic" style="margin-top: 16px">
          <div>计划名称</div>
          <div style="margin-left: 8px">
            <Input v-model="chooseDetail.title" placeholder="请填写计划名称" style="width: 340px" />
          </div>
        </div>
        <div class="flex aic" style="margin-top: 16px">
          <div>随访模式</div>
          <div style="margin-left: 8px">
            <Select style="width: 340px" v-model="chooseDetail.followmode">
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
            v-if="chooseDetail.followmode === 'week'"
          >
            <i class="iconfont icon-tishi gray" style="margin-left: 8px; width: 18px"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="选择“指定日期”随访模式，只在指定日期对选择患者进行随访"
            placement="top"
            v-if="chooseDetail.followmode === 'point'"
          >
            <i class="iconfont icon-tishi gray" style="margin-left: 8px; width: 18px"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="选择“仅一次”随访模式，当选择患者后并到达随访时间时仅执行一次随访任务"
            placement="top"
            v-if="chooseDetail.followmode === '仅一次随访'"
          >
            <i class="iconfont icon-tishi gray" style="margin-left: 8px; width: 18px"></i>
          </el-tooltip>
        </div>
        <div class="flex aic" style="margin-top: 16px">
          <div>随访模板</div>
          <div style="margin-left: 8px">
            <Select
              v-model="chooseDetail.tempid"
              multiple
              filterable
              @on-change="$forceUpdate()"
              style="width: 340px"
            >
              <Option
                v-for="(item, index) in temList"
                :key="index + 'temList'"
                :value="item.tempid"
                :label="item.tempname"
              ></Option>
            </Select>
          </div>
          <div
            class="blue flex aic"
            @click="showEdit = true"
            style="margin-left: 8px; cursor: pointer"
          >
            <i class="iconfont icon-tianjia" style="font-size: 18px"></i>
            <div style="margin-left: 8px">添加模板</div>
          </div>
        </div>
        <div class="flex aic" style="margin-top: 16px" v-if="chooseDetail.followmode === 'week'">
          <div>随访频率</div>
          <div style="margin-left: 8px">
            <Input
              v-model="chooseDetail.followrate"
              type="number"
              style="width: 340px"
              placeholder="请填写随访频率"
            >
              <div class="flex aic" slot="suffix" style="height: 100%">天/次</div>
            </Input>
          </div>
        </div>
        <div
          :class="chooseDetail.dateList.length > 1 ? 'flex' : 'flex aic'"
          style="margin-top: 16px"
          v-if="chooseDetail.followmode === 'week' || chooseDetail.followmode === 'point'"
        >
          <div>随访{{ chooseDetail.followmode === 'week' ? '周' : '日' }}期</div>
          <div style="margin-left: 8px" v-if="chooseDetail.followmode === 'week'">
            <DatePicker
              :editable="false"
              :transfer="true"
              separator="至"
              type="daterange"
              placement="bottom-end"
              placeholder="请选择随访周期"
              v-model="chooseDetail.weekDate"
              @on-change="chooseDetail.weekDate = $event"
              format="yyyy-MM-dd"
              style="width: 340px"
            ></DatePicker>
          </div>
          <div v-if="chooseDetail.followmode === 'point'">
            <div
              style="margin-left: 8px"
              :class="index === 0 ? 'flex' : 'flex mt16'"
              v-for="(item, index) in chooseDetail.dateList"
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
                  v-if="index === chooseDetail.dateList.length - 1"
                ></i>
                <i
                  class="iconfont icon-shanchu red"
                  style="font-size: 18px"
                  @click="deleteDateList(index)"
                  v-if="index !== chooseDetail.dateList.length - 1"
                ></i>
                <div
                  class="blue"
                  @click="addDateList"
                  style="margin-left: 8px"
                  v-if="index === chooseDetail.dateList.length - 1"
                >
                  添加日期
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex aic" style="margin-top: 16px">
          <div style="padding-top: 2px">随访时间</div>
          <div style="margin-left: 8px">
            <TimePicker
              :editable="false"
              :transfer="true"
              format="HH:mm"
              placeholder="请选择随访时间"
              v-model="chooseDetail.followtime"
              style="width: 340px"
            ></TimePicker>
          </div>
        </div>
        <div style="width: 100%; margin-top: 40px" class="flex aic jcc">
          <Button @click="toPrev">返回上一级</Button>
          <Button type="primary" @click="savePlan" :loading="loadingPlan">保 存</Button>
        </div>
      </div>
    </div>
    <addFollowUpTem
      :tempid="tempid"
      :showEdit="showEdit"
      @save="saveEdit"
      @close="close"
    ></addFollowUpTem>
  </div>
</template>

<script>
import addFollowUpTem from '@/components/addFollowUpTem/addFollowUpTem'
import { ai } from '@/api/specialistFollowUp/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'SFJHAdd',
  props: ['isAdd', 'chooseSF'],
  components: {
    addFollowUpTem
  },
  data () {
    return {
      showEdit: false,
      loading: false,
      loadingPlan: false,
      chooseDetail: {},
      temList: [],
      tempid: ''
    }
  },
  methods: {
    saveEdit () {
      this.close()
      this.getDetail()
    },
    close () {
      this.showEdit = false
    },
    getDetail () {
      this.loading = true
      ai.editPlan({
        planid: this.chooseSF.planid || ''
      }).then(res => {
        let data = res.data
        data.info.tempid = data.info.tempid.split(',').map(item => Number(item))
        data.info.weekDate = [data.info.startdate, data.info.enddate]
        data.info.dateList = data.info.followdate.split(',').map(item => {
          return {
            date: item
          }
        })
        this.chooseDetail = data.info
        this.temList = data.temp
        this.loading = false
      })
    },
    savePlan () {
      if (!this.chooseDetail.title) {
        this.$Message.error('请填写计划名称')
        return
      } else if (!this.chooseDetail.followmode) {
        this.$Message.error('请选择随访模式')
        return
      } else if (this.chooseDetail.tempid.length < 1) {
        this.$Message.error('请选择随访模板')
        return
      } else if (!this.chooseDetail.followtime) {
        this.$Message.error('请选择随访时间')
        return
      } else if (this.chooseDetail.followmode === 'week') {
        if (!this.chooseDetail.followrate) {
          this.$Message.error('请选择随访频率')
          return
        } else if (!this.chooseDetail.weekDate) {
          this.$Message.error('请选择随访周期')
          return
        }
      } else if (
        this.chooseDetail.followmode === 'point' &&
        this.chooseDetail.dateList.findIndex(item => !item.date) !== -1
      ) {
        this.$Message.error('随访日期请勿留空')
        return
      }

      let param = deepClone(this.chooseDetail)
      param.tempid = param.tempid.toString()
      if (param.followmode === 'week') {
        param.startdate = param.weekDate[0]
          ? this.$moment(param.weekDate[0]).format('YYYY-MM-DD')
          : ''
        param.enddate = param.weekDate[1]
          ? this.$moment(param.weekDate[1]).format('YYYY-MM-DD')
          : ''
      } else {
        param.followdate = param.dateList
          .map(item => (item.date ? this.$moment(item.date).format('YYYY-MM-DD') : ''))
          .toString()
        delete param.startdate
        delete param.enddate
      }

      delete param.weekDate
      delete param.dateList
      delete param.tempary

      this.loadingPlan = true

      ai.savePlan({ jsondata: JSON.stringify(param) })
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
      this.chooseDetail.dateList.push({})
      this.$forceUpdate()
    },
    deleteDateList (index) {
      this.chooseDetail.dateList.splice(index, 1)
      this.$forceUpdate()
    }
  },
  mounted () {
    this.getDetail()
  }
}
</script>

<style lang="less" scoped>
@import '../../AIFollowUp.less';
.mt16 {
  margin-top: 16px;
}
</style>
