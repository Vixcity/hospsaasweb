<template>
  <div class="assessmentData">
    <div class="tab_header">
      <div class="tab_header_active tab_header_item" style="padding-bottom: 5px">
        <Dropdown :transfer="true" @on-click="clickDropDown">
          <div class="flex jcsb" style="width: 200px; padding-bottom: 8px">
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
              {{ tabList[tab_index].evatit }}
            </div>
            <Icon type="ios-arrow-down"></Icon>
          </div>
          <DropdownMenu slot="list">
            <DropdownItem
              v-for="(item, index) in tabList"
              style="
                min-width: 224px;
                max-width: 224px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
              :key="index"
              :name="item.evaid"
            >
              {{ item.evatit }}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <!-- <div
        v-for="(item, index) in tabList"
        :key="index"
        @click="
          tab_index = item.evaid
          getList()
        "
      >
        {{ item.evatit }}
      </div> -->
    </div>
    <div class="tab_container" v-if="!noData" style="background: white; height: calc(100% - 44px)">
      <div v-for="(item, index) in tabList" :label="item" :name="index + ''" :key="index">
        <div class="tabItemCon" v-if="tab_index === index">
          <div class="filterCtn">
            <div class="itemFather">
              <!-- <div class="filterItem">
                <div class="label">诊断结果</div>
                <div>
                  <Select style="width: 180px" filterable>
                    <Option value="良好">良好</Option>
                    <Option value="不好">不好</Option>
                    <Option value="健康">健康</Option>
                  </Select>
                </div>
              </div> -->
              <div class="filterItem">
                <div class="label">搜索</div>
                <div>
                  <Input v-model="keyword" search placeholder="人员姓名/人员账号" />
                </div>
              </div>
              <div class="filterItem">
                <Button type="primary" @click="changeFilter">查 询</Button>
                <Button @click="reset">重 置</Button>
              </div>
            </div>
          </div>
          <div class="filterCtn">
            <div class="itemFather">
              <div class="filterItem">
                <!-- <Button type="primary">导 入</Button> -->
                <Button type="primary" @click="getList(true)">导 出</Button>
              </div>
            </div>
          </div>
          <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
            <template #action="{ row }">
              <span class="tableAdd" @click="openEdit('edit', row)">查看明细</span>
              <span class="tableAdd" @click="showPDF(row)">PDF预览</span>
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
      </div>
    </div>
    <div v-else style="width: 100%; height: calc(100% - 1px); border-left: 1px solid #d2d7e1">
      <div
        class="gray tc"
        style="
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateY(-50%) translateX(-50%);
        "
      >
        <img src="@/assets/images/noData.png" alt="" />
        <div style="margin-top: 16px">暂无评估数据</div>
      </div>
    </div>
    <!-- 量表评估(患者) -->
    <el-dialog
      title="量表评估"
      :visible.sync="inventory"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="inventory_cont">
        <div class="inventory_cont_title">
          <div>{{ inventoryInfo.shorthand }}（{{ inventoryInfo.title }}）</div>
          <section>
            总分
            <span>{{ inventoryInfo.score }}</span>
            分
          </section>
        </div>
        <div class="inventory_cont_list">
          <div class="inventory_cont_list_item" v-for="(item, index) in inventoryData" :key="index">
            <div>{{ item.number }}. {{ item.title }}</div>
            <!-- <div>答: {{ item.svalue }} ({{ item.score }})</div> -->
            <div>答: {{ item.svalue }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 导出结果 -->
    <el-dialog
      title="导出结果"
      :visible.sync="showXZ"
      width="320px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flex aic" style="margin-left: 40px">
        <i class="iconfont icon-a-EXCEL green" style="font-size: 18px; margin-right: 8px"></i>
        <span style="font-size: 14px" class="black">{{ filename }}</span>
      </div>
      <div slot="footer">
        <Button type="primary" @click="download">下 载</Button>
      </div>
    </el-dialog>
    <div v-show="showPDFBoolean" class="pdfClass">
      <i
        class="el-dialog__close el-icon el-icon-close selfClose"
        @click="showPDFBoolean = false"
      ></i>
      <embed :src="src" type="" />
    </div>
  </div>
</template>

<script>
import { pgData } from '@/api/scientificData/index'
import { common } from '@/api/index'
export default {
  name: 'assessmentData',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      inventory: false,
      loading: false,
      showPDFBoolean: false,
      noData: false,
      showXZ: false,
      inventoryInfo: {},
      src: '',
      keyword: '',
      filename: '',
      tabList: [{ evatit: '' }],
      tab_index: 0,
      evaid: '',
      columns: [
        {
          title: '就诊卡号',
          key: 'jzcard',
          minWidth: 120
        },
        {
          title: '姓名',
          key: 'realname',
          minWidth: 80
        },
        {
          title: '性别',
          key: 'gender',
          minWidth: 80
        },
        {
          title: '诊断结果',
          key: 'diagnose',
          minWidth: 90
        },
        {
          title: '评估时间',
          key: 'evatime',
          width: 170
        },
        {
          title: '评估得分',
          key: 'score',
          minWidth: 90
        },
        {
          title: '操作',
          fixed: 'right',
          width: 180,
          slot: 'action'
        }
      ],
      inventoryData: [],
      tableData: []
    }
  },
  methods: {
    changePage (page) {
      this.currentPageIdx = page
      this.getList()
    },
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    },
    download () {
      common
        .downloadExcel({
          filename: this.filename
        })
        .then(res => {
          this.showXZ = false
        })
    },
    showPDF (row) {
      pgData
        .viewPDF({
          evaid: row.evaid,
          patid: row.patientid,
          evatime: row.evatime
        })
        .then(res => {
          let data = res.data
          data = data.replace('http://saas.hzszyjyl.com/api', '/api')
          this.src = data
          this.showPDFBoolean = true
        })
        .catch(err => {
          console.log('查看PDF:', err)
          this.loading = false
        })
    },
    openEdit (type, row) {
      pgData
        .detail({
          patid: row.patientid,
          evaid: row.evaid,
          evacode: row.evacode
        })
        .then(res => {
          let data = res.data
          data.lists.sort(function (a, b) {
            return Number(a.number) - Number(b.number)
          })
          this.inventoryData = data.lists
          this.inventoryInfo = data.info
          this.inventory = true
        })
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    reset () {
      this.keyword = ''
      this.changeFilter()
    },
    getList (isExport) {
      let param = {
        page: this.currentPageIdx,
        limit: this.pageSize,
        keyword: this.keyword,
        evaid: this.evaid
      }
      if (isExport) {
        param.export = true
      } else {
        this.loading = true
      }
      pgData.list(param).then(res => {
        let data = res.data
        if (isExport) {
          this.filename = data
          this.showXZ = true
        } else {
          this.pageNum = data.total
          this.tableData = data.lists
          this.loading = false
        }
      })
    },
    clickDropDown (e) {
      if (this.evaid === e) return
      this.evaid = e
      this.tab_index = this.tabList.findIndex(item => e === item.evaid)
      this.getList()
    },
    getAllList () {
      pgData.allList().then(res => {
        let data = res.data
        this.tabList = data
        if (data.length === 0) {
          this.noData = true
        } else {
          this.evaid = data[0].evaid
          this.getList()
        }
      })
    }
  },
  mounted () {
    this.getAllList()
  }
}
</script>

