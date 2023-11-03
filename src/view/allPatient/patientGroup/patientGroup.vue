<template>
  <div class="patientGroup">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" placeholder="分组名称" icon="ios-search"></Input>
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="getList">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary" @click="openAdd('one')">新增分组</Button>
          <Button type="primary" @click="openAdd('two')">新增二级分组</Button>
        </div>
      </div>
    </div>
    <!-- <Table
      v-loading="loading"
      :columns="columns"
      :data="tableData"
      style="margin-top: 16px"
    ></Table> -->
    <el-table
      :data="tableData"
      v-loading="loading"
      style="margin-top: 16px"
      row-key="id"
      border
      :row-class-name="tableRowClassName"
      default-expand-all
      :tree-props="{ children: 'sub' }"
    >
      <el-table-column prop="title" label="分组名称"></el-table-column>
      <el-table-column prop="createtime" label="创建时间"></el-table-column>
      <el-table-column prop="total" label="患者人数"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <span
            style="color: #3171ff; cursor: pointer; margin-right: 16px"
            @click="edit(scope.row)"
          >
            编辑
          </span>
          <span style="color: #f75559; cursor: pointer" @click="deleteItem(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="isEdit ? '编辑分组' : '添加分组'"
      :visible.sync="showAdd"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form ref="ruleForm" :model="ruleForm" :label-width="100">
        <FormItem label="一级分组" prop="oneid" v-if="!isOne">
          <Select v-model="ruleForm.oneid">
            <Option
              v-for="(item, index) in oneGroupList"
              :key="index + '一级分组'"
              :value="item.value"
              :label="item.label"
            ></Option>
          </Select>
        </FormItem>
        <FormItem :label="isEdit ? '分组名称' : isOne ? '一级分组' : '二级分组'" prop="title">
          <Input v-model="ruleForm.title" placeholder="请输入分组名称"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveEdit" :loading="loadingEdit">确 定</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { allPatient } from '@/api/allPatient/index'
export default {
  name: 'patientGroup',
  data () {
    return {
      loading: false,
      showAdd: false,
      isOne: false,
      isEdit: false,
      loadingEdit: false,
      oneGroupList: [],
      ruleForm: {
        oneid: 0,
        title: ''
      },
      // columns: [
      //   {
      //     title: '分组名称',
      //     key: 'title'
      //   },
      //   {
      //     title: '创建时间',
      //     key: 'createtime'
      //   },
      //   {
      //     title: '患者人数',
      //     key: 'total'
      //   },
      //   {
      //     title: '操作',
      //     width: 80,
      //     fixed: 'right',
      //     render: (h, obj) => {
      //       return h('div', [
      //         h(
      //           'span',
      //           {
      //             style: {
      //               color: '#3171FF',
      //               cursor: 'pointer',
      //               marginRight: '16px'
      //             },
      //             on: {
      //               click: () => {
      //                 this.$router.push({ path: '/detail?patid=' + obj.row.patid })
      //               }
      //             }
      //           },
      //           '编辑'
      //         )
      //         // h(
      //         //   'span',
      //         //   {
      //         //     style: {
      //         //       color: '#F75559',
      //         //       cursor: 'pointer'
      //         //     },
      //         //     on: {
      //         //       click: () => {
      //         //         this.$confirm(`是否确认删除患者${obj.row.patname}信息?`, '提示', {
      //         //           confirmButtonText: '确 定',
      //         //           cancelButtonText: '取 消',
      //         //           type: 'warning'
      //         //         }).then(res => {
      //         //           this.tableData.splice(obj.index, 1)
      //         //           this.$Message.success('删除成功')
      //         //         })
      //         //       }
      //         //     }
      //         //   },
      //         //   '删除'
      //         // )
      //       ])
      //     }
      //   }
      // ],
      tableData: [],
      keyword: ''
    }
  },
  methods: {
    openAdd (type) {
      this.showAdd = true
      if (type === 'one') {
        this.isOne = true
        this.ruleForm.oneid = 0
        this.ruleForm.title = ''
      } else {
        if (this.oneGroupList.length === 0) {
          this.$Message.error('请先填写一级分组')
          return
        }
        this.isOne = false
        this.ruleForm.oneid = this.oneGroupList[0].value
      }
    },
    deleteItem (row) {
      this.$confirm(`是否确认该分组?`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(res => {
        allPatient
          .delGroup({
            id: row.id
          })
          .then(res => {
            this.$Message.success('删除成功')
            this.getList()
          })
      })
    },
    edit (row) {
      this.showAdd = true
      this.isOne = true
      this.isEdit = true
      this.ruleForm.title = row.title
      this.ruleForm.id = row.id
    },
    saveEdit () {
      if (!this.ruleForm.title) {
        this.$Message.error('请填写分组名称')
        return
      }

      this.loadingEdit = true

      if (this.isEdit) {
        allPatient
          .editGroup({
            id: this.ruleForm.id,
            title: this.ruleForm.title
          })
          .then(res => {
            this.$Message.success('保存成功')
            this.showAdd = false
            this.isEdit = false
            this.getList()
            this.loadingEdit = false
          })
          .catch(() => {
            this.loadingEdit = false
          })
      } else {
        allPatient
          .addGroup({
            oneid: this.ruleForm.oneid,
            title: this.ruleForm.title
          })
          .then(res => {
            this.$Message.success('保存成功')
            this.showAdd = false
            this.getList()
            this.loadingEdit = false
          })
          .catch(() => {
            this.loadingEdit = false
          })
      }
      this.ruleForm.title = ''
    },
    reset () {
      this.keyword = ''
      this.getList()
    },
    tableRowClassName ({ row }) {
      if (row.sub === undefined) {
        return 'son-row'
      } else {
        return ''
      }
    },
    getList () {
      this.loading = true
      allPatient
        .groupList({
          content: this.keyword
        })
        .then(res => {
          let data = res.data
          this.oneGroupList = [].concat(
            data.map(item => {
              return {
                value: item.id,
                label: item.title
              }
            })
          )
          this.tableData = data
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
.patientGroup {
  padding: 1px 8px 50px;
  box-sizing: border-box;
}

// 对齐根节点 无论有无子节点
::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 24px;
  }
}
</style>
<style>
.el-table th.el-table__cell {
  background: #d6e3ff !important;
  color: #282d3c;
  font-weight: unset;
  padding: 8px 0 !important;
  font-size: 14px;
}

.el-table--enable-row-hover .el-table__body tr:hover td {
  background: #ebf7ff !important;
}

.el-table__placeholder {
  width: 32px;
}

.el-table .son-row {
  background: #f8f8f8;
}

.el-table--border,
.el-table--group {
  border: 0px;
}

.el-table--border::after {
  width: 0;
}

.el-table--border .el-table__cell,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 1px solid white;
}
</style>
