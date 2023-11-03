
<template>
  <div class="isOpenMedic">
    <div class="filterCtn">
      <div class="itemFather">
        <!-- <div class="filterItem">
          <div class="label">类型</div>
          <div>
            <Select v-model="status" style="width: 160px" disabled>
              <Option :value="1">待开药</Option>
              <Option :value="2">已开药</Option>
            </Select>
          </div>
        </div> -->
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="请输入患者姓名" v-model="keyword" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #treattime="{ row }">
        {{ row.treattime || '-' }}
      </template>
      <template #action="{ row }">
        <span class="btn" v-if="status !== 2" @click="openEdit(row)">处方</span>
        <span class="btn red" @click="deleteItem(row)">退回</span>
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
      title="开药"
      :visible.sync="showEdit"
      width="920px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div>
        <Table :columns="smallColumns" :data="smallTabledata">
          <template #action="{ row }">
            <span class="btn" @click="openEdit(row)">开药</span>
            <span class="btn red" @click="deleteItem(row)">删除</span>
          </template>
        </Table>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit">处方执行</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { outpatientPharmacy } from '@/api/outpatientPharmacy/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'isOpenMedic',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      status: 2,
      showEdit: false,
      loading: false,
      chooseMedic: {},
      smallColumns: [
        {
          title: '商品名',
          key: 'medical_name'
        },
        {
          title: '化学名',
          key: 'medical_trade'
        },
        {
          title: '药物规格',
          key: 'medical_spec'
        },
        {
          title: '服用剂量',
          key: 'medical_dose'
        },
        {
          title: '服用方式',
          key: 'medical_usage'
        },
        {
          title: '服用频率',
          key: 'medical_rate'
        },
        {
          title: '用药天数',
          key: 'medical_days'
        },
        {
          title: '开具数量',
          key: 'medical_num'
        },
        {
          title: '开药医生',
          key: 'doctorname'
        },
        {
          title: '开药时间',
          key: 'medical_time',
          width: 140
        }
      ],
      smallTabledata: [],
      columns: [
        {
          key: 'jzcard',
          title: '就诊卡号',
          minWidth: 120
        },
        {
          key: 'patname',
          minWidth: 70,
          title: '姓名'
        },
        {
          key: 'sex',
          minWidth: 60,
          title: '性别'
        },
        {
          key: 'age',
          minWidth: 60,
          title: '年龄'
        },
        {
          key: 'docname',
          minWidth: 90,
          title: '接诊医生'
        },
        {
          slot: 'treattime',
          title: '就诊时间',
          minWidth: 160
        },
        {
          slot: 'action',
          width: 120,
          fixed: 'right',
          title: '操作'
        }
      ],
      tableData: [],
      pageSize: 10,
      keyword: ''
    }
  },
  methods: {
    changePage (page) {
      this.currentPageIdx = page
      this.getList()
    },
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.currentPageIdx = 1
      this.getList()
    },
    openEdit (row) {
      this.chooseMedic = deepClone(row)
      outpatientPharmacy
        .storeDetail({
          appointid: row.appointid
        })
        .then(res => {
          // console.log(res)
          let data = res.data
          this.smallTabledata = data
          this.showEdit = true
        })
    },
    saveEdit () {
      outpatientPharmacy
        .prescribeCarry({
          appointid: this.chooseMedic.appointid
        })
        .then(res => {
          this.$Message.success('执行成功')
          this.getList()
          this.showEdit = false
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
    getList () {
      this.loading = true
      outpatientPharmacy
        .list({
          status: this.status,
          page: this.currentPageIdx,
          limit: this.pageSize,
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.pageNum = data.total
          this.tableData = data.lists
          this.loading = false
        })
    },
    deleteItem (row) {
      this.$confirm('是否确认退回?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(res => {
        outpatientPharmacy
          .backPrescribe({
            appointid: row.appointid
          })
          .then(res => {
            // console.log(res)
            this.$Message.success('退回成功')
            this.getList()
          })
        // this.tableData.splice(row._index, 1)
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import '../outpatientPharmacy.less';
</style>
