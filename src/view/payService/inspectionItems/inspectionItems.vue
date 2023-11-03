<template>
  <div class="inspectionItems">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="项目名称" v-model="keyword" />
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
          <Button type="primary" @click="openEdit('add')">新增项目</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #isuse="{ row }">
        {{ row.isuse === 'Y' ? '是' : '否' }}
      </template>
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
      :title="isAdd ? '新增项目' : '编辑项目'"
      :visible.sync="showEdit"
      width="660px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">项目名称</div>
            <div class="itemContent">
              <Input v-model="chooseIns.name" placeholder="请填写项目名称" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">项目代码</div>
            <div class="itemContent">
              <Input v-model="chooseIns.code" placeholder="请输入项目代码" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">检查价格</div>
            <div class="itemContent">
              <Input v-model="chooseIns.price" placeholder="请输入检查价格" type="number" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">项目类别</div>
            <div class="itemContent flex aic">
              <RadioGroup v-model="chooseIns.type">
                <Radio label="lab">化验</Radio>
                <Radio label="exam">检查</Radio>
              </RadioGroup>
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">拼音首字母</div>
            <div class="itemContent">
              <Input v-model="chooseIns.firstlet" placeholder="请输入拼音首字母" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">拼音全拼</div>
            <div class="itemContent">
              <Input v-model="chooseIns.fulllet" placeholder="请输入拼音全拼" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">是否启用</div>
            <div class="itemContent flex aic">
              <RadioGroup v-model="chooseIns.isuse">
                <Radio label="Y">是</Radio>
                <Radio label="N">否</Radio>
              </RadioGroup>
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
  name: 'inspectionItems',
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
      chooseIns: {
        dataid: '',
        type: 'lab',
        code: '',
        name: '',
        price: '',
        isuse: 'Y',
        firstlet: '',
        fulllet: ''
      },
      columns: [
        {
          title: '序号',
          key: 'dataid'
        },
        {
          title: '项目名称',
          key: 'name'
        },
        {
          title: '项目代码',
          key: 'code'
        },
        {
          title: '项目类别',
          key: 'type'
        },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '是否启用',
          slot: 'isuse'
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
      let param = deepClone(this.chooseIns)
      payService
        .insSave(param)
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
        this.chooseIns = {
          dataid: '',
          type: 'lab',
          code: '',
          name: '',
          price: '',
          isuse: 'Y',
          firstlet: '',
          fulllet: ''
        }
      } else {
        this.isAdd = false
        payService
          .insDetail({
            dataid: row.dataid
          })
          .then(res => {
            let data = res.data
            this.chooseIns = data
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
          .insDelete({
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
        .insList({
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
@import './inspectionItems.less';
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
