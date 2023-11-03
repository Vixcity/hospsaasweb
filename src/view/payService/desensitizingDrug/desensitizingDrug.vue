<template>
  <div class="desensitizingDrug">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="脱敏药物名称" />
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
          <Button type="primary" @click="openEdit('add')">新增脱敏药物</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #action="{ row }">
        <span class="btn" @click="openEdit('edit', row)">编辑</span>
        <span class="btn red" @click="deleteItem(row)">删除</span>
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
      :title="isAdd ? '新增脱敏药物' : '编辑脱敏药物'"
      :visible.sync="showEdit"
      width="420px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">脱敏药物名称</div>
            <div class="itemContent flex aic">
              <Select v-model="chooseTM.tag">
                <Option value="cd">畅迪</Option>
                <Option value="atd">安脱达</Option>
                <Option value="alg">阿罗格</Option>
              </Select>
              <div style="margin: 0 8px">-</div>
              <Input v-model="chooseTM.name" placeholder="药物详情" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">单价</div>
            <div class="itemContent">
              <Input v-model="chooseTM.price" placeholder="请输入单价" type="number" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">次数</div>
            <div class="itemContent">
              <Input v-model="chooseTM.num" placeholder="请填写次数" type="number"></Input>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit" :loading="loadingSaveEdit">保 存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { payService } from '@/api/payService/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'desensitizingDrug',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      isAdd: false,
      showEdit: false,
      loading: false,
      loadingSaveEdit: false,
      keyword: '',
      chooseTM: {
        dataid: '',
        name: '',
        tag: 'cd',
        price: '',
        num: ''
      },
      columns: [
        // {
        //   title: '序号',
        //   key: 'dataid'
        // },
        {
          title: '脱敏药物名称',
          key: 'name'
        },
        {
          title: '单价',
          key: 'price'
        },
        {
          title: '次数',
          key: 'num'
        },
        {
          title: '操作',
          slot: 'action',
          width: 120,
          fixed: 'right'
        }
      ],
      tableData: []
    }
  },
  methods: {
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
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
    saveEdit () {
      this.loadingSaveEdit = true
      let param = deepClone(this.chooseTM)
      switch (param.tag) {
        case 'cd':
          param.name = param.name ? '畅迪-' + param.name : '畅迪'
          break

        case 'atd':
          param.name = param.name ? '安脱达-' + param.name : '安脱达'
          break

        case 'alg':
          param.name = param.name ? '阿罗格-' + param.name : '阿罗格'
          break
      }
      payService
        .tmSave(param)
        .then(res => {
          if (res.msg === '新增成功' || res.msg === '更新成功') {
            this.showEdit = false
            this.$Message.success(res.msg)
            this.getList()
          } else {
            this.$Message.error(res.msg)
          }
          this.loadingSaveEdit = false
        })
        .catch(() => {
          this.loadingSaveEdit = false
        })
    },
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.chooseTM = {
          dataid: '',
          name: '',
          tag: 'cd',
          price: '',
          num: ''
        }
      } else {
        this.isAdd = false
        payService
          .tmDetail({
            dataid: row.dataid
          })
          .then(res => {
            let data = res.data
            data.name = data.name.split('-')[1] ? data.name.split('-')[1] : ''
            this.chooseTM = data
          })
      }

      this.showEdit = true
    },
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        payService
          .tmDelete({
            dataid: row.dataid
          })
          .then(res => {
            this.$Message.success(res.msg)
            this.getList()
          })
      })
    },
    getList () {
      this.loading = true
      payService
        .tmList({
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
          console.log('服用频率:', err)
          this.loading = false
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './desensitizingDrug.less';
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
</style>
