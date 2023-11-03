<template>
  <div class="YYYZ">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="药品名称" v-model="keyword" />
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
          <Button type="primary" @click="openEdit('add')">新增药品</Button>
        </div>
      </div>
    </div>
    <Table :columns="columns" :data="tableData" style="margin-top: 16px">
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
      :title="isAdd ? '新增药品' : '编辑药品'"
      :visible.sync="showEdit"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">商品名称</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.medicine_name" placeholder="请输入商品名称" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">商品名首字母</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.firstlet" placeholder="请输入商品名首字母" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">商品名全拼</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.fullet" placeholder="请输入商品名全拼" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">化学名称</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.medicine_trade" placeholder="请输入化学名称" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">化学名首字母</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.pfirstlet" placeholder="请输入化学名首字母" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">化学名全拼</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.pfullet" placeholder="请输入化学名全拼" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">商品规格</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.medicine_spec" placeholder="请输入商品规格" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">服用方式</div>
            <div class="itemContent">
              <Select v-model="chooseMedic.medicine_usage" filterable placeholder="请选择服用方式">
                <Option
                  v-for="(item, index) in selectData.usage"
                  :key="index"
                  :value="item"
                  :label="item"
                ></Option>
              </Select>
            </div>
          </div>
          <!-- <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">单次服用剂量</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.jl" placeholder="请填写单次服用剂量">
                <div class="flex aic" style="height: 100%" slot="suffix">片</div>
              </Input>
            </div>
          </div> -->
        </div>
        <!-- 右边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">剂量单位</div>
            <div class="itemContent">
              <Select v-model="chooseMedic.medicine_unit" filterable placeholder="请选择剂量单位">
                <Option
                  v-for="(item, index) in selectData.unit"
                  :key="index"
                  :value="item"
                  :label="item"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">组装单位</div>
            <div class="itemContent">
              <Select v-model="chooseMedic.medicine_units" filterable placeholder="请选择组装单位">
                <Option
                  v-for="(item, index) in selectData.unit"
                  :key="index"
                  :value="item"
                  :label="item"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">售卖单价</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.medicine_price" placeholder="请输入售卖单价" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">生产厂商</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.medicine_firm" placeholder="请输入生产厂商" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">服用剂量</div>
            <div class="itemContent">
              <Select v-model="chooseMedic.medicine_dose" filterable placeholder="请选择服用剂量">
                <Option
                  v-for="(item, index) in selectData.dose"
                  :key="index"
                  :value="item"
                  :label="item"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">服用频率</div>
            <div class="itemContent">
              <Select v-model="chooseMedic.medicine_rate" filterable placeholder="请选择服用频率">
                <Option
                  v-for="(item, index) in selectData.rate"
                  :key="index"
                  :value="item"
                  :label="item"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">剩余库存</div>
            <div class="itemContent">
              <Input v-model="chooseMedic.medicine_num" placeholder="请输入剩余库存" />
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
import { common } from '@/api/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'YYYZ',
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
      chooseMedic: {},
      columns: [
        {
          title: '序号',
          key: 'dataid',
          width: 80
        },
        {
          title: '商品名称',
          key: 'medicine_name',
          width: 175
        },
        {
          title: '化学名称',
          key: 'medicine_trade',
          width: 169
        },
        {
          title: '药物规格',
          key: 'medicine_spec',
          minWidth: 110
        },
        {
          title: '药物剂量',
          key: 'medicine_dose',
          width: 100
        },
        {
          title: '剂量单位',
          key: 'medicine_unit',
          width: 100
        },
        {
          title: '组装单位',
          key: 'medicine_units',
          width: 90
        },
        {
          title: '生产厂商',
          key: 'medicine_firm',
          minWidth: 230
        },
        {
          title: '零售价格',
          key: 'medicine_price',
          width: 110
        },
        {
          title: '剩余库存',
          key: 'medicine_num',
          width: 100
        },
        {
          title: '商品名拼音首字母',
          key: 'firstlet',
          width: 140
        },
        {
          title: '化学名名拼音首字母',
          key: 'pfirstlet',
          width: 170
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 120
        }
      ],
      tableData: [],
      selectData: {}
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
      let param = deepClone(this.chooseMedic)
      payService
        .yzSave(param)
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
        this.chooseMedic = {
          dataid: '', // 列表数据ID
          medicine_name: '', // 商品名称
          medicine_trade: '', // 化学名称
          medicine_spec: '', // 商品规格
          medicine_usage: '', // 服用方式
          medicine_unit: '', // 剂量单位
          medicine_units: '', // 组装单位
          medicine_price: '', // 售卖单价
          medicine_firm: '', // 生产厂商
          medicine_dose: '', // 服用剂量
          medicine_rate: '', // 服用频率
          medicine_num: '', // 剩余库存
          firstlet: '', // 商品名首字母
          fullet: '', // 商品名全拼
          pfirstlet: '', // 化学名首字母
          pfullet: '' // 化学名全拼
        }
      } else {
        this.isAdd = false
        payService
          .yzDetail({
            dataid: row.dataid
          })
          .then(res => {
            let data = res.data
            data.medicine_dose = Number(data.medicine_dose)
            this.chooseMedic = data
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
          .yzDelete({
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
        .yzList({
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
          console.log('用药医嘱:', err)
          this.loading = false
        })
    }
  },
  mounted () {
    this.getList()
    common
      .getSelect({
        type: 'rate,unit,dose,usage',
        postype: 'doctor'
      })
      .then(res => {
        this.selectData = res.data
      })
  }
}
</script>

<style lang="less" scoped>
@import '../medicationOrder.less';
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
