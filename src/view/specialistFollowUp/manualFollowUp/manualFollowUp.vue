<template>
  <div class="manualFollowUp">
    <div v-if="!kssf" class="tabItemCon">
      <div class="filterCtn">
        <div class="itemFather">
          <!-- <div class="filterItem">
            <div class="label">脱敏药物</div>
            <div>
              <Select style="width: 180px">
                <Option value="全部">全部</Option>
                <Option value="安脱达">安脱达</Option>
                <Option value="畅迪">畅迪</Option>
                <Option value="阿格罗">阿格罗</Option>
              </Select>
            </div>
          </div> -->
          <div class="filterItem">
            <div class="label">离院时间大于</div>
            <div>
              <Input v-model="minday" type="number" style="width: 160px">
                <div slot="suffix" class="flex aic" style="height: 100%">天</div>
              </Input>
            </div>
          </div>
          <div class="filterItem">
            <div class="label">搜索</div>
            <div>
              <Input v-model="keyword" search placeholder="患者姓名/手机号" />
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
          <!-- <div class="filterItem">
            <Button type="primary" @click="addSF">新 增</Button>
            <Button type="primary">导 入</Button>
            <Button type="primary">导 出</Button>
          </div> -->
        </div>
      </div>
      <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
        <template #isfollow="{ row }">
          <span v-if="row.isfollow === 'Y'" class="flex aic">
            <div
              style="
                width: 8px;
                height: 8px;
                background: #d2d7e1;
                margin-right: 8px;
                border-radius: 4px;
              "
            ></div>
            已随访
          </span>
          <span v-else class="flex aic">
            <div
              style="
                width: 8px;
                height: 8px;
                background: #ffbd38;
                margin-right: 8px;
                border-radius: 4px;
              "
            ></div>
            未随访
          </span>
        </template>
        <template #action="{ row }">
          <span v-if="row.isfollow === 'Y'" class="btn" @click="examine(row)">查 看</span>
          <span v-else class="btn" @click="startSF(row)">开始随访</span>
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
    <KSSF v-else :chooseSF="chooseSF" @close="closeKSSF"></KSSF>

    <!-- 新增 -->
    <el-dialog
      title="新增"
      :visible.sync="edit"
      width="450px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
      @close="cancel"
    >
      <Form ref="ruleForm" :model="ruleForm" :rules="rules" :label-width="100">
        <FormItem label="患者名称" prop="name">
          <Select v-model="ruleForm.name" filterable laceholder="请选择患者名称">
            <Option value="禄欣可">禄欣可</Option>
            <Option value="王梦丝">王梦丝</Option>
            <Option value="尚德曜">尚德曜</Option>
            <Option value="瞿涵映">瞿涵映</Option>
          </Select>
        </FormItem>
        <FormItem label="随访日期" prop="date">
          <DatePicker :editable="false" type="date" placeholder="请选择随访日期"></DatePicker>
        </FormItem>
        <FormItem label="模板" prop="template">
          <Select v-model="ruleForm.template" filterable placeholder="请选择模板">
            <Option value="过敏性鼻炎">过敏性鼻炎</Option>
            <Option value="特应性咽炎">特应性咽炎</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取 消</Button>
        <Button type="primary" @click="submit">确 定</Button>
      </div>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog
      title="随访记录"
      :visible.sync="inventory"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="inventory_cont">
        <!-- <div class="inventory_cont_title">
          <div>SCORAD（特应性皮炎严重程度指数）</div>
          <section>
            总分
            <span>22</span>
            分
          </section>
        </div> -->
        <div class="inventory_cont_list">
          <div class="inventory_cont_list_item" v-for="(item, index) in inventoryData" :key="index">
            <div>{{ index + 1 }}. {{ item.questit }}</div>
            <div>答: {{ item.quesval }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { manualFollowUp } from '@/api/specialistFollowUp/index'
import KSSF from './KSSF/KSSF'
import { deepClone } from '@/libs/util'
export default {
  name: 'manualFollowUp',
  components: {
    KSSF
  },
  data () {
    return {
      kssf: false,
      keyword: '',
      loading: false,
      pageNum: 0,
      pageSize: 10,
      currentPageIdx: 1,
      minday: 0,
      maxday: '',
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
          title: '年龄',
          key: 'age',
          minWidth: 80
        },
        {
          title: '联系电话',
          key: 'mobile',
          minWidth: 130
        },
        {
          title: '诊断',
          key: 'diagnose',
          minWidth: 400
        },
        {
          title: '初/复诊',
          key: 'visittype',
          minWidth: 100
        },
        {
          title: '离院天数',
          key: 'outday',
          width: 120
        },
        {
          title: '随访日期',
          key: 'followdate',
          width: 120
        },
        {
          title: '状态',
          slot: 'isfollow',
          width: 100
        },
        // {
        //   title: '脱敏药品',
        //   key: 'medic',
        //   width: 140
        // },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 100
        }
      ],
      tableData: [],
      edit: false,
      ruleForm: {
        name: '',
        date: '',
        template: ''
      },
      rules: {},
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
      this.currentPageIdx = 1
      this.getList()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    reset () {
      this.minday = 0
      this.keyword = ''
      this.changeFilter()
    },
    getList () {
      this.loading = true
      manualFollowUp
        .renList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          minday: this.minday,
          maxday: this.maxday,
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
        })
        .catch(err => {
          console.log('人工随访:', err)
          this.loading = false
        })
    },
    startSF (row) {
      this.kssf = true
      this.chooseSF = deepClone(row)
    },
    closeKSSF () {
      this.getList()
      this.kssf = false
    },
    addSF () {
      this.edit = true
    },
    // 取消
    cancel () {
      this.edit = false
      this.$refs['ruleForm'].resetFields()
    },
    // 确 定
    submit () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$Message.success('添加成功')
          this.cancel()
        }
      })
    },
    examine (row) {
      manualFollowUp
        .sfjl({
          followid: row.followid
        })
        .then(res => {
          let data = res.data
          this.inventoryData = data
          this.inventory = true
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './manualFollowUp.less';
.inventory_cont {
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
      &:first-child {
        margin-top: 0;
      }
      div {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
<style scoped>
.manualFollowUp >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}

html >>> .ivu-date-picker {
  width: 100%;
}
</style>
