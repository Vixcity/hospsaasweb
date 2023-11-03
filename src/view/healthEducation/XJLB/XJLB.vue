<template>
  <div class="XJLB">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">宣教类型</div>
          <div>
            <Select v-model="cateid" style="width: 160px">
              <Option
                v-for="(item, index) in cateList"
                :key="index + 'cateList'"
                :value="item.cateid"
              >
                {{ item.title }}
              </Option>
            </Select>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="请输入宣教标题" v-model="keyword" />
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
          <Button type="primary" @click="openEdit('add')">新增宣教</Button>
        </div>
      </div>
    </div>
    <Table :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #isshow="{ row }">
        {{ row.isshow === 'Y' ? '是' : '否' }}
      </template>
      <template #action="{ row }">
        <span class="btn" @click="openEdit('edit', row)">编辑</span>
        <span class="btn red" @click="deleteItem(row)">删除</span>
      </template>
    </Table>
    <el-dialog
      :title="isAdd ? '新增类别' : '编辑类别'"
      :visible.sync="showEdit"
      width="790px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div>
        <div class="flex aic jcsb black">
          <div style="width: 56px">宣教标题</div>
          <Input
            placeholder="请输入宣教标题"
            v-model="chooseRichText.title"
            style="width: 686px"
          ></Input>
        </div>
        <div class="flex jcsb black" style="margin-top: 16px">
          <div style="width: 56px">宣教内容</div>
          <editor
            ref="editor"
            style="width: 686px"
            v-if="showEdit"
            :value="chooseRichText.content"
            @on-change="handleChange"
          />
        </div>
        <div class="flex black" style="margin-top: 16px">
          <div style="width: 56px">宣教图片</div>
          <el-upload
            class="avatar-uploader"
            action="/api/saas/Xuan/uploadFileOne"
            :show-file-list="false"
            :headers="imgHeader"
            name="photo"
            style="margin-left: 8px"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="chooseRichText.thumbImg" :src="chooseRichText.thumbImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="flex aic black" style="margin-top: 16px">
          <div style="width: 56px">宣教类型</div>
          <Select v-model="chooseRichText.cateid" style="width: 180px; margin-left: 8px">
            <Option
              v-for="(item, index) in cateList"
              :key="index + 'cateList'"
              :value="item.cateid"
            >
              {{ item.title }}
            </Option>
          </Select>
        </div>
        <div class="flex aic black" style="margin-top: 16px">
          <div class="itemLabel">是否显示</div>
          <div class="itemContent" style="margin-left: 8px">
            <RadioGroup v-model="chooseRichText.isshow">
              <Radio label="Y">是</Radio>
              <Radio label="N">否</Radio>
            </RadioGroup>
          </div>
        </div>
        <div class="flex aic black" style="margin-top: 16px">
          <div class="itemLabel">排列序号</div>
          <div class="itemContent" style="margin-left: 8px">
            <Input
              v-model="chooseRichText.sortnum"
              style="width: 150px"
              type="number"
              placeholder="请填写排列序号"
            />
          </div>
        </div>
        <!-- <div class="title">宣教对象设置</div>
        <div class="flex aic" style="margin-top: 16px">
          <div style="width: 56px">年龄范围</div>
          <div class="flex aic">
            <Input
              placeholder="请输入年龄范围"
              v-model="chooseRichText.young"
              style="width: 150px"
            />
            <div style="margin-left: 8px">-</div>
            <Input
              placeholder="请输入年龄范围"
              v-model="chooseRichText.old"
              style="width: 150px; margin-left: 8px"
            />
          </div>
        </div>
        <div class="flex aic" style="margin-top: 16px">
          <div style="width: 56px">诊断结果</div>
          <Select
            v-model="chooseRichText.zdjg"
            style="width: 320px"
            filterable
            multiple
            placeholder="请选择诊断结果"
          >
            <Option value="良好">良好</Option>
            <Option value="健康">健康</Option>
            <Option value="不健康">不健康</Option>
          </Select>
        </div>
        <div class="flex aic" style="margin-top: 16px">
          <div style="width: 56px">脱敏类型</div>
          <Select v-model="chooseRichText.tmlx" style="width: 320px" placeholder="请选择脱敏类型">
            <Option value="全部脱敏">全部脱敏</Option>
            <Option value="皮下脱敏">皮下脱敏</Option>
            <Option value="舌下脱敏">舌下脱敏</Option>
          </Select>
        </div> -->
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit" :loading="loadingSaveEdit">确 定</Button>
      </div>
    </el-dialog>
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
import Editor from '_c/editor'
import { healthEducation } from '@/api/healthEducation/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'XJLB',
  components: {
    Editor
  },
  data () {
    return {
      cateid: '',
      keyword: '',
      imgHeader: {
        token: localStorage.token
      },
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      cateList: [],
      chooseRichText: {
        xuanid: '',
        cateid: '',
        title: '',
        content: '',
        thumb: '',
        sortnum: 0,
        isshow: 'Y'
      },
      isAdd: false,
      showEdit: false,
      loadingSaveEdit: false,
      columns: [
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '宣教类型',
          key: 'catetit'
        },
        // {
        //   title: '宣教对象',
        //   key: 'xjdx'
        // },
        {
          title: '是否显示',
          slot: 'isshow'
        },
        {
          title: '排列序号',
          key: 'sortnum'
        },
        {
          title: '创建时间',
          key: 'time',
          width: 170
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
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        healthEducation
          .delete({
            xuanid: row.xuanid
          })
          .then(res => {
            this.$Message.success(res.msg)
            this.getList()
          })
      })
    },
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.getList()
    },
    reset () {
      this.cateid = ''
      this.keyword = ''
      this.changeFilter()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    },
    handleChange (html) {
      this.chooseRichText.content = html
    },
    handleAvatarSuccess (res) {
      if (res.code === '401') {
        localStorage.token = ''
        this.$router.push('/login')
      } else if (res.code !== '200') {
        this.$Message.error(res.msg)
      } else {
        this.chooseRichText.thumbImg = res.data.picurl
        this.chooseRichText.thumb = res.data.pic
        this.$forceUpdate()
      }
    },
    getList () {
      healthEducation
        .list({
          page: this.currentPageIdx,
          limit: this.pageSize,
          cateid: this.cateid,
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
        })
    },
    saveEdit () {
      let param = deepClone(this.chooseRichText)
      param.sortnum = param.sortnum || 0

      this.loadingSaveEdit = true

      healthEducation
        .save(param)
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
        this.chooseRichText = {
          xuanid: '',
          cateid: '',
          title: '',
          content: '',
          thumb: '',
          sortnum: 0,
          isshow: 'Y'
        }
        this.showEdit = true
      } else {
        healthEducation
          .detail({
            xuanid: row.xuanid
          })
          .then(res => {
            this.chooseRichText = res.data
            this.showEdit = true
          })
      }
    }
  },
  mounted () {
    this.getList()
    healthEducation.getCate().then(res => {
      this.cateList = res.data
    })
  }
}
</script>

<style lang="less" scoped>
@import '../healthEducation.less';
.title {
  position: relative;
  padding-left: 12px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 16px;
  &::after {
    width: 4px;
    height: 18px;
    display: block;
    position: absolute;
    top: 3px;
    left: 0;
    content: ' ';
    background: #3171ff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<style>
.w-e-text-container {
  z-index: 99 !important;
}
</style>
