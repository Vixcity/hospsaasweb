<template>
  <div class="rolePermissions">
    <div style="width: 35%; min-width: 290px">
      <div class="flex jcsb aic" style="background: rgba(49, 113, 255, 10%); padding: 8px 20px">
        <div style="font-size: 16px">角色列表</div>
        <div style="cursor: pointer">
          <i
            class="iconfont icon-tianjia-1 blue"
            style="font-size: 24px"
            @click="openEdit('add')"
          ></i>
        </div>
      </div>
      <div style="margin: 20px 20px 0">
        <Input placeholder="输入角色名称搜索" style="width: 100%">
          <i class="iconfont icon-sousuo" slot="suffix"></i>
        </Input>
      </div>
      <Table
        v-loading="loading"
        :columns="columns"
        :data="tableData"
        ref="table"
        @on-selection-change="getSelect"
        @on-row-click="openEdit('edit', $event)"
        style="margin: 10px 20px"
      >
        <template #remark="{ row }">
          {{ row.remark || '-' }}
        </template>
        <template #action="{ row }">
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
        ></Page>
      </div>
    </div>
    <div style="min-width: 8px; height: 100vh; background: #f5f5fa"></div>
    <div
      v-loading="editLoading"
      style="padding: 40px; width: calc(80% - 8px); overflow: auto; box-sizing: border-box"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem flex aic">
          <div class="flex aic">
            <div class="itemLabel" style="width: 60px; text-align: right">
              <span class="red">*</span>
              角色名称
            </div>
            <div class="itemContent">
              <Input
                v-model="chooseRole.title"
                placeholder="请填写角色名称"
                style="width: 160px; margin-left: 8px"
              />
            </div>
          </div>
          <div class="flex aic">
            <div class="itemLabel" style="text-align: right; margin-left: 20px; min-width: 24px">
              备注
            </div>
            <div class="itemContent">
              <Input
                v-model="chooseRole.remark"
                placeholder="请输入备注"
                style="width: 250px; margin-left: 8px"
              />
            </div>
          </div>
        </div>
        <div class="fromItem flex aic" style="margin-top: 16px">
          <div class="flex aic">
            <div class="itemLabel" style="width: 60px; text-align: right">是否生效</div>
            <div class="itemContent" style="margin-left: 8px">
              <RadioGroup v-model="chooseRole.isvalid">
                <Radio label="Y">是</Radio>
                <Radio label="N">否</Radio>
              </RadioGroup>
            </div>
          </div>
        </div>
        <div>
          <div class="flex" style="margin-top: 16px">
            <div class="itemLabel" style="width: 60px; text-align: right; margin-top: 3px">
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
                  v-for="(item, index) in chooseRole.authority"
                  :key="index + 'authority'"
                >
                  <div class="flex aic" style="height: 18px">
                    <i
                      class="iconfont icon-xiajiantou curpor gray"
                      style="margin-right: 8px"
                      v-if="item.isExpand && item.checkAllGroup.length !== 0"
                      @click="item.isExpand = !item.isExpand"
                    ></i>
                    <i
                      class="iconfont icon-youjiantou curpor gray"
                      style="margin-right: 8px"
                      v-else-if="!item.isExpand && item.checkAllGroup.length !== 0"
                      @click="item.isExpand = !item.isExpand"
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
      <Button
        type="primary"
        @click="saveEdit"
        :loading="loadingSaveEdit"
        style="margin-left: 270px; margin-top: 90px"
      >
        保 存
      </Button>
    </div>
  </div>
</template>

