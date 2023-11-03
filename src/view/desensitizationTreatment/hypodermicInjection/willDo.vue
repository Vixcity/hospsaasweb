<template>
  <div class="willDo">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">剩余针数</div>
          <div>
            <Select v-model="synum" style="width: 160px">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
              <Option value="0">0</Option>
            </Select>
          </div>
        </div>
        <!-- <div class="filterItem">
          <div class="label">时间</div>
          <div>
            <DatePicker
              :editable="false"
              type="daterange"
              v-model="chooseDate"
              :transfer="true"
              :options="dateList"
              placement="bottom-end"
              placeholder="请选择就诊时间"
            ></DatePicker>
          </div>
        </div> -->
        <div class="filterItem">
          <div class="label">预约日期</div>
          <div>
            <DatePicker
              :editable="false"
              v-model="yydate"
              :transfer="true"
              placeholder="请选择预约日期"
            ></DatePicker>
          </div>
        </div>
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" search placeholder="患者姓名/项目名称" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <!-- <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <Button type="primary">新增患者</Button>
          <Button type="primary" @click="getYYXQ">预约详情</Button>
          <Button type="primary">导 入</Button>
          <Button type="primary">导 出</Button>
        </div>
      </div>
    </div> -->
    <Table
      v-loading="loading"
      :row-class-name="rowClassName"
      :columns="columns"
      :data="tableData"
      style="margin-top: 16px"
    >
      <template #isdrop="{ row }">
        <span>{{ row.isdrop === 'Y' ? '是' : '否' }}</span>
      </template>
      <template #synum="{ row }">
        <span v-if="row.synum < 3" class="red">{{ row.synum }}</span>
        <span v-else>{{ row.synum }}</span>
      </template>
      <template #action="{ row }">
        <span v-if="row.synum == 0 || row.istoday === 'Y'" class="gray" style="cursor: not-allowed">
          执行
        </span>
        <span v-else class="btn" @click="doZS(row)">执行</span>
        <span class="btn blue" @click="getDetail(row)">详情</span>
        <span class="btn blue" @click="editZS(row)">增减针数</span>
        <span v-if="row.nextdays < -15" class="btn blue" @click="tuoluo(row)">脱落</span>
        <!-- <span v-if="row.synum > 0" class="btn blue" @click="tuizhen(row)">退针</span> -->
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
      title="执行注射"
      :visible.sync="showZS"
      width="768px"
      :close-on-click-modal="false"
      :before-close="handleZSClose"
      class="vertical-center-modal"
    >
      <!-- 个人信息 -->
      <div class="flex info">
        <div>姓名：{{ chooseZSJL.realname }}</div>
        <div>性别：{{ chooseZSJL.gender }}</div>
        <div>年龄：{{ chooseZSJL.age }}</div>
        <div>肾上腺素推荐量：{{ chooseZSJL.ssxsdose }}</div>
        <div>
          哮喘病史：
          <span :class="chooseZSJL.isxc === 'Y' ? 'red' : ''">
            {{ chooseZSJL.isxc === 'Y' ? '是' : '否' }}
          </span>
        </div>
        <div>脱敏药物：{{ chooseZSJL.medicine }}</div>
        <div>脱敏方案：{{ chooseZSJL.chineseScheme }}</div>
        <div>剩余针数：{{ chooseZSJL.synum }}</div>
        <div>PEF预计值：{{ chooseZSJL.pefyj }}</div>
        <!-- <div>PEF最佳值：{{ chooseZSJL.pefzj }}</div> -->
        <div>上次注射部位：{{ chooseZSJL.prevsite || '-' }}</div>
      </div>
      <div class="line"></div>
      <!-- 身高体重 -->
      <div class="flex" style="margin-bottom: 30px">
        <div class="flex">
          <div class="flex jcsb aic">
            <div :class="chooseZSJL.ishalf === 'Y' ? 'red' : 'itemLabel'" style="margin-right: 8px">
              身高
            </div>
            <div class="itemContent" style="width: 103px">
              <Input type="number" v-model="chooseZSJL.height" placeholder="请填写">
                <span slot="append">cm</span>
              </Input>
            </div>
          </div>
        </div>
        <div class="flex jcsb aic" style="margin-left: 24px">
          <div :class="chooseZSJL.ishalf === 'Y' ? 'red' : 'itemLabel'" style="margin-right: 8px">
            体重
          </div>
          <div class="itemContent" style="width: 103px">
            <Input type="number" v-model="chooseZSJL.weight" placeholder="请填写">
              <span slot="append">kg</span>
            </Input>
          </div>
        </div>
      </div>
      <!-- 集群 -->
      <div class="dialogTitle" v-if="chooseZSJL.jqno == 1">上次注射迟发反应记录</div>
      <div class="flexFrom" v-if="chooseZSJL.jqno == 1" style="margin-top: 16px">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 206px)">迟发反应风团大小</div>
            <div class="itemContent">
              <div
                @click="showFT = true"
                style="
                  display: block;
                  height: 30px;
                  line-height: 30px;
                  font-size: 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  padding-left: 8px;
                  padding-right: 24px;
                  background-color: #fff;
                  border-radius: 4px;
                  border: 1px solid #dcdee2;
                  position: relative;
                  cursor: pointer;
                "
                :class="chooseZSJL.cfftsize ? 'black' : 'disabled'"
              >
                {{ chooseZSJL.cfftsize || '请选择' }}
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
              </div>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 206px)">迟发反应记录</div>
            <div class="itemContent">
              <div
                @click="showCFRec = true"
                style="
                  display: block;
                  height: 30px;
                  line-height: 30px;
                  font-size: 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  padding-left: 8px;
                  padding-right: 24px;
                  background-color: #fff;
                  border-radius: 4px;
                  border: 1px solid #dcdee2;
                  position: relative;
                  cursor: pointer;
                "
                :class="chooseZSJL.cfrecord ? 'black' : 'disabled'"
              >
                {{ chooseZSJL.cfrecord || '请选择' }}
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
              </div>
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 206px)">迟发反应记录时间</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                type="date"
                v-model="chooseZSJL.cftime"
                format="yyyy-MM-dd"
                @on-change="chooseZSJL.cftime = $event"
                placeholder="请选择迟发反应记录时间"
                style="width: 100%"
              ></DatePicker>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 206px)">迟发反应记录处理</div>
            <div class="itemContent">
              <div
                @click="showHandle = true"
                style="
                  display: block;
                  height: 30px;
                  line-height: 30px;
                  font-size: 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  padding-left: 8px;
                  padding-right: 24px;
                  background-color: #fff;
                  border-radius: 4px;
                  border: 1px solid #dcdee2;
                  position: relative;
                  cursor: pointer;
                "
                :class="chooseZSJL.cfhandle ? 'black' : 'disabled'"
              >
                {{ chooseZSJL.cfhandle || '请选择' }}
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 基础填写弹窗 -->
      <div class="dialogTitle" style="margin-top: 30px">注射信息</div>
      <div class="flexFrom injection_list" style="margin: 16px 0">
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">注射日期</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                type="date"
                v-model="chooseZSJL.zsdate"
                format="yyyy-MM-dd"
                @on-change="chooseZSJL.zsdate = $event"
                placeholder="请选择注射日期"
                style="width: 100%"
              ></DatePicker>
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">注射序号</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.zshao" placeholder="请输入注射序号" type="number" />
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">状态</div>
            <div class="itemContent" style="min-width: 147px; max-width: 147px">
              <div
                @click="showZT = true"
                style="
                  display: block;
                  height: 30px;
                  line-height: 30px;
                  font-size: 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  padding-left: 8px;
                  padding-right: 24px;
                  background-color: #fff;
                  border-radius: 4px;
                  border: 1px solid #dcdee2;
                  position: relative;
                  cursor: pointer;
                "
                :class="chooseZSJL.zsstate ? 'black' : 'disabled'"
              >
                {{ chooseZSJL.zsstate || '请选择' }}
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div
              class="itemLabel"
              :style="{ width: `calc(100% - ${chooseZSJL.isdevice === 'Y' ? 56 : 116}px)` }"
            >
              PEF(前)
            </div>
            <div class="itemContent">
              <Input
                v-model="chooseZSJL.pefq"
                placeholder="输入PEF(前)"
                type="number"
                style="width: 100%"
              />
            </div>
            <div
              v-if="chooseZSJL.isdevice === 'Y'"
              style="width: calc(100% - 180px)"
              v-loading="loadingTest"
            >
              <div class="injection_edit" @click="willPolling">检测</div>
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">PEF(前)%</div>
            <div class="itemContent">
              <input
                :value="$percentage(chooseZSJL.pefq || 0, chooseZSJL.pefyj).val"
                :style="`width: 100%; height: 100%; padding-left: 7px;border-radius: 4px; border: 1px solid #dcdee2; color: ${
                  $percentage(chooseZSJL.pefq || 0, chooseZSJL.pefyj).color
                }`"
                disabled
              />
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">分针</div>
            <div class="itemContent">
              <Select v-model="chooseZSJL.fenzhen" style="width: 100%">
                <Option value="Y">是</Option>
                <Option value="N">否</Option>
              </Select>
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">注射瓶号</div>
            <div class="itemContent">
              <Select
                v-model="chooseZSJL.zsnum"
                @on-change="changezsnum"
                placeholder="请选择注射瓶号"
                style="width: 100%"
              >
                <Option
                  v-for="(item, index) in chooseZSJL.option"
                  :key="index + 'chooseZSJL.option'"
                  :value="item.num"
                  :label="item.num"
                ></Option>
              </Select>
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div v-if="isEdit" class="itemLabel" style="width: calc(100% - 56px)">
              {{ isEdit ? '' : '原' }}注射剂量(ml)
            </div>
            <div v-else class="itemLabel" style="width: calc(100% - 105px)">
              {{ isEdit ? '' : '原' }}注射剂量(ml)
            </div>
            <div class="itemContent">
              <Select
                v-model="chooseZSJL.zsdose"
                ref="zsdose"
                :clearable="true"
                not-found-text="请先选择注射瓶号"
                placeholder="请选择注射剂量"
                style="width: 100%"
              >
                <Option
                  v-for="(item, index) in doseList"
                  :key="index + 'doseList'"
                  :value="item"
                  :label="item"
                ></Option>
              </Select>
            </div>
            <div
              class="injection_edit"
              style="width: calc(100% - 180px)"
              v-if="isEdit"
              @click="isShowInjection = true"
            >
              修改
            </div>
          </div>
        </div>
        <div class="fromItem" v-if="!isEdit">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">实际注射剂量(ml)</div>
            <div class="itemContent">
              <Input v-model="realdose" placeholder="请输入实际注射剂量" type="text" />
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">注射部位</div>
            <div class="itemContent">
              <Select v-model="chooseZSJL.zssite" style="width: 100%">
                <Option value="左">左</Option>
                <Option value="右">右</Option>
              </Select>
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">注射时间</div>
            <div class="itemContent">
              <TimePicker
                :editable="false"
                format="HH:mm"
                v-model="chooseZSJL.zstime"
                placeholder="请选择注射时间"
                style="width: 100%"
              ></TimePicker>
            </div>
          </div>
        </div>
        <div class="fromItem" v-if="this.chooseZSJL.scheme === 'jqfa'">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">注射总数</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.jqnum" placeholder="请输入注射总数" type="number" />
            </div>
          </div>
        </div>
        <div class="fromItem" v-if="this.chooseZSJL.scheme === 'jqfa'">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">当前针数</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.jqno" placeholder="请输入当前针数" type="number" />
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">下次注射日期</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                type="date"
                v-model="chooseZSJL.nextdate"
                format="yyyy-MM-dd"
                @on-change="chooseZSJL.nextdate = $event"
                placeholder="请选择"
                style="width: 100%"
              ></DatePicker>
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">下次注射时间</div>
            <div class="itemContent">
              <Select v-model="chooseZSJL.nexttime" style="width: 100%">
                <Option value="上午">上午</Option>
                <Option value="下午">下午</Option>
              </Select>
            </div>
          </div>
        </div>
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 105px)">备注</div>
            <div class="itemContent">
              <Input
                v-model="chooseZSJL.remark"
                placeholder="请填写备注"
                type="textarea"
                :rows="4"
              />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" style="padding-top: 20px">
        <span v-if="chooseZSJL.deviceno" class="blue" style="margin-right: 8px">
          设备号：{{ chooseZSJL.deviceno }}
        </span>
        <Button
          type="primary"
          v-if="chooseZSJL.isdevice === 'Y'"
          @click="openBind"
          style="margin-right: 8px"
        >
          绑定设备
        </Button>
        <Button type="primary" @click="finishZS" :loading="loadingZS">注射完成</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="退针"
      :visible.sync="showTZ"
      width="300px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form ref="ruleForm" :model="ruleForm" :label-width="60">
        <FormItem label="剩余针数" prop="title">
          <Input
            v-model="ruleFormTZ.synum"
            style="width: 100%"
            disabled
            placeholder="请输入退针数量"
          ></Input>
        </FormItem>
        <FormItem label="退针数量" prop="title">
          <InputNumber
            :min="1"
            :max="ruleFormTZ.synum"
            v-model="ruleFormTZ.tznum"
            style="width: 100%"
            placeholder="请输入退针数量"
          ></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveTZ">确 定</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="脱落原因"
      :visible.sync="showAdd"
      width="600px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form ref="ruleForm" :model="ruleForm" :label-width="100">
        <FormItem label="脱落原因" prop="title">
          <Input
            v-model="ruleForm.dropmark"
            type="textarea"
            :rows="4"
            placeholder="请输入脱落原因"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveEdit" :loading="loadingTL">确 定</Button>
      </div>
    </el-dialog>
    <!-- 迟发反应风团大小 -->
    <ftSizeModal
      type="cf"
      :show="showFT"
      :size="chooseZSJL.cfftsize"
      @close="closeFT"
      @save="saveFT"
    />
    <!-- 迟发反应记录 -->
    <ftReactionRecord
      type="cf"
      :show="showCFRec"
      :info="chooseZSJL.cfrecord"
      @close="closeCFRec"
      @save="saveCFRec"
    />
    <el-dialog
      title="选择状态"
      :visible.sync="showZT"
      width="520px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="gray" style="margin-bottom: 8px">注射前7天患者状态</div>
      <div class="flex">
        <Radio v-model="chooseZT.isGood" @on-change="chooseGood" style="margin-right: 40px">
          好
        </Radio>
        <CheckboxGroup @on-change="changeZT" v-model="chooseZT.zt" style="margin-bottom: 22px">
          <Checkbox label="咳嗽" style="margin-right: 40px"></Checkbox>
          <Checkbox label="发热" style="margin-right: 40px"></Checkbox>
        </CheckboxGroup>
      </div>
      <CheckboxGroup @on-change="changeZT" v-model="chooseZT.zt">
        <div v-for="(item, index) in ztList" :key="index + 'resList'" style="margin-bottom: 22px">
          <div class="gray" style="margin-bottom: 8px">{{ item.title }}</div>
          <Checkbox
            v-for="(itemSon, indexSon) in item.list"
            :key="indexSon + 'item.list'"
            :label="itemSon"
            style="margin-right: 40px"
          ></Checkbox>
        </div>
      </CheckboxGroup>
      <div class="gray" style="margin-bottom: 8px">其他</div>
      <Input type="textarea" v-model="chooseZT.text" @input="changeZTInput"></Input>
      <div slot="footer">
        <Button type="primary" @click="closeZT">确 定</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="迟发反应处理方式"
      :visible.sync="showHandle"
      width="630px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <CheckboxGroup v-model="chooseHandle.fyclfs" style="margin-bottom: 22px">
        <div class="gray" style="margin-bottom: 8px">反应处理方式</div>
        <Checkbox style="margin-right: 40px" label="抗组胺药"></Checkbox>
        <Checkbox style="margin-right: 40px" label="外涂抗组胺药物"></Checkbox>
        <Checkbox style="margin-right: 40px" label="外涂激素药物"></Checkbox>
        <Checkbox style="margin-right: 40px" label="局部冰敷处理"></Checkbox>
        <Checkbox style="margin-right: 40px" label="β受体激动剂（雾化）"></Checkbox>
      </CheckboxGroup>
      <CheckboxGroup v-model="chooseHandle.zdy" style="margin-bottom: 22px">
        <div class="gray" style="margin-bottom: 8px">自定义</div>
        <Checkbox style="margin-right: 40px" label="外涂"></Checkbox>
        <Checkbox style="margin-right: 40px" label="口服：留观1小时"></Checkbox>
        <Checkbox style="margin-right: 40px" label="万托林"></Checkbox>
        <Checkbox style="margin-right: 40px" label="氯雷他定"></Checkbox>
        <Checkbox style="margin-right: 40px" label="舒利迭"></Checkbox>
      </CheckboxGroup>
      <div class="gray" style="margin-bottom: 8px">其他</div>
      <Input type="textarea" v-model="chooseHandle.text"></Input>
      <div slot="footer">
        <Button type="primary" @click="closeHandle">确 定</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="注射记录"
      :visible.sync="injectionRecord"
      width="920px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div>
        <div class="fz16">
          上次备注：
          <span :class="remark ? 'red' : 'gray'">{{ remark || '暂无内容' }}</span>
        </div>
        <Table :columns="injectionColumns" style="margin-top: 8px" :data="injectionTabledata">
          <template #pefq="{ row }">
            <span>{{ row.pefq }}</span>
            <span
              v-if="pefyj && pefyj != '-'"
              :style="`color: ${$percentage(row.pefq, pefyj).color}`"
            >
              ({{ $percentage(row.pefq, pefyj).val }})
            </span>
          </template>
          <template #fenzhen="{ row }">
            <span>{{ row.fenzhen === 'Y' ? '是' : '否' }}</span>
          </template>
          <template #realdose="{ row }">
            <span :style="row.zsdose == row.realdose ? '' : 'color: red;'">{{ row.realdose }}</span>
          </template>
          <template #pefh="{ row }">
            <span>{{ row.pefh }}</span>
            <span
              v-if="pefyj && pefyj != '-'"
              :style="`color: ${$percentage(row.pefh, pefyj).color}`"
            >
              ({{ $percentage(row.pefh, pefyj).val }})
            </span>
          </template>
          <template #remark="{ row }">
            <span>{{ row.remark || '-' }}</span>
          </template>
        </Table>
      </div>
      <div slot="footer">
        <Button type="primary" @click="startInjection">开始注射</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改剂量"
      :visible.sync="isShowInjection"
      width="320px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div>
        <div class="flex jcsb aic">
          <div class="itemLabel" style="width: calc(100% - 155px)">实际注射剂量(ml)</div>
          <div class="itemContent">
            <Input v-model="realdose" placeholder="请输入实际注射剂量" type="text" />
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submitInjection">保存</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="增减针数"
      :visible.sync="showEditZS"
      width="440px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Form ref="ruleForm" :model="ruleFormZS" :label-width="80">
        <FormItem label="增加/减少" prop="type">
          <RadioGroup v-model="ruleFormZS.type">
            <Radio label="add">增加</Radio>
            <Radio label="dec">减少</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="增减针数" prop="title">
          <InputNumber
            v-model="ruleFormZS.num"
            style="width: 100%"
            :min="0"
            placeholder="请输入要修改的针数"
          ></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveZS" :loading="loadingZJZS">确 定</Button>
      </div>
    </el-dialog>
    <el-dialog
      title="绑定设备"
      :visible.sync="isShowBind"
      width="320px"
      :close-on-click-modal="false"
      :before-close="closeBind"
      class="vertical-center-modal"
    >
      <div>
        <div class="flex jcsb aic">
          <div class="itemLabel" style="width: calc(100% - 220px)">设备号</div>
          <div class="itemContent">
            <Select style="width: 220px" clearable v-model="deviceno" placeholder="请选择设备号">
              <Option
                v-for="(item, index) in devicenoList"
                :key="index + 'devicenoList'"
                :label="item"
                :value="item"
              ></Option>
            </Select>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveBind">保存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pxzs } from '@/api/desensitizationTreatment/index'
import ftSizeModal from '../../../components/ftSizeModal/ftSizeModal.vue'
import ftReactionRecord from '../../../components/ftReactionRecord/ftReactionRecord.vue'
export default {
  name: 'willDo',
  components: { ftSizeModal, ftReactionRecord },
  data () {
    var showjzno = JSON.parse(localStorage.getItem('userInfo')).showjzno
    var columns =
      showjzno === 'Y'
        ? [
          {
            key: 'jzcard',
            title: '就诊卡号',
            minWidth: 120
          },
          {
            key: 'jzno',
            title: '编号',
            minWidth: 120
          },
          {
            key: 'realname',
            title: '姓名',
            minWidth: 80
          },
          {
            key: 'gender',
            title: '性别',
            minWidth: 60
          },
          {
            key: 'age',
            title: '年龄',
            minWidth: 60
          },
          {
            key: 'nextdays',
            title: '距离预约日期(天)',
            width: 90
          },
          {
            key: 'zsnum',
            title: '注射瓶号',
            minWidth: 86
          },
          {
            key: 'zsdose',
            title: '注射剂量(ml)',
            minWidth: 110
          },
          {
            key: 'medicine',
            title: '脱敏药品',
            minWidth: 86
          },
          {
            key: 'scheme',
            title: '脱敏方案',
            minWidth: 86
          },
          {
            key: 'stages',
            title: '所处阶段',
            minWidth: 86
          },
          {
            slot: 'synum',
            title: '剩余针数',
            minWidth: 86
          },
          {
            key: 'prevdate',
            title: '上次注射时间',
            width: 120
          },
          {
            key: 'nextdate',
            title: '预约日期',
            width: 110
          },
          {
            slot: 'action',
            title: '操作',
            minWidth: 220,
            fixed: 'right',
            className: 'defaultInfo'
          }
        ]
        : [
          {
            key: 'jzcard',
            title: '就诊卡号',
            minWidth: 120
          },
          {
            key: 'realname',
            title: '姓名',
            minWidth: 80
          },
          {
            key: 'gender',
            title: '性别',
            minWidth: 60
          },
          {
            key: 'age',
            title: '年龄',
            minWidth: 60
          },
          {
            key: 'nextdays',
            title: '距离预约日期(天)',
            width: 90
          },
          {
            key: 'zsnum',
            title: '注射瓶号',
            minWidth: 86
          },
          {
            key: 'zsdose',
            title: '注射剂量(ml)',
            minWidth: 110
          },
          {
            key: 'medicine',
            title: '脱敏药品',
            minWidth: 86
          },
          {
            key: 'scheme',
            title: '脱敏方案',
            minWidth: 86
          },
          {
            key: 'stages',
            title: '所处阶段',
            minWidth: 86
          },
          {
            slot: 'synum',
            title: '剩余针数',
            minWidth: 86
          },
          {
            key: 'prevdate',
            title: '上次注射时间',
            width: 120
          },
          {
            key: 'nextdate',
            title: '预约日期',
            width: 110
          },
          {
            slot: 'action',
            title: '操作',
            minWidth: 220,
            fixed: 'right',
            className: 'defaultInfo'
          }
        ]
    return {
      pageNum: 0,
      currentPageIdx: 1,
      pageSize: 10,
      synum: '',
      doseList: [],
      devicenoList: [],
      deviceno: '',
      keyword: '',
      showEditZS: false,
      showTZ: false,
      showFT: false,
      showZT: false,
      showCFRec: false,
      showHandle: false,
      showZS: false,
      loading: false,
      showAdd: false,
      loadingZS: false,
      loadingZJZS: false,
      loadingTL: false,
      loadingTest: false,
      isShowBind: false,
      ruleFormZS: {
        type: 'add',
        num: 0
      },
      ruleForm: {},
      ruleFormTZ: {},
      oldWeight: '',
      oldHeight: '',
      chooseHandle: {},
      chooseZT: {
        isGood: true
      },
      ztList: [
        {
          title: '鼻部',
          list: ['鼻塞', '鼻痒', '鼻涕', '喷嚏']
        },
        {
          title: '呼吸道',
          list: ['咽痒', '多痰']
        },
        {
          title: '眼部',
          list: ['眼痒', '眼红']
        }
      ],
      columns,
      tableData: [],
      today: this.$moment().startOf('day').format('YYYY-MM-DD'),
      dateList: {
        shortcuts: [
          {
            text: '今天',
            value: () => {
              const start = this.$moment().startOf('day')._d
              return [start, start]
            }
          },
          {
            text: '本周',
            value: () => {
              const start = this.$moment().startOf('week').add(1, 'day')._d
              const end = this.$moment().endOf('week').add(1, 'day')._d
              return [start, end]
            }
          },
          {
            text: '本月',
            value: () => {
              const start = this.$moment().startOf('month')._d
              const end = this.$moment().endOf('month')._d
              return [start, end]
            }
          },
          {
            text: '今年',
            value () {
              const start = new Date().getFullYear() + '01-01'
              const end = new Date().getFullYear() + '12-31'
              return [start, end]
            }
          }
        ]
      },
      chooseDate: [
        this.$moment().startOf('day').format('YYYY-MM-DD'),
        this.$moment().startOf('day').format('YYYY-MM-DD')
      ],
      yydate: '',
      chooseZSJL: {},
      injectionRecord: false,
      injectionColumns: [
        {
          title: '周次',
          key: 'zsweek',
          width: 80
        },
        {
          title: '日期',
          key: 'zsdate',
          width: 130
        },
        {
          title: '注射序号',
          key: 'zshao',
          width: 100
        },
        {
          title: '状态',
          key: 'zsstate',
          width: 80
        },
        {
          title: 'PEF（前）',
          key: 'pefq',
          slot: 'pefq',
          width: 120
        },
        {
          title: '分针',
          slot: 'fenzhen',
          width: 70
        },
        {
          title: '瓶号',
          key: 'zsnum',
          width: 70
        },
        {
          title: '容量（ml）',
          key: 'zsdose',
          width: 110
        },
        {
          title: '实际注射（ml）',
          slot: 'realdose',
          width: 140
        },
        {
          title: '注射部位',
          key: 'zssite',
          width: 100
        },
        {
          title: '注射时间',
          key: 'zstime',
          width: 100
        },
        {
          title: 'PEF（后）',
          key: 'pefh',
          slot: 'pefh',
          width: 120
        },
        {
          title: '即刻反应风团大小（mm）',
          key: 'jkftsize',
          width: 200
        },
        {
          title: '即刻反应记录',
          key: 'jkrecord',
          width: 120
        },
        {
          title: '即刻反应记录处理',
          key: 'jkhandle',
          width: 150
        },
        {
          title: '迟发局部风团大小（mm）',
          key: 'cfftsize',
          width: 200
        },
        {
          title: '迟发反应记录',
          key: 'cfrecord',
          width: 120
        },
        {
          title: '迟发反应记录处理',
          key: 'cfhandle',
          width: 150
        },
        {
          title: '备注',
          slot: 'remark',
          width: 200
        }
      ],
      injectionTabledata: [],
      pefyj: '',
      tuominid: '',
      remark: '',
      isShowInjection: false,
      realdose: '',
      pollingInterval: null,
      pollCount: 0,
      isEdit: true
    }
  },
  methods: {
    openBind () {
      this.isShowBind = true

      pxzs
        .initBind({ projectid: this.chooseZSJL.tuominid })
        .then(res => {
          this.devicenoList = res.data.device
          this.deviceno = res.data.deviceno
        })
        .catch(err => {
          console.log('初始化绑定设备出错：', err)
        })
    },
    closeBind () {
      this.deviceno = ''
      this.isShowBind = false
      this.stopPolling()
    },
    saveBind () {
      if (!this.deviceno) {
        this.$Message.error('请选择设备号')
        return
      }
      pxzs
        .saveBind({ projectid: this.chooseZSJL.tuominid, deviceno: this.deviceno })
        .then(res => {
          this.isShowBind = false
          this.$Message.success(res.msg)
          this.chooseZSJL.deviceno = this.deviceno
        })
        .catch(err => {
          console.log('保存设备出错：', err)
        })
    },
    polling () {
      this.pollingInterval = setInterval(() => {
        if (this.pollCount < 20) {
          pxzs
            .getLungs({ projectid: this.chooseZSJL.tuominid })
            .then(res => {
              if (res.data) {
                // 有值：赋值，且停止轮询
                this.chooseZSJL.pefq = res.data
                this.$forceUpdate()
                this.stopPolling()
              }

              this.pollCount++
            })
            .catch(err => {
              console.log('获取pef数值出错，停止轮询，出错原因：\n', err)
              this.stopPolling()
            })
        } else {
          this.stopPolling()
        }
      }, 5000)
    },
    stopPolling () {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
      }
      this.loadingTest = false
      this.pollCount = 0
    },
    willPolling () {
      this.loadingTest = true
      pxzs
        .renewTime({ projectid: this.chooseZSJL.tuominid })
        .then(res => {
          // console.log(res.data.data)
          this.polling()
        })
        .catch(err => {
          console.log('获取PEF接口前初始化：', err)
          this.loadingTest = false
        })
    },
    editZS (row) {
      this.showEditZS = true
      this.ruleFormZS.tuominid = row.tuominid
    },
    saveZS () {
      this.loadingZJZS = true
      pxzs
        .saveZS(this.ruleFormZS)
        .then(res => {
          this.$Message.success('保存成功')
          this.showEditZS = false
          this.getList()
          this.ruleFormZS = {
            num: 0,
            type: 'add'
          }
          this.loadingZJZS = false
        })
        .catch(err => {
          console.log('皮下注射-保存针数:', err)
          this.loadingZJZS = false
        })
    },
    rowClassName (row) {
      if (row.isdrop === 'Y') {
        return 'garyInfo'
      } else if (row.nextdays < -15) {
        return 'redInfo'
      } else if (row.nextdays >= -15 && row.nextdays <= 0) {
        return 'orangeInfo'
      } else {
        return ''
      }
    },
    chooseGood (e) {
      if (e) {
        this.chooseZT.zt = []
        this.chooseZT.text = ''
      }
    },
    changeZT (e) {
      if (e.length > 0) {
        this.chooseZT.isGood = false
      }
    },
    closeFT (e) {
      this.showFT = false
    },
    saveFT (e) {
      this.chooseZSJL.cfftsize = e
      this.closeFT()
    },
    closeCFRec () {
      this.showCFRec = false
    },
    saveCFRec (e) {
      this.chooseZSJL.cfrecord = e
      this.closeCFRec()
    },
    closeZT () {
      let str = ''

      if (this.chooseZT.isGood) {
        str = '好'
      }

      str =
        str && (this.chooseZT.zt ? this.chooseZT.zt.toString() : '')
          ? str + ',' + (this.chooseZT.zt ? this.chooseZT.zt.toString() : '')
          : str + (this.chooseZT.zt ? this.chooseZT.zt.toString() : '')

      str =
        str && this.chooseZT.text
          ? str + ',' + (this.chooseZT.text || '')
          : str + (this.chooseZT.text || '')

      this.chooseZSJL.zsstate = str
      this.showZT = false
    },
    closeHandle () {
      let str = ''

      str += this.chooseHandle.fyclfs ? this.chooseHandle.fyclfs.toString() : ''
      str =
        str && (this.chooseHandle.zdy ? this.chooseHandle.zdy.toString() : '')
          ? str + ',' + (this.chooseHandle.zdy ? this.chooseHandle.zdy.toString() : '')
          : str + (this.chooseHandle.zdy ? this.chooseHandle.zdy.toString() : '')

      str =
        str && this.chooseHandle.text
          ? str + ',' + (this.chooseHandle.text || '')
          : str + (this.chooseHandle.text || '')

      this.chooseZSJL.cfhandle = str
      this.showHandle = false
    },
    tuoluo (row) {
      this.ruleForm = row
      this.showAdd = true
    },
    tuizhen (row) {
      this.ruleFormTZ = row
      this.ruleFormTZ.tznum = 1
      this.showTZ = true
    },
    changeZTInput (e) {
      if (!e) return
      this.chooseZT.isGood = false
    },
    saveTZ () {
      if (!this.ruleFormTZ.tznum) {
        this.$Message.error('请填写退针数量')
        return
      }

      pxzs
        .tzSave({
          tuominid: this.ruleFormTZ.tuominid,
          tznum: this.ruleFormTZ.tznum
        })
        .then(res => {
          this.$Message.success('退针成功')
          this.getList()
          this.showTZ = false
        })
        .catch(err => {
          console.log('皮下注射-退针:', err)
        })
    },
    saveEdit () {
      if (!this.ruleForm.dropmark) {
        this.$Message.error('请填写脱落原因')
        return
      }

      this.loadingTL = true

      pxzs
        .saveDrop({
          tuominid: this.ruleForm.tuominid,
          isdrop: 'Y',
          dropmark: this.ruleForm.dropmark
        })
        .then(res => {
          this.$Message.success('保存成功')
          this.$emit('changeTab', 'tl')
          this.loadingTL = false
        })
        .catch(err => {
          console.log('皮下注射-保存脱落:', err)
          this.loadingTL = false
        })
    },
    // 当前页数发生改变
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.getList()
    },
    // 详情
    getDetail (row) {
      this.$router.push({ path: '/detail?patid=' + row.patid })
    },
    getYYXQ () {
      this.$emit('getYYXQ')
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    reset () {
      this.synum = ''
      this.keyword = ''
      this.yydate = ''
      this.changeFilter()
    },
    getList () {
      this.loading = true
      pxzs
        .willDoList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          synum: this.synum,
          yydate: this.yydate ? this.$moment(this.yydate).format('YYYY-MM-DD') : '',
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.remark = data.remark
          this.loading = false
        })
        .catch(err => {
          console.log('皮下注射-待执行:', err)
          this.loading = false
        })
    },
    changezsnum (e) {
      let index = this.chooseZSJL.option.findIndex(item => item.num === e)
      if (this.chooseZSJL.scheme === 'jqfa') {
        this.chooseZSJL.jqnum = e.split(',').length
        this.chooseZSJL.jqno =
          e.split(',').length === this.oldzhenInfo.jqnum ? this.oldzhenInfo.jqno : 1
      }
      // console.log(index)
      this.doseList = this.chooseZSJL.option[index].dose
      this.$refs.zsdose.clearSingleSelect()
    },
    doZS (row) {
      this.isShowInjection = false
      this.realdose = ''
      this.isEdit = true
      if (row.hasrecord === 'Y') {
        this.tuominid = row.tuominid
        pxzs
          .shotRecord({
            limit: 100,
            page: 1,
            patid: row.patid,
            projectid: row.tuominid
          })
          .then(res => {
            this.injectionRecord = true
            this.injectionTabledata = res.data.lists
            this.pefyj = res.data.pefyj
          })
      } else {
        pxzs
          .willDoInit({
            tuominid: row.tuominid
          })
          .then(res => {
            let data = res.data.tdata
            let info = res.data.info
            let device = res.data.device
            let arr = localStorage.pxzsWillDo ? JSON.parse(localStorage.pxzsWillDo) : []
            let indexPEFQ = arr.findIndex(item => {
              return item.patid === info.patid
            })
            let obj = arr[indexPEFQ]
            this.chooseZSJL = {
              ...data,
              ...info,
              ...device,
              jqnum: data.nownum,
              jqno: data.nowno,
              scheme: data.scheme,
              chineseScheme: info.scheme,
              zsnum: Number(data.zsnum) ? Number(data.zsnum) : data.zsnum,
              ...obj
            }
            this.chooseZSJL.tuominid = row.tuominid
            this.chooseZSJL.zsdate = this.today
            this.chooseZSJL.zstime = data.zstime
            this.oldWeight = info.weight
            this.oldHeight = info.height
            this.oldzhenInfo = {
              jqnum: this.chooseZSJL.nownum,
              jqno: this.chooseZSJL.nowno
            }
            let index = this.chooseZSJL.option.findIndex(
              item =>
                item.num === this.chooseZSJL.zsnum || item.num === Number(this.chooseZSJL.zsnum)
            )
            this.doseList = this.chooseZSJL.option[index].dose
            this.showZS = true
          })
      }
    },
    // 开始注射
    startInjection () {
      pxzs
        .willDoInit({
          tuominid: this.tuominid
        })
        .then(res => {
          let data = res.data.tdata
          let info = res.data.info
          let device = res.data.device
          let arr = localStorage.pxzsWillDo ? JSON.parse(localStorage.pxzsWillDo) : []
          let indexPEFQ = arr.findIndex(item => {
            return item.patid === info.patid
          })
          let obj = arr[indexPEFQ]
          this.chooseZSJL = {
            ...data,
            ...info,
            ...device,
            jqnum: data.nownum,
            jqno: data.nowno,
            scheme: data.scheme,
            chineseScheme: info.scheme,
            zsnum: Number(data.zsnum) ? Number(data.zsnum) : data.zsnum,
            ...obj
          }
          // console.log(obj, this.chooseZSJL)
          this.chooseZSJL.tuominid = this.tuominid
          this.chooseZSJL.zsdate = this.today
          this.chooseZSJL.zstime = data.zstime
          this.oldWeight = info.weight
          this.oldHeight = info.height
          this.oldzhenInfo = {
            jqnum: this.chooseZSJL.nownum,
            jqno: this.chooseZSJL.nowno
          }
          let index = this.chooseZSJL.option.findIndex(
            item => item.num === this.chooseZSJL.zsnum || item.num === Number(this.chooseZSJL.zsnum)
          )
          // console.log(index)
          this.doseList = this.chooseZSJL.option[index].dose
          this.injectionRecord = false
          this.showZS = true
        })
    },
    // 每页数量发生改变
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    },
    // 修改剂量 - 保存
    submitInjection () {
      if (this.realdose === '') {
        this.$Message.error('请输入实际注射剂量')
        return
      }
      this.isShowInjection = false
      this.isEdit = false
    },
    // 关闭完成注射页面之前，先缓存本地
    handleZSClose () {
      this.showZS = false
      let arr = localStorage.pxzsWillDo ? JSON.parse(localStorage.pxzsWillDo) : []
      let index = arr.findIndex(item => {
        return this.chooseZSJL.patid === item.patid
      })

      if (index !== -1) {
        arr[index] = this.chooseZSJL
      } else {
        arr.push(this.chooseZSJL)
      }

      localStorage.pxzsWillDo = JSON.stringify(arr)
      this.stopPolling()
    },
    // 完成注射
    finishZS () {
      if (!this.chooseZSJL.zsdate) {
        this.$Message.error('请选择注射日期')
        return
      } else if (this.chooseZSJL.zshao === '' || this.chooseZSJL.zshao === undefined) {
        this.$Message.error('请选择注射序号')
        return
      } else if (this.chooseZSJL.zsnum === undefined) {
        this.$Message.error('请选择注射瓶号')
        return
      } else if (!this.chooseZSJL.zsdose) {
        this.$Message.error('请选择注射剂量')
        return
      } else if (!this.chooseZSJL.pefq) {
        this.$Message.error('请填写PEF(前)')
        return
      } else if (!this.chooseZSJL.zsstate) {
        this.$Message.error('请选择注射状态')
        return
      } else if (!this.chooseZSJL.zssite) {
        this.$Message.error('请选择注射部位')
        return
      } else if (!this.chooseZSJL.fenzhen) {
        this.$Message.error('请选择是否分针')
        return
      } else if (!this.chooseZSJL.zstime) {
        this.$Message.error('请选择注射时间')
        return
      } else if (this.chooseZSJL.jqnum === '') {
        this.$Message.error('请填写注射总数')
        return
      } else if (this.chooseZSJL.jqno === '') {
        this.$Message.error('请填写当前针数')
        return
      } else if (!this.chooseZSJL.nextdate) {
        this.$Message.error('请选择下次注射日期')
        return
      }

      let ischange = 'N'
      if (this.chooseZSJL.height !== this.oldHeight || this.chooseZSJL.weight !== this.oldWeight) {
        ischange = 'Y'
      }

      let param = {}

      let zstime = ''
      if (typeof this.chooseZSJL.zstime === 'object') {
        zstime =
          (this.chooseZSJL.zstime.getHours() >= 10
            ? this.chooseZSJL.zstime.getHours()
            : '0' + this.chooseZSJL.zstime.getHours()) +
          ':' +
          (this.chooseZSJL.zstime.getMinutes() >= 10
            ? this.chooseZSJL.zstime.getMinutes()
            : '0' + this.chooseZSJL.zstime.getMinutes())
      } else {
        zstime = this.chooseZSJL.zstime
      }

      if (!this.isEdit && this.realdose !== '') {
        param = {
          tuominid: this.chooseZSJL.tuominid,
          jsondata: JSON.stringify({
            height: this.chooseZSJL.height,
            weight: this.chooseZSJL.weight,
            ischange,
            zshao: this.chooseZSJL.zshao,
            zsdate: this.chooseZSJL.zsdate
              ? this.$moment(this.chooseZSJL.zsdate).format('YYYY-MM-DD')
              : '',
            zsnum: this.chooseZSJL.zsnum,
            zsdose: this.chooseZSJL.zsdose,
            realdose: this.realdose,
            pefq: this.chooseZSJL.pefq,
            pev: this.chooseZSJL.pev,
            zsstate: this.chooseZSJL.zsstate,
            zssite: this.chooseZSJL.zssite,
            fenzhen: this.chooseZSJL.fenzhen,
            zstime,
            jqnum: this.chooseZSJL.jqnum,
            jqno: this.chooseZSJL.jqno,
            cfftsize: this.chooseZSJL.cfftsize || '',
            cftime: this.chooseZSJL.cftime || '',
            cfrecord: this.chooseZSJL.cfrecord || '',
            cfhandle: this.chooseZSJL.cfhandle || ''
          })
        }
      } else {
        param = {
          tuominid: this.chooseZSJL.tuominid,
          jsondata: JSON.stringify({
            height: this.chooseZSJL.height,
            weight: this.chooseZSJL.weight,
            ischange,
            zshao: this.chooseZSJL.zshao,
            zsdate: this.chooseZSJL.zsdate
              ? this.$moment(this.chooseZSJL.zsdate).format('YYYY-MM-DD')
              : '',
            nextdate: this.chooseZSJL.nextdate
              ? this.$moment(this.chooseZSJL.nextdate).format('YYYY-MM-DD')
              : '',
            nexttime: this.chooseZSJL.nexttime,
            remark: this.chooseZSJL.remark,
            zsnum: this.chooseZSJL.zsnum,
            zsdose: this.chooseZSJL.zsdose,
            pefq: this.chooseZSJL.pefq,
            pev: this.chooseZSJL.pev,
            zsstate: this.chooseZSJL.zsstate,
            zssite: this.chooseZSJL.zssite,
            fenzhen: this.chooseZSJL.fenzhen,
            zstime,
            jqnum: this.chooseZSJL.jqnum,
            jqno: this.chooseZSJL.jqno,
            cfftsize: this.chooseZSJL.cfftsize || '',
            cftime: this.chooseZSJL.cftime || '',
            cfrecord: this.chooseZSJL.cfrecord || '',
            cfhandle: this.chooseZSJL.cfhandle || ''
          })
        }
      }

      this.loadingZS = true

      pxzs
        .willDoSave(param)
        .then(res => {
          this.$Message.success('执行成功')
          this.handleZSClose()
          this.$emit('changeTab', 'duringDo')
          this.loadingZS = false
          let arr = localStorage.pxzsWillDo ? JSON.parse(localStorage.pxzsWillDo) : []
          arr = arr.filter(item => item.patid !== this.chooseZSJL.patid)
          localStorage.pxzsWillDo = JSON.stringify(arr)
        })
        .catch(() => {
          this.loadingZS = false
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import './hypodermicInjection.less';
/deep/ .ivu-table .redInfo td {
  background-color: #fdddde;
}
/deep/ .ivu-table .orangeInfo td {
  background-color: #fff2d7;
}
/deep/ .ivu-table td.defaultInfo {
  background-color: #fff;
}
/deep/ .ivu-checkbox {
  margin-right: 8px !important;
}
.flexFrom {
  display: flex;
  justify-content: space-between;
  &:first-child {
    margin-top: 0;
  }
  .fromItem {
    .itemLabel {
      text-align: right;
      padding-right: 8px;
      color: #282d3c;
    }
    .itemContent {
      width: 206px;
      height: 32px;
    }
  }
  .fromItem > div {
    margin-top: 16px;
    &:first-child {
      margin-top: 0;
    }
  }
}
.line {
  border-bottom: 1px solid #d2d7e1;
  margin: 8px 0 24px;
}
.info {
  width: 100%;
  flex-wrap: wrap;
  div {
    // width: 120px;
    margin-right: 40px;
    font-size: 14px;
    line-height: 30px;
  }
}

.injection_list {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 0;
}

.injection_edit {
  text-align: right;
  font-size: 14px;
  font-weight: 400;
  color: #3171ff;
  cursor: pointer;
}
</style>
