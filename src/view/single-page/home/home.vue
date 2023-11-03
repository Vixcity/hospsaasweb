<template>
  <div style="overflow-x: hidden">
    <div class="filterCtn" style="margin-top: 8px">
      <div class="itemFather">
        <div class="filterItem" style="margin-top: 8px">
          <div class="label">时间</div>
          <div>
            <Select v-model="sj" style="width: 160px" @on-change="changeChooseDate">
              <Option v-for="item in sjList" :value="item.value" :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </div>
        </div>
        <div class="filterItem" style="margin-top: 8px">
          <div class="label">自定义日期</div>
          <div>
            <DatePicker
              :editable="false"
              type="daterange"
              :clearable="false"
              v-model="chooseDate"
              placement="bottom-end"
            ></DatePicker>
          </div>
        </div>
        <div class="filterItem" style="margin-top: 8px">
          <Button type="primary" @click="getData">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <div class="index_list">
      <div class="bgcolor index_txt">
        <div class="title">患者数据</div>
        <div class="canvas">
          <myechart :option="pieData" style="width: 100%; height: 400px"></myechart>
        </div>
      </div>
      <div class="bgcolor index_cont">
        <div class="title">数据概览</div>
        <div class="content">
          <div class="item">
            <div class="num">
              <div v-for="(item, index) in total_fee" :key="index + 'total_fee'">{{ item }}</div>
            </div>
            <div class="item_title">总收入(万元)</div>
          </div>
          <div class="item">
            <div class="num">
              <div v-for="(item, index) in total_num" :key="index + 'total_num'">{{ item }}</div>
            </div>
            <div class="item_title">总患者数量(人)</div>
          </div>
        </div>
        <div class="list">
          <div class="list_item" v-for="(item, index) in independentData" :key="index">
            <img
              class="list_img"
              :src="require(`@/assets/images/home/independent${index + 1}.png`)"
              alt=""
            />
            <div class="list_item_right">
              <div class="list_item_right_num">{{ item.num }}</div>
              <div class="list_item_right_title">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="bgcolor index_txt">
        <div class="title">收入占比（万元）</div>
        <div class="canvas">
          <myechart :option="incomeData" style="width: 100%; height: 400px"></myechart>
        </div>
      </div>
    </div>
    <Row :gutter="8" style="margin-top: 8px">
      <Col span="15">
        <div class="bgcolor">
          <div class="title">科室情况</div>
          <example style="height: 400px" :value="exampleData"></example>
        </div>
      </Col>
      <Col span="9">
        <div class="bgcolor">
          <div class="title">科室医生排行榜（接诊量占比）</div>
          <ranking style="height: 400px" :value="rankingData"></ranking>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { home } from '@/api/home/index'
