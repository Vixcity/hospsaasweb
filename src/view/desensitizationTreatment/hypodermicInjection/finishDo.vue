<template>
  <div class="finishDo">
    <div class="filterCtn">
      <div class="itemFather">
        <div class="filterItem">
          <div class="label">搜索</div>
          <div>
            <Input v-model="keyword" search placeholder="患者姓名/手机号" />
          </div>
        </div>
        <div class="filterItem">
          <Button type="primary" @click="changeFilter">查 询</Button>
          <Button @click="reset">重 置</Button>
        </div>
      </div>
    </div>
    <Table v-loading="loading" :columns="columns" :data="tableData" style="margin-top: 16px">
      <template #pefq="{ row }">
        <span>{{ row.pefq }}</span>
        <span
          v-if="row.pefyj && row.pefyj != '-'"
          :style="`color: ${$percentage(row.pefq, row.pefyj).color}`"
        >
          ({{ $percentage(row.pefq, row.pefyj).val }})
        </span>
      </template>
      <template #fenzhen="{ row }">
        {{ row.fenzhen === 'Y' ? '是' : '否' }}
      </template>
      <template #pefh="{ row }">
        <span>{{ row.pefh }}</span>
        <span
          v-if="row.pefyj && row.pefyj != '-'"
          :style="`color: ${$percentage(row.pefh, row.pefyj).color}`"
        >
          ({{ $percentage(row.pefh, row.pefyj).val }})
        </span>
      </template>
      <template #jkftsize="{ row }">
        {{ row.jkftsize || '无' }}
      </template>
      <template #jkrecord="{ row }">
        {{ row.jkrecord || '无' }}
      </template>
      <template #jkhandle="{ row }">
        {{ row.jkhandle || '无' }}
      </template>
      <template #cfftsize="{ row }">
        {{ row.cfftsize || '无' }}
      </template>
      <template #cfrecord="{ row }">
        {{ row.cfrecord || '无' }}
      </template>
      <template #cfhandle="{ row }">
        {{ row.cfhandle || '无' }}
      </template>
      <template #remark="{ row }">
        {{ row.remark || '无' }}
      </template>
      <template #action="{ row }">
        <div class="flex">
          <div class="btn blue" @click="openEdit(row)">编辑</div>
        </div>
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
      :title="chooseZSJL.name + '注射信息'"
      :visible.sync="showZSXX"
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
            <div class="itemContent">
              <div
                v-for="(item, index) in chooseZSJL.fenzhen"
                :key="index + 'chooseZSJL.fenzhen'"
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
              <Input v-model="chooseZSJL.zsnum" placeholder="请填写注射瓶号" />
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">注射剂量(ml)</div>
            <div class="itemContent">
              <Input v-model="chooseZSJL.zsdose" placeholder="请填写注射剂量" />
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
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">下次注射日期</div>
            <div class="itemContent">
              <DatePicker
                :editable="false"
                type="date"
                v-model="chooseZSJL.nextdate"
                placeholder="请选择下次注射日期"
                style="width: 100%"
              ></DatePicker>
            </div>
          </div>
          <div class="flex jcsb aic">
            <div class="itemLabel" style="width: calc(100% - 236px)">下次注射时间</div>
            <div class="itemContent">
              <Select v-model="chooseZSJL.nexttime" style="width: 100%">
                <Option value="上午">上午</Option>
                <Option value="下午">下午</Option>
              </Select>
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
        <Button type="primary" @click="finishJL" :loading="submitLoading">提 交</Button>
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
    <!-- 即刻反应风团大小 -->
    <ftSizeModal
      type="jk"
      :show="showJKFT"
      :size="chooseJKFTInfo.jkftsize"
      :index="chooseJKFTInfo.index"
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
import { pxzs } from '@/api/desensitizationTreatment/index'
import { deepClone } from '@/libs/util'
import ftSizeModal from '../../../components/ftSizeModal/ftSizeModal.vue'
import ftReactionRecord from '../../../components/ftReactionRecord/ftReactionRecord.vue'
export default {
  name: 'finishDo',
  components: { ftSizeModal, ftReactionRecord },
  data () {
    var showjzno = JSON.parse(localStorage.getItem('userInfo')).showjzno
    var columns = showjzno === 'Y' ? [
      {
        width: 110,
        key: 'jzcard',
        title: '就诊卡号',
        fixed: 'left'
      },
      {
        width: 110,
        key: 'jzno',
        title: '编号',
        fixed: 'left'
      },
      {
        width: 100,
        key: 'realname',
        title: '姓名',
        fixed: 'left'
      },
      {
        width: 100,
        key: 'zsweek',
        title: '周次'
      },
      {
        width: 110,
        key: 'zsdate',
        title: '注射日期'
      },
      {
        width: 100,
        key: 'zsstate',
        title: '状态'
      },
      {
        width: 130,
        key: 'pefq',
        slot: 'pefq',
        title: 'PEF（前）'
      },
      {
        width: 100,
        slot: 'fenzhen',
        title: '分针'
      },
      {
        width: 100,
        key: 'zsnum',
        title: '瓶号'
      },
      {
        width: 110,
        key: 'zsdose',
        title: '剂量（ml）'
      },
      {
        width: 100,
        key: 'synum',
        title: '剩余针数'
      },
      {
        width: 100,
        key: 'zssite',
        title: '注射部位'
      },
      {
        width: 130,
        key: 'pefh',
        slot: 'pefh',
        title: 'PEF（后）'
      },
      {
        width: 200,
        slot: 'jkftsize',
        title: '即刻反应风团大小（mm）'
      },
      {
        width: 120,
        slot: 'jkrecord',
        title: '即刻反应记录'
      },
      {
        width: 150,
        slot: 'jkhandle',
        title: '即刻反应记录处理'
      },
      {
        width: 200,
        slot: 'cfftsize',
        title: '迟发反应风团大小（mm）'
      },
      {
        width: 120,
        slot: 'cfrecord',
        title: '迟发反应记录'
      },
      {
        width: 150,
        slot: 'cfhandle',
        title: '迟发反应记录处理'
      },
      {
        width: 150,
        slot: 'remark',
        title: '备注'
      },
      {
        width: 80,
        slot: 'action',
        title: '操作',
        fixed: 'right'
      }
    ] : [
      {
        width: 110,
        key: 'jzcard',
        title: '就诊卡号',
        fixed: 'left'
      },
      {
        width: 100,
        key: 'realname',
        title: '姓名',
        fixed: 'left'
      },
      {
        width: 100,
        key: 'zsweek',
        title: '周次'
      },
      {
        width: 110,
        key: 'zsdate',
        title: '注射日期'
      },
      {
        width: 100,
        key: 'zsstate',
        title: '状态'
      },
      {
        width: 130,
        key: 'pefq',
        slot: 'pefq',
        title: 'PEF（前）'
      },
      {
        width: 100,
        slot: 'fenzhen',
        title: '分针'
      },
      {
        width: 100,
        key: 'zsnum',
        title: '瓶号'
      },
      {
        width: 110,
        key: 'zsdose',
        title: '剂量（ml）'
      },
      {
        width: 100,
        key: 'synum',
        title: '剩余针数'
      },
      {
        width: 100,
        key: 'zssite',
        title: '注射部位'
      },
      {
        width: 130,
        key: 'pefh',
        slot: 'pefh',
        title: 'PEF（后）'
      },
      {
        width: 200,
        slot: 'jkftsize',
        title: '即刻反应风团大小（mm）'
      },
      {
        width: 120,
        slot: 'jkrecord',
        title: '即刻反应记录'
      },
      {
        width: 150,
        slot: 'jkhandle',
        title: '即刻反应记录处理'
      },
      {
        width: 200,
        slot: 'cfftsize',
        title: '迟发反应风团大小（mm）'
      },
      {
        width: 120,
        slot: 'cfrecord',
        title: '迟发反应记录'
      },
      {
        width: 150,
        slot: 'cfhandle',
        title: '迟发反应记录处理'
      },
      {
        width: 150,
        slot: 'remark',
        title: '备注'
      },
      {
        width: 80,
        slot: 'action',
        title: '操作',
        fixed: 'right'
      }
    ]
    return {
      pageNum: 0,
      showZSXX: false,
      loading: false,
      showCFRec: false,
      showZT: false,
      showJKRec: false,
      showJKHandle: false,
      showHandle: false,
      showJKFT: false,
      chooseJKFTInfo: {},
      showFT: false,
      submitLoading: false,
      keyword: '',
      currentPageIdx: 1,
      chooseHandle: {},
      chooseJKHandle: {},
      chooseJKRecObj: {},
      chooseZT: {
        zt: []
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
      }
    }
  },
  methods: {
    // 当前页数发生改变
    changePage (pageIndex) {
      this.currentPageIdx = pageIndex
      this.getList()
    },
    changeFilter () {
      this.currentPageIdx = 1
      this.getList()
    },
    // 每页数量发生改变
    changeSize (pageSize) {
      this.pageSize = pageSize
      this.changeFilter()
    },
    reset () {
      this.keyword = ''
      this.changeFilter()
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
    saveJKFT (ftsize, index) {
      this.chooseZSJL.jkftsize[index].jkftsize = ftsize
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
    openJKFT (item) {
      this.chooseJKFTInfo = item
      this.showJKFT = true
    },
    openJKRec (item) {
      this.chooseJKRecObj = item
      this.showJKRec = true
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
    closeJKRec () {
      this.showJKRec = false
    },
    saveJKRec (str, index) {
      this.chooseZSJL.jkrecord[index].jkrecord = str
      this.chooseZSJL.jkrecord[index].arr = str.split(',')
      this.closeJKRec()
    },
    getList () {
      this.loading = true
      pxzs
        .finishedDoList({
          page: this.currentPageIdx,
          limit: this.pageSize,
          keyword: this.keyword
        })
        .then(res => {
          let data = res.data
          this.tableData = data.lists
          this.pageNum = data.total
          this.loading = false
        })
        .catch(err => {
          console.log('皮下注射-已完成:', err)
          this.loading = false
        })
    },
    openEdit (row) {
      pxzs
        .finishedDoInit({
          recordid: row.recordid
        })
        .then(res => {
          let data = res.data
          // for (const key in data) {
          //   if (Object.hasOwnProperty.call(data, key)) {
          //     let item = data[key]
          //     if (typeof item === 'string') {
          //       data[key] = item.split('|')
          //     }
          //   }
          // }
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

          this.showZSXX = true
        })
    },
    findEmpty (key) {
      return this.chooseZSJL[key].findIndex(item => {
        return item[key] === ''
      })
    },
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
      param.zsdate = param.zsdate ? this.$moment(param.zsdate).format('YYYY-MM-DD') : ''
      param.nextdate = param.nextdate ? this.$moment(param.nextdate).format('YYYY-MM-DD') : ''

      delete param.recordid
      delete param.name

      this.submitLoading = true

      pxzs
        .finishedDoSave({
          recordid: this.chooseZSJL.recordid,
          jsondata: JSON.stringify(param)
        })
        .then(res => {
          this.$Message.success('保存成功')
          this.getList()
          this.showZSXX = false
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
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
