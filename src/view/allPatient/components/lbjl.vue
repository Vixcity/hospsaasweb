<template>
  <div class="history_inventory">
    <div class="history_inventory_head">
      <div class="history_inventory_head_title">历史评估记录</div>
      <!-- <div class="history_inventory_head_pre" @click="goBack">返回上一级</div> -->
    </div>

    <!-- 患者自测 -->
    <div class="history_inventory_patient" v-if="arrList.length">
      <div class="history_inventory_left">
        <div class="history_inventory_left_title">患者自测</div>
        <div class="history_inventory_left_list">
          <div
            :class="[
              'history_inventory_left_item',
              patient_index === index ? 'history_inventory_left_item_active' : ''
            ]"
            v-for="(item, index) in arrList"
            :key="index"
            @click="getEvalDetail(item.evaid, index, 1)"
          >
            {{ item.shorthand + item.title }}
          </div>
        </div>
      </div>
      <div class="history_inventory_right">
        <Area v-if="JSON.stringify(areaPatient) !== '{}'" style="height: 350px" :value="areaPatient"></Area>
      </div>
    </div>
    <div v-else class="history_inventory_empty">
      <div class="history_inventory_left_title">患者自测</div>
      <div class="gray tc">
        <img src="@/assets/images/noData.png" alt="" />
        <div style="margin-top: 16px">暂无量表评估</div>
      </div>
    </div>

    <div class="history_inventory_line"></div>

    <!-- 医生评估 -->
    <div class="history_inventory_doctor" v-if="doctorArrList.length">
      <div class="history_inventory_left">
        <div class="history_inventory_left_title">医生评估</div>
        <div class="history_inventory_left_list">
          <div
            :class="[
              'history_inventory_left_item',
              doctor_index === index ? 'history_inventory_left_item_active' : ''
            ]"
            v-for="(item, index) in doctorArrList"
            :key="index"
            @click="getEvalDetail(item.evaid, index, 2)"
          >
            {{ item.shorthand + item.title }}
          </div>
        </div>
      </div>
      <div class="history_inventory_right">
        <Area v-if="JSON.stringify(areaDoctor) !== '{}'" style="height: 350px" :value="areaDoctor"></Area>
      </div>
    </div>
    <div v-else class="history_inventory_empty">
      <div class="history_inventory_left_title">医生评估</div>
      <div class="gray tc">
        <img src="@/assets/images/noData.png" alt="" />
        <div style="margin-top: 16px">暂无量表评估</div>
      </div>
    </div>
  </div>
</template>

<script>
import { treated } from '@/api/treated/index'
import Area from './area.vue'
export default {
  name: 'history_lb',
  data () {
    return {
      patid: this.$route.query.patid,
      arrList: [],
      doctorArrList: [],
      patient_index: 0,
      doctor_index: 0,
      areaPatient: {},
      areaDoctor: {}
    }
  },
  components: {
    Area
  },
  methods: {
    goBack () {
      this.$emit('pre')
    },
    getList () {
      treated
        .evalTrend({
          patid: this.patid
        })
        .then(res => {
          this.arrList = res.data.evaself
          this.doctorArrList = res.data.evahim
          if (res.data.evaself.length) {
            this.getEvalData(res.data.evaself[0].evaid, 1)
          }
          if (res.data.evahim.length) {
            this.getEvalData(res.data.evahim[0].evaid, 2)
          }
        })
    },
    // 查看评估
    getEvalDetail (evaid, index, i) {
      if (i === 1) {
        if (this.patient_index === index) return
        this.patient_index = index
        this.getEvalData(evaid, i)
      } else if (i === 2) {
        if (this.doctor_index === index) return
        this.doctor_index = index
        this.getEvalData(evaid, i)
      }
    },
    // 查看评估详情
    getEvalData (evaid, index) {
      treated
        .evalData({
          patid: this.patid,
          evaid
        })
        .then(res => {
          if (index === 1) {
            this.areaPatient = {
              xAxis: res.data.xaxis,
              yAxis: res.data.yaxis,
              color: '#3171FF',
              bg_color1: 'rgba(49,113,255,0.57)',
              bg_color2: 'rgba(49,113,255,0)'
            }
          } else if (index === 2) {
            this.areaDoctor = {
              xAxis: res.data.xaxis,
              yAxis: res.data.yaxis,
              color: '#55D2D4',
              bg_color1: 'rgba(85,209,211,0.76)',
              bg_color2: 'rgba(85,210,212,0)'
            }
          }
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.history_inventory {
  .history_inventory_head {
    display: flex;
    justify-content: space-between;
    .history_inventory_head_title {
      font-size: 18px;
      font-weight: 500;
      color: #282d3c;
      line-height: 17px;
      padding-left: 12px;
      box-sizing: border-box;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 0;
        width: 4px;
        height: 18px;
        background: #3171ff;
      }
    }
    .history_inventory_head_pre {
      width: 102px;
      height: 32px;
      text-align: center;
      background: #3171ff;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 32px;
      cursor: pointer;
    }
  }
  .history_inventory_left {
    width: 296px;
    .history_inventory_left_title {
      font-size: 16px;
      font-weight: 400;
      color: #282d3c;
      line-height: 17px;
      margin-bottom: 8px;
    }
    .history_inventory_left_list {
      height: 333px;
      overflow-y: auto;
      .history_inventory_left_item {
        width: 272px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        border-radius: 5px;
        background: rgba(49, 113, 255, 0.1);
        font-size: 14px;
        font-weight: 400;
        color: #282d3c;
        margin-bottom: 16px;
        cursor: pointer;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .history_inventory_left_item_active {
        background: #3171ff !important;
        color: #ffffff !important;
      }
    }
  }
  .history_inventory_right {
    flex: 1;
  }
  .history_inventory_patient {
    margin-top: 16px;
    display: flex;
  }
  .history_inventory_line {
    width: 100%;
    height: 1px;
    background: #d2d7e1;
    margin: 24px 0;
  }
  .history_inventory_doctor {
    display: flex;
  }
  .history_inventory_empty {
    margin-top: 16px;
    .history_inventory_left_title {
      font-size: 16px;
      font-weight: 400;
      color: #282d3c;
      line-height: 17px;
      margin-bottom: 8px;
    }
  }
}
</style>
