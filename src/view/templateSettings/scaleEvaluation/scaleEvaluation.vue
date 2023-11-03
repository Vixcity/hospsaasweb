<template>
  <div class="scaleEvaluation">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">项目名称</div>
          <div>
            <Select style="width: 200px">
              <Option value="患者自评">患者自评</Option>
              <Option value="医生评估">医生评估</Option>
            </Select>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input search placeholder="项目名称" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary">查 询</Button>
          <Button>重 置</Button>
        </div>
      </div>
    </div>
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary" @click="openEdit('add')">新增量表</Button>
        </div>
      </div>
    </div>
    <Table :columns="columns" :data="tableData" ref="table" style="margin-top: 16px">
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
      :title="isAdd ? '新增量表' : '编辑量表'"
      :visible.sync="showEdit"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div>
        <div class="flex jcsb black">
          <div class="flex aic">
            <div>量表简称</div>
            <div style="margin-left: 8px">
              <Input v-model="chooseLB.jc" placeholder="请填写量表简称" />
            </div>
          </div>
          <div class="flex aic">
            <div>量表全称</div>
            <div style="margin-left: 8px">
              <Input v-model="chooseLB.qc" placeholder="请填写量表全称" />
            </div>
          </div>
          <div class="flex aic">
            <div>量表类型</div>
            <div style="margin-left: 8px">
              <Select style="width: 200px" v-model="chooseLB.type">
                <Option value="患者自评">患者自评</Option>
                <Option value="医生评估">医生评估</Option>
              </Select>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div v-for="(itemTitle, indexTitle) in chooseLB.titleArr" :key="'itemTitle' + indexTitle" class="black">
          <div
            v-if="indexTitle != 0"
            style="border-bottom: 1px dashed #d2d7e1; margin: 8px 0"
          ></div>
          <div class="flex aic">
            <div style="width: 80px; text-align: right">题目名称{{ indexTitle + 1 }}</div>
            <Input
              v-model="itemTitle.title"
              placeholder="请输入题目名称"
              style="width: 260px; margin-left: 8px"
            />
            <div
              class="red"
              style="margin-left: 8px; cursor: pointer"
              v-if="chooseLB.titleArr.length > 1"
              @click="deleteTitle(indexTitle)"
            >
              删除
            </div>
          </div>
          <div
            class="flex aic"
            style="margin-top: 10px"
            v-for="(itemSelect, indexSelect) in itemTitle.selection"
            :key="'itemSelect' + indexSelect"
          >
            <div class="gray" style="width: 80px; text-align: right">选项{{ indexSelect + 1 }}</div>
            <Input
              v-model="itemSelect.select"
              placeholder="请输入选项内容"
              style="width: 260px; margin-left: 8px"
            />
            <div class="gray" style="margin-left: 20px">分值</div>
            <Input
              v-model="itemSelect.sorce"
              style="width: 60px; margin-left: 8px"
              type="number"
              placeholder="分值"
            />
            <div class="gray" style="margin-left: 8px">分</div>
            <i
              class="iconfont icon-shanchu red"
              v-if="itemTitle.selection.length > 1"
              style="font-size: 20px; margin-left: 8px; cursor: pointer"
              @click="deleteSelect(indexTitle, indexSelect)"
            ></i>
            <i
              class="iconfont icon-tianjia blue"
              v-if="itemTitle.selection.length - 1 === indexSelect"
              style="font-size: 20px; margin-left: 8px; cursor: pointer"
              @click="addSelect(indexTitle)"
            ></i>
          </div>
        </div>
        <Button type="primary" ghost style="margin-top: 20px" @click="addTitle">
          <div class="flex aic" style="margin-top: -3px">
            <i class="iconfont icon-tianjia-circle" style="font-size: 16px"></i>
            <div style="margin-left: 8px; font-size: 14px; margin-top: 1px">添加题目</div>
          </div>
        </Button>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveEdit">保 存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/libs/util'
export default {
  name: 'scaleEvaluation',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      isAdd: false,
      showEdit: false,
      columns: [
        {
          title: '简称',
          key: 'name'
        },
        {
          title: '全称',
          key: 'allName'
        },
        {
          title: '类别',
          key: 'type'
        },
        {
          title: '题数',
          key: 'count'
        },
        {
          title: '总分',
          key: 'totalCount'
        },
        {
          title: '操作',
          slot: 'action',
          width: 120,
          fixed: 'right'
        }
      ],
      tableData: [],
      chooseLB: {
        jc: '',
        qc: '',
        type: '患者自评',
        titleArr: [
          {
            title: '',
            selection: [{}]
          }
        ]
      }
    }
  },
  methods: {
    changePage () {},
    changeSize () {},
    saveEdit () {},
    openEdit (type, row) {
      if (type === 'add') {
        this.isAdd = true
        this.chooseLB = {
          jc: '',
          qc: '',
          type: '患者自评',
          titleArr: [
            {
              title: '',
              selection: [{}]
            }
          ]
        }
      } else {
        // console.log(row)
        row.qc = row.allName
        row.jc = row.name
        row.titleArr = [
          {
            title: '',
            selection: [{}]
          }
        ]
        this.chooseLB = deepClone(row)
      }

      this.showEdit = true
    },
    addTitle () {
      this.chooseLB.titleArr.push({
        title: '',
        selection: [{}]
      })
    },
    deleteTitle (indexTitle) {
      this.chooseLB.titleArr.splice(indexTitle, 1)
    },
    addSelect (indexTitle) {
      this.chooseLB.titleArr[indexTitle].selection.push({})
    },
    deleteSelect (indexTitle, indexSelect) {
      this.chooseLB.titleArr[indexTitle].selection.splice(indexSelect, 1)
    },
    deleteItem (row) {
      this.$confirm('确认是否删除?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(obj.index, 1)
        this.$Message.success('删除成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './scaleEvaluation.less';
</style>
