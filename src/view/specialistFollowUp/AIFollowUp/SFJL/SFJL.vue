<template>
  <div class="SFJL">
    <div v-if="!showDetail">
      <div class="filterCtn">
        <div class="itemFather">
          <div class="filterItem">
            <div class="label">搜索</div>
            <div>
              <Input v-model="keyword" search placeholder="记录名称" />
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
          <div class="filterItem jcsb" style="width: 100%;margin-right: 0">
            <Button type="primary" @click="openEdit('add')">添加随访记录</Button>
            <Button type="primary" style="margin-right: 0" @click="update()">一键刷新</Button>
          </div>
        </div>
      </div>
      <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
        <template #action="{ row }">
          <span class="btn" @click="goDetail(row)">详情</span>
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
        :title="isAdd ? '新增随访记录' : '编辑随访记录'"
        :visible.sync="showEdit"
        width="768px"
        :close-on-click-modal="false"
        class="vertical-center-modal"
      >
        <div v-loading="loadingDialog">
          <div class="flex aic black">
            <div>
              <span class="red">*</span>
              记录名称
            </div>
            <div style="margin-left: 8px">
              <Input v-model="chooseSF.title" placeholder="请填写记录名称" style="width: 340px" />
            </div>
          </div>
          <div class="flex aic black" style="margin-top: 16px">
            <div>
              <span class="red">*</span>
              记录模式
            </div>
            <div style="margin-left: 8px">
              <Select style="width: 340px" v-model="chooseSF.modetype">
                <Option value="point">指定患者</Option>
                <Option value="dimen">患者纬度</Option>
              </Select>
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              content="仅对选择的患者进行随访计划"
              placement="top"
              v-if="chooseSF.modetype === 'point'"
            >
              <i class="iconfont icon-tishi gray" style="margin-left: 8px; width: 18px"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="对选择纬度下的所有患者进行随访计划"
              placement="top"
              v-if="chooseSF.modetype === 'dimen'"
            >
              <i class="iconfont icon-tishi gray" style="margin-left: 8px; width: 18px"></i>
            </el-tooltip>
          </div>
          <div class="flex aic black" style="margin-top: 16px">
            <div>
              <span class="red">*</span>
              记录计划
            </div>
            <div style="margin-left: 8px">
              <Select style="width: 340px" v-model="chooseSF.planid">
                <Option
                  v-for="(item, index) in chooseSF.planary"
                  :key="index + 'chooseSF.planary'"
                  :value="item.planid"
                  :label="item.planname"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex aic black" style="margin-top: 16px">
            <div>
              <span class="transparent">*</span>
              宣教随访
            </div>
            <div style="margin-left: 8px">
              <Select
                style="width: 340px"
                v-model="chooseSF.xuanid"
                multiple
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="searchXuanLoading"
              >
                <Option
                  v-for="(item, index) in xuanList"
                  :key="index + 'xuanList'"
                  :value="item.xuanid"
                  :label="item.xuantit"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex aic black" style="margin-top: 16px" v-if="chooseSF.modetype === 'point'">
            <div>
              <span class="transparent">*</span>
              添加患者
            </div>
            <div style="margin-left: 8px">
              <Select
                style="width: 340px"
                v-model="chooseSF.patientids"
                multiple
                filterable
                remote
                :remote-method="getPatList"
                @on-change="changeSelectPat"
                :loading="loadingSearch"
              >
                <Option
                  v-for="(item, index) in patList"
                  :value="item.patid"
                  :key="index + 'patList'"
                  :label="item.patname"
                ></Option>
              </Select>
            </div>
          </div>
          <div v-if="chooseSF.modetype === 'dimen'" style="margin-top: 16px">
            <div class="title black">患者纬度选择</div>
            <div class="flex aic black" style="margin-top: 16px">
              <div>
                <span class="transparent">*</span>
                年龄范围
              </div>
              <div class="flex aic" style="margin-left: 8px">
                <Input
                  v-model="chooseSF.patientdimen.minage"
                  type="number"
                  placeholder="请填写年龄范围"
                  style="width: 160px"
                />
                <div style="margin-left: 8px">-</div>
                <Input
                  v-model="chooseSF.patientdimen.maxage"
                  type="number"
                  placeholder="请填写年龄范围"
                  style="width: 160px; margin-left: 8px"
                />
              </div>
            </div>
            <div class="flex aic black" style="margin-top: 16px">
              <div>
                <span class="transparent">*</span>
                诊断结果
              </div>
              <div style="margin-left: 8px">
                <Select v-model="chooseSF.patientdimen.diagnose" multiple style="width: 340px">
                  <Option
                    v-for="(item, index) in diagnoseList"
                    :key="index + 'diagnoseList'"
                    :value="item"
                    :label="item"
                  ></Option>
                </Select>
              </div>
            </div>
            <div class="flex aic black" style="margin-top: 16px">
              <div>
                <span class="transparent">*</span>
                患者类型
              </div>
              <div style="margin-left: 8px">
                <Select style="width: 340px" v-model="chooseSF.patientdimen.pattype">
                  <!-- <Option value="所有患者">所有患者</Option> -->
                  <Option value="yestm">全部脱敏患者</Option>
                  <Option value="notm">未脱敏患者</Option>
                  <Option value="tmalg">阿罗格</Option>
                  <Option value="tmatd">安脱达</Option>
                  <Option value="tmcd">畅迪</Option>
                </Select>
              </div>
            </div>
            <!-- <div
              class="flex aic"
              style="margin-top: 16px"
              v-if="chooseSF.hzlx !== '所有患者' && chooseSF.hzlx !== '未脱敏患者'"
            >
              <div>
                <span class="transparent">*</span>
                脱敏周期
              </div>
              <div class="flex aic" style="margin-left: 8px">
                <Input
                  v-model="chooseSF.zqYoung"
                  placeholder="请填写年龄范围"
                  style="width: 160px"
                  type="number"
                >
                  <div slot="suffix" class="flex aic" style="height: 100%">周</div>
                </Input>
                <div style="margin-left: 8px">-</div>
                <Input
                  v-model="chooseSF.zqOld"
                  placeholder="请填写年龄范围"
                  type="number"
                  style="width: 160px; margin-left: 8px"
                >
                  <div slot="suffix" class="flex aic" style="height: 100%">周</div>
                </Input>
              </div>
            </div> -->
          </div>
        </div>
        <div slot="footer">
          <Button type="primary" @click="saveEdit" :loading="loadingSaveEdit">保 存</Button>
        </div>
      </el-dialog>
    </div>
    <SGJLDetail v-else @back="showDetail = false" :dataid="dataid"></SGJLDetail>
  </div>
