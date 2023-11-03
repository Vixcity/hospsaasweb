<template>
  <div class="jkxj">
    <div class="flex jcsb">
      <div class="flex">
        <div class="flex">
          <div class="flexItem">
            <div class="label">宣教类型</div>
            <Select
              v-model="cateid"
              style="width: 220px; margin-left: 8px"
              @on-change="getListByType"
            >
              <Option
                v-for="(item, index) in selList"
                :key="index + 'selList'"
                :value="item.cateid"
                :label="item.title"
              ></Option>
            </Select>
          </div>
          <div class="flexItem">
            <div class="label">宣教列表</div>
            <Select
              v-model="xuanid"
              style="width: 220px; margin-left: 8px"
              not-found-text="请选择其他类型"
            >
              <Option
                v-for="(item, index) in listLists"
                :key="index + 'selList'"
                :value="item.xuanid"
                :label="item.title"
              ></Option>
            </Select>
          </div>
        </div>
        <Button type="primary" @click="addTableData">新 增</Button>
      </div>
      <Button type="primary" @click="send">发 送</Button>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #action="{ row }">
        <span class="red curpor" @click="deleteXuan(row)">删除</span>
      </template>
    </Table>
  </div>
</template>

<script>
import { treated } from '@/api/treated/index'
export default {
  name: 'jkxj',
  data () {
    return {
      selList: [],
      tableData: [],
      listLists: [],
      loading: false,
      patid: this.$route.query.patid,
      appointid: this.$route.query.appointid,
      cateid: '',
      xuanid: '',
      columns: [
        {
          title: '宣教类型',
          key: 'catename'
        },
        {
          title: '宣教标题',
          key: 'title'
        },
        {
          title: '操作',
          slot: 'action',
          maxWidth: 280
        }
      ]
    }
  },
  methods: {
    getDetail () {
      this.loading = true
      treated
        .xuanInit({
          appointid: this.appointid
        })
        .then(res => {
          let data = res.data
          this.selList = data.cate
          this.tableData = data.lists
          this.loading = false
        })
    },
    getListByType () {
      treated
        .getListByXuanType({
          cateid: this.cateid
        })
        .then(res => {
          let data = res.data
          this.listLists = data
        })
    },
    addTableData () {
      if (!this.xuanid) return
      let objType = this.selList.find(item => item.cateid === this.cateid)
      let obj = this.listLists.find(item => item.xuanid === this.xuanid)
      this.tableData.push({
        xuanid: this.xuanid,
        catename: objType.title,
        title: obj.title
      })
      this.xuanid = ''
    },
    deleteXuan (row) {
      this.$confirm(`是否删除?`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(res => {
        this.tableData.splice(row.index, 1)
        this.$Message.success('删除成功')
      })
    },
    send () {
      treated
        .sendXuan({
          appointid: this.appointid,
          xuanids: this.tableData.map(item => item.xuanid).toString()
        })
        .then(res => {
          this.$Message.success('发送成功')
        })
    }
  },
  mounted () {
    this.getDetail()
    this.getListByType()
  }
}
</script>

<style lang="less" scoped>
.jkxj {
  .flexItem {
    display: flex;
    align-items: center;
    margin-right: 24px;
    &:last-child {
      margin-right: 16px;
    }
    .label {
      font-size: 14px;
    }
  }
}
</style>
