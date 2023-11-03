<template>
  <div class="desensitize" v-loading="loading">
    <!-- <div
      style="
        font-size: 18px;
        color: #5489ff;
        cursor: pointer;
        position: absolute;
        right: 300px;
        z-index: 99;
      "
      @click="type = !type"
    >
      切换
    </div> -->
    <div v-if="!noData">
      <div class="desensitize_px">
        <div class="title">脱敏信息</div>
        <div class="flex">
          <div class="showInfo">
            <div class="label">脱敏方案：</div>
            <div class="info">{{ info.tmtype }}</div>
          </div>
          <div class="showInfo">
            <div class="label">脱敏药物：</div>
            <div class="info">{{ info.tmdrug }}</div>
          </div>
          <!-- <div class="showInfo">
            <div class="label">脱敏方案：</div>
            <div class="info">{{ info.scheme || '-' }}</div>
          </div> -->
          <div class="showInfo" v-if="info.tmtype === '皮下脱敏'">
            <div class="label">剩余次数：</div>
            <div class="info">{{ info.synum }}</div>
          </div>
          <div class="showInfo">
            <div class="label">初次治疗日期：</div>
            <div class="info">{{ info.firstdate }}</div>
          </div>
          <div class="showInfo">
            <div class="label">是否脱落：</div>
            <div class="info">{{ info.isdrop === 'Y' ? '是' : '否' }}</div>
          </div>
        </div>
        <!-- 皮下 -->
        <div class="line" v-if="info.tmtype === '皮下脱敏'"></div>
        <div class="title" v-if="info.tmtype === '皮下脱敏'">肺功能记录</div>
        <div class="flex">
          <myechart
            v-if="info.tmtype === '皮下脱敏'"
            :option="option"
            style="width: 1300px; height: 262px"
          ></myechart>
          <!-- <myechart
            v-if="info.tmtype === '皮下脱敏'"
            :option="option1"
            style="width: 685px; height: 262px; margin-left: 50px"
          ></myechart> -->
        </div>
        <div class="line" v-if="info.tmtype === '皮下脱敏'"></div>
        <div class="title" v-if="info.tmtype === '皮下脱敏'">注射记录</div>
        <Table
          v-loading="loadingTable"
          v-if="info.tmtype === '皮下脱敏'"
          :columns="columns"
          :data="tableData"
          style="margin-top: 16px"
        >
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
          <template #action="{ row }">
            <div class="tableAdd" @click="editZSJL(row)">编辑</div>
          </template>
        </Table>
        <div class="pageWrapper" v-if="info.tmtype === '皮下脱敏'">
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

        <!-- 舌下 -->
        <div class="line" v-if="info.tmtype === '舌下脱敏'"></div>
        <div class="title" v-if="info.tmtype === '舌下脱敏'">治疗方案</div>
        <myechart
          v-if="info.tmtype === '舌下脱敏'"
          :option="planOption"
          style="height: 360px"
        ></myechart>
      </div>

      <div class="desensitize_sx" v-if="type === false">
        <div class="title">脱敏信息</div>
        <div class="desensitize_sx_list">
          <div class="desensitize_sx_item">
            <div class="desensitize_sx_item_title">脱敏方案</div>
            <div class="desensitize_sx_item_cont">
              <Input v-model="sxData.plan" disabled></Input>
            </div>
          </div>
          <div class="desensitize_sx_item">
            <div class="desensitize_sx_item_title">脱敏药物</div>
            <div class="desensitize_sx_item_cont">
              <Input v-model="sxData.medicine" disabled></Input>
            </div>
          </div>
          <div class="desensitize_sx_item">
            <div class="desensitize_sx_item_title">初次治疗日期</div>
            <div class="desensitize_sx_item_cont">
              <Input v-model="sxData.firstDate" disabled></Input>
            </div>
          </div>
          <div class="desensitize_sx_item">
            <div class="desensitize_sx_item_title">今日治疗瓶</div>
            <div class="desensitize_sx_item_cont">
              <Select v-model="sxData.num" placeholder="请选择">
                <Option value="1">1号</Option>
                <Option value="2">2号</Option>
                <Option value="3">3号</Option>
                <Option value="4">4号</Option>
                <Option value="5">5号</Option>
              </Select>
            </div>
          </div>
          <div class="desensitize_sx_item">
            <div class="desensitize_sx_item_title">今日治疗剂量</div>
            <div class="desensitize_sx_item_cont">
              <Select v-model="sxData.dose" placeholder="请选择">
                <Option value="1">1滴</Option>
                <Option value="2">2滴</Option>
                <Option value="3">3滴</Option>
                <Option value="4">4滴</Option>
                <Option value="5">5滴</Option>
              </Select>
            </div>
          </div>
          <div class="desensitize_sx_item">
            <div class="desensitize_sx_item_title">复诊日期</div>
            <div class="desensitize_sx_item_cont">
              <DatePicker
                :editable="false"
                type="date"
                placeholder="请选择"
                v-model="sxData.date"
              ></DatePicker>
            </div>
          </div>
        </div>

        <div class="desensitize_sx_btn">保存方案</div>
      </div>
    </div>
    <div v-else style="position: relative; height: 370px">
      <div
        class="gray tc"
        style="
          position: absolute;
          left: 50%;
          top: 65%;
          transform: translateY(-50%) translateX(-50%);
        "
      >
        <img src="@/assets/images/noData.png" alt="" />
        <div style="margin-top: 16px">暂无脱敏信息</div>
      </div>
    </div>
    <!-- 编辑 -->
    <el-dialog
      :title="name + ' 注射记录'"
      :visible.sync="openEdit"
      width="768px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <div class="flexFrom">
        <!-- 左边 -->
        <div class="fromItem">
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射周次</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.zsweek" placeholder="请填写注射周次" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射日期</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                type="date"
                v-model="chooseZSJL.zsdate"
                placeholder="请选择注射日期"
                style="width: 100%"
              ></DatePicker>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射序号</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.zshao" placeholder="请填写注射序号" type="number" />
            </div>
          </div>
          <div :class="chooseZSJL.zsstate.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射状态</div>
            <div class="itemContent">
              <div
                v-for="(item, index) in chooseZSJL.zsstate"
                :key="index + 'item.zsstate'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
                @click="openZT(item, index)"
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
                :class="item.zsstate ? 'black' : 'disabled'"
              >
                {{ item.zsstate || '请选择' }}
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
              </div>
              <!-- <Input
                v-for="(item, index) in chooseZSJL.zsstate"
                :key="index + 'chooseZSJL.zsstate'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
                v-model="item.zsstate"
                disabled
                placeholder="请填写注射状态"
              ></Input> -->
            </div>
          </div>
          <div :class="chooseZSJL.pefq.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">PEF(前)</div>
            <div class="itemContent">
              <Input
                v-for="(item, index) in chooseZSJL.pefq"
                :key="index + 'chooseZSJL.pefq'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
                v-model="item.pefq"
                type="number"
                placeholder="请填写PEF(前)"
              />
            </div>
          </div>
          <div :class="chooseZSJL.fenzhen.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">分针</div>
            <div
              class="itemContent"
              :style="chooseZSJL.fenzhen.length > 1 ? { height: 'auto' } : ''"
            >
              <div
                v-for="(item, index) in chooseZSJL.fenzhen"
                :key="index + 'chooseZSJL.fenzhen'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
                style="
                  display: block;
                  line-height: 30px;
                  font-size: 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  padding-left: 8px;
                  padding-right: 24px;
                  background-color: #f3f3f3;
                  border-radius: 4px;
                  border: 1px solid #e3e5e8;
                  color: #666;
                  position: relative;
                  cursor: not-allowed;
                "
              >
                {{ item.fenzhen === 'Y' ? '是' : '否' }}
              </div>
              <!-- <Input
                v-for="(item, index) in chooseZSJL.fenzhen"
                :key="index + 'chooseZSJL.fenzhen'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
                v-model="item.fenzhen"
                disabled
                placeholder="请填写是否分针"
              ></Input> -->
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射瓶号</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.zsnum" type="number" placeholder="请填写注射瓶号" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射剂量(ml)</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.zsdose" type="number" placeholder="请填写注射剂量" />
            </div>
          </div>
          <div :class="chooseZSJL.zssite.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射部位</div>
            <div class="itemContent">
              <Select
                v-for="(item, index) in chooseZSJL.zssite"
                :key="index + 'chooseZSJL.zssite'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
                v-model="item.zssite"
                style="width: 100%"
                placeholder="请填写注射部位"
              >
                <Option value="左">左</Option>
                <Option value="右">右</Option>
              </Select>
            </div>
          </div>
          <div :class="chooseZSJL.zstime.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射时间</div>
            <div class="itemContent">
              <TimePicker
                :editable="false"
                format="HH:mm"
                v-for="(item, index) in chooseZSJL.zstime"
                :key="index + 'chooseZSJL.zstime'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
                v-model="item.zstime"
                placeholder="请选择注射时间"
                style="width: 100%"
              ></TimePicker>
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="fromItem">
          <div :class="chooseZSJL.pefh.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">PEF(后)</div>
            <div class="itemContent">
              <Input
                v-for="(item, index) in chooseZSJL.pefh"
                :key="index + 'chooseZSJL.pefh'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
                v-model="item.pefh"
                type="number"
                placeholder="请填写PEF(后)"
              />
            </div>
          </div>
          <div :class="chooseZSJL.jkftsize.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应风团大小(mm)</div>
            <div class="itemContent">
              <div
                v-for="(item, index) in chooseZSJL.jkftsize"
                :key="index + 'chooseZSJL.jkftsize'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
                @click="openJKFT(item)"
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
                :class="item.jkftsize ? 'black' : 'disabled'"
              >
                {{ item.jkftsize || '请选择' }}
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
              </div>
            </div>
          </div>
          <div :class="chooseZSJL.jkrecord.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应记录</div>
            <div class="itemContent">
              <div
                @click="openJKRec(item)"
                v-for="(item, index) in chooseZSJL.jkrecord"
                :key="index + 'chooseZSJL.jkrecord'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
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
                :class="item.jkrecord ? 'black' : 'disabled'"
              >
                {{ item.jkrecord || '请选择' }}
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
              </div>
            </div>
          </div>
          <div :class="chooseZSJL.jkrecord.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应处理</div>
            <div class="itemContent">
              <div
                @click="openJKHandle(item)"
                v-for="(item, index) in chooseZSJL.jkhandle"
                :key="index + 'chooseZSJL.jkhandle'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
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
                :class="item.jkhandle ? 'black' : 'disabled'"
              >
                {{ item.jkhandle || '请选择' }}
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
              </div>
            </div>
          </div>
          <div
            :class="
              chooseZSJL.jktime && chooseZSJL.jktime.length > 1 ? 'flex jcsb' : 'flex jcsb aic'
            "
          >
            <div class="itemLabel" style="width: calc(100% - 236px)">即刻反应时间</div>
            <div class="itemContent">
              <TimePicker
                :editable="false"
                v-for="(item, index) in chooseZSJL.jktime"
                :key="index + 'chooseZSJL.jkhandle'"
                :style="{ marginTop: index === 0 ? '0' : '16px' }"
                v-model="item.jktime"
                format="HH:mm"
                placeholder="请填写即刻反应时间"
                style="width: 100%"
              ></TimePicker>
            </div>
          </div>
          <div :class="chooseZSJL.cfftsize.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">迟发反应风团大小(mm)</div>
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
          <div :class="chooseZSJL.cfrecord.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">迟发反应记录</div>
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
          <div :class="chooseZSJL.cfhandle.length > 1 ? 'flex jcsb' : 'flex jcsb aic'">
            <div class="itemLabel" style="width: calc(100% - 236px)">迟发反应处理</div>
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
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">迟发反应记录时间</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                type="date"
                v-model="chooseZSJL.cftime"
                placeholder="请选择迟发反应记录时间"
                style="width: 100%"
              ></DatePicker>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">备注</div>
            <div class="itemContent">
              <Input
                v-model="chooseZSJL.remark"
                type="textarea"
                :rows="5"
                placeholder="请填写备注"
              />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="finishJL" :loading="loadingSubmit">提 交</Button>
      </div>
    </el-dialog>
    <!-- 二级弹窗 -->
    <!-- 迟发反应风团 -->
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
    <!-- <el-dialog
      title="迟发反应记录"
      :visible.sync="showCFRec"
      width="678px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Checkbox-group v-model="chooseCFRec.arr">
        <div v-for="(item, index) in recList" :key="index + 'resList'" style="margin-bottom: 22px">
          <div class="gray" style="margin-bottom: 8px">{{ item.title }}</div>
          <Checkbox
            v-for="(itemSon, indexSon) in item.list"
            :key="indexSon + 'item.list'"
            :label="itemSon"
            style="margin-right: 40px"
          ></Checkbox>
        </div>
      </Checkbox-group>
      <div class="gray" style="margin-bottom: 8px">其他</div>
      <Input type="textarea" v-model="chooseCFRec.text"></Input>
      <div slot="footer">
        <Button type="primary" @click="closeCFRec">确 定</Button>
      </div>
    </el-dialog> -->
    <el-dialog
      title="迟发反应处理方式"
      :visible.sync="showHandle"
      width="630px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Checkbox-group v-model="chooseHandle.fyclfs" style="margin-bottom: 22px">
        <div class="gray" style="margin-bottom: 8px">反应处理方式</div>
        <Checkbox style="margin-right: 40px" label="抗组胺药"></Checkbox>
        <Checkbox style="margin-right: 40px" label="外涂抗组胺药物"></Checkbox>
        <Checkbox style="margin-right: 40px" label="外涂激素药物"></Checkbox>
        <Checkbox style="margin-right: 40px" label="局部冰敷处理"></Checkbox>
        <Checkbox style="margin-right: 40px" label="β受体激动剂（雾化）"></Checkbox>
      </Checkbox-group>
      <Checkbox-group v-model="chooseHandle.zdy" style="margin-bottom: 22px">
        <div class="gray" style="margin-bottom: 8px">自定义</div>
        <Checkbox style="margin-right: 40px" label="外涂"></Checkbox>
        <Checkbox style="margin-right: 40px" label="口服：留观1小时"></Checkbox>
        <Checkbox style="margin-right: 40px" label="万托林"></Checkbox>
        <Checkbox style="margin-right: 40px" label="氯雷他定"></Checkbox>
        <Checkbox style="margin-right: 40px" label="舒利迭"></Checkbox>
      </Checkbox-group>
      <div class="gray" style="margin-bottom: 8px">其他</div>
      <Input type="textarea" v-model="chooseHandle.text"></Input>
      <div slot="footer">
        <Button type="primary" @click="closeHandle">确 定</Button>
      </div>
    </el-dialog>
    <!-- 即刻反应记录 -->
    <ftReactionRecord
      type="cf"
      :show="showJKRec"
      :info="chooseJKRecObj.jkrecord"
      :index="chooseJKRecObj.index"
      @close="closeJKRec"
      @save="saveJKRec"
    />
    <!-- <el-dialog
      title="即刻反应记录"
      :visible.sync="showJKRec"
      width="678px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Checkbox-group v-model="chooseJKRec.arr">
        <div v-for="(item, index) in recList" :key="index + 'resList'" style="margin-bottom: 22px">
          <div class="gray" style="margin-bottom: 8px">{{ item.title }}</div>
          <Checkbox
            v-for="(itemSon, indexSon) in item.list"
            :key="indexSon + 'item.list'"
            :label="itemSon"
            style="margin-right: 40px"
          ></Checkbox>
        </div>
      </Checkbox-group>
      <div class="gray" style="margin-bottom: 8px">其他</div>
      <Input type="textarea" v-model="chooseJKRec.text"></Input>
      <div slot="footer">
        <Button type="primary" @click="closeJKRec">确 定</Button>
      </div>
    </el-dialog> -->
    <el-dialog
      title="即刻反应处理方式"
      :visible.sync="showJKHandle"
      width="630px"
      :close-on-click-modal="false"
      class="vertical-center-modal"
    >
      <Checkbox-group
        v-model="chooseJKHandle.fyclfs"
        @on-change="changeJKHandle($event, 'fyclfs')"
        style="margin-bottom: 22px"
      >
        <div class="gray" style="margin-bottom: 8px">反应处理方式</div>
        <Checkbox style="margin-right: 40px" label="抗组胺药"></Checkbox>
        <Checkbox style="margin-right: 40px" label="糖皮质激素"></Checkbox>
        <Checkbox style="margin-right: 40px" label="局部处理（冰敷）"></Checkbox>
        <Checkbox style="margin-right: 40px" label="β受体激动剂（雾化）"></Checkbox>
      </Checkbox-group>
      <Checkbox-group
        v-model="chooseJKHandle.zdy"
        @on-change="changeJKHandle($event, 'zdy')"
        style="margin-bottom: 22px"
      >
        <div class="gray" style="margin-bottom: 8px">自定义</div>
        <Checkbox style="margin-right: 40px" label="外涂尤卓尔"></Checkbox>
        <Checkbox style="margin-right: 40px" label="口服：留观1小时"></Checkbox>
        <Checkbox style="margin-right: 40px" label="万托林2吸吸入"></Checkbox>
        <Checkbox style="margin-right: 40px" label="氯雷他定1片口服"></Checkbox>
        <Checkbox style="margin-right: 40px" label="舒利迭1吸"></Checkbox>
      </Checkbox-group>
      <div class="gray" style="margin-bottom: 8px">其他</div>
      <Input type="textarea" v-model="chooseJKHandle.text"></Input>
      <div slot="footer">
        <Button type="primary" @click="closeJKHandle">确 定</Button>
      </div>
    </el-dialog>
    <!-- 即刻反应风团 -->
    <ftSizeModal
      type="jk"
      :show="showJKFT"
      :size="ftJKInfo.jkftsize"
      :index="ftJKInfo.index"
      @close="closeJKFT"
      @save="saveJKFT"
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
  </div>