import Example from './example.vue'
import Ranking from './ranking.vue'
import myechart from '../../../components/charts/myechart'
import { splitToDigit } from '@/libs/util'
export default {
  name: 'home',
  components: {
    Example,
    Ranking,
    myechart
  },
  data () {
    return {
      today: this.$moment().startOf('day').format('YYYY-MM-DD'),
      sj: 'week',
      sjList: [
        {
          value: 'week',
          label: '最近7天'
        },
        {
          value: 'month',
          label: '最近30天'
        },
        {
          value: 'nowWeek',
          label: '本周'
        },
        {
          value: 'nowMonth',
          label: '本月'
        },
        {
          value: 'nowYear',
          label: '今年'
        }
      ],
      total_fee: [0],
      total_num: [0],
      chooseDate: [
        this.$moment().subtract(6, 'days').format('YYYY-MM-DD'),
        this.$moment().startOf('day').format('YYYY-MM-DD')
      ],
      pieData: {
        title: {
          show: true,
          text: '0',
          subtext: '患者总数(人)',
          // 具体放置位置
          left: 'center',
          top: '43%',
          z: 0,
          zlevel: 100,
          // 文本对应的样式
          textStyle: {
            textAlign: 'center',
            color: '#282D3C',
            fontSize: 28,
            fontWeight: 500
          },
          subtextStyle: {
            textAlign: 'center',
            color: '#969BAA',
            lineHeight: 14,
            fontSize: 14,
            fontWeight: 400
          }
        },
        tooltip: {
          trigger: 'item',
          textStyle: {
            color: '#282D3C' // 设置文字颜色
          }
        },
        legend: {
          bottom: '30px',
          textStyle: {
            color: '#282D3C', // 设置文字颜色
            fontSize: 12,
            rich: {
              a: {
                verticalAlign: 'middle'
              }
            },
            lineHeight: 8,
            padding: [0, 5, -4, 0] // ★图例的图标内边距top right bottom left（重点
          },
          itemWidth: 8,
          itemHeight: 8,
          left: 'center'
        },
        color: ['#3171FF', '#55D2D4', '#F75559', '#FFBD38'],
        series: [
          {
            name: '患者数据',
            type: 'pie',
            radius: ['45%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
              formatter: '{b}' + '\n\r' + '{c}(人)'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 0, name: '初诊' },
              { value: 0, name: '复诊' }
            ]
          }
        ]
      },
      incomeData: {
        title: {
          show: true,
          text: '0',
          subtext: '总收入',
          // 具体放置位置
          left: 'center',
          top: '43%',
          z: 0,
          zlevel: 100,
          // 文本对应的样式
          textStyle: {
            textAlign: 'center',
            color: '#282D3C',
            fontSize: 28,
            fontWeight: 500
          },
          subtextStyle: {
            textAlign: 'center',
            color: '#969BAA',
            lineHeight: 14,
            fontSize: 14,
            fontWeight: 400
          }
        },
        tooltip: {
          trigger: 'item',
          textStyle: {
            color: '#282D3C' // 设置文字颜色
          }
        },
        legend: {
          bottom: '30px',
          textStyle: {
            color: '#282D3C', // 设置文字颜色
            fontSize: 12,
            rich: {
              a: {
                verticalAlign: 'middle'
              }
            },
            lineHeight: 8,
            padding: [0, 5, -3, 0] // ★图例的图标内边距top right bottom left（重点
          },
          itemWidth: 8,
          itemHeight: 8,
          left: 'center'
        },
        color: ['#3171FF', '#55D2D4', '#F75559', '#FFBD38'],
        series: [
          {
            name: '收入占比',
            type: 'pie',
            radius: ['45%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
              formatter: '{b}' + '\n\r' + '{c}(人)'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 0, name: '挂号费' },
              { value: 0, name: '检验检查' },
              { value: 0, name: '脱敏治疗' },
              { value: 0, name: '药费' }
            ]
          }
        ]
      },
      independentData: [
        {
          num: 0,
          key: 'clinic_fee',
          title: '门诊收入'
        },
        {
          num: 0,
          key: 'inspect_fee',
          title: '检验检查收入'
        },
        {
          num: 0,
          key: 'tuomin_fee',
          title: '脱敏治疗收入'
        },
        {
          num: 0,
          key: 'drug_fee',
          title: '药品收入'
        },
        {
          num: 0,
          key: 'clinic_num',
          title: '门诊人数'
        },
        {
          num: 0,
          key: 'inspect_num',
          title: '检验检查(人次)'
        },
        {
          num: 0,
          key: 'tuomin_num',
          title: '脱敏治疗(人次)'
        },
        {
          num: 0,
          key: 'drug_num',
          title: '购买药品(人次)'
        }
      ],
      exampleData: {
        xAxis: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月'
        ],
        yAxis1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        yAxis2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      rankingData: []
    }
  },
  methods: {
    changeChooseDate (type) {
      if (type === 'week') {
        this.chooseDate = [this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), this.today]
      } else if (type === 'month') {
        this.chooseDate = [this.$moment().subtract(29, 'days').format('YYYY-MM-DD'), this.today]
      } else if (type === 'nowWeek') {
        this.chooseDate = [
          this.$moment().startOf('week').add(1, 'day').format('YYYY-MM-DD'),
          this.$moment().endOf('week').add(1, 'day').format('YYYY-MM-DD')
        ]
      } else if (type === 'nowMonth') {
        this.chooseDate = [
          this.$moment().startOf('month').format('YYYY-MM-DD'),
          this.$moment().endOf('month').format('YYYY-MM-DD')
        ]
      } else if (type === 'nowYear') {
        this.chooseDate = [
          this.$moment().startOf('year').format('YYYY-MM-DD'),
          this.$moment().endOf('year').format('YYYY-MM-DD')
        ]
      }
    },
    reset () {
      this.sj = 'week'
      this.chooseDate = [this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), this.today]
    },
    getData () {
      // 患者数据
      home
        .homeHZSJ({
          startdate: this.chooseDate[0]
            ? this.$moment(this.chooseDate[0]).format('YYYY-MM-DD')
            : '',
          enddate: this.chooseDate[1] ? this.$moment(this.chooseDate[1]).format('YYYY-MM-DD') : ''
        })
        .then(res => {
          let data = res.data
          this.pieData.title.text = data.total
          this.pieData.series[0].data = [
            { value: data.first, name: '初诊' },
            { value: data.second, name: '复诊' }
          ]
        })

      // 数据概览
      home
        .homeSJGL({
          startdate: this.chooseDate[0]
            ? this.$moment(this.chooseDate[0]).format('YYYY-MM-DD')
            : '',
          enddate: this.chooseDate[1] ? this.$moment(this.chooseDate[1]).format('YYYY-MM-DD') : ''
        })
        .then(res => {
          let data = res.data
          this.total_fee = splitToDigit((data.total_fee / 10000).toFixed(1))
          this.total_num = splitToDigit(data.total_num)
          this.independentData.forEach(item => {
            item.num = data[item.key]
          })
        })

      // 收入占比
      home
        .homeSRZB({
          startdate: this.chooseDate[0]
            ? this.$moment(this.chooseDate[0]).format('YYYY-MM-DD')
            : '',
          enddate: this.chooseDate[1] ? this.$moment(this.chooseDate[1]).format('YYYY-MM-DD') : ''
        })
        .then(res => {
          let data = res.data
          this.incomeData.title.text = (data.total_fee / 10000).toFixed(1)
          this.incomeData.series[0].data = [
            { value: (data.clinic_fee / 10000).toFixed(1), name: '挂号费' },
            { value: (data.inspect_fee / 10000).toFixed(1), name: '检验检查' },
            { value: (data.tuomin_fee / 10000).toFixed(1), name: '脱敏治疗' },
            { value: (data.drug_fee / 10000).toFixed(1), name: '药费' }
          ]
        })

      // 科室情况
      home
        .homeKSQK({
          startdate: this.chooseDate[0]
            ? this.$moment(this.chooseDate[0]).format('YYYY-MM-DD')
            : '',
          enddate: this.chooseDate[1] ? this.$moment(this.chooseDate[1]).format('YYYY-MM-DD') : ''
        })
        .then(res => {
          let data = res.data
          this.exampleData = {
            xAxis: data.xaxis,
            yAxis1: data.section.map(item => (item / 10000).toFixed(2)),
            yAxis2: data.patient
          }
        })

      // 接诊排行
      home
        .homeJZPH({
          startdate: this.chooseDate[0]
            ? this.$moment(this.chooseDate[0]).format('YYYY-MM-DD')
            : '',
          enddate: this.chooseDate[1] ? this.$moment(this.chooseDate[1]).format('YYYY-MM-DD') : ''
        })
        .then(res => {
          let data = res.data

          this.rankingData = data
        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
@import './home.less';
</style>
