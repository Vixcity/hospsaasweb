<template>
  <div class="zhenShuBuy">
    <div v-if="!showYYXQ">
      <div class="filterCtn">
        <div class="itemFather">
          <!-- <div class="filterItem">
            <div class="label">检验项目</div>
            <div>
              <Select style="width: 180px">
                <Option v-for="(item, index) in jcList" :value="item" :key="index + 'jcList'">
                  {{ item }}
                </Option>
              </Select>
            </div>
          </div> -->
          <!-- <div class="filterItem">
            <div class="label">时间</div>
            <div>
              <DatePicker
                :editable="false"
                type="daterange"
                v-model="chooseDate"
                :transfer="true"
                :options="dateList"
                placement="bottom-end"
                placeholder="请选择就诊时间"
              ></DatePicker>
            </div>
          </div> -->
          <div class="filterItem">
            <div class="label">预约时间</div>
            <div>
              <DatePicker
                :editable="false"
                v-model="today"
                :transfer="true"
                placeholder="请选择就诊时间"
              ></DatePicker>
            </div>
          </div>
          <div class="filterItem">
            <div class="label">搜索</div>
            <div>
              <Input search placeholder="患者姓名/项目名称" />
            </div>
          </div>
          <div class="filterItem">
            <Button type="primary">查 询</Button>
            <Button>重 置</Button>
          </div>
        </div>
      </div>
      <div class="filterCtn">
        <div class="itemFather">
          <div class="filterItem">
            <Button type="primary" @click="addHZ">新增患者</Button>
            <Button type="primary" @click="getYYXQ">预约详情</Button>
            <Button type="primary">导 入</Button>
            <Button type="primary">导 出</Button>
          </div>
        </div>
      </div>
      <Table :columns="columns" :data="tableData" style="margin-top: 16px">
        <template #action="{ row }">
          <div class="flex">
            <div class="btn" @click="addZS(row)">增加针数</div>
            <div class="btn" @click="getDetail(row)">详情</div>
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
    </div>
    <YYXQ v-else @notShow="notShow"></YYXQ>
    <el-dialog
      title="增加针数"
      :visible.sync="showAdd"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="info">
        <span>姓名：{{ chooseZSJL.name }}</span>
        <span>性别：{{ chooseZSJL.sex }}</span>
        <span>年龄：{{ chooseZSJL.age }}</span>
        <span>出生日期：{{ '2022-02-02' }}</span>
        <span>初次发病日期：{{ '2022-02-02' }}</span>
        <span>诊断：{{ '过敏性支气管炎' }}</span>
        <span>脱敏药物：{{ '安脱达' }}</span>
        <span>脱敏方案：{{ '常规' }}</span>
        <span>剩余针数：{{ chooseZSJL.zs }}</span>
      </div>
      <div class="line"></div>
      <div class="table_style">
        <Table :columns="smallColumns" :data="smallData">
          <template slot-scope="{ row }" slot="medic">
            <Select v-model="row.medic" :transfer="true" style="width: 100%">
              <Option value="畅迪">畅迪</Option>
              <Option value="安脱达">安脱达</Option>
              <Option value="阿格罗">阿格罗</Option>
            </Select>
          </template>
          <template #action="{ row }">
            <div class="flex">
              <div class="tableAdd" @click="addZSItem">添加</div>
              <div class="tableRemove" @click="deleteZSItem(row)">删除</div>
            </div>
          </template>
        </Table>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit">提 交</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增患者"
      :visible.sync="showAddHZ"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">就诊卡号</div>
            <div class="itemContent">
              <Input v-model="addHZObj.bah" placeholder="请输入就诊卡号" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">姓名</div>
            <div class="itemContent">
              <Input v-model="addHZObj.name" placeholder="请输入姓名" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">脱敏药物</div>
            <div class="itemContent">
              <Select
                v-model="addHZObj.medic"
                placeholder="请选择脱敏药物"
                :transfer="true"
                style="width: 100%"
              >
                <Option value="畅迪">畅迪</Option>
                <Option value="安脱达">安脱达</Option>
                <Option value="阿格罗">阿格罗</Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">脱敏方案</div>
            <div class="itemContent">
              <Select
                v-model="addHZObj.medic"
                placeholder="请选择脱敏方案"
                :transfer="true"
                style="width: 100%"
              >
                <Option value="常规方案">常规方案</Option>
                <Option value="集群方案">集群方案</Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">上次注射周次</div>
            <div class="itemContent">
              <Input v-model="addHZObj.lastWeek" placeholder="请填写上次注射周次" />
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">上次注射日期</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                type="date"
                v-model="addHZObj.lastZSDate"
                style="width: 100%"
                placeholder="请选择上次注射日期"
              ></DatePicker>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">上次注射瓶号</div>
            <div class="itemContent">
              <Select
                v-model="addHZObj.medic"
                placeholder="请选择上次注射瓶号"
                :transfer="true"
                style="width: 100%"
              >
                <Option value="1">1</Option>
                <Option value="2">2</Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">上次注射瓶号</div>
            <div class="itemContent">
              <Select
                v-model="addHZObj.medic"
                placeholder="请选择上次注射瓶号"
                :transfer="true"
                style="width: 100%"
              >
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">剩余针数</div>
            <div class="itemContent">
              <Input v-model="addHZObj.zs" placeholder="请输入剩余针数" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="showAddHZ = false">提交</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import YYXQ from '../hypodermicInjection/YYXQ.vue'