<script>
import { systemSetting } from '@/api/systemSetting/index'
import { deepClone } from '@/libs/util'
export default {
  name: 'rolePermissions',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      isAdd: true,
      loadingSaveEdit: false,
      loading: false,
      checkAll: false,
      indeterminate: false,
      editLoading: false,
      isExpand: true,
      menuListString: '',
      keyword: '',
      chooseRole: {
        roleid: '',
        title: '',
        remark: '',
        isvalid: 'Y',
        authority: []
      },
      columns: [
        {
          title: '名称',
          key: 'title'
        },
        {
          title: '备注',
          slot: 'remark'
        },
        {
          title: '操作',
          width: 60,
          slot: 'action'
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
      this.currentPageIdx = 1
      this.getList()
    },
    saveEdit () {
      this.loadingSaveEdit = true
      let param = deepClone(this.chooseRole)
      param.chooseList = []
      param.authority.forEach(item => {
        if (item.checkAll || item.indeterminate) {
          param.chooseList.push(item.id)
        }

        if (item.checkAllGroup.length !== 0) {
          param.chooseList = param.chooseList.concat(item.checkAllGroupList)
        }
      })
      param.ruledata = JSON.stringify(param.chooseList)

      systemSetting
        .roleSave(param)
        .then(res => {
          this.isAdd ? this.$Message.success('新增成功') : this.$Message.success('更新成功')
          this.getList()
          this.loadingSaveEdit = false
        })
        .catch(err => {
          console.log('角色权限:', err)
          this.loadingSaveEdit = false
        })
    },
    deleteItem (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        systemSetting
          .roleDelete({
            roleid: row.roleid
          })
          .then(res => {
            this.getList()
            this.getDetail()
            this.$Message.success('删除成功')
          })
      })
    },
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.checkAll = false
        this.getDetail()
      } else {
        this.isAdd = false
        this.checkAll = false
        this.getDetail(row)
      }
    },
    getDetail (row) {
      this.editLoading = true
      systemSetting
        .roleDetail({
          roleid: row ? row.roleid : ''
        })
        .then(res => {
          let data = res.data
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

          this.chooseRole = {
            roleid: data.roleid,
            title: data.title,
            remark: data.remark,
            isvalid: data.isvalid || 'Y',
            authority: data.rules
          }

          this.isCheckAll()
          this.editLoading = false
        })
        .catch(err => {
          this.editLoading = false
          console.log('角色权限:', err)
        })
    },
    handleCheckAll (index) {
      let item = this.chooseRole.authority[index]
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
    isCheckAll () {
      let chooseLenth = this.chooseRole.authority.filter(item => {
        return item.checkAll
      }).length

      if (chooseLenth === 0) {
        let chooseSonLenth = this.chooseRole.authority.filter(item => {
          return item.indeterminate
        }).length

        if (chooseSonLenth === 0) {
          this.checkAll = false
          this.indeterminate = false
        } else {
          this.checkAll = false
          this.indeterminate = true
        }
      } else if (chooseLenth !== this.chooseRole.authority.length) {
        this.checkAll = false
        this.indeterminate = true
      } else {
        this.checkAll = true
        this.indeterminate = false
      }
    },
    checkAllClick () {
      this.checkAll = !this.checkAll
      this.indeterminate = false
      this.chooseRole.authority.forEach(item => {
        item.checkAll = this.checkAll
        item.indeterminate = false
        item.checkAllGroupList = this.checkAll
          ? item.checkAllGroup.map(itemSon => {
            return itemSon.value
          })
          : []
      })
    },
    getSelect (select) {
      for (const key in this.$refs.table.objData) {
        if (Object.hasOwnProperty.call(this.$refs.table.objData, key)) {
          const item = this.$refs.table.objData[key]
          if (item._isChecked) {
            item._isHighlight = true
          } else {
            item._isHighlight = false
          }
        }
      }
      this.selectList = select
    },
    checkAllGroupChange (data, index) {
      let item = this.chooseRole.authority[index]
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
    getList () {
      this.loading = true
      systemSetting
        .roleList({
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
          console.log('角色权限:', err)
          this.loading = false
        })
    }
  },
  mounted () {
    this.getList()
    this.getDetail()
  }
}
</script>

<style lang="less" scoped>
@import './rolePermissions.less';
</style>
