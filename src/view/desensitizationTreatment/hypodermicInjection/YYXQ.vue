<template>
  <div class="YYXQ">
    <div class="contain">
      <Button type="primary">
        <div class="flex aic">
          <i class="iconfont icon-zuo" style="font-size: 12px"></i>
          上一周
        </div>
      </Button>
      <Button type="primary" style="margin-left: 8px">
        <div class="flex aic">
          下一周
          <i class="iconfont icon-you" style="font-size: 12px"></i>
        </div>
      </Button>
      <Button type="primary" style="margin-left: 8px">本 周</Button>
    </div>
    <div style="width: 100%; height: 8px; background: #f5f5fa"></div>
    <div class="contain">
      <Table :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="zy">
          <span v-if="row.zy != 0" class="editCtn" @click="showYYPeople(1)">{{ row.zy }}</span>
          <span v-else>{{ row.zy }}</span>
        </template>
        <template slot-scope="{ row }" slot="ze">
          <span v-if="row.ze != 0" class="editCtn" @click="showYYPeople(2)">{{ row.ze }}</span>
          <span v-else>{{ row.ze }}</span>
        </template>
        <template slot-scope="{ row }" slot="zsan">
          <span v-if="row.zsan != 0" class="editCtn" @click="showYYPeople(3)">{{ row.zsan }}</span>
          <span v-else>{{ row.zsan }}</span>
        </template>
        <template slot-scope="{ row }" slot="zsi">
          <span v-if="row.zsi != 0" class="editCtn" @click="showYYPeople(4)">{{ row.zsi }}</span>
          <span v-else>{{ row.zsi }}</span>
        </template>
        <template slot-scope="{ row }" slot="zw">
          <span v-if="row.zw != 0" class="editCtn" @click="showYYPeople(5)">{{ row.zw }}</span>
          <span v-else>{{ row.zw }}</span>
        </template>
        <template slot-scope="{ row }" slot="zl">
          <span v-if="row.zl != 0" class="editCtn" @click="showYYPeople(6)">{{ row.zl }}</span>
          <span v-else>{{ row.zl }}</span>
        </template>
        <template slot-scope="{ row }" slot="zri">
          <span v-if="row.zri != 0" class="editCtn" @click="showYYPeople(7)">{{ row.zri }}</span>
          <span v-else>{{ row.zri }}</span>
        </template>
      </Table>
    </div>
    <div class="flex jcc" style="width: 100%; margin-top: 20px">
      <Button type="primary" @click="goBack">返回上一级</Button>
    </div>
    <el-dialog
      :title="yyObj.title"
      :visible.sync="showYY"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="table_style">
        <Table :columns="smallColumns" :data="smallData">
          <template slot-scope="{ row }" slot="date">
            <DatePicker
              :editable="false"
              type="date"
              :transfer="true"
              placeholder="请选择预约日期"
              v-model="row.date"
            ></DatePicker>
          </template>
          <template slot-scope="{ row }" slot="time">
            <Select v-model="row.time" :transfer="true">
              <Option value="上午">上午</Option>
              <Option value="下午">下午</Option>
            </Select>
          </template>
        </Table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'YYXQ',
  data () {
    return {
      showYY: false,
      columns: [
        {
          title: '预约',
          key: 'yy'
        },
        {
          title: '周一',
          slot: 'zy'
        },
        {
          title: '周二',
          slot: 'ze'
        },
        {
          title: '周三',
          slot: 'zsan'
        },
        {
          title: '周四',
          slot: 'zsi'
        },
        {
          title: '周五',
          slot: 'zw'
        },
        {
          title: '周六',
          slot: 'zl'
        },
        {
          title: '周日',
          slot: 'zri'
        }
      ],
      tableData: [],
      smallColumns: [
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
          title: '预约日期',
          slot: 'date',
          width: 220
        },
        {
          title: '时间',
          slot: 'time'
        }
      ],
      smallData: [
        {
          bah: 1,
          name: '潘鸿才',
          sex: '男',
          age: 22,
          date: '',
          time: ''
        }
      ],
      yyObj: {}
    }
  },
  methods: {
    goBack () {
      this.$emit('notShow')
    },
    showYYPeople (index) {
      this.showYY = true
      this.yyObj = {
        title: '预约患者 ' + this.columns[index].title
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './hypodermicInjection.less';
</style>
