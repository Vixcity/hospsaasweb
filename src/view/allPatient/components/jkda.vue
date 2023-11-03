<template>
  <div class="files" v-loading="loading">
    <div class="files_title">基础信息</div>
    <div class="files_txt">
      <div>
        姓名：
        <span>{{ basic.patname }}</span>
      </div>
      <div>
        性别：
        <span>{{ basic.sex }}</span>
      </div>
      <div>
        年龄：
        <span>{{ basic.age }}</span>
      </div>
      <div>
        出生日期：
        <span>{{ basic.birthday }}</span>
      </div>
      <!-- <div>
        手机号：
        <span>18441964223</span>
      </div> -->
      <div>
        身高：
        <span>{{ basic.height ? basic.height + 'cm' : '-' }}</span>
      </div>
      <div>
        体重：
        <span>{{ basic.weight ? basic.weight + 'kg' : '-' }}</span>
      </div>
      <div>
        BIM：
        <span>{{ basic.bmi }}</span>
      </div>
      <div>
        诊断：
        <span>{{ basic.diagnose }}</span>
      </div>
    </div>
    <div class="files_line"></div>
    <div class="files_title">其他信息</div>
    <div class="files_txt">
      <div>
        是否抽烟：
        <span>{{ other.issmoke === 'Y' ? '是' : '否' }}</span>
      </div>
      <div>
        是否酗酒：
        <span>{{ other.isdrink === 'Y' ? '是' : '否' }}</span>
      </div>
      <div>
        家族过敏史：
        <span>{{ other.family }}</span>
      </div>
    </div>
    <div class="files_line"></div>
    <div class="files_title">联系人信息</div>
    <div class="files_txt">
      <div>
        联系人姓名：
        <span>{{ other.jjlxname }}</span>
      </div>
      <div>
        联系人电话：
        <span>{{ other.jjlxphone }}</span>
      </div>
    </div>
    <!-- <Table :columns="contacts" :data="contactsList" style="margin-bottom: 16px"></Table>
    <div class="files_name">脱敏治疗</div> -->
    <!-- <Table :columns="columns" :data="arrList"></Table> -->

    <!-- 结束治疗 -->
    <el-dialog
      title="结束治疗"
      :visible.sync="edit"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
      @close="cancel"
    >
      <Form ref="ruleForm" :model="ruleForm" :rules="rules" :label-width="100">
        <FormItem prop="cause">
          <RadioGroup v-model="ruleForm.cause">
            <Radio label="1">已康复</Radio>
            <Radio label="2">其他</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="结束治疗原因" prop="causeCont" v-if="ruleForm.cause == '2'">
          <Input
            v-model="ruleForm.causeCont"
            type="textarea"
            :rows="5"
            placeholder="请输入结束治疗原因"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit">确 定</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treated } from '@/api/treated/index'
export default {
  name: 'jkda',
  data () {
    return {
      basic: {},
      other: {},
      loading: false,
      patid: this.$route.query.patid,
      contacts: [
        {
          title: '序号',
          key: 'id'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '关系',
          key: 'relationship'
        },
        {
          title: '电话',
          key: 'phone'
        },
        {
          title: '地址',
          key: 'address',
          width: 600
        }
      ],
      contactsList: [
        {
          id: 1,
          name: '张二',
          relationship: '父亲',
          phone: '15372413899',
          address: '浙江省杭州市余杭区数字健康小镇10号楼B座2楼'
        },
        {
          id: 2,
          name: '王七',
          relationship: '母亲',
          phone: '15964856568',
          address: '浙江省杭州市余杭区数字健康小镇10号楼B座2楼'
        }
      ],
      columns: [
        {
          title: '药物名称',
          key: 'title'
        },
        {
          title: '治疗方案',
          key: 'plan'
        },
        {
          title: '治疗状态',
          key: 'status',
          render: (h, obj) => {
            return h('div', [
              h('div', {
                style: {
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor:
                    obj.row.status === 1 ? '#00D48A' : obj.row.status === 2 ? '#D2D7E1' : '',
                  display: 'inline-block',
                  marginRight: '10px'
                }
              }),
              obj.row.status === 1 ? '治疗中' : obj.row.status === 2 ? '结束治疗' : ''
            ])
          }
        },
        {
          title: '操作',
          render: (h, obj) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    color: '#3171FF',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      if (obj.row.status === 1) {
                        this.edit = true
                        this.chooseIndex = obj.row._index
                      } else if (obj.row.status === 2) {
                        this.$Message.success('操作成功')
                        this.arrList[obj.row._index].status = 1
                      }
                    }
                  }
                },
                obj.row.status === 1 ? '结束治疗' : obj.row.status === 2 ? '继续治疗' : ''
              )
            ])
          }
        }
      ],
      arrList: [
        {
          title: '安脱达',
          plan: '集群方案',
          status: 1
        },
        {
          title: '安脱达',
          plan: '集群方案',
          status: 2
        }
      ],
      edit: false,
      ruleForm: {
        cause: '1',
        causeCont: ''
      },
      rules: {}
    }
  },
  methods: {
    // 取消
    cancel () {
      this.edit = false
      this.$refs['ruleForm'].resetFields()
    },
    // 确定
    submit () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$Message.success('提交成功')
          this.arrList[this.chooseIndex].status = 2
          this.cancel()
        }
      })
    },
    getDetail () {
      this.loading = true
      treated
        .jkdaDetail({
          patid: this.patid
        })
        .then(res => {
          let data = res.data
          this.basic = data.basic
          this.other = data.other
          this.loading = false
        })
    }
  },
  mounted () {
    this.getDetail()
  }
}
</script>

<style lang="less" scoped>
.files {
  .files_title {
    font-size: 18px;
    font-weight: 500;
    color: #282d3c;
    line-height: 18px;
    margin-bottom: 16px;
    padding-left: 12px;
    box-sizing: border-box;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 0;
      width: 4px;
      height: 18px;
      background: #3171ff;
    }
  }
  .files_txt {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    div {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 400;
      color: #969baa;
      line-height: 16px;
      margin-right: 80px;
      &:last-child {
        margin-right: 0;
      }
      span {
        color: #282d3c;
      }
    }
  }
  .files_line {
    width: 100%;
    height: 1px;
    background: #d2d7e1;
    margin-bottom: 16px;
  }
  .files_name {
    font-size: 16px;
    font-weight: 500;
    color: #282d3c;
    line-height: 18px;
    margin-bottom: 8px;
  }
}
</style>
