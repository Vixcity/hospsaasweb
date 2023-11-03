<template>
  <div class="check">
    <div class="tab_header">
      <div
        :class="tab_index === item.value ? 'tab_header_active tab_header_item' : 'tab_header_item'"
        v-for="(item, index) in tabList"
        :key="index"
        @click="changeTab(item)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="tab_container">
      <div class="filterCtn">
        <div class="itemFather">
          <div class="filterItem">
            <div class="label">检验项目</div>
            <div>
              <Select v-model="inspectid" placeholder="请选择" filterable style="width: 160px">
                <Option
                  v-for="(item, index) in jcList"
                  :value="item.inspect_id"
                  :key="index + 'jcList'"
                  :label="item.inspect_name"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="filterItem" v-if="tab_index !== 2">
            <div class="label">时间</div>
            <div>
              <Select v-model="time" placeholder="请选择" style="width: 160px">
                <Option v-for="item in timeList" :value="item.value" :key="item.value">
                  {{ item.label }}
                </Option>
              </Select>
            </div>
          </div>
          <div class="filterItem">
            <div class="label">搜索</div>
            <div>
              <Input v-model="keyword" placeholder="就诊卡号/患者姓名" icon="ios-search"></Input>
            </div>
          </div>
          <div class="filterItem">
            <Button type="primary" @click="changeFilter">查 询</Button>
            <Button @click="reset">重 置</Button>
          </div>
        </div>
      </div>
      <Table
        v-loading="loading"
        v-if="tab_index === 1"
        :columns="column1"
        :data="tableData"
        style="margin-top: 16px"
      ></Table>
      <Table
        v-loading="loading"
        v-if="tab_index === 2"
        :columns="column2"
        :data="tableData"
        style="margin-top: 16px"
      ></Table>
      <Table
        v-loading="loading"
        v-if="tab_index === 3"
        :columns="column3"
        :data="tableData"
        style="margin-top: 16px"
      >
        <template #action="{ row }">
          <div>
            <span style="color: #3171ff; cursor: pointer" @click="watchImg(row)">查看</span>
          </div>
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

    <!-- 撤销 -->
    <el-dialog
      title="撤销检查项目"
      :visible.sync="repeal"
      width="400px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
      @close="cancel"
    >
      <Form ref="ruleFormRepeal" :model="ruleFormRepeal" :rules="rulesRepeal" :label-width="100">
        <FormItem label="撤销原因" prop="cause" style="margin-bottom: 0">
          <Input
            v-model="ruleFormRepeal.cause"
            type="textarea"
            :rows="5"
            placeholder="请输入撤销原因"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit">提 交</Button>
      </div>
    </el-dialog>

    <!-- 完成/编辑 -->
    <el-dialog
      :title="title"
      :visible.sync="edit"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
      @close="cancelEdit"
    >
      <Form ref="ruleFormEdit" :model="ruleFormEdit" :rules="rulesEdit" :label-width="100">
        <FormItem label="检查报告" prop="report">
          <el-upload
            action="/api/saas/Inspect/uploadFileOne"
            list-type="picture-card"
            name="photo"
            :headers="imgHeader"
            :file-list="imgList"
            :on-success="handleSuccess"
            :on-error="error"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-image
            ref="preview_img"
            style="display: none"
            :src="report"
            :preview-src-list="imgList"
          ></el-image>
          <!-- <template v-if="!ruleFormEdit.report">
            <div class="edit_report" @click="upload">
              <img src="@/assets/images/check/upload.png" alt="" />
            </div>
            <div class="edit_tip">上传结果</div>
          </template>
          <template v-else>
            <el-image
              class="edit_img"
              :src="ruleFormEdit.report"
              :preview-src-list="[ruleFormEdit.report]"
            ></el-image>
            <div class="edit_tips" @click="upload">重新上传</div>
          </template> -->
        </FormItem>
        <FormItem label="文字结果" prop="result">
          <Input
            v-model="ruleFormEdit.result"
            type="textarea"
            :rows="3"
            placeholder="请输入文字结果"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitEdit" :loading="loadingEdit">完 成</Button>
      </div>
    </el-dialog>
    <el-image
      ref="watchReport"
      style="display: none"
      :src="showImgPath"
      :preview-src-list="watchImgList"
    ></el-image>
  </div>
</template>

