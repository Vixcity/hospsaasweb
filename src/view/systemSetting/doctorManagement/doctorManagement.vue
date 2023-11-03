<template>
  <div class="doctorManagement">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">是否锁定</div>
          <div>
            <Select v-model="islocked" style="width: 160px">
              <Option value="all">全部</Option>
              <Option value="Y">是</Option>
              <Option value="N">否</Option>
            </Select>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">允许登录</div>
          <div>
            <Select v-model="isallow" style="width: 160px">
              <Option value="all">全部</Option>
              <Option value="Y">是</Option>
              <Option value="N">否</Option>
            </Select>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" placeholder="请输入姓名/账号" icon="ios-search"></Input>
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
          <Button type="primary" @click="openEdit('add')">新增医生</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #isallow="{ row }">
        {{ row.isallow === 'Y' ? '是' : '否' }}
      </template>
      <template #islocked="{ row }">
        {{ row.islocked === 'Y' ? '是' : '否' }}
      </template>
      <template #action="{ row }">
        <span class="btn" @click="openEdit('edit', row)">编辑</span>
        <span class="btn red" style="margin-left: 8px" @click="deleteItem(row)">删除</span>
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
      :title="isAdd ? '新增医生' : '编辑医生'"
      :visible.sync="showEdit"
      width="780px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div v-loading="saveLoading">
        <div class="flexFrom flex">
          <!-- 左边 -->
          <div class="fromItem">
            <div class="flex aic">
              <div class="itemLabel" style="width: 60px; text-align: right">登录账号</div>
              <div class="itemContent">
                <Input
                  v-model="chooseRole.loginuser"
                  placeholder="请输入账号"
                  style="width: 280px; margin-left: 8px"
                />
              </div>
              <!-- <el-tooltip
                class="item"
                effect="dark"
                style="margin-left: 8px"
                content="人员账号为当前人员联系电话"
                placement="top"
              >
                <i class="iconfont icon-tishi gray"></i>
              </el-tooltip> -->
            </div>
            <div class="flex aic" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">登录密码</div>
              <div class="itemContent">
                <Input
                  v-model="chooseRole.loginpwd"
                  type="password"
                  placeholder="请输入密码"
                  style="width: 280px; margin-left: 8px"
                />
              </div>
            </div>
            <div class="flex aic" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">姓名</div>
              <div class="itemContent">
                <Input
                  v-model="chooseRole.realname"
                  placeholder="请填写姓名"
                  style="width: 280px; margin-left: 8px"
                />
              </div>
            </div>

            <div class="flex aic" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">联系电话</div>
              <div class="itemContent">
                <Input
                  v-model="chooseRole.mobile"
                  placeholder="请输入联系电话"
                  style="width: 280px; margin-left: 8px"
                />
              </div>
              <!-- <el-tooltip
                class="item"
                effect="dark"
                style="margin-left: 8px"
                content="人员账号为当前人员联系电话"
                placement="top"
              >
                <i class="iconfont icon-tishi gray"></i>
              </el-tooltip> -->
            </div>
            <div class="flex aic" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">职称</div>
              <div class="itemContent">
                <Select v-model="chooseRole.postitle" style="width: 280px; margin-left: 8px">
                  <!-- <Option label="执业医师" value="执业医师"></Option> -->
                  <Option label="住院医师" value="住院医师"></Option>
                  <Option label="主治医师" value="主治医师"></Option>
                  <Option label="副主任医师" value="副主任医师"></Option>
                  <Option label="主任医师" value="主任医师"></Option>
                  <Option label="其他" value="其他"></Option>
                  <!-- <Option
                    v-for="(item, index) in postitleList"
                    :key="index + 'postitleList'"
                    :value="item"
                    :label="item"
                  ></Option> -->
                </Select>
              </div>
            </div>
            <div class="flex aic" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">是否锁定</div>
              <div class="itemContent flex aic" style="margin-left: 8px">
                <RadioGroup v-model="chooseRole.islocked">
                  <Radio label="Y">是</Radio>
                  <Radio label="N">否</Radio>
                </RadioGroup>
              </div>
            </div>
            <div class="flex" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">头像</div>
              <div class="itemContent" style="margin-left: 8px">
                <el-upload
                  class="avatar-uploader"
                  action="/api/saas/Auth/uploadFileOne"
                  :show-file-list="false"
                  :headers="imgHeader"
                  name="photo"
                  :on-success="handleAvatarSuccess"
                >
                  <img v-if="chooseRole.avatarshow" :src="chooseRole.avatarshow" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </div>
          </div>
          <!-- 右边 -->
          <div class="fromItem" style="margin-left: 24px">
            <div class="flex aic" v-if="hospid === 0">
              <div class="itemLabel" style="width: 60px; text-align: right">所属医院</div>
              <div class="itemContent">
                <Select
                  v-model="chooseRole.hospid"
                  @on-change="getRoleByHosp"
                  style="width: 280px; margin-left: 8px"
                >
                  <Option
                    v-for="(item, index) in hospitalList"
                    :key="index + 'roles'"
                    :value="item.id"
                    :label="item.name"
                  ></Option>
                </Select>
              </div>
            </div>
            <div class="flex aic" :style="{ 'margin-top': hospid === 0 ? '16px' : '0' }">
              <div class="itemLabel" style="width: 60px; text-align: right">分配角色</div>
              <div class="itemContent">
                <Select
                  v-model="chooseRole.roleids"
                  filterable
                  multiple
                  style="width: 280px; margin-left: 8px"
                >
                  <Option
                    v-for="(item, index) in roleList"
                    :key="index + 'roleList'"
                    :value="item.id"
                    :label="item.title"
                  ></Option>
                </Select>
              </div>
            </div>
            <div class="flex aic" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">科室</div>
              <div class="itemContent">
                <Select v-model="chooseRole.section" style="width: 280px; margin-left: 8px">
                  <Option
                    v-for="(item, index) in sectionList"
                    :key="index + 'sectionList'"
                    :value="item"
                    :label="item"
                  ></Option>
                </Select>
              </div>
            </div>
            <div class="flex aic" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">简介</div>
              <div class="itemContent">
                <Input
                  v-model="chooseRole.resume"
                  placeholder="请填写简介"
                  style="width: 280px; margin-left: 8px"
                />
              </div>
            </div>
            <div class="flex aic" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">擅长</div>
              <div class="itemContent">
                <Input
                  v-model="chooseRole.goodat"
                  placeholder="请填写擅长的领域"
                  style="width: 280px; margin-left: 8px"
                ></Input>
              </div>
            </div>
            <div class="flex aic" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">允许登录</div>
              <div class="itemContent flex aic" style="margin-left: 8px">
                <RadioGroup v-model="chooseRole.isallow">
                  <Radio label="Y">是</Radio>
                  <Radio label="N">否</Radio>
                </RadioGroup>
              </div>
            </div>
            <div class="flex" style="margin-top: 16px">
              <div class="itemLabel" style="width: 60px; text-align: right">签名</div>
              <div class="itemContent flex" style="margin-left: 8px">
                <el-upload
                  class="avatar-uploader"
                  action="/api/saas/Auth/uploadFileOne"
                  :show-file-list="false"
                  :headers="imgHeader"
                  name="photo"
                  :on-success="handleQMSuccess"
                >
                  <img
                    v-if="chooseRole.autographshow"
                    :src="chooseRole.autographshow"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-tooltip
                  class="item"
                  effect="dark"
                  style="margin-left: 8px"
                  content="签名请用马克笔在白底上书写拍照上传"
                  placement="top"
                >
                  <i class="iconfont icon-tishi gray"></i>
                </el-tooltip>
              </div>
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
import { systemSetting } from '@/api/systemSetting/index'
import { common } from '@/api/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'doctorManagement',
  data () {
    return {
      isAdd: false,
      showEdit: false,
      loadingSaveEdit: false,
      keyword: '',
      pageNum: 0,
      currentPageIdx: 1,
      hospid: JSON.parse(localStorage.userInfo).hospid,
      imgHeader: {
        token: localStorage.token
      },
      pageSize: 10,
      loading: false,
      saveLoading: false,
      isallow: 'all',
      islocked: 'all',
      hospitalList: [],
      roleList: [],
      sectionList: [],
      postitleList: [],
      chooseRole: {},
      columns: [
        {
          title: '医生姓名',
          key: 'realname',
          minWidth: 86
        },
        {
          title: '医生账号',
          key: 'loginuser',
          minWidth: 120
        },
        {
          title: '医生职称',
          key: 'postitle',
          minWidth: 90
        },
        {
          title: '科室',
          key: 'section',
          minWidth: 90
        },
        {
          title: '允许登录',
          slot: 'isallow',
          minWidth: 86
        },
        {
          title: '是否锁定',
          slot: 'islocked',
          minWidth: 86
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
    reset () {
      this.keyword = ''
      this.islocked = 'all'
      this.isallow = 'all'
      this.changeFilter()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    saveEdit () {
      const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!phoneReg.test(this.chooseRole.mobile)) {
        this.$Message.error('请填写正确的手机号')
        return
      }

      if (!this.chooseRole.loginuser) {
        this.$Message.error('请填写登录账号')
        return
      }

      if (!this.chooseRole.loginpwd) {
        this.$Message.error('请填写登录密码')
        return
      }

      if (!this.chooseRole.roleids.length === 0) {
        this.$Message.error('请选择所属角色')
        return
      }

      // console.log(this.chooseRole.autograph)
      if (!this.chooseRole.autograph) {
        this.chooseRole.autograph = ''
        // this.$Message.error('请上传用马克笔在白底上书写的签名')
        // return
      }

      let param = deepClone(this.chooseRole)
      // param.loginpwd = 12345646546465465
      this.saveLoading = true

      param.roledata = JSON.stringify(param.roleids)
      // param.loginuser = param.mobile

      // console.log(param)
      // return
      this.loadingSaveEdit = true
      systemSetting
        .docSave(param)
        .then(res => {
          console.log(res)
          this.$Message.success(res.msg)
          this.showEdit = false
          this.saveLoading = false
          this.getList()
          this.loadingSaveEdit = false
        })
        .catch(err => {
          this.saveLoading = false
          console.log('医生保存:', err)
          this.loadingSaveEdit = false
        })
    },
    getRoleByHosp (val, type) {
      systemSetting
        .getRoleByHospital({
          hospid: val,
          keyword: ''
        })
        .then(res => {
          let data = res.data
          this.roleList = data
          if (type === 'edit') {
            this.showEdit = true
          } else {
            this.chooseRole.roleids = []
          }
        })
    },
    openEdit (type, row) {
      systemSetting
        .docDetail({
          adminid: row ? row.adminid : ''
        })
        .then(res => {
          let data = res.data
          this.chooseRole = data
          common
            .getSelect({
              type: 'section,postitle',
              postype: 'doctor'
            })
            .then(ress => {
              let datas = ress.data
              this.sectionList = datas.section
              this.postitleList = datas.postitle
            })
          if (type === 'add') {
            this.isAdd = true
            this.chooseRole.isallow = 'Y'
            this.chooseRole.islocked = 'N'
            this.chooseRole.avatar = ''
            this.chooseRole.avatarshow = ''
            this.chooseRole.autograph = ''
            this.chooseRole.autographshow = ''
            this.chooseRole.goodat = ''
          } else {
            this.isAdd = false
          }
          this.getRoleByHosp(data.hospid, type)
          this.showEdit = true
        })
    },
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        systemSetting
          .docDelete({
            adminid: row.adminid
          })
          .then(res => {
            this.getList()
            this.$Message.success('删除成功')
          })
      })
    },
    handleAvatarSuccess (res) {
      if (res.code === '401') {
        localStorage.token = ''
        this.$router.push('/login')
      } else if (res.code !== '200') {
        this.$Message.error(res.msg)
      } else {
        this.chooseRole.avatarshow = res.data.picurl
        this.chooseRole.avatar = res.data.pic
        this.$forceUpdate()
      }
    },
    handleQMSuccess (res) {
      if (res.code === '401') {
        localStorage.token = ''
        this.$router.push('/login')
      } else if (res.code !== '200') {
        this.$Message.error(res.msg)
      } else {
        this.chooseRole.autographshow = res.data.picurl
        this.chooseRole.autograph = res.data.pic
        this.$forceUpdate()
      }
    },
    getHospital () {
      systemSetting
        .getHospital({
          keyword:
            JSON.parse(localStorage.userInfo).hospid === 0
              ? ''
              : JSON.parse(localStorage.userInfo).hospname
        })
        .then(res => {
          let data = res.data
          this.hospitalList = data
        })
    },
    getList () {
      this.loading = true
      systemSetting
        .docList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          keyword: this.keyword,
          isallow: this.isallow === 'all' ? '' : this.isallow,
          islocked: this.islocked === 'all' ? '' : this.islocked
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
        })
        .catch(err => {
          console.log('医生账号:', err)
          this.loading = false
        })
    }
  },
  mounted () {
    this.getList()
    this.getHospital()
  }
}
</script>

<style lang="less" scoped>
@import './doctorManagement.less';
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
</style>
