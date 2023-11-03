<template>
  <div class="EVAFollowUp">
    <div class="tabItemCon">
      <div v-if="!showEdit && !showDetail">
        <div class="filterCtn">
          <div class="itemFather">
            <div class="filterItem">
              <div class="label">搜索</div>
              <div>
                <Input v-model="keyword" search placeholder="随访名称" />
              </div>
            </div>
            <div class="filterItem">
              <Button type="primary" @click="changeFilter">查 询</Button>
              <Button @click="reset" style="margin-left: 0">重 置</Button>
            </div>
          </div>
        </div>
        <div class="filterCtn" style="width: 100%">
          <div class="itemFather" style="width: 100%">
            <div class="filterItem jcsb" style="width: 100%; margin-right: 0">
              <Button type="primary" @click="openEdit('add')">添加量表随访</Button>
              <Button type="primary" style="margin-right: 0" @click="update()">一键刷新</Button>
            </div>
          </div>
        </div>
        <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
          <template #action="{ row }">
            <span class="btn" @click="openDetail(row)">详情</span>
            <span class="btn" @click="openEdit('edit', row)">编辑</span>
            <span class="btn red" @click="deleteItem(row)">删除</span>
          </template>
          <template #followmode="{ row }">
            {{ row.followmode === 'point' ? '指定日期随访' : '固定周期随访' }}
          </template>
          <template #date="{ row }">
            {{ row.followmode === 'point' ? row.followdate : `${row.startdate} - ${row.enddate}` }}
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
      <EVAAdd
        v-if="showEdit"
        :isAdd="isAdd"
        :chooseSF="chooseSF"
        @back="
          showEdit = false
          getList()
        "
      ></EVAAdd>
      <EVADetail v-if="showDetail" @back="showDetail = false" :dataid="dataid"></EVADetail>
    </div>
  </div>
</template>

<script>
import { eva } from '@/api/specialistFollowUp/index'
import { common } from '@/api/index'
import { deepClone } from '@/libs/util'
import EVAAdd from './EVAAdd/EVAAdd.vue'
import EVADetail from './EVADetail/EVADetail.vue'
export default {
  name: 'EVAFollowUp',
  components: { EVAAdd, EVADetail },
  data () {
    return {
      keyword: '',
      showEdit: false,
      showDetail: false,
      loading: false,
      dataid: '',
      pageNum: 0,
      pageSize: 10,
      currentPageIdx: 1,
      columns: [
        {
          title: '随访名称',
          key: 'title'
        },
        {
          title: '随访模式',
          slot: 'followmode'
        },
        {
          title: '随访频率',
          key: 'followrate'
        },
        {
          title: '随访日期',
          slot: 'date'
        },
        {
          title: '患者模式',
          key: 'modetype'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 160
        }
      ],
      tableData: [],
      chooseSF: {}
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
      eva
        .list({
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
        .catch(err => {
          console.log('量表随访:', err)
          this.loading = false
        })
    },
    update () {
      eva.update().then(res => {
        this.$Message.success(res.msg)
        this.getList()
      })
    },
    openEdit (type, row) {
      this.loadingDialog = true
      if (type === 'add') {
        this.isAdd = true
        this.loadingDialog = false
      } else {
        this.isAdd = false
      }

      eva.edit({ dataid: row ? row.dataid : '' }).then(res => {
        let data = res.data
        this.patList = deepClone(data.patientary)
        data.patientdimen.diagnose = data.patientdimen.diagnose.split(',')
        data.weekDate = [data.startdate, data.enddate]
        data.dateList = data.followdate.split(',').map(item => {
          return {
            date: item
          }
        })

        this.chooseSF = deepClone(data)
        this.evaList = this.chooseSF.evaary
        this.chooseSF.evaids = this.chooseSF.evaids.split(',').map(item => Number(item))

        if (this.chooseSF.patientids !== '' && typeof this.chooseSF.patientids === 'string') {
          this.$nextTick(() => {
            setTimeout(() => {
              this.chooseSF.patientids = this.chooseSF.patientids.split(',').map(Number)
              this.loadingDialog = false
              this.$forceUpdate()
            }, 200)
          })
        } else {
          this.loadingDialog = false
        }
      })

      this.showEdit = true
    },
    openDetail (row) {
      this.dataid = row.dataid
      this.showDetail = true
    },
    deleteItem (row) {
      eva
        .del({
          dataid: row.dataid
        })
        .then(res => {
          this.$Message.success('删除成功')
          this.getList()
        })
    }
  },
  mounted () {
    common.getSelect({ type: 'diagnose' }).then(res => {
      let data = res.data
      this.diagnoseList = data.diagnose
    })
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './EVAFollowUp.less';
</style>