import { deepClone } from '@/libs/util'
export default {
  name: 'zhenShuBuy',
  components: {
    YYXQ
  },
  data () {
    return {
      showYYXQ: false,
      showAdd: false,
      showAddHZ: false,
      pageNum: 0,
      currentPageIdx: 1,
      jcList: [
        '血常规',
        '血沉',
        '吸入物变应原筛查',
        '变应原检测',
        '食入物变应原筛查',
        '食物特异性IgG4抗体检测',
        '肺功能',
        '耳鼻喉内窥镜检查'
      ],
      columns: [
        {
          key: 'bah',
          title: '就诊卡号',
          width: 140
        },
        {
          key: 'name',
          title: '姓名',
          width: 120
        },
        {
          key: 'sex',
          title: '性别',
          width: 100
        },
        {
          key: 'age',
          title: '年龄',
          width: 100
        },
        {
          key: 'ph',
          title: '注射瓶号',
          width: 100
        },
        {
          key: 'jl',
          title: '注射剂量（ml）',
          width: 175
        },
        {
          key: 'zs',
          title: '剩余针数',
          width: 180
        },
        {
          key: 'prevzssj',
          title: '上次注射时间',
          width: 220
        },
        {
          key: 'yydate',
          title: '预约日期',
          width: 220
        },
        {
          key: 'surplusTime',
          title: '距离预约时间',
          width: 200
        },
        {
          slot: 'action',
          title: '操作',
          fixed: 'right',
          width: 140
        }
      ],
      tableData: [],
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
      smallColumns: [
        {
          title: '序号',
          key: 'index'
        },
        {
          title: '脱敏药物',
          slot: 'medic'
        },
        {
          title: '次数',
          key: 'count'
        },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right'
        }
      ],
      smallData: [
        {
          index: 1,
          medic: '安脱达',
          price: 20,
          count: 3
        },
        {
          index: 2,
          medic: '安脱达',
          price: 40,
          count: 6
        }
      ],
      chooseDate: [
        this.$moment().startOf('day').format('YYYY-MM-DD'),
        this.$moment().startOf('day').format('YYYY-MM-DD')
      ],
      today: this.$moment().startOf('day').format('YYYY-MM-DD'),
      chooseZSJL: {},
      addHZObj: {}
    }
  },
  methods: {
    getYYXQ () {
      this.showYYXQ = true
    },
    // 详情
    getDetail (row) {
      this.$router.push({ path: '/detail?patid=' + row.patid })
    },
    notShow () {
      this.showYYXQ = false
    },
    addHZ () {
      this.showAddHZ = true
    },
    saveEdit () {
      this.showAdd = false
    },
    addZSItem () {
      this.smallData.push({
        index: this.smallData.slice(-1)[0].index + 1,
        medic: '安脱达',
        price: 40,
        count: 6
      })
    },
    deleteZSItem (row) {
      this.smallData.splice(row._index, 1)
    },
    // 当前页数发生改变
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
    },
    // 每页数量发生改变
    changeSize (pageSize) {},
    addZS (row) {
      this.chooseZSJL = deepClone(row)
      this.showAdd = true
    }
  }
}
</script>

<style lang="less" scoped>
@import './zhenShuBuy.less';
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
  transform: translateX(-40px);
  span {
    font-size: 14px;
    margin-left: 40px;
    margin-top: 10px;
  }
}
</style>
