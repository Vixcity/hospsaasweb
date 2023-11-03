<template>
  <div>
    <div class="filterCtn">
      <div class="itemFather">
        <!-- <div class="filterItem" style="margin-top: 0">
          <div class="label">就诊时间</div>
          <div>
            <DatePicker
              type="daterange"
              v-model="chooseDate"
              :options="dateList"
              placement="bottom-end"
              placeholder="请选择就诊时间"
            ></DatePicker>
          </div>
        </div> -->
        <div class="filterItem" style="margin-top: 0">
          <div class="label">随访类型</div>
          <div>
            <Select v-model="followtype" placeholder="请选择" style="width: 160px">
              <Option v-for="item in sflxList" :value="item.value" :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </div>
        </div>
        <div class="filterItem" style="margin-top: 0">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <!-- <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary">人工随访</Button>
        </div>
      </div>
    </div> -->
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #datatype="{ row }">
        {{ row.datatype === 'ren' ? '人工随访' : 'AI随访' }}
      </template>
      <template #action="{ row }">
        <div>
          <span style="color: #3171ff; cursor: pointer" @click="examine(row)">查看结果</span>
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

    <!-- 评估结果 -->
    <el-dialog
      title="随访记录"
      :visible.sync="inventory"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="inventory_cont" v-loading="loadingShow">
        <!-- <div class="inventory_cont_title">
          <div>2022-02-02 特应性皮炎严重程度指数</div>
          <section>
            总分
            <span>22</span>
            分
          </section>
        </div> -->
        <div class="inventory_cont_list" v-if="inventoryData.length !== 0">
          <div class="inventory_cont_list_item" v-for="(item, index) in inventoryData" :key="index">
            <div>{{ index + 1 }}. {{ item.questit }}</div>
            <div>答: {{ item.quesval }}</div>
          </div>
        </div>
        <div
          v-else
          class="gray tc"
          style="position: relative; left: 50%; top: 50%; transform: translateX(-50%)"
        >
          <img src="@/assets/images/noData.png" style="height: 120px" alt="" />
          <div style="margin-top: 16px">暂无随访记录</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="随访结果"
      :visible.sync="showEdit"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div v-if="planList.length !== 0">
        <!-- <div v-for="(item, index) in MKList" :key="index + 'MKList'" class="MKListItem"> -->
        <div class="title black">{{ plantit }}</div>
        <!-- <div v-for="(itemSon, indexSon) in item.itemArr" :key="indexSon + 'itemSon'"> -->
        <!-- <div class="temTitle">
        {{ plantit }}
        <span>总分：</span>
        <span class="red">{{ itemSon.totalSorce }}</span>
        <span style="margin-left: 8px; cursor: pointer">
          <span class="blue" v-if="!itemSon.showDetail" @click="itemSon.showDetail = true">
            展开
            <i class="iconfont icon-xiala blue" style="font-size: 8px"></i>
          </span>
          <span class="blue" v-if="itemSon.showDetail" @click="itemSon.showDetail = false">
            隐藏
            <i class="iconfont icon-shang blue" style="font-size: 8px"></i>
          </span>
        </span>
      </div> -->
        <!-- <div v-if="itemSon.showDetail"> -->
        <div v-for="(item, index) in planList" :key="index + 'item'" class="questionItem black">
          <div style="margin-top: 8px">{{ index + 1 }}.{{ item.questit }}</div>
          <div style="margin-top: 8px">
            答：{{ item.quesval }}
            <!-- <span>{{ item.mark }}分</span> -->
          </div>
        </div>
        <!-- </div> -->
        <!-- </div> -->
        <!-- </div> -->
      </div>
      <div
        v-else
        class="gray tc"
        style="position: relative; left: 50%; top: 50%; transform: translateX(-50%)"
      >
        <img src="@/assets/images/noData.png" style="height: 120px" alt="" />
        <div style="margin-top: 16px">暂无随访记录</div>
      </div>
      <div slot="footer"></div>
    </el-dialog>
  </div>
</template>

<script>
import { treated } from '@/api/treated/index'
import { manualFollowUp, ai } from '@/api/specialistFollowUp/index'
export default {
  name: 'sfjl',
  data () {
    return {
      patid: this.$route.query.patid,
      pageSize: 10,
      loading: false,
      loadingShow: false,
      showEdit: false,
      plantit: '',
      planList: [],
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
      followtype: '',
      sflxList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'ren',
          label: '人工随访'
        },
        {
          value: 'ai',
          label: 'AI随访'
        }
      ],
      columns: [
        // {
        //   title: '序号',
        //   key: 'id'
        // },
        {
          title: '随访日期',
          key: 'followdate'
        },
        {
          title: '就诊诊断',
          key: 'diagnose'
        },
        {
          title: '随访模板',
          key: 'tempname'
        },
        {
          title: '随访类型',
          slot: 'datatype'
        },
        // {
        //   title: '随访人员',
        //   key: 'visitName'
        // },
        {
          title: '操作',
          slot: 'action',
          width: 120
        }
      ],
      tableData: [],
      pageNum: 0,
      currentPageIdx: 1,
      inventory: false,
      inventoryData: []
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
    reset () {
      this.followtype = ''
      this.changeFilter()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    examine (row) {
      this.loadingShow = true
      if (row.datatype === 'ren') {
        manualFollowUp
          .sfjl({
            followid: row.dataid
          })
          .then(res => {
            let data = res.data
            this.inventoryData = data
            this.inventory = true
            this.loadingShow = false
          })
      } else if (row.datatype === 'ai') {
        ai.detailResult({
          dataid: row.dataid,
          patientid: row.patid,
          followdate: row.followdate
        }).then(res => {
          let data = res.data
          this.planList = data.lists
          this.plantit = data.plantit
          this.showEdit = true
          // console.log(data)
        })
      }
    },
    getList () {
      this.loading = true
      treated
        .fllowUpHist({
          followtype: this.followtype === 'all' ? '' : this.followtype,
          page: this.currentPageIdx,
          limit: this.pageSize,
          patid: this.patid
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
          // console.log(data)
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.title {
  position: relative;
  padding-left: 12px;
  font-weight: 500;
  font-size: 18px;
  &::after {
    content: '';
    display: block;
    position: absolute;
    background: #3171ff;
    width: 4px;
    height: 18px;
    top: 4px;
    left: 0;
  }
}
// 评估结果
.inventory_cont {
  position: relative;
  .inventory_cont_title {
    display: flex;
    align-items: center;
    div {
      font-size: 16px;
      font-weight: 400;
      color: #282d3c;
      line-height: 21px;
    }
    section {
      font-size: 16px;
      font-weight: 400;
      color: #969baa;
      line-height: 21px;
      margin-left: 5px;
      span {
        color: #f75559;
      }
    }
  }
  .inventory_cont_list {
    .inventory_cont_list_item {
      margin-top: 30px;
      font-size: 14px;
      font-weight: 400;
      color: #282d3c;
      line-height: 17px;
      div {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      &:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>