<style lang="less" scoped>
@import './assessmentData.less';
// 量表评估
.pdfClass {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  embed {
    position: fixed;
    top: 50%;
    width: 80%;
    height: 80%;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .selfClose {
    position: fixed;
    color: white;
    right: 7%;
    top: 4%;
    z-index: 2222;
    font-size: 22px;
    background: rgba(0, 0, 0, 0.7);
    transition: all 0.2s;
    padding: 10px;
    border-radius: 80px;
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.5);
    }
  }
}
.inventory_cont {
  .inventory_cont_title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
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
      span {
        color: #f75559;
      }
    }
  }
  .inventory_cont_list {
    .inventory_cont_list_item {
      margin-bottom: 30px;
      font-size: 14px;
      font-weight: 400;
      color: #282d3c;
      line-height: 17px;
      &:last-child {
        margin-bottom: 0;
      }
      div {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .inventory_cont_mark {
    display: flex;
    align-items: center;
    margin-top: 30px;
    .inventory_cont_mark_title {
      font-size: 14px;
      font-weight: 400;
      color: #282d3c;
      line-height: 17px;
      margin-right: 8px;
    }
    .inventory_cont_mark_ipt {
      width: 110px;
      position: relative;
      /deep/ .ivu-input {
        padding-right: 30px;
        box-sizing: border-box;
      }
      .inventory_cont_mark_ipt_tip {
        position: absolute;
        top: 6px;
        right: 8px;
        font-size: 14px;
        font-weight: 400;
        color: #282d3c;
      }
    }
  }
}
</style>
<style scoped>
.assessmentData >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
