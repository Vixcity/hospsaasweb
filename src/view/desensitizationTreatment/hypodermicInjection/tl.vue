<template>
  <div class="tl">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" search placeholder="患者姓名/项目名称" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <!-- <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary">新增患者</Button>
          <Button type="primary" @click="getYYXQ">预约详情</Button>
          <Button type="primary">导 入</Button>
          <Button type="primary">导 出</Button>
        </div>
      </div>
    </div> -->
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #isdrop="{ row }">
        <span>{{ row.isdrop === 'Y' ? '是' : '否' }}</span>
      </template>
      <template #synum="{ row }">
        <span v-if="row.synum < 2" class="red">{{ row.synum }}</span>
        <span v-else>{{ row.synum }}</span>
      </template>
      <template #action="{ row }">
        <span class="btn blue" @click="getDetail(row)">详情</span>
        <span class="btn blue" @click="tuoluo(row)">未脱落</span>
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
</template>

<script>
import { pxzs } from '@/api/desensitizationTreatment/index'
export default {
  name: 'tl',
  data () {
    var showjzno = JSON.parse(localStorage.getItem('userInfo')).showjzno
    var columns = showjzno === 'Y' ? [
      {
        key: 'jzcard',
        title: '就诊卡号',
        minWidth: 120
      },
      {
        key: 'jzno',
        title: '编号',
        minWidth: 120
      },
      {
        key: 'realname',
        title: '姓名',
        minWidth: 80
      },
      {
        key: 'gender',
        title: '性别',
        minWidth: 80
      },
      {
        key: 'age',
        title: '年龄',
        minWidth: 80
      },
      {
        key: 'stages',
        title: '所处阶段',
        width: 150
      },
      {
        key: 'medicine',
        title: '脱敏药品',
        minWidth: 150
      },
      {
        key: 'dropmark',
        title: '脱落原因',
        minWidth: 200
      },
      {
        slot: 'action',
        title: '操作',
        minWidth: 120,
        fixed: 'right',
        className: 'defaultInfo'
      }
    ] : [
      {
        key: 'jzcard',
        title: '就诊卡号',
        minWidth: 120
      },
      {
        key: 'realname',
        title: '姓名',
        minWidth: 80
      },
      {
        key: 'gender',
        title: '性别',
        minWidth: 80
      },
      {
        key: 'age',
        title: '年龄',
        minWidth: 80
      },
      {
        key: 'stages',
        title: '所处阶段',
        width: 150
      },
      {
        key: 'medicine',
        title: '脱敏药品',
        minWidth: 150
      },
      {
        key: 'dropmark',
        title: '脱落原因',
        minWidth: 200
      },
      {
        slot: 'action',
        title: '操作',
        minWidth: 120,
        fixed: 'right',
        className: 'defaultInfo'
      }
    ]
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      keyword: '',
      loading: false,
      columns,
      tableData: [],
      chooseZSJL: {}
    }
  },
  methods: {
    // 当前页数发生改变
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.getList()
    },
    tuoluo (row) {
      pxzs
        .saveDrop({
          tuominid: row.tuominid,
          isdrop: 'N',
          dropmark: row.dropmark
        })
        .then(res => {
          this.$Message.success('保存成功')
          this.getList()
        })
        .catch(err => {
          console.log('皮下注射-保存脱落:', err)
          this.loading = false
        })
    },
    // 详情
    getDetail (row) {
      this.$router.push({ path: '/detail?patid=' + row.patid })
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    reset () {
      this.keyword = ''
      this.changeFilter()
    },
    getList () {
      this.loading = true
      pxzs
        .dropList({
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
          console.log('皮下注射-待执行:', err)
          this.loading = false
        })
    },
    // 每页数量发生改变
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
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
    // width: 120px;
    margin-right: 40px;
    font-size: 14px;
    line-height: 30px;
  }
}
</style>