</template>

<script>
import { ai } from '@/api/specialistFollowUp/index'
import { common } from '@/api/index'
import { debounce, deepClone } from '@/libs/util'
import SGJLDetail from './SGJLDetail/SGJLDetail.vue'
export default {
  name: 'SFJL',
  components: { SGJLDetail },
  data () {
    return {
      isAdd: false,
      showDetail: false,
      showEdit: false,
      keyword: '',
      dataid: '',
      loading: false,
      searchXuanLoading: false,
      loadingSearch: false,
      loadingDialog: false,
      loadingSaveEdit: false,
      pageNum: 0,
      pageSize: 10,
      currentPageIdx: 1,
      chooseSF: {},
      patList: [],
      xuanList: [],
      diagnoseList: [],
      columns: [
        {
          title: '记录名称',
          key: 'title'
        },
        {
          title: '记录模式',
          key: 'modetype'
        },
        {
          title: '随访计划',
          key: 'planname'
        },
        // {
        //   title: '最近随访日期',
        //   key: 'date'
        // },
        {
          title: '已填写人数',
          key: 'yesnum',
          width: 98
        },
        {
          title: '未填写人数',
          key: 'nonum',
          width: 98
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 160
        }
      ],
      oldPatList: [],
      tableData: []
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
      this.keyword = ''
      this.changeFilter()
    },
    remoteMethod (keyword) {
      this.searchXuanLoading = true
      common
        .searchXuan({
          keyword
        })
        .then(res => {
          let data = res.data
          this.xuanList = data
          this.searchXuanLoading = false
        })
    },
    getList () {
      this.loading = true
      ai.list({
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
          console.log('AI随访记录:', err)
          this.loading = false
        })
    },
    update () {
      ai.update().then(res => {
        this.$Message.success(res.msg)
        this.getList()
      })
    },
    openEdit (type, row) {
      this.loadingDialog = true
      this.chooseSF = {}
      this.getPatList()
      if (type === 'add') {
        this.isAdd = true
        this.remoteMethod('')
      } else {
        this.isAdd = false
      }
      ai.edit({ dataid: row ? row.dataid : '' }).then(res => {
        let data = res.data
        // this.patList = deepClone(data.patientary)
        data.patientdimen.diagnose = data.patientdimen.diagnose.split(',')

        this.chooseSF = deepClone(data)
        this.xuanList = this.chooseSF.xuanary
        this.chooseSF.xuanid = this.chooseSF.xuanids.split(',').map(item => Number(item))
        this.remoteMethod('')

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
    changeSelectPat (val) {
      this.getPatList()
    },
    getPatList: debounce(function (val) {
      common
        .getPatList({
          keyword: val || ''
        })
        .then(res => {
          let data = res.data
          if (
            JSON.stringify(this.oldPatList) !== JSON.stringify(this.patList) &&
            JSON.stringify(this.oldPatList) !== '[]'
          ) {
            this.loadingSearch = true
            this.patList = data
          }
          if (!val) {
            this.oldPatList = data
          }
          this.loadingSearch = false
        })
    }, 500),
    saveEdit () {
      // console.log(this.chooseSF)
      let param = deepClone(this.chooseSF)
      param.patientids = param.patientids.toString()
      param.minage =
        param.patientdimen.maxage > param.patientdimen.minage
          ? param.patientdimen.minage
          : param.patientdimen.maxage
      param.maxage =
        param.patientdimen.maxage > param.patientdimen.minage
          ? param.patientdimen.maxage
          : param.patientdimen.minage
      param.diagnose = param.patientdimen.diagnose.toString()
      param.pattype = param.patientdimen.pattype || ''
      param.xuanids = deepClone(param.xuanid).toString()

      delete param.patientary
      delete param.planary
      delete param.patientdimen
      delete param.xuanid
      delete param.xuanary

      // console.log(param)

      // return

      this.loadingSaveEdit = true

      ai.save({ jsondata: JSON.stringify(param) }).then(res => {
        this.$Message.success('保存成功')
        this.showEdit = false
        this.getList()
        this.loadingSaveEdit = false
      }).catch(() => {
        this.loadingSaveEdit = false
      })
    },
    goDetail (row) {
      this.dataid = row.dataid
      this.showDetail = true
    },
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        ai.delete({ dataid: row.dataid }).then(res => {
          this.$Message.success('删除成功')
          this.getList()
        })
      })
    }
  },
  mounted () {
    common.getSelect({ type: 'diagnose' }).then(res => {
      let data = res.data
      this.diagnoseList = data.diagnose
    })
    this.getPatList()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import '../AIFollowUp.less';
</style>
