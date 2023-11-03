<template>
  <div class="history_case" v-loading="loading" :style="`height: calc(100vh - ${top}px)`">
    <div
      class="history_case_cont"
      ref="backTop"
      :style="`height: calc(100vh - ${top}px)`"
      style="position: relative; width: 100%"
    >
      <div class="history_case_left">
        <div
          class="history_case_left_item"
          v-for="(item, index) in tableData"
          :key="index"
          :style="
            tab_index === index
              ? `background: url(${require('@/assets/images/patient/case_bg_active.png')}) 0% 0% / 100%;`
              : `background: url(${require('@/assets/images/patient/case_bg.png')}) 0% 0% / 100%;`
          "
          @click="tab_index = index"
        >
          <img
            class="history_case_left_item_tip"
            :src="
              tab_index === index
                ? require(`@/assets/images/patient/point.png`)
                : require(`@/assets/images/patient/circle.png`)
            "
            alt=""
          />
          <div class="history_case_left_item_txt">
            <div class="history_case_left_item_txt_cont">
              <div
                :class="[
                  'history_case_left_item_txt_cont_title',
                  tab_index === index ? 'history_case_left_item_txt_cont_title_active' : ''
                ]"
              >
                就诊日期：
              </div>
              <div
                :class="[
                  'history_case_left_item_txt_cont_value',
                  tab_index === index ? 'history_case_left_item_txt_cont_value_active' : ''
                ]"
              >
                {{ item.jzdate }}
              </div>
            </div>
            <div class="history_case_left_item_txt_cont">
              <div
                :class="[
                  'history_case_left_item_txt_cont_title',
                  tab_index === index ? 'history_case_left_item_txt_cont_title_active' : ''
                ]"
              >
                接诊医生：
              </div>
              <div
                :class="[
                  'history_case_left_item_txt_cont_value',
                  tab_index === index ? 'history_case_left_item_txt_cont_value_active' : ''
                ]"
              >
                {{ item.docname }}
              </div>
            </div>
            <div class="history_case_left_item_txt_cont">
              <div
                :class="[
                  'history_case_left_item_txt_cont_title',
                  tab_index === index ? 'history_case_left_item_txt_cont_title_active' : ''
                ]"
              >
                诊断：
              </div>
              <div
                :class="[
                  'history_case_left_item_txt_cont_value',
                  tab_index === index ? 'history_case_left_item_txt_cont_value_active' : ''
                ]"
              >
                {{ item.diagnose }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="verticalLine" v-if="tableData.length !== 0"></div>
      <div v-if="tableData.length !== 0" class="history_case_right">
        <div class="history_case_right_head">
          <div class="history_case_right_head_title">病历信息</div>
          <Button type="primary" v-print="'#print'">打 印</Button>
        </div>
        <div class="history_case_right_list" id="print">
          <div
            class="history_case_right_item"
            style="display: flex"
            v-for="(item, index) in diagnoseData"
            :key="index + 'diagnoseData'"
          >
            <div class="tr" style="color: #969baa; width: 100px">{{ item.title }}：</div>
            <div style="color: #282d3c; flex: 1" v-if="item.key === 'visittype'">
              {{ tableData[tab_index][item.key] === 'first' ? '初诊' : '复诊' }}
            </div>
            <div style="color: #282d3c; flex: 1" v-else-if="!item.list">
              {{ tableData[tab_index][item.key] }}
            </div>
            <div
              class="history_case_right_item_txt"
              style="color: #282d3c; flex: 1"
              v-if="item.list"
            >
              <div v-for="(txt, i) in item.list" :key="i + 'item.list'">
                {{ txt.title }}{{ tableData[tab_index][txt.key] }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="gray tc"
        style="
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateY(-50%) translateX(-50%);
        "
      >
        <img class="history_case_img" src="@/assets/images/noData.png" alt="" />
        <div style="margin-top: 16px">暂无历史病历</div>
      </div>
    </div>
  </div>
</template>

<script>
import { treated } from '@/api/treated/index'
import { throttle } from '@/libs/util'
export default {
  name: 'hzbl',
  data () {
    return {
      tab_index: 0,
      top: 0,
      page: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      patid: this.$route.query.patid,
      tableData: [],
      diagnoseData: [
        {
          title: '初/复诊',
          key: 'visittype'
        },
        {
          title: '主诉',
          key: 'suit'
        },
        {
          title: '现病史',
          key: 'present'
        },
        {
          title: '过敏史',
          key: 'allergy'
        },
        {
          title: '疾病史',
          key: 'disease'
        },
        {
          title: '手术史',
          key: 'surgery'
        },
        {
          title: '外伤史',
          key: 'trauma'
        },
        {
          title: '婚育史',
          key: 'marry'
        },
        {
          title: '家族史',
          key: 'family'
        },
        {
          title: '各项评估',
          list: [
            {
              title: '疼痛评估：',
              key: 'vas'
            },
            {
              title: '心理评估：',
              key: 'psy'
            },
            {
              title: '交通工具：',
              key: 'car'
            }
          ]
        },
        {
          title: '诊断结果',
          key: 'diagnose'
        }
      ]
    }
  },
  methods: {
    getList: throttle(function () {
      treated
        .BLList({
          page: this.page,
          limit: this.pageSize,
          patid: this.patid
        })
        .then(res => {
          let data = res.data
          this.total = data.total
          this.tableData = this.tableData.concat(data.lists)
          this.page++
          this.loading = false
        })
    }, 500),
    handleScroll (e) {
      // console.log(this.tableData.length >= this.total)
      if (this.tableData.length >= this.total) return
      let scrollTop = e.target.scrollTop // 距顶部
      let clientHeight = e.target.clientHeight // 可视区高度
      let scrollHeight = e.target.scrollHeight // 滚动条总高度

      // scrollTop + clientHeight == scrollHeight
      if (scrollTop + clientHeight === scrollHeight) {
        this.loading = true
        this.getList() // 每滑动到底部一次就调用一次接口
      }
    }
  },
  mounted () {
    document.querySelector('.history_case_left').addEventListener('scroll', this.handleScroll, true)
    this.loading = true
    this.getList()
    this.top = Math.ceil(this.$refs.backTop.getBoundingClientRect().top) + 50
  },
  beforeDestroy () {
    document
      .querySelector('.history_case_left')
      .removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>

<style lang="less" scoped>
.noBorder {
  border: none !important;
}
@media screen and (max-width: 1100px) {
  .history_case_img {
    width: 250px;
  }
}
@media screen and (max-width: 1000px) {
  .history_case_img {
    width: 200px;
  }
}
.history_case {
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  display: flex;
  .history_case_left {
    width: 455px;
    // border-right: 1px solid #d2d7e1;
    overflow-y: auto;
    overflow-x: hidden;
    .history_case_left_item {
      width: 434px;
      height: 102px;
      position: relative;
      margin-bottom: 31px;
      &:last-child {
        margin-bottom: 0;
      }
      .history_case_left_item_tip {
        width: 8px;
        height: 8px;
        position: absolute;
        top: 47px;
        right: -19px;
      }
      .history_case_left_item_txt {
        width: 100%;
        height: 100%;
        padding: 10px 60px 10px 10px;
        box-sizing: border-box;
        cursor: pointer;
        .history_case_left_item_txt_cont {
          font-size: 14px;
          font-weight: 400;
          line-height: 17px;
          display: flex;
          margin-bottom: 8px;
          &:last-child {
            margin-bottom: 0;
          }
          .history_case_left_item_txt_cont_title {
            width: 70px;
            color: #969baa;
            text-align: right;
          }
          .history_case_left_item_txt_cont_title_active {
            color: rgba(255, 255, 255, 0.8);
          }
          .history_case_left_item_txt_cont_value {
            flex: 1;
            color: #282d3c;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .history_case_left_item_txt_cont_value_active {
            color: #ffffff;
          }
        }
      }
    }
  }
  .history_case_cont {
    margin-top: 2px;
    display: flex;
    .verticalLine {
      position: relative;
      top: 0;
      bottom: 0;
      width: 1px;
      height: 100%;
      background: #d2d7e1;
      z-index: 0;
      right: 6px;
    }
    .history_case_left {
      width: 455px;
      overflow-y: auto;
      .history_case_left_item {
        width: 434px;
        height: 102px;
        position: relative;
        margin-bottom: 31px;
        &:last-child {
          margin-bottom: 0;
        }
        .history_case_left_item_tip {
          width: 8px;
          height: 8px;
          position: absolute;
          z-index: 1;
          top: 47px;
          right: -19px;
        }
        .history_case_left_item_txt {
          width: 100%;
          height: 100%;
          padding: 10px 60px 10px 10px;
          box-sizing: border-box;
          cursor: pointer;
          .history_case_left_item_txt_cont {
            font-size: 14px;
            font-weight: 400;
            line-height: 17px;
            display: flex;
            margin-bottom: 8px;
            &:last-child {
              margin-bottom: 0;
            }
            .history_case_left_item_txt_cont_title {
              width: 70px;
              color: #969baa;
              text-align: right;
            }
            .history_case_left_item_txt_cont_title_active {
              color: rgba(255, 255, 255, 0.8);
            }
            .history_case_left_item_txt_cont_value {
              flex: 1;
              color: #282d3c;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
            .history_case_left_item_txt_cont_value_active {
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  .history_case_right {
    overflow-y: auto;
    flex: 1;
    padding: 0 16px;
    box-sizing: border-box;
    .history_case_right_head {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        margin-right: 8px;
        font-size: 16px;
        font-weight: 500;
        color: #282d3c;
        line-height: 17px;
      }
      img {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
    .history_case_right_list {
      margin-top: 24px;
      .history_case_right_item {
        font-size: 14px;
        font-weight: 400;
        line-height: 17px;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
        .history_case_right_item_txt {
          div {
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
}
</style>
