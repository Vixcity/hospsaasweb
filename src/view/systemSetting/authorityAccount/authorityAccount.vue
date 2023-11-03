<template>
  <div class="authorityAccount">
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
            <Input
              v-model="keyword"
              placeholder="请输入姓名/账号/所属医院"
              icon="ios-search"
            ></Input>
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
          <Button type="primary" @click="openEdit('add')">新增账户</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #isallow="{ row }">{{ row.isallow === 'Y' ? '是' : '否' }}</template>
      <template #islocked="{ row }">{{ row.islocked === 'Y' ? '是' : '否' }}</template>
      <template #action="{ row }">
        <span class="btn" v-if="row.loginuser !== 'hzszyjyl'" @click="openEdit('edit', row)">
          编辑
        </span>
        <span class="btn gray" v-else>编辑</span>
        <span
          class="btn"
          style="margin-left: 8px"
          v-if="row.loginuser !== 'hzszyjyl'"
          @click="resetPassword(row)"
        >
          重置密码
        </span>
        <span class="btn gray" style="margin-left: 8px" v-else>重置密码</span>
        <span
          class="btn red"
          v-if="row.loginuser !== 'hzszyjyl'"
          style="margin-left: 8px"
          @click="deleteItem(row)"
        >
          删除
        </span>
        <span class="btn gray" v-else style="margin-left: 8px">删除</span>
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
      :title="isAdd ? '新增账户' : '编辑账户'"
      :visible.sync="showEdit"
      width="740px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom flex">
        <!-- 左边 -->
        <div class="fromItem" style="width: 55%">
          <div class="flex aic">
            <div class="itemLabel" style="width: 60px; text-align: right">登录账号</div>
            <div class="itemContent">
              <Input
                v-model="chooseRole.loginuser"
                placeholder="请输入登录账号"
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
          <div class="flex aic" v-if="isAdd" style="margin-top: 16px">
            <div class="itemLabel" style="width: 60px; text-align: right">登录密码</div>
            <div class="itemContent">
              <Input
                v-model="chooseRole.loginpwd"
                placeholder="请输入登录密码"
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
          <div class="flex aic" style="margin-top: 16px" v-if="hospid <= 0">
            <div class="itemLabel" style="width: 60px; text-align: right">所属医院</div>
            <div class="itemContent">
              <Select
                style="width: 280px; margin-left: 8px"
                v-model="chooseRole.hospid"
                filterable
                clearable
                remote
                @on-change="getRoleByHosp"
              >
                <Option
                  v-for="(option, index) in hospitalList"
                  :value="option.id"
                  :key="index + 'selectHospital'"
                  :label="option.name"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="flex aic" style="margin-top: 16px">
            <div class="itemLabel" style="width: 60px; text-align: right">分配角色</div>
            <div class="itemContent">
              <Select
                v-model="chooseRole.roledata"
                placeholder="请选择分配角色"
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
            <div class="itemLabel" style="width: 60px; text-align: right">姓名</div>
            <div class="itemContent">
              <Input
                v-model="chooseRole.realname"
                placeholder="请填写姓名"
                style="width: 280px; margin-left: 8px"
              />
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="fromItem" style="width: 45%">
          <div class="flex aic">
            <div class="itemLabel" style="width: 60px; text-align: right">是否锁定</div>
            <div class="itemContent flex aic" style="margin-left: 8px">
              <RadioGroup v-model="chooseRole.islocked">
                <Radio label="Y">是</Radio>
                <Radio label="N">否</Radio>
              </RadioGroup>
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
            <div class="itemLabel" style="width: 60px; text-align: right; margin-right: 8px">
              头像
            </div>
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
      <div slot="footer">
        <Button type="primary" @click="saveEdit" :loading="loadingSaveEdit">保 存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { systemSetting } from '@/api/systemSetting/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'authorityAccount',
  data () {
    return {
      isAdd: false,
      showEdit: false,
      loadingSaveEdit: false,
      keyword: '',
      pageNum: 0,
      hospid: JSON.parse(localStorage.userInfo).hospid,
      currentPageIdx: 1,
      imgHeader: {
        token: localStorage.token
      },
      pageSize: 10,
      loading: false,
      isallow: 'all',
      islocked: 'all',
      hospitalList: [],
      roleList: [],
      chooseRole: {},
      columns: [
        {
          title: '登录账号',
          key: 'loginuser',
          minWidth: 120
        },
        {
          title: '所属医院',
          key: 'hospital',
          minWidth: 140
        },
        {
          title: '姓名',
          key: 'realname',
          minWidth: 86
        },
        {
          title: '电话',
          key: 'mobile',
          minWidth: 120
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
          width: 170,
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
    handleAvatarSuccess (res) {
      if (res.code === '401') {
        localStorage.token = ''
        this.$router.push('/login')
      } else if (res.code !== '200') {
        this.$Message.error(res.msg)
      } else {
        this.chooseRole.avatar = res.data.pic
        this.chooseRole.avatarshow = res.data.picurl
        this.$forceUpdate()
      }
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

      if (!this.chooseRole.roledata.length === 0) {
        this.$Message.error('请选择所属角色')
        return
      }

      this.loadingSaveEdit = true

      let param = deepClone(this.chooseRole)
      param.roledata = JSON.stringify(param.roledata)
      // param.loginuser = param.mobile
      systemSetting
        .userSave(param)
        .then(res => {
          this.$Message.success(res.msg)
          this.showEdit = false
          this.getList()
          this.loadingSaveEdit = false
        })
        .catch(() => {
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
            this.chooseRole.roledata = []
          }
        })
    },
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.chooseRole = {
          adminid: '',
          hospid: this.hospid,
          avatar: '',
          loginuser: '',
          loginpwd: '',
          realname: '',
          mobile: '',
          isallow: 'Y',
          islocked: 'N',
          roledata: []
        }
        this.showEdit = true
      } else {
        this.isAdd = false
        systemSetting
          .userDetail({
            adminid: row.adminid
          })
          .then(res => {
            let data = res.data
            this.chooseRole = data
            this.chooseRole.roledata = this.chooseRole.roleids
          })
      }
      this.getRoleByHosp(this.hospid, type)
    },
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        systemSetting
          .userDelete({
            adminid: row.adminid
          })
          .then(res => {
            this.getList()
            this.$Message.success('删除成功')
          })
      })
    },
    resetPassword (row) {
      this.$confirm('是否重置密码？重置密码为（123456）', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        systemSetting
          .userResetPwd({
            adminid: row.adminid
          })
          .then(res => {
            this.$Message.success(res.msg)
          })
      })
    },
    getHospital () {
      systemSetting
        .getHospital({
          keyword: ''
        })
        .then(res => {
          let data = res.data
          this.hospitalList = data
        })
    },
    getList () {
      this.loading = true
      systemSetting
        .userList({
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
          console.log('权限账号:', err)
          this.loading = false
        })
    }
  },
  mounted () {
    this.getList()
    this.getRoleByHosp(this.hospid)
    this.getHospital()
  }
}
</script>

<style lang="less" scoped>
@import './authorityAccount.less';
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
