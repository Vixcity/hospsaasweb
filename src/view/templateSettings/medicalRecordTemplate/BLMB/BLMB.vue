<template>
  <div class="BLMB">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <Input placeholder="模板名称" v-model="keyword" style="width: 230px" search />
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset" style="margin-left: 0">重 置</Button>
        </div>
      </div>
    </div>
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary" @click="openEdit('add')">新增模板</Button>
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
      :title="isAdd ? '新增病历模板' : '编辑病历模板'"
      :visible.sync="showEdit"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">病历名称</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.name" style="width: 100%" placeholder="请输入病历名称" />
            </div>
          </div>
          <!-- <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">病历类型</div>
            <div class="itemContent">
              <Select v-model="chooseBLMB.type" style="width: 100%">
                <Option value="科室模板">科室模板</Option>
                <Option value="个人模板">个人模板</Option>
              </Select>
            </div>
          </div> -->
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">主诉</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.suit" placeholder="请输入主诉" />
            </div>
          </div>
          <div class="flex jcsb black">
            <div class="itemLabel" style="width: calc(100% - 236px)">现病史</div>
            <div class="itemContent" style="height: unset">
              <Input
                v-model="chooseBLMB.present"
                type="textarea"
                :rows="3"
                placeholder="请输入现病史"
              />
            </div>
          </div>
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">过敏史</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.allergy" placeholder="请输入过敏史" />
            </div>
          </div>
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">疾病史</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.disease" placeholder="请输入疾病史" />
            </div>
          </div>
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">手术史</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.surgery" placeholder="请输入手术史" />
            </div>
          </div>
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">外伤史</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.trauma" placeholder="请输入外伤史" />
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="fromItem">
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">婚育史</div>
            <div class="itemContent">
              <Select v-model="chooseBLMB.marry" style="width: 100%" placeholder="选择婚育状态">
                <Option value="未婚">未婚</Option>
                <Option value="未育">未育</Option>
                <Option value="已婚">已婚</Option>
                <Option value="已育">已育</Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">家族史</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.family" placeholder="请输入家族史" />
            </div>
          </div>
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">疼痛评估</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.vas" placeholder="请填写疼痛评估" />
            </div>
          </div>
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">心理评估</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.psy" placeholder="请填写心理评估" />
            </div>
          </div>
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">交通工具</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.car" placeholder="请填写交通工具" />
            </div>
          </div>
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">诊断</div>
            <div class="itemContent" style="height: unset">
              <Select
                v-model="chooseBLMB.diagnose"
                multiple
                style="width: 100%"
                filterable
                placeholder="请选择诊断"
              >
                <Option
                  v-for="(item, index) in diagnoseList"
                  :value="item"
                  :label="item"
                  :key="index + 'diagnoseList'"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex jcsb aic black">
            <div class="itemLabel" style="width: calc(100% - 236px)">备注</div>
            <div class="itemContent">
              <Input v-model="chooseBLMB.remark" placeholder="请填写备注" />
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
import { templateSettings } from '@/api/templateSettings/index'
import { deepClone } from '@/libs/util'
import { common } from '@/api/index'
export default {
  name: 'ZDJG',
  data () {
    return {
      loading: false,
      loadingSaveEdit: false,
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      isAdd: false,
      showEdit: false,
      keyword: '',
      chooseBLMB: {
        dataid: '', // 列表数据ID
        name: '', // 名称
        suit: '', // 主诉
        present: '', // 现病史
        allergy: '', // 过敏史
        disease: '', // 疾病史
        surgery: '', // 手术史
        trauma: '', // 外伤史
        marry: '', // 婚育史
        family: '', // 家族史
        vas: '', // 疼痛评估
        psy: '', // 心理评估
        car: '', // 交通工具
        diagnose: '', // 诊断
        remark: '' // 备注
      },
      columns: [
        {
          title: '序号',
          key: 'dataid',
          width: 60
        },
        {
          title: '病历名称',
          key: 'name',
          minWidth: 170
        },
        // {
        //   title: '模板类型',
        //   key: 'type'
        // },
        {
          title: '创建时间',
          key: 'time',
          width: 170
        },
        {
          title: '创建医生',
          key: 'createuser',
          minWidth: 80
        },
        {
          title: '操作',
          slot: 'action',
          width: 120,
          fixed: 'right'
        }
      ],
      tableData: [],
      diagnoseList: []
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
      let param = deepClone(this.chooseBLMB)
      param.diagnose = JSON.stringify(param.diagnose)

      this.loadingSaveEdit = true

      templateSettings
        .temSave(param)
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
        this.chooseBLMB = {
          dataid: '',
          name: '',
          suit: '',
          present: '',
          allergy: '',
          disease: '',
          surgery: '',
          trauma: '',
          marry: '',
          family: '',
          vas: '',
          psy: '',
          car: '',
          diagnose: '',
          remark: ''
        }
      } else {
        this.isAdd = false
        templateSettings
          .temDetail({
            dataid: row.dataid
          })
          .then(res => {
            let data = res.data
            data.diagnose = JSON.parse(data.diagnose)
            this.chooseBLMB = data
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
        templateSettings
          .temDelete({
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
      templateSettings
        .temList({
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
          console.log('模板病历:', err)
          this.loading = false
        })
    },
    getDiagnoseList () {
      common
        .getSelect({
          type: 'diagnose'
        })
        .then(res => {
          let data = res.data
          this.diagnoseList = data.diagnose
        })
    }
  },
  mounted () {
    this.getList()
    this.getDiagnoseList()
  }
}
</script>

<style lang="less" scoped>
@import '../medicalRecordTemplate.less';
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
