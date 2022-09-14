<!-- 提币教程 -->
<template>
  <div class="withdraw-tu tu-public">
    <el-dialog :visible.sync="withdrawTu" :show-close="false" width="960">
      <template slot="title">
        <div class="tu-title">
          <p></p>
          <div class="title-inner">
            <img
              :src="require('../../../assets/images/title_other.png')"
              alt=""
            />
            <p>提现到交易所或钱包操作流程</p>
            <img
              :src="require('../../../assets/images/title_other.png')"
              alt=""
            />
          </div>
          <img
            :src="require('../../../assets/images/close_icon_2.png')"
            alt=""
            class="close-icon"
            @click="withdrawTu = false"
          />
        </div>
      </template>
      <div class="tu-inner">
        <ul class="withdraw-list">
          <li v-for="(step, index) in stepList" :key="index">
            <div class="step-number">Step{{ step.index }}</div>
            <div class="step-inner">
              <p class="step-title">{{ step.title }}</p>
              <el-image
                :style="{
                  width: `420px`,
                  height: 'auto',
                }"
                :src="step.step_img"
                :preview-src-list="[step.step_img]"
              >
              </el-image>
            </div>
          </li>
        </ul>
        <div class="step-last">
          <div class="step-number">Step3</div>
          <div class="last-inner">
            <div class="inner-content">
              填写完之后，点击下一步弹窗输入交易密码等即可完成提币，审核通过后会向你指定的地址（USDT-TRC20）打币
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      withdrawTu: false,
      stepList: [
        {
          index: 1,
          title: "点击后台“商户提币”，选择币种账户（USDT-TRC20），下图：",
          step_img: require("../../../assets/images/tu/withdraw_tu_1.png"),
        },
        {
          index: 2,
          title:
            "选择完之后，填入交易所（币安、钱包等）收U（USDT-TRC20）地址及提币个数，下图：",
          step_img: require("../../../assets/images/tu/withdraw_tu_2.png"),
        },
      ],
    };
  },
  watch: {
    value: {
      handler: function (v) {
        this.withdrawTu = v;
      },
    },
    withdrawTu(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>