</template>

<script>
import myechart from '../../../components/charts/myechart'
import ftSizeModal from '../../../components/ftSizeModal/ftSizeModal.vue'
import ftReactionRecord from '../../../components/ftReactionRecord/ftReactionRecord.vue'
import { pxzs } from '@/api/desensitizationTreatment/index'
import { treated } from '@/api/treated/index'
import { deepClone } from '@/libs/util'
import Plan from './plan.vue'
export default {
  props: ['name'],
  name: 'tmxx',
  components: {
    myechart,
    Plan,
    ftSizeModal,
    ftReactionRecord
  },
  data () {
    return {
      type: true,
      noData: false,
      showZT: false,
      patid: this.$route.query.patid,
      loadingSubmit: false,
      pageSize: 10,
      info: {},
      columns: [
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
        },
        // {
        //   title: '医生',
        //   key: 'doctor',
        //   width: 120
        // },
        {
          title: '操作',
          key: 'do',
          slot: 'action',
          fixed: 'right',
          width: 80
        }
      ],
      tableData: [],
      pefyj: '',
      option: {
        color: ['#3171FF', '#00d48a', '#F75559'],
        title: {
          text: 'PEF变化曲线图',
          left: 'center',
          textStyle: { color: '#282D3C' }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          bottom: '0%',
          data: ['PEF前', 'PEF后', 'PEF预计值']
        },
        grid: {
          top: '12%',
          left: '3%',
          right: '6%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'PEF前',
            type: 'line',
            data: []
          },
          {
            name: 'PEF后',
            type: 'line',
            data: []
          },
          {
            name: 'PEF预计值',
            lineStyle: {
              type: 'dashed'
            },
            type: 'line',
            data: []
          }
        ]
      },
      chooseZT: {
        zt: []
      },
      option1: {
        title: {
          text: 'PEV1变化曲线图',
          left: 'center',
          textStyle: { color: '#282D3C' }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '12%',
          left: '3%',
          right: '6%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'PEF前',
            type: 'line',
            stack: 'Total',
            data: []
          }
        ]
      },
      planOption: {
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            handleSize: 2,
            maxValueSpan: 10,
            height: '20px',
            start: 0,
            end: 10,
            showDetail: false,
            bottom: '10',
            zoomLock: true,
            brushSelect: false
          }
        ],
        grid: {
          left: '40px',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '滴数',
          // 隐藏Y轴
          axisLine: {
            show: false
          },
          // 隐藏Y轴的刻度线
          axisTick: {
            show: false
          }
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#3171FF'
              }
            }
          }
        ]
      },
      pageNum: 0,
      currentPageIdx: 1,
      openEdit: false,
      loading: false,
      loadingTable: false,
      showCFRec: false,
      showJKRec: false,
      showJKHandle: false,
      showHandle: false,
      showJKFT: false,
      showFT: false,
      chooseZSJL: {
        zsstate: [],
        pefq: [],
        pefh: [],
        fenzhen: [],
        zssite: [],
        zstime: [],
        jkftsize: [],
        jkrecord: [],
        jkhandle: [],
        cfftsize: '',
        cfrecord: '',
        cfhandle: []
      },
      chooseHandle: {},
      chooseJKHandle: {},
      chooseJKRecObj: {},
      ftJKInfo: {},
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
      sxData: {
        plan: '舌下脱敏',
        medicine: '畅迪',
        firstDate: '2022-02-02',
        num: '5',
        dose: '2',
        date: '2023-03-24'
      }
    }
  },
  methods: {
    // 当前页数发生改变
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.getList()
    },
    // 每页数量发生改变
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.currentPageIdx = 1
      this.getList()
    },
    changeFtJKInfo (e) {
      if (e === '无') {
        this.ftJKInfo.chang = ''
        this.ftJKInfo.kuan = ''
      } else {
        let s = e.split('*')
        this.ftJKInfo.chang = s[0]
        this.ftJKInfo.kuan = s[1]
      }
      this.$forceUpdate()
    },
    closeFT () {
      this.showFT = false
    },
    saveFT (e) {
      this.chooseZSJL.cfftsize = e
      this.closeFT()
    },
    closeJKFT () {
      this.$forceUpdate()
      this.showJKFT = false
    },
    saveJKFT (jkftsize, index) {
      console.log(jkftsize, index)
      this.chooseZSJL.jkftsize[index].jkftsize = jkftsize
      this.closeJKFT()
    },
    closeCFRec () {
      this.showCFRec = false
    },
    saveCFRec (str) {
      this.chooseZSJL.cfrecord = str
      this.closeCFRec()
    },
    changeJKHandle (e, type) {
      this.$forceUpdate()
      this.chooseJKHandle[type] = JSON.parse(JSON.stringify(e))
    },
    openJKHandle (item) {
      this.chooseJKHandle.index = item.index
      this.chooseJKHandle.fyclfs = item.arr.filter(item => {
        if (
          item === '抗组胺药' ||
          item === '糖皮质激素' ||
          item === '局部处理（冰敷）' ||
          item === 'β受体激动剂（雾化）'
        ) {
          return item
        }
      })
      this.chooseJKHandle.zdy = JSON.parse(
        JSON.stringify(
          item.arr.filter(item => {
            if (
              item === '外涂尤卓尔' ||
              item === '口服：留观1小时' ||
              item === '万托林2吸吸入' ||
              item === '氯雷他定1片口服' ||
              item === '舒利迭1吸'
            ) {
              return item
            }
          })
        )
      )

      let arr = this.chooseJKHandle.fyclfs.concat(this.chooseJKHandle.zdy)
      this.chooseJKHandle.text = item.arr.filter(v => arr.every(val => val !== v))[0] || ''
      this.showJKHandle = true
    },
    closeJKHandle () {
      let str = ''
      let index = this.chooseJKHandle.index

      str += this.chooseJKHandle.fyclfs ? this.chooseJKHandle.fyclfs.toString() : ''
      str =
        str && (this.chooseJKHandle.zdy ? this.chooseJKHandle.zdy.toString() : '')
          ? str + ',' + (this.chooseJKHandle.zdy ? this.chooseJKHandle.zdy.toString() : '')
          : str + (this.chooseJKHandle.zdy ? this.chooseJKHandle.zdy.toString() : '')

      str =
        str && this.chooseJKHandle.text
          ? str + ',' + (this.chooseJKHandle.text || '')
          : str + (this.chooseJKHandle.text || '')

      this.chooseZSJL.jkhandle[index].jkhandle = str
      this.chooseZSJL.jkhandle[index].arr = str.split(',')

      this.$forceUpdate()
      this.showJKHandle = false
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
    changeZTInput (e) {
      if (!e) return
      this.chooseZT.isGood = false
    },
    openZT (item, index) {
      this.chooseZT = { index, zt: [] }

      if (item.zsstate === '好') {
        this.chooseZT.isGood = true
      } else {
        this.chooseZT.isGood = false
        let arr = item.zsstate.split(',')
        let textArr = JSON.parse(JSON.stringify(arr))
        this.ztList.forEach(itemZS => {
          itemZS.list.forEach(itemList => {
            arr.forEach(arrItem => {
              if (
                itemList === arrItem ||
                (arrItem === '咳嗽' &&
                  this.chooseZT.zt.findIndex(itemZT => itemZT === '咳嗽') === -1) ||
                (arrItem === '发热' &&
                  this.chooseZT.zt.findIndex(itemZT => itemZT === '发热') === -1)
              ) {
                this.chooseZT.zt.push(arrItem)
                textArr = textArr.filter(itemTextArr => itemTextArr !== arrItem)
              }
            })
          })
        })

        this.chooseZT.text = textArr.toString()
      }

      this.showZT = true
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

      this.chooseZSJL.zsstate[this.chooseZT.index].zsstate = str || '好'
      this.showZT = false
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
    openJKFT (item) {
      this.ftJKInfo = item
      this.showJKFT = true
    },
    openJKRec (item) {
      this.chooseJKRecObj = item
      this.$forceUpdate()
      this.showJKRec = true
    },
    closeJKRec () {
      this.showJKRec = false
    },
    saveJKRec (str, index) {
      this.chooseZSJL.jkrecord[index].jkrecord = str
      this.chooseZSJL.jkrecord[index].arr = str.split(',')
      this.closeJKRec()
    },
    repetition (arr, brr) {
      // 定义一个新的数组，存入重复的数组
      var newArr = []
      // 循环两个数组，外循环循环一圈，内循环一轮，用外循环的一个去和内循环的每一个作比较
      // 如果相等说明就是重复的，然后再新数组里查找一下，这个数是否存在，如果两个条件都满足，则存入新数组

      // 循环第一个数组
      for (var i = 0; i < arr.length; i++) {
        // 循环第二个数组
        for (var j = 0; j < brr.length; j++) {
          // 避免新数组中出现重复的数
          if (arr[i] === brr[j] && newArr.indexOf(arr[i]) === -1) {
            newArr.push(arr[i])
          }
        }
      }
      // 返回新数组
      return newArr
    },
    getDetail () {
      this.loading = true
      treated
        .tuominInfo({
          patid: this.patid
        })
        .then(res => {
          let data = res.data
          if (data.length === 0) {
            this.noData = true
            this.loading = false
          } else {
            this.info = data.info
            this.loading = false
            if (this.info.tmtype === '皮下脱敏') {
              this.getLung()
            } else {
              this.getPlan()
            }
            this.getList()
          }
        })
    },
    getPlan () {
      treated
        .sheRec({
          projectid: this.info.projectid
        })
        .then(res => {
          let data = res.data
          this.planOption.xAxis.data = data.xaxis
          this.planOption.series[0].data = data.yaxis
        })
    },
    getLung () {
      treated
        .lungRec({
          projectid: this.info.projectid
        })
        .then(res => {
          let data = res.data
          this.option.xAxis.data = data.xaxis
          this.option1.xAxis.data = data.xaxis
          this.option1.series[0].data = data.pev
          this.option.series[0].data = data.pefq
          this.option.series[1].data = data.pefh
          this.option.series[2].data = data.pefyj
        })
    },
    getList () {
      this.loadingTable = true
      treated
        .shotRecord({
          page: this.currentPageIdx,
          limit: this.pageSize,
          patid: this.patid,
          projectid: this.info.projectid
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.loadingTable = false
          this.pefyj = data.pefyj
        })
    },
    editZSJL (row) {
      pxzs
        .finishedDoInit({
          recordid: row.recordid
        })
        .then(res => {
          let data = res.data
          this.chooseZSJL.realdose = row.realdose

          this.chooseZSJL = data
          this.chooseZSJL.recordid = row.recordid
          this.chooseZSJL.name = row.realname
          let keyArr = [
            'pefq',
            'fenzhen',
            'zssite',
            'zstime',
            'pefh',
            'jkftsize',
            'jkrecord',
            'jkhandle',
            'jktime'
          ]
          keyArr.forEach(key => {
            this.chooseZSJL[key] = data[key].split('|').map((item, index) => {
              let obj = {}
              obj[key] = item
              obj.index = index
              return obj
            })
          })

          let splitArr = ['jkrecord', 'jkhandle']
          splitArr.forEach(key => {
            this.chooseZSJL[key] = this.chooseZSJL[key].map(item => {
              item.arr = item[key].split(',')
              return item
            })
          })

          this.chooseZSJL.zsstate = data.zsstate.split('|').map(item => {
            return {
              zsstate: item
            }
          })

          this.chooseZSJL.cfftsize = data.cfftsize || ''
          this.chooseZSJL.cfrecord = data.cfrecord
          this.chooseCFRec = { arr: data.cfrecord.split(','), text: '' }
          this.chooseHandle.fyclfs = data.cfhandle.split(',').filter(item => {
            if (
              item === '抗组胺药' ||
              item === '外涂抗组胺药物' ||
              item === '外涂激素药物' ||
              item === '局部冰敷处理' ||
              item === 'β受体激动剂（雾化）'
            ) {
              return item
            }
          })
          this.chooseHandle.zdy = data.cfhandle.split(',').filter(item => {
            if (
              item === '外涂' ||
              item === '口服：留观1小时' ||
              item === '万托林' ||
              item === '氯雷他定' ||
              item === '舒利迭'
            ) {
              return item
            }
          })
          let arr = this.chooseHandle.fyclfs.concat(this.chooseHandle.zdy)
          let textArr = data.cfhandle.split(',').filter(v => arr.every(val => val !== v))
          this.chooseHandle.text = textArr ? textArr.toString() : ''

          this.openEdit = true
        })
    },
    findEmpty (key) {
      return this.chooseZSJL[key].findIndex(item => {
        return item[key] === ''
      })
    },
    // 提交
    finishJL () {
      if (this.findEmpty('pefq') !== -1) {
        this.$Message.error('请填写PEF(前)')
        return
      } else if (this.findEmpty('pefh') !== -1) {
        this.$Message.error('请填写PEF(后)')
        return
      }

      let param = deepClone(this.chooseZSJL)

      let keyArr = [
        'zsstate',
        'pefq',
        'fenzhen',
        'zssite',
        'zstime',
        'pefh',
        'jkftsize',
        'jkrecord',
        'jkhandle',
        'jktime'
      ]
      keyArr.forEach(item => {
        param[item] = param[item].map(itemObj => itemObj[item]).join('|')
      })

      param.cftime = param.cftime ? this.$moment(param.cftime).format('YYYY-MM-DD') : ''

      delete param.recordid
      delete param.name

      this.loadingSubmit = true

      pxzs
        .finishedDoSave({
          recordid: this.chooseZSJL.recordid,
          jsondata: JSON.stringify(param)
        })
        .then(res => {
          this.$Message.success('保存成功')
          this.getList()
          this.openEdit = false
          this.loadingSubmit = false
        })
        .catch(() => {
          this.loadingSubmit = false
        })
    }
  },
  mounted () {
    this.getDetail()
  }
}
</script>

