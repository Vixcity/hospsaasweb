<template>
  <div class="deploy">
    <Table v-loading="loading" :columns="columns" :data="tableData">
      <template #setval="{ row }">
        <TimePicker
          :editable="false"
          v-if="row.setkey == 'qh_time'"
          v-model="row.setval"
          :steps="[1, 5]"
          format="HH:mm"
          :placeholder="'请选择' + row.name"
        ></TimePicker>
        <InputNumber
          v-else
          :min="1"
          v-model="row.setval"
          :placeholder="'请输入' + row.name"
        ></InputNumber>
      </template>
      <template #action="{ row }">
        <div class="flex">
          <div class="tableAdd" @click="blurVal(row)">保存</div>
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
import { pbgl } from '@/api/systemSetting/pbgl'
export default {
  name: 'jcpz',
  data () {
    return {
      loading: false,
      columns: [
        {
          title: '参数名称',
          key: 'name'
        },
        {
          title: '参数标识',
          key: 'setkey'
        },
        {
          title: '参数值',
          key: 'setval',
          slot: 'setval'
        },
        {
          title: '操作',
          slot: 'action',
          width: 120
        }
      ],
      tableData: []
    }
  },
  methods: {
    getData () {
      this.loading = true
      pbgl.getConfig().then(res => {
        this.tableData = res.data.lists
        this.loading = false
      })
    },
    blurVal (row) {
      if (!row.setval) return
      pbgl
        .saveConfig({
          setkey: row.setkey,
          setval: row.setval
        })
        .then(res => {
          this.$Message.success('修改成功')
          this.getData()
        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.deploy {
  padding-top: 16px;
  /deep/ .ivu-input-number,
  /deep/ .ivu-date-picker {
    width: 100%;
  }
  /deep/ .ivu-table-wrapper {
    overflow: visible !important;
  }
}
</style>
