<template>
  <el-dialog
    :title="(type === 'cf' ? '迟发' : '即刻') + '反应风团大小'"
    :visible.sync="showFT"
    width="488px"
    :close-on-click-modal="false"
    @close="$emit('close')"
    class="vertical-center-modal"
  >
    <div class="flexFrom">
      <!-- 左边 -->
      <div class="fromItem">
        <div class="flex jcsb aic">
          <div class="itemLabel" style="width: calc(100% - 160px)">长(mm)</div>
          <div class="itemContent" style="width: 160px">
            <Input v-model="ftInfo.chang" placeholder="请填写" type="number" />
            <!-- <Select filterable >
                <Option
                  v-for="item in 80"
                  :key="item + '80option'"
                  :label="item + ''"
                  :value="item + ''"
                ></Option>
              </Select> -->
          </div>
        </div>
      </div>
      <!-- 右边 -->
      <div class="fromItem">
        <div class="flex jcsb aic">
          <div class="itemLabel" style="width: calc(100% - 160px)">宽(mm)</div>
          <div class="itemContent" style="width: 160px">
            <Input v-model="ftInfo.kuan" placeholder="请填写" type="number" />
            <!-- <Select filterable v-model="ftInfo.kuan">
                <Option
                  v-for="item in 80"
                  :key="item + '80option'"
                  :label="item + ''"
                  :value="item + ''"
                ></Option>
              </Select> -->
          </div>
        </div>
      </div>
    </div>
    <div class="gray" style="margin-top: 20px">常用风团大小(mm)</div>
    <RadioGroup
      v-model="ftInfo.strVal"
      @on-change="changeFtInfo"
      style="
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-row-gap: 20px;
        padding-top: 10px;
      "
    >
      <Radio label="无" value="无"></Radio>
      <Radio label="5*5" value="5*5"></Radio>
      <Radio label="10*10" value="10*10"></Radio>
      <Radio label="15*15" value="15*15"></Radio>
      <Radio label="20*20" value="20*20"></Radio>
      <Radio label="25*25" value="25*25"></Radio>
      <Radio label="30*30" value="30*30"></Radio>
    </RadioGroup>
    <div slot="footer">
      <Button type="primary" @click="closeFT">确 定</Button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    type: String,
    size: String,
    show: Boolean,
    index: Number | undefined
  },
  name: 'ftSizeModal',
  data () {
    return {
      showFT: false,
      ftInfo: {
        strVal: '无'
      }
    }
  },
  methods: {
    changeFtInfo (e) {
      if (e === '无') {
        this.ftInfo.chang = ''
        this.ftInfo.kuan = ''
      } else {
        let s = e.split('*')
        this.ftInfo.chang = s[0]
        this.ftInfo.kuan = s[1]
      }
    },
    closeFT () {
      let ftsize = ''
      if (this.ftInfo.chang || this.ftInfo.kuan) {
        ftsize = (this.ftInfo.chang || 0) + '*' + (this.ftInfo.kuan || 0)
      }
      this.$emit('save', ftsize, this.index)
    }
  },
  watch: {
    show (val) {
      this.showFT = val
    },
    size (val) {
      this.ftInfo.chang = val ? val.split('*')[0] : ''
      this.ftInfo.kuan = val ? val.split('*')[1] : ''
      this.ftInfo.strVal = val || '无'
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./ftSizeModal.less');
</style>
