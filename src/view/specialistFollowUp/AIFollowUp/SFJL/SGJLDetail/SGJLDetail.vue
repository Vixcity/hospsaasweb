<template>
  <div class="SGJLDetail">
    <div class="flex jcsb aic">
      <div class="title">随访记录详情</div>
      <Button type="primary" @click="toPrev">返回上一级</Button>
    </div>
    <div class="flex aic" style="margin-top: 16px;">
      <div class="itemLabel">记录名称：{{ info.datatit }}</div>
      <div class="itemLabel">记录模式：{{ info.modetype }}</div>
      <div class="itemLabel">随访计划：{{ info.plantit }}</div>
    </div>
    <div class="line"></div>
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" search placeholder="关键词搜索" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset" style="margin-left: 0">重 置</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #isfinish="{ row }">
        {{ row.isfinish === 'Y' ? '已填写' : '未填写' }}
      </template>
      <template #action="{ row }">
        <span v-if="row.isfinish === 'N'" style="color: #969baa; cursor: not-allowed">
          人工拨打
        </span>
        <span v-if="row.isfinish === 'Y'" class="btn" @click="openEdit(row)">查看结果</span>
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
      title="随访结果"
      :visible.sync="showEdit"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
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
      <div slot="footer"></div>
    </el-dialog>
  </div>
</template>

<script>
import { ai } from '@/api/specialistFollowUp/index'
export default {
  name: 'SGJLDetail',
  props: ['dataid'],
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      showEdit: false,
      loading: false,
      info: {},
      keyword: '',
      columns: [
        {
          title: '就诊卡号',
          key: 'jzcard',
          minWidth: 120
        },
        {
          title: '姓名',
          key: 'realname',
          minWidth: 90
        },
        {
          title: '年龄',
          key: 'age',
          minWidth: 60
        },
        {
          title: '诊断结果',
          key: 'diagnose',
          minWidth: 250
        },
        {
          title: '填写状态',
          slot: 'isfinish',
          minWidth: 90
        },
        {
          title: '提交日期',
          key: 'finishdate',
          minWidth: 110
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 100
        }
      ],
      tableData: [],
      planList: [],
      plantit: ''
    }
  },
  methods: {
    toPrev () {
      this.$emit('back')
    },
    getDetail () {
      ai.detail({
        dataid: this.dataid
      }).then(res => {
        let data = res.data
        this.info = data
      })
    },
    getList () {
      this.loading = true
      ai.detailList({
        dataid: this.dataid,
        keyword: this.keyword,
        page: this.currentPageIdx,
        limit: this.pageSize
      }).then(res => {
        let data = res.data
        this.tableData = data.lists
        this.pageNum = data.total
        this.loading = false
      })
    },
    openEdit (row) {
      ai.detailResult({
        dataid: this.dataid,
        patientid: row.patientid,
        followdate: row.finishdate
      }).then(res => {
        let data = res.data
        this.planList = data.lists
        this.plantit = data.plantit
        this.showEdit = true
        // console.log(data)
      })
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    changePage (index) {
      this.currentPageIdx = index
      this.getList()
    },
    reset () {
      this.keyword = ''
      this.changeFilter()
    },
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    }
  },
  mounted () {
    this.getDetail()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import '../../AIFollowUp.less';
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
    overflow: hidden;
    margin-top: 30px;
    &:first-child {
      margin-top: 8px;
    }
  }
}
</style>
