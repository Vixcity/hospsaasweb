<template>
  <div>
    <div class="case" v-if="step === '1'">
      <div class="flex aic jcsb">
        <div class="flex aic" style="width: 44%">
          <div class="label">选择模板</div>
          <Select
            v-model="transfer"
            style="width: calc(100% - 100px)"
            placeholder="请选择模板"
            @on-change="changeRuleFormTem"
          >
            <Option v-for="(item, index) in temp" :value="index" :key="index + 'temp'">
              {{ item.name }}
            </Option>
          </Select>
        </div>
        <div class="case_history">
          <span @click="step = '2'">历史病历</span>
        </div>
      </div>
      <div class="flex" v-loading="loading" id="printMe">
        <div class="flexLeft" style="width: 44%">
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">就诊卡号</div>
            <Input
              v-model="ruleForm.jzcard"
              style="width: calc(100% - 100px)"
              @keyup.native="changeJZCard"
              placeholder="请填写就诊卡号"
            />
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">初复诊</div>
            <Input style="width: calc(100% - 100px)" v-model="typename" disabled />
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">
              <span class="red">*</span>
              主诉
            </div>
            <Input
              style="width: calc(100% - 100px)"
              v-model="ruleForm.suit"
              placeholder="请输入主诉内容"
            />
          </div>
          <div class="flex" style="margin-top: 24px">
            <div class="label">
              <span class="red">*</span>
              现病史
            </div>
            <Input
              v-model="ruleForm.present"
              style="width: calc(100% - 100px)"
              type="textarea"
              :rows="5"
              placeholder="请输入现病史"
            />
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">
              <span class="red">*</span>
              过敏史
            </div>
            <Input
              style="width: calc(100% - 100px)"
              v-model="ruleForm.allergy"
              placeholder="请输入过敏史"
            />
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">疾病史</div>
            <Input
              style="width: calc(100% - 100px)"
              v-model="ruleForm.disease"
              placeholder="请输入疾病史"
            />
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">手术史</div>
            <Input
              style="width: calc(100% - 100px)"
              v-model="ruleForm.surgery"
              placeholder="请输入手术史"
            />
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">外伤史</div>
            <Input
              style="width: calc(100% - 100px)"
              v-model="ruleForm.trauma"
              placeholder="请输入外伤史"
            />
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">婚育史</div>
            <Select
              v-model="ruleForm.marry"
              style="width: calc(100% - 100px)"
              placeholder="请选择婚育状态"
            >
              <Option value="未婚">未婚</Option>
              <Option value="未育">未育</Option>
              <Option value="已婚">已婚</Option>
              <Option value="已育">已育</Option>
            </Select>
          </div>
        </div>
        <div class="flexRight" style="width: 56%">
          <div class="flex aic" style="margin-top: 24px" v-if="showjzno == 'Y'">
            <div class="label">编号</div>
            <Input
              v-model="ruleForm.jzno"
              style="width: calc(100% - 100px)"
              placeholder="请填写编号"
            />
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">家族史</div>
            <Input
              style="width: calc(100% - 100px)"
              v-model="ruleForm.family"
              placeholder="请输入家族史"
            />
          </div>
          <div class="flex" style="margin-top: 24px">
            <div class="label">体检检查</div>
            <div class="case_inspect" style="width: calc(100% - 100px); background: #f5f5fa">
              <div class="flex aic jcsb" style="margin-bottom: 10px">
                <div class="flex aic" style="width: 50%">
                  <span
                    style="font-size: 14px; margin-right: 8px; flex: 1; min-width: 48px"
                    class="max_width"
                  >
                    收缩压
                  </span>
                  <div class="case_breath" style="position: relative; flex: 3">
                    <Input v-model="ruleForm.blood1" type="number" placeholder="收缩压" />
                    <span style="position: absolute; right: 8px; top: 6px">mmHg</span>
                  </div>
                </div>
                <div class="flex aic" style="width: 50%; margin-left: 8px">
                  <span
                    style="font-size: 14px; margin-right: 8px; flex: 1; min-width: 48px"
                    class="max_width"
                  >
                    舒张压
                  </span>
                  <div class="case_breath" style="position: relative; flex: 3">
                    <Input v-model="ruleForm.blood2" type="number" placeholder="舒张压" />
                    <span style="position: absolute; right: 8px; top: 6px">mmHg</span>
                  </div>
                </div>
              </div>
              <div class="flex aic jcsb" style="margin-bottom: 10px">
                <div class="flex aic" style="width: 50%">
                  <span
                    style="font-size: 14px; margin-right: 8px; flex: 1; min-width: 48px"
                    class="max_width"
                  >
                    呼吸
                  </span>
                  <div class="case_breath" style="position: relative; flex: 3">
                    <Input v-model="ruleForm.breath" type="number" placeholder="呼吸" />
                    <span style="position: absolute; right: 8px; top: 6px">次/min</span>
                  </div>
                </div>
                <div class="flex aic" style="width: 50%; margin-left: 8px">
                  <span
                    style="font-size: 14px; margin-right: 8px; flex: 1; min-width: 48px"
                    class="max_width"
                  >
                    体温
                  </span>
                  <div class="case_heat" style="position: relative; flex: 3">
                    <Input v-model="ruleForm.heat" type="number" placeholder="体温" />
                    <span style="position: absolute; right: 8px; top: 6px">℃</span>
                  </div>
                </div>
              </div>
              <div class="flex aic jcsb" style="margin-bottom: 10px">
                <div class="flex aic" style="width: 50%">
                  <span
                    style="font-size: 14px; margin-right: 8px; flex: 1; min-width: 48px"
                    class="max_width"
                  >
                    身高
                  </span>
                  <div class="case_heat" style="position: relative; flex: 3">
                    <Input v-model="ruleForm.height" type="number" placeholder="身高" />
                    <span style="position: absolute; right: 8px; top: 6px">cm</span>
                  </div>
                </div>
                <div class="flex aic" style="width: 50%; margin-left: 8px">
                  <span
                    style="font-size: 14px; margin-right: 8px; flex: 1; min-width: 48px"
                    class="max_width"
                  >
                    体重
                  </span>
                  <div class="case_heat" style="position: relative; flex: 3">
                    <Input v-model="ruleForm.weight" type="number" placeholder="体重" />
                    <span style="position: absolute; right: 8px; top: 6px">kg</span>
                  </div>
                </div>
              </div>
              <div class="flex aic jcsb" style="margin-bottom: 10px">
                <div class="flex aic" style="width: 50%; justify-content: end">
                  <span
                    style="flex: 1.1; min-width: 48px; font-size: 14px; margin-right: 8px"
                    class="max_width"
                  >
                    跌倒风险筛查
                  </span>
                  <div style="position: relative; flex: 3">
                    <Select v-model="ruleForm.tumble">
                      <Option value="是">是</Option>
                      <Option value="否">否</Option>
                    </Select>
                  </div>
                </div>
                <div class="flex aic" style="width: 50%; margin-left: 8px">
                  <span
                    style="font-size: 14px; margin-right: 8px; flex: 1; min-width: 48px"
                    class="max_width"
                  >
                    备注
                  </span>
                  <div style="flex: 3">
                    <Input v-model="ruleForm.sign" placeholder="请输入备注"></Input>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">疼痛评估</div>
            <Input
              style="width: calc(100% - 100px)"
              v-model="ruleForm.vas"
              placeholder="请输入疼痛评估"
            ></Input>
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">心理评估</div>
            <Input
              style="width: calc(100% - 100px)"
              v-model="ruleForm.psy"
              placeholder="请输入心理评估"
            ></Input>
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">交通工具</div>
            <Input
              style="width: calc(100% - 100px)"
              v-model="ruleForm.car"
              placeholder="请输入交通工具"
            ></Input>
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">
              <span class="red">*</span>
              诊断
            </div>
            <Select
              style="width: calc(100% - 180px)"
              v-model="ruleForm.diagnose"
              multiple
              filterable
              placeholder="请选择诊断结果"
            >
              <Option
                v-for="(item, index) in diagnoseList"
                :key="index + 'diagnoseList'"
                :value="item"
                :label="item"
              ></Option>
            </Select>
            <div class="blue curpor" style="margin-left: 8px" @click="openEdit('add')">
              新增诊断模板
            </div>
          </div>
          <div class="flex aic" style="margin-top: 24px">
            <div class="label">备注</div>
            <Input
              style="width: calc(100% - 100px)"
              v-model="ruleForm.remark"
              placeholder="请输入备注"
            ></Input>
          </div>
        </div>
      </div>
      <div class="case_btn">
        <Button type="primary" @click="saveBL" :loading="loadingBL">保 存</Button>
        <Button @click="addTemplate" style="margin-left: 16px">
          <div class="flex aic">
            <Icon type="md-add" size="20" class="gray" />
            <span style="font-size: 14p; margin-left: 4px" @click="showEdit = true">
              添加为新模板
            </span>
          </div>
        </Button>
        <Button style="margin-left: 16px" v-print="'#printMe'">
          <div class="flex aic">
            <Icon type="ios-print-outline" size="18" class="gray" />
            <span style="font-size: 14p; margin-left: 8px">打 印</span>
          </div>
        </Button>
      </div>
    </div>

    <!-- 历史病历 -->
    <HistoryBl v-if="step === '2'" @pre="step = '1'" @changeRuleForm="changeRuleForm"></HistoryBl>

    <!-- 添加新模板 -->
    <el-dialog
      title="添加新模板"
      :visible.sync="showEdit"
      width="400px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
      @close="cancel"
    >
      <Form ref="ruleFormAdd" :model="ruleFormAdd" :rules="rulesAdd" :label-width="100">
        <FormItem label="模板名称" prop="tempname">
          <Input v-model="ruleFormAdd.tempname" placeholder="请输入模板名称"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取 消</Button>
        <Button type="primary" @click="saveEdit" style="margin-left: 8px" :loading="loadingEdit">
          确 定
        </Button>
      </div>
    </el-dialog>

    <el-dialog
      title="新增诊断模板"
      :visible.sync="showDiaEdit"
      width="300px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic black">
            <div style="width: 34px; text-align: right; margin-right: 8px">名称</div>
            <Input v-model="chooseZD.name" placeholder="请填写诊断模板名称" />
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveDiaEdit" :loading="loadingDiaEdit">保 存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treated } from '@/api/treated/index'
import { templateSettings } from '@/api/templateSettings/index'
import { common } from '@/api/index'
import HistoryBl from './history_bl.vue'
import { deepClone } from '@/libs/util'
export default {
  name: 'txbl',
  props: ['patInfo'],
  data () {
    return {
      step: '1',
      typename: '初诊',
      patid: this.$route.query.patid,
      appointid: this.$route.query.appointid,
      showDiaEdit: false,
      chooseZD: {
        dataid: '',
        name: ''
      },
      ruleForm: {
        jzcard: Number(this.patInfo.jzcard),
        jzno: this.patInfo.jzno,
        suit: '', // 主诉
        family: '', // 家族史
        present: '', // 现病史
        blood1: '', // 收缩压
        blood2: '', // 舒张压
        breath: '', // 呼吸
        heat: '', // 体温
        height: '', // 身高
        weight: '', // 体重
        tumble: '', // 跌倒风险筛查
        sign: '', // 体检检查-备注
        allergy: '', // 过敏史
        vas: '', // 疼痛评估
        disease: '', // 疾病史
        psy: '', // 心理评估
        surgery: '', // 手术史
        car: '', // 交通工具
        trauma: '', // 外伤史
        diagnose: [], // 诊断
        marry: '', // 婚育史
        remark: '' // 备注
      },
      rules: {
        suit: [{ required: true, message: '请输入主诉内容', trigger: 'blur' }],
        present: [{ required: true, message: '请输入现病史', trigger: 'blur' }],
        allergy: [{ required: true, message: '请输入过敏史', trigger: 'blur' }],
        diagnose: [{ required: true, message: '请选择诊断结果', trigger: 'blur' }]
      },
      transfer: '',
      showEdit: false,
      isCopy: false,
      loading: false,
      loadingBL: false,
      loadingEdit: false,
      loadingDiaEdit: false,
      ruleFormAdd: {
        tempname: ''
      },
      rulesAdd: {
        tempname: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
      },
      temp: [],
      diagnoseList: [],
      showjzno: JSON.parse(localStorage.getItem('userInfo')).showjzno
    }
  },
  components: {
    HistoryBl
  },
  methods: {
    // 添加新模板
    addTemplate () {
      this.showEdit = true
    },
    // 取消
    cancel () {
      this.showEdit = false
      this.$refs['ruleFormAdd'].resetFields()
    },
    changeJZCard (e) {
      let input = e.target.value
      const regex = /^0*[0-9]{1,15}$/
      if (!regex.test(input) || input.length > 15) {
        this.ruleForm.jzcard = input.slice(0, -1) // 移除最后一个字符
      }
    },
    // 保存模板
    saveEdit () {
      let param = deepClone(this.ruleForm)
      param.diagnose = JSON.stringify(param.diagnose)

      delete param.name
      delete param.blood1
      delete param.blood2
      delete param.breath
      delete param.heat
      delete param.height
      delete param.weight
      delete param.tumble
      delete param.sign

      this.loadingEdit = true

      treated
        .saveBLTem({
          tempname: this.ruleFormAdd.tempname,
          jsondata: JSON.stringify(param)
        })
        .then(res => {
          this.showEdit = false
          this.$Message.success('保存成功')
          this.loadingEdit = false
        })
        .catch(() => {
          this.loadingEdit = false
        })
    },
    saveDiaEdit () {
      let param = deepClone(this.chooseZD)

      this.loadingDiaEdit = true

      templateSettings
        .resultSave(param)
        .then(res => {
          if (res.msg === '新增成功' || res.msg === '更新成功') {
            this.showDiaEdit = false
            this.$Message.success(res.msg)
            this.getDiagnoseList()
          } else {
            this.$Message.error(res.msg)
          }

          this.loadingDiaEdit = false
        })
        .catch(() => {
          this.loadingDiaEdit = false
        })
    },
    saveBL () {
      let param = deepClone(this.ruleForm)
      param.diagnose = param.diagnose.length ? param.diagnose.join(',') : ''
      param.jzcard = param.jzcard + ''
      param.blood = param.blood1 + '/' + param.blood2
      delete param.name
      delete param.blood1
      delete param.blood2

      this.loadingBL = true

      treated
        .saveBL({
          patid: this.patid,
          appointid: this.appointid,
          jsondata: JSON.stringify(param)
        })
        .then(res => {
          // let data = res.data
          this.$Message.success('保存成功')
          this.loadingBL = false
        })
        .catch(() => {
          this.loadingBL = false
        })
    },
    getDiagnoseList () {
      common
        .getSelect({
          type: 'diagnose'
        })
        .then(res => {
          let data = res.data
          this.diagnoseList = data.diagnose
        })
    },
    openEdit () {
      this.chooseZD = {
        dataid: '',
        name: ''
      }
      this.showDiaEdit = true
    },
    changeRuleForm () {
      this.isCopy = true
      console.log(localStorage.patientTxbl)
      this.ruleForm = localStorage.patientTxbl
        ? JSON.parse(localStorage.patientTxbl)
        : {
          title: ''
        }
    },
    changeRuleFormTem (i) {
      this.temp[i].diagnose =
        typeof this.temp[i].diagnose === 'string'
          ? JSON.parse(this.temp[i].diagnose)
          : this.temp[i].diagnose
      this.temp[i].jzcard = Number(this.ruleForm.jzcard)
      this.temp[i].jzno = this.ruleForm.jzno
      this.ruleForm = this.temp[i]
    }
  },
  mounted () {
    this.getDiagnoseList()
    if (!this.isCopy) {
      this.loading = true
      treated
        .writeBLInit({
          appointid: this.appointid
        })
        .then(res => {
          let obj = localStorage.patientTxbl ? JSON.parse(localStorage.patientTxbl) : {}
          let data = res.data
          this.ruleForm = {
            jzcard: Number(this.patInfo.jzcard), // 就诊卡号
            jzno: this.patInfo.jzno, // 编号
            suit: data.case.suit || obj.suit || '', // 主诉
            family: data.case.family || obj.family || '', // 家族史
            present: data.case.present || obj.present || '', // 现病史
            blood1: data.case.blood
              ? data.case.blood.split('/')[0]
              : obj.blood
                ? obj.blood.split('/')[0]
                : '', // 收缩压
            blood2: data.case.blood
              ? data.case.blood.split('/')[1]
              : obj.blood
                ? obj.blood.split('/')[1]
                : '', // 舒张压
            breath: data.case.breath || obj.breath || '', // 呼吸
            heat: data.case.heat || obj.heat || '', // 体温
            height: data.case.height || obj.height || '', // 身高
            weight: data.case.weight || obj.weight || '', // 体重
            tumble: data.case.tumble || obj.tumble || '', // 跌倒风险筛查
            sign: data.case.sign || obj.sign || '', // 体检检查-备注
            allergy: data.case.allergy || obj.allergy || '', // 过敏史
            vas: data.case.vas || obj.vas || '', // 疼痛评估
            disease: data.case.disease || obj.disease || '', // 疾病史
            psy: data.case.psy || obj.psy || '', // 心理评估
            surgery: data.case.surgery || obj.surgery || '', // 手术史
            car: data.case.car || obj.car || '', // 交通工具
            trauma: data.case.trauma || obj.trauma || '', // 外伤史
            diagnose:
              data.case.diagnose !== '' ? data.case.diagnose.split(',') : obj.diagnose || [], // 诊断
            marry: data.case.marry || obj.marry || '', // 婚育史
            remark: data.case.remark || obj.remark || '' // 备注
          }
          this.typename = data.typename
          this.temp = data.temp
          this.loading = false
        })
    } else {
      this.changeRuleForm()
      this.isCopy = false
    }
  },
  watch: {
    ruleForm: {
      handler (val) {
        localStorage.patientTxbl = JSON.stringify(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.label {
  width: 100px;
  text-align: right;
  padding-right: 12px;
  font-size: 14px;
}
@media screen and (max-width: 1100px) {
  .flexRight {
    width: 60% !important;
  }
}
.case {
  .case_history {
    text-align: right;
    span {
      font-size: 14px;
      color: #3171ff;
      line-height: 20px;
      cursor: pointer;
    }
  }
  .case_inspect {
    padding: 8px;
    box-sizing: border-box;
    .max_width {
      width: 90px;
      text-align: right;
    }
    .case_breath {
      /deep/ .ivu-input {
        padding-right: 50px;
        box-sizing: border-box;
      }
    }
    .case_heat {
      /deep/ .ivu-input {
        padding-right: 30px;
        box-sizing: border-box;
      }
    }
  }
  .case_btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 24px;
    .case_transfer_template {
      margin: 0 20px;
      width: 126px;
    }
    .case_print {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px;
      box-sizing: border-box;
      border-radius: 3px;
      border: 1px solid #d2d7e1;
      margin-left: 16px;
      width: 70px;
      cursor: pointer;
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>