<style lang="less" scoped>
.desensitize {
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #282d3c;
    line-height: 20px;
    padding-left: 12px;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 16px;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 4px;
      height: 18px;
      background: #3171ff;
    }
  }
  .showInfo {
    display: flex;
    margin-left: 40px;
    font-size: 14px;
    &:first-child {
      margin-left: 0;
    }
    .label {
      color: #969baa;
    }
    .info {
      color: #282d3c;
    }
  }
  .line {
    border-top: 1px solid #d2d7e1;
    margin-top: 16px;
    margin-bottom: 24px;
  }
  .tableAdd {
    cursor: pointer;
    color: #3171ff;
  }
}
.desensitize_sx {
  .desensitize_sx_list {
    .desensitize_sx_item {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      /deep/ .ivu-input[disabled] {
        color: #282d3c !important;
      }
      .desensitize_sx_item_title {
        font-size: 14px;
        font-weight: 400;
        color: #282d3c;
        line-height: 20px;
        margin-right: 8px;
        width: 85px;
        text-align: right;
      }
      .desensitize_sx_item_cont {
        width: 160px;
      }
    }
  }
  .desensitize_sx_btn {
    width: 89px;
    height: 32px;
    line-height: 32px;
    background: #3171ff;
    border-radius: 3px;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    margin: 40px auto 0;
    cursor: pointer;
  }
}
// 弹窗居中
/deep/ .vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
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
      width: 236px;
    }
  }
  .fromItem > div {
    margin-top: 16px;
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>
