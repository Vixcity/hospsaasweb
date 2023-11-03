<template>
  <div class="lungFunctionData">
    <div class="tabItemCon">
      <div class="filterCtn">
        <div class="itemFather">
          <div class="filterItem">
            <div class="label">诊断结果</div>
            <div>
              <Select style="width: 180px" filterable>
                <Option value="良好">良好</Option>
                <Option value="不好">不好</Option>
                <Option value="健康">健康</Option>
              </Select>
            </div>
          </div>
          <div class="filterItem">
            <div class="label">搜索</div>
            <div>
              <Input search placeholder="人员姓名/人员账号" />
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
            <Button type="primary">导 入</Button>
            <Button type="primary">导 出</Button>
          </div>
        </div>
      </div>
      <Table :columns="columns" :data="tableData" style="margin-top: 16px"></Table>
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
  </div>
</template>

<script>
export default {
  name: 'lungFunctionData',
  data () {
    return {
      pageNum: 0,
      currentPageIdx: 1,
      columns: [
        {
          title: '就诊卡号',
          key: 'bah'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '性别',
          key: 'sex'
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: 'PEF预计值',
          key: 'pefyj'
        },
        {
          title: 'PEF最佳值',
          key: 'pefzj'
        },
        {
          title: '诊断结果',
          key: 'result'
        },
        {
          title: '吹起时间',
          key: 'pgTime'
        },
        {
          title: '结果数值',
          key: 'pgResult'
        }
      ],
      tableData: []
    }
  },
  methods: {
    changePage () {},
    changeSize () {}
  }
}
</script>

<style lang="less" scoped>
@import './lungFunctionData.less';
</style>
<style scoped>
.lungFunctionData >>> .ivu-tabs-bar {
  border-color: transparent;
  margin-bottom: 10px;
}
</style>