<script>
import { check } from '@/api/check/index'
import { treated } from '@/api/treated/index'
export default {
  name: 'check',
  data () {
    return {
      tabList: [
        { label: '待执行', value: 1 },
        { label: '执行中', value: 2 },
        { label: '已完成', value: 3 }
      ],
      showImgPath: '',
      watchImgList: [],
      imgHeader: {
        token: localStorage.token
      },
      watchReport: false,
      loadingEdit: false,
      tab_index: 1,
      inspectid: '',
      jcList: [],
      time: 'all',
      timeList: [
        {
          value: 'today',
          label: '今天'
        },
        {
          value: 'week',
          label: '本周'
        },
        {
          value: 'month',
          label: '本月'
        },
        {
          value: 'year',
          label: '今年'
        },
        {
          value: 'all',
          label: '全部'
        }
      ],
      keyword: '',
      column1: [
        {
          title: '就诊卡号',
          key: 'jzcard',
          minWidth: 120
        },
        {
          title: '姓名',
          key: 'patname',
          minWidth: 80
        },
        {
          title: '性别',
          key: 'sex',
          minWidth: 80
        },
        {
          title: '年龄',
          key: 'age',
          minWidth: 80
        },
        {
          title: '项目名称',
          key: 'inspectname',
          minWidth: 180
        },
        {
          title: '检查代码',
          key: 'inspectcode',
          minWidth: 180
        },
        {
          title: '医生',
          key: 'docname',
          minWidth: 80
        },
        {
          title: '缴费时间',
          key: 'paytime',
          minWidth: 200
        },
        {
          title: '操作',
          fixed: 'right',
          width: 80,
          render: (h, obj) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    color: '#3171FF',
                    cursor: 'pointer',
                    marginRight: '16px'
                  },
                  on: {
                    click: () => {
                      check
                        .checkDo({
                          checkid: obj.row.checkid
                        })
                        .then(res => {
                          this.$Message.success('执行成功')
                          this.tab_index = 2
                          this.getList()
                        })
                    }
                  }
                },
                '执行'
              )
              // h(
              //   'span',
              //   {
              //     style: {
              //       color: '#3171FF',
              //       cursor: 'pointer'
              //     },
              //     on: {
              //       click: () => {
              //         this.repeal = true
              //       }
              //     }
              //   },
              //   '撤销'
              // )
            ])
          }
        }
      ],
      column2: [
        {
          title: '就诊卡号',
          key: 'jzcard',
          minWidth: 120
        },
        {
          title: '姓名',
          key: 'patname',
          minWidth: 80
        },
        {
          title: '性别',
          key: 'sex',
          minWidth: 80
        },
        {
          title: '年龄',
          key: 'age',
          minWidth: 80
        },
        {
          title: '项目名称',
          key: 'inspectname',
          minWidth: 180
        },
        {
          title: '检查代码',
          key: 'inspectcode',
          minWidth: 180
        },
        {
          title: '医生',
          key: 'docname',
          minWidth: 80
        },
        {
          title: '缴费时间',
          key: 'paytime',
          minWidth: 200
        },
        // {
        //   title: '执行时间',
        //   key: 'paytime',
        //   width: 160
        // },
        {
          title: '操作',
          fixed: 'right',
          width: 80,
          render: (h, obj) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    color: '#3171FF',
                    cursor: 'pointer',
                    marginRight: '16px'
                  },
                  on: {
                    click: () => {
                      this.title = `${obj.row.patname}-${obj.row.inspectname}`
                      this.ruleFormEdit = {
                        report: '',
                        checkid: obj.row.checkid,
                        result: ''
                      }
                      this.edit = true
                    }
                  }
                },
                '完成'
              )
              // h(
              //   'span',
              //   {
              //     style: {
              //       color: '#3171FF',
              //       cursor: 'pointer'
              //     },
              //     on: {
              //       click: () => {
              //         this.repeal = true
              //       }
              //     }
              //   },
              //   '撤销'
              // )
            ])
          }
        }
      ],
      column3: [
        {
          title: '就诊卡号',
          key: 'jzcard',
          minWidth: 120
        },
        {
          title: '姓名',
          key: 'patname',
          minWidth: 80
        },
        {
          title: '性别',
          key: 'sex',
          minWidth: 80
        },
        {
          title: '年龄',
          key: 'age',
          minWidth: 80
        },
        {
          title: '项目名称',
          key: 'inspectname',
          minWidth: 180
        },
        {
          title: '检查代码',
          key: 'inspectcode',
          minWidth: 180
        },
        {
          title: '医生',
          key: 'docname',
          minWidth: 80
        },
        {
          title: '缴费时间',
          key: 'paytime',
          minWidth: 200
        },
        {
          title: '检验结果',
          key: 'jcresult',
          minWidth: 240
        },
        {
          title: '报告单',
          minWidth: 80,
          slot: 'action',
          fixed: 'right'
        }
        // {
        //   title: '操作',
        //   width: 80,
        //   fixed: 'right',
        //   render: (h, obj) => {
        //     return h('div', [
        //       h(
        //         'span',
        //         {
        //           style: {
        //             color: '#3171FF',
        //             cursor: 'pointer'
        //           },
        //           on: {
        //             click: () => {
        //               this.title = `${obj.row.name}-${obj.row.title}`
        //               this.ruleFormEdit = {
        //                 report: 'https://xcx.hzszyjyl.com/upload/kepu/2023/03/640a9f8fd2110.jpg',
        //                 result: '测试'
        //               }
        //               this.edit = true
        //             }
        //           }
        //         },
        //         '编辑'
        //       )
        //     ])
        //   }
        // }
      ],
      tableData: [],
      imgList: [],
      trumbImgList: [],
      pageNum: 0,
      currentPageIdx: 1,
      repeal: false,
      ruleFormRepeal: {
        cause: ''
      },
      rulesRepeal: {
        cause: [{ required: true, message: '请输入撤销原因', trigger: 'blur' }]
      },
      title: '',
      edit: false,
      showImg: false,
      ruleFormEdit: {},
      rulesEdit: {
        report: [{ required: true, message: '请上传检查报告', trigger: 'blur' }],
        result: [{ required: true, message: '请输入文字结果', trigger: 'blur' }]
      },
      report: '',
      loading: false,
      pageSize: 10
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
      this.time = 'today'
      this.keyword = ''
      this.inspectid = ''
      this.currentPageIdx = 1
      this.getList()
    },
    watchImg (row) {
      check
        .getReport({
          checkid: row.checkid
        })
        .then(res => {
          let data = res.data
          this.showImgPath = data.jcfiles[0]
          this.watchImgList = data.jcfiles
          this.$nextTick(() => {
            this.$refs.watchReport.clickHandler()
          })
        })
    },
    // 取消
    cancel () {
      this.repeal = false
      this.$refs['ruleFormRepeal'].resetFields()
    },
    // 确 定
    submit () {
      this.$refs['ruleFormRepeal'].validate(valid => {
        if (valid) {
          this.$Message.success('提交成功')
          this.cancel()
        }
      })
    },
    // 取消
    cancelEdit () {
      this.edit = false
      this.imgList = []
      this.trumbImgList = []
      this.ruleFormEdit.result = ''
      this.ruleFormEdit.checkid = ''
      this.$forceUpdate()
    },
    // 确 定
    submitEdit () {
      if (this.trumbImgList.length === 0) {
        this.$Message.error('请至少上传一张图片')
        return
      } else if (!this.ruleFormEdit.result) {
        this.$Message.error('请输入文字结果')
        return
      }

      this.loadingEdit = true

      check
        .checkSave({
          checkid: this.ruleFormEdit.checkid,
          jcresult: this.ruleFormEdit.result,
          jcfiles: this.trumbImgList.toString()
        })
        .then(res => {
          this.$Message.success('提交成功')
          this.cancelEdit()
          this.tab_index = 3
          this.getList()
          this.loadingEdit = false
        })
        .catch(() => {
          this.loadingEdit = false
        })
    },
    handleSuccess (res) {
      if (res.code === '401') {
        localStorage.token = ''
        this.$router.push('/login')
      } else if (res.code !== '200') {
        this.$Message.error(res.msg)
      } else {
        this.imgList.push(res.data.picurl)
        this.trumbImgList.push(res.data.pic)
        this.$forceUpdate()
      }
    },
    error (err) {
      console.log(err)
    },
    handleRemove (file) {
      let index = this.imgList.findIndex(item => item === file)
      this.imgList.splice(index, 1)
      this.trumbImgList.splice(index, 1)
      // console.log(this.imgList, this.trumbImgList)
    },
    handlePictureCardPreview (file) {
      this.showImg = true
      this.report = file
      this.$refs.preview_img.clickHandler()
    },
    // 上传图片
    upload () {
      this.$refs['img-upload-input'].click()
    },
    getList () {
      this.loading = true
      check
        .checkList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          status: this.tab_index,
          time: this.time === 'all' ? '' : this.time,
          inspectid: this.inspectid,
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.pageNum = data.total
          this.tableData = data.lists
          this.loading = false
        })
    },
    handleClick (e) {
      var rawFile = e.target.files[0]
      var data = new FormData()

      data.append('photo', rawFile)

      if (!rawFile) return
      this.ruleFormEdit.report = window.URL.createObjectURL(rawFile)
    },
    changeTab (item) {
      this.tab_index = item.value
      this.time = 'all'
      this.getList()
    }
  },
  mounted () {
    treated
      .writeCheckSearch({
        keyword: ''
      })
      .then(res => {
        this.jcList = res.data
      })
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.check {
  height: 100%;
}
.el-image__error {
  display: none !important;
}
.check_head {
  display: flex;
  align-items: center;
  background: #f5f5fa;
  padding: 6px 9px 17px;
  box-sizing: border-box;
  div {
    font-size: 16px;
    font-weight: 400;
    color: #282d3c;
    line-height: 17px;
    margin-right: 32px;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
  }
  .check_head_active {
    color: #3171ff !important;
    font-weight: 500;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      bottom: -5px;
      width: 100%;
      height: 2px;
      background: #3171ff;
    }
  }
}
.edit_report {
  width: 120px;
  height: 120px;
  background: #f5f5fa;
  border-radius: 5px;
  border: 1px dashed #d2d7e1;
  cursor: pointer;
  img {
    width: 24px;
    height: 24px;
    margin-top: 48px;
    margin-left: 48px;
  }
}
.edit_tip {
  font-size: 14px;
  font-weight: 400;
  color: #969baa;
  line-height: 18px;
  width: 120px;
  text-align: center;
  margin-top: 8px;
}

.edit_tips {
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  width: 120px;
  text-align: center;
  margin-top: 8px;
  color: #3171ff;
  cursor: pointer;
}
.edit_img {
  width: 120px;
  height: 120px;
  border-radius: 5px;
}
// 上传图片
.img-upload-input {
  display: none;
}
</style>
