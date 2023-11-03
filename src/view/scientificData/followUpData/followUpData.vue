<template>
  <div class="followUpData">
    <div class="tabItemCon">
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
        <template #datatype="{ row }">
          {{ row.datatype === 'ren' ? '人工随访' : 'AI随访' }}
        </template>
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
    <el-dialog
      title="随访结果"
      :visible.sync="showEdit"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <!-- <div v-for="(item, index) in MKList" :key="index + 'MKList'" class="MKListItem"> -->
      <div class="title">{{ plantit }}</div>
      <!-- <div v-for="(itemSon, indexSon) in item.itemArr" :key="indexSon + 'itemSon'">
          <div class="temTitle">
            {{ itemSon.title }} 总分：
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
          </div>
          <div v-if="itemSon.showDetail"> -->
      <div v-for="(item, index) in planList" :key="index + 'item'" class="questionItem black">
        <div style="margin-top: 8px">{{ index + 1 }}.{{ item.questit }}</div>
        <div style="margin-top: 8px">
          答：{{ item.quesval }}
          <!-- <span>{{ item.mark }}分</span> -->
        </div>
      </div>
      <div v-if="planList.length === 0">
        <div class="gray tc">
          <img src="@/assets/images/noData.png" alt="" style="height: 120px; margin-top: 16px" />
          <div style="margin-top: 16px">暂无量表评估</div>
        </div>
      </div>
      <!-- </div>
        </div>
      </div> -->
      <div slot="footer"></div>
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
import { sfData } from '@/api/scientificData/index'
import { common } from '@/api/index'
import { manualFollowUp, ai } from '@/api/specialistFollowUp/index'
import pdf from 'vue-pdf'
export default {
  name: 'followUpData',
  components: {
    pdf
  },
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      src: '',
      keyword: '',
      plantit: '',
      filename: '',
      showXZ: false,
      showPDFBoolean: false,
      loading: false,
      showEdit: false,
      planList: [],
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
        // {
        //   title: '年龄',
        //   key: 'age'
        // },
        {
          title: '诊断结果',
          key: 'diagnose',
          minWidth: 300
        },
        {
          title: '随访时间',
          key: 'followdate',
          minWidth: 120
        },
        {
          title: '随访类型',
          slot: 'datatype',
          minWidth: 100
        },
        {
          title: '随访模板',
          key: 'tempname',
          minWidth: 200
        },
        {
          title: '操作',
          width: 170,
          fixed: 'right',
          slot: 'action'
        }
      ],
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
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    reset () {
      this.keyword = ''
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
    getList (isExport) {
      let param = {
        page: this.currentPageIdx,
        limit: this.pageSize,
        keyword: this.keyword
      }
      if (isExport) {
        param.export = true
      } else {
        this.loading = true
      }
      sfData
        .list(param)
        .then(res => {
          let data = res.data
          if (isExport) {
            this.filename = data
            this.showXZ = true
          } else {
            this.tableData = data.lists
            this.pageNum = data.total
            this.loading = false
          }
        })
        .catch(err => {
          console.log('随访数据:', err)
          this.loading = false
        })
    },
    showPDF (row) {
      sfData
        .viewPDF({
          dataid: row.dataid,
          datatype: row.datatype,
          patid: row.patid,
          createdate: row.createdate
        })
        .then(res => {
          let data = res.data
          console.log(data)
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
      if (row.datatype === 'ren') {
        manualFollowUp
          .sfjl({
            followid: row.dataid
          })
          .then(res => {
            // console.log(row)
            let data = res.data
            this.planList = data
            this.plantit = row.tempname
            this.showEdit = true
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
        })
      } else {
        this.$Message.error('系统出错')
      }
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './followUpData.less';
.title {
  font-size: 18px;
  font-weight: 500;
  padding-left: 12px;
  position: relative;
  color: @black;
  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 18px;
    position: absolute;
    background: @blue;
    left: 0;
    top: 3px;
  }
}
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
.MKListItem {
  border-top: 1px dotted @disabled;
  margin-top: 16px;
  padding-top: 16px;
  .temTitle {
    color: @black;
    margin-top: 8px;
    font-weight: 500;
    font-size: 14px;
  }
  &:first-child {
    padding-top: 0;
    margin-top: 0;
    border-top: 0;
  }
  .questionItem {
    color: @black;
    overflow: hidden;
    margin-top: 30px;
    &:first-child {
      margin-top: 8px;
    }
  }
}
</style>
<style scoped>
.followUpData >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
