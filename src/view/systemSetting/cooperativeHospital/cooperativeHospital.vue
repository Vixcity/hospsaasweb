<template>
  <div class="cooperativeHospital">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="医院名称" v-model="keyword" />
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
          <Button type="primary" @click="openEdit('add')">新增医院</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #isopen="{ row }">
        {{ row.isopen === 'Y' ? '是' : '否' }}
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
      :title="isAdd ? '新增医院' : '编辑医院'"
      :visible.sync="showEdit"
      width="750px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom jcsb">
        <!-- 左边 -->
        <div
          class="fromItem"
          style="width: 55%; height: calc(65vh - 48px); overflow-y: auto; padding-right: 8px"
        >
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 278px)">医院名称</div>
            <div class="itemContent">
              <Input v-model="chooseHospital.name" placeholder="请填写医院名称" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 278px)">医院唯一标识</div>
            <div class="itemContent">
              <Input v-model="chooseHospital.untag" placeholder="请输入医院唯一标识" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 278px)">联系人</div>
            <div class="itemContent">
              <Input v-model="chooseHospital.lxname" placeholder="请输入联系人" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 278px)">联系人电话</div>
            <div class="itemContent">
              <Input v-model="chooseHospital.lxphone" placeholder="请输入联系人电话" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 278px)">自定义域名</div>
            <div class="itemContent">
              <Input v-model="chooseHospital.weburl" placeholder="请输入自定义域名" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 278px)">医院地址</div>
            <div class="itemContent">
              <Input v-model="chooseHospital.address" placeholder="请输入医院地址" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 278px)">是否开启</div>
            <div class="itemContent flex aic">
              <RadioGroup v-model="chooseHospital.isopen">
                <Radio label="Y">是</Radio>
                <Radio label="N">否</Radio>
              </RadioGroup>
            </div>
          </div>
          <div class="flex aic">
            <div class="itemLabel" style="width: calc(100% - 278px)">医院logo</div>
            <el-upload
              class="avatar-uploader"
              action="/api/saas/Auth/uploadFileOne"
              :show-file-list="false"
              :headers="imgHeader"
              name="photo"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="chooseHospital.logoImg" :src="chooseHospital.logoImg" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
        <!-- 右边 -->
        <div class="fromItem" style="width: 45%; height: calc(65vh - 48px); overflow-y: auto">
          <div class="flex">
            <div
              class="itemLabel"
              style="width: 60px; text-align: right; margin-top: 3px; width: calc(100% - 186px)"
            >
              <span class="transparent">*</span>
              权限设置
            </div>
            <div class="itemContent" style="margin-left: 8px">
              <div class="flex aic">
                <i
                  class="iconfont icon-xiajiantou curpor gray"
                  style="margin-right: 8px"
                  v-if="isExpand"
                  @click="isExpand = !isExpand"
                ></i>
                <i
                  class="iconfont icon-youjiantou curpor gray"
                  style="margin-right: 8px"
                  v-else
                  @click="isExpand = !isExpand"
                ></i>
                <Checkbox
                  :value="checkAll"
                  :indeterminate="indeterminate"
                  @click.prevent.native="checkAllClick"
                >
                  <span style="margin-left: 8px">全选</span>
                </Checkbox>
              </div>
              <div v-if="isExpand">
                <div
                  style="margin-left: 16px; margin-top: 10px"
                  v-for="(item, index) in chooseHospital.authority"
                  :key="index + 'authority'"
                >
                  <div class="flex aic" style="height: 18px">
                    <i
                      class="iconfont icon-xiajiantou curpor gray"
                      style="margin-right: 8px"
                      v-if="item.isExpand && item.checkAllGroup.length !== 0"
                      @click="
                        item.isExpand = !item.isExpand
                        $forceUpdate()
                      "
                    ></i>
                    <i
                      class="iconfont icon-youjiantou curpor gray"
                      style="margin-right: 8px"
                      v-else-if="!item.isExpand && item.checkAllGroup.length !== 0"
                      @click="
                        item.isExpand = !item.isExpand
                        $forceUpdate()
                      "
                    ></i>
                    <i style="margin-left: 24px" v-else></i>
                    <Checkbox
                      :indeterminate="item.indeterminate"
                      :value="item.checkAll"
                      @click.prevent.native="handleCheckAll(index)"
                    >
                      <span style="margin-left: 8px">{{ item.title }}</span>
                    </Checkbox>
                  </div>
                  <CheckboxGroup
                    class="flex"
                    style="padding-left: 40px; flex-direction: column"
                    v-model="item.checkAllGroupList"
                    v-if="item.checkAllGroup.length !== 0 && item.isExpand"
                    @on-change="checkAllGroupChange($event, index)"
                  >
                    <Checkbox
                      v-for="(itemCheck, indexCheck) in item.checkAllGroup"
                      :key="indexCheck + 'group' + index"
                      style="margin-top: 10px"
                      :label="itemCheck.value"
                    >
                      <span style="margin-left: 8px">{{ itemCheck.label }}</span>
                    </Checkbox>
                  </CheckboxGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit">保 存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { systemSetting } from '@/api/systemSetting/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'cooperativeHospital',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      isAdd: false,
      showEdit: false,
      loading: false,
      checkAll: false,
      indeterminate: false,
      isExpand: true,
      keyword: '',
      imgHeader: {
        token: localStorage.token
      },
      columns: [
        {
          title: '医院名称',
          key: 'name'
        },
        {
          title: '联系人',
          key: 'lxname'
        },
        {
          title: '联系人电话',
          key: 'lxphone'
        },
        {
          title: '医院地址',
          key: 'address'
        },
        {
          title: '是否开启',
          slot: 'isopen'
        },
        {
          title: '操作',
          slot: 'action',
          width: 120,
          fixed: 'right'
        }
      ],
      tableData: [],
      chooseHospital: {}
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
        this.chooseHospital.logoImg = res.data.picurl
        this.chooseHospital.logo = res.data.pic
        this.$forceUpdate()
      }
    },
    saveEdit () {
      let param = deepClone(this.chooseHospital)
      param.chooseList = []
      param.authority.forEach(item => {
        if (item.checkAll || item.indeterminate) {
          param.chooseList.push(item.id)
        }

        if (!(item.checkAllGroup.length !== 1 && item.sub.length === 0)) {
          param.chooseList = param.chooseList.concat(item.checkAllGroupList)
        }
      })

      if (param.chooseList.length === 0) {
        this.$Message.error('至少选择一个菜单')
        return
      }

      // console.log(param.chooseList)

      param.ruleids = JSON.stringify(param.chooseList)
      systemSetting.hospSave(param).then(res => {
        if (res.msg === '新增成功' || res.msg === '更新成功') {
          this.showEdit = false
          this.$Message.success(res.msg)
          this.getList()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        systemSetting
          .hospDelete({
            hospid: row ? row.hospid : ''
          })
          .then(res => {
            this.getList()
            this.$Message.success('删除成功')
          })
      })
    },
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.chooseHospital = {
          hospid: '',
          logo: '',
          name: '',
          untag: '',
          lxname: '',
          lxphone: '',
          address: '',
          weburl: '',
          ruleids: [],
          isopen: 'Y'
        }

        systemSetting
          .roleDetail({
            roleid: row ? row.roleid : ''
          })
          .then(res => {
            let data = res.data
            this.getDetail(data)
          })
          .catch(err => {
            this.editLoading = false
            console.log('合作医院:', err)
          })
      } else {
        this.isAdd = false
        systemSetting
          .hospDetail({
            hospid: row.hospid
          })
          .then(res => {
            let data = res.data
            this.chooseHospital = data
            this.getDetail(data)
            this.showEdit = true
          })
      }
    },
    getDetail (data) {
      data.rules = data.rules.reverse()
      data.rules.forEach(item => {
        item.checkAll = item.isselect === 'Y'
        item.isExpand = false
        let chooseSonLen = item.sub.filter(itemSon => {
          return itemSon.isselect === 'Y'
        }).length

        item.checkAllGroup = item.sub.map(itemSon => {
          return {
            label: itemSon.title,
            value: itemSon.id
          }
        })

        item.checkAllGroupList = item.sub
          .filter(itemSon => {
            return itemSon.isselect === 'Y'
          })
          .map(itemSon => {
            return itemSon.id
          })

        if (item.sub.length === 0) {
          item.checkAll = item.isselect === 'Y'
          item.indeterminate = false
        } else if (chooseSonLen === 0) {
          item.checkAll = false
          item.indeterminate = false
        } else if (chooseSonLen === item.sub.length) {
          item.checkAll = true
          item.indeterminate = false
        } else {
          item.checkAll = false
          item.indeterminate = true
        }
      })

      this.chooseHospital.authority = data.rules
      this.isCheckAll()
      this.showEdit = true
    },
    handleCheckAll (index) {
      let item = this.chooseHospital.authority[index]
      if (item.checkAll) {
        item.checkAllGroupList = []
        item.checkAll = false
        item.indeterminate = false
      } else {
        item.checkAllGroupList = JSON.parse(
          JSON.stringify(
            item.checkAllGroup.map(item => {
              return item.value
            })
          )
        )
        item.checkAll = true
        item.indeterminate = false
      }
      this.isCheckAll()
    },
    checkAllGroupChange (data, index) {
      let item = this.chooseHospital.authority[index]
      if (data.length === item.checkAllGroup.length) {
        item.indeterminate = false
        item.checkAll = true
      } else if (data.length > 0) {
        item.indeterminate = true
        item.checkAll = false
      } else {
        item.indeterminate = false
        item.checkAll = false
      }
      this.isCheckAll()
    },
    checkAllClick () {
      this.checkAll = !this.checkAll
      this.indeterminate = false
      this.chooseHospital.authority.forEach(item => {
        item.checkAll = this.checkAll
        item.indeterminate = false
        item.checkAllGroupList = this.checkAll
          ? item.checkAllGroup.map(itemSon => {
            return itemSon.value
          })
          : []
      })
    },
    isCheckAll () {
      let chooseLenth = this.chooseHospital.authority.filter(item => {
        return item.checkAll
      }).length

      if (chooseLenth === 0) {
        let chooseSonLenth = this.chooseHospital.authority.filter(item => {
          return item.indeterminate
        }).length

        if (chooseSonLenth === 0) {
          this.checkAll = false
          this.indeterminate = false
        } else {
          this.checkAll = false
          this.indeterminate = true
        }
      } else if (chooseLenth !== this.chooseHospital.authority.length) {
        this.checkAll = false
        this.indeterminate = true
      } else {
        this.checkAll = true
        this.indeterminate = false
      }

      this.$forceUpdate()
    },
    getList () {
      this.loading = true
      systemSetting
        .hospList({
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
          console.log('合作医院:', err)
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
@import './cooperativeHospital.less';
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
