<!-- 充币教程 -->
<template>
  <div class="recharge-tu tu-public">
    <el-dialog :visible.sync="rechargeTu" width="960" :show-close="false">
      <template slot="title">
        <div class="tu-title">
          <p></p>
          <div class="title-inner">
            <img
              :src="require('../../../assets/images/title_other.png')"
              alt=""
            />
            <p>钱包或交易所充值到我们后台</p>
            <img
              :src="require('../../../assets/images/title_other.png')"
              alt=""
            />
          </div>
          <img
            :src="require('../../../assets/images/close_icon_2.png')"
            alt=""
            class="close-icon"
            @click="rechargeTu = false"
          />
        </div>
      </template>
      <div class="tu-inner">
        <ul class="recharge-list">
          <li
            v-for="(step, index) in stepList"
            :key="index"
            :class="[
              step.other_width && 'big-width',
              step.without_m && 'm-b-0',
            ]"
          >
            <div class="step-number">Step{{ step.index }}</div>
            <div class="step-inner">
              <p class="inner-title">{{ step.title }}</p>
              <div
                class="img-remark"
                :class="[
                  step.remark && 'with-remark',
                  step.step_img_1 && 'more-remark-img',
                ]"
              >
                <div class="step-img-view">
                  <el-image
                    :style="{
                      width: `${step.other_width ? 302 : 100}px`,
                      height: 'auto',
                    }"
                    :src="step.step_img"
                    :preview-src-list="[step.step_img]"
                  >
                  </el-image>
                  <p v-if="step.step_img_1">图1</p>
                </div>
                <div class="step-img-view" v-if="step.step_img_1">
                  <el-image
                    :style="{
                      width: `${step.other_width ? 302 : 105}px`,
                      height: 'auto',
                    }"
                    :src="step.step_img_1"
                    :preview-src-list="[step.step_img_1]"
                  >
                  </el-image>
                  <p>图2</p>
                </div>
                <!-- 说明 -->
                <div class="remark-danger">
                  <div class="step-remark" v-if="step.remark">
                    <p>{{ step.remark }}</p>
                  </div>
                  <div class="step-danger" v-if="step.danger">
                    <p>{{ step.danger }}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="bottom-arrow">
          <img
            :src="require('../../../assets/images/tu/bottom_arrow.png')"
            alt=""
          />
        </div>
        <div class="step-last">
          <div class="step-number">Step7</div>
          <div class="last-inner">
            <div class="inner-content">
              提现地址获取完后进入最后的操作了，就是输入你想提现的个数，点击提交，输入相关密码之后就
              <span>完成提币</span>
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
      rechargeTu: false,
      stepList: [
        {
          index: 1,
          title: "点击后台“商户充币”，选择币种账户（USDT-TRC20），下图：",
          step_img: require("../../../assets/images/tu/recharge_tu_1.png"),
          other_width: true,
        },
        {
          index: 2,
          title:
            "选择完之后，打开交易所（币安等），以欧易交易所为例子，选择底部“资产”菜单进入资产页面，下图：",
          step_img: require("../../../assets/images/tu/recharge_tu_2.png"),
        },
        {
          index: 3,
          title:
            "进入资产页面之后，点击“提现”按钮（图1），进入提现页面，下图（图2）：",
          step_img: require("../../../assets/images/tu/recharge_tu_3.png"),
          step_img_1: require("../../../assets/images/tu/recharge_tu_3_1.png"),
        },
        {
          index: 4,
          title:
            "进入提现页面后，交易所会显示你的资产余额，你只要选择USDT，进入USDT提现页面，下图（默认为线上转账，这个不用去调整）：",
          step_img: require("../../../assets/images/tu/recharge_tu_4.png"),
          remark:
            "注：大部分交易所都会有链上转账和内部转账选择，对外提币都是走链上转账",
        },
        {
          index: 5,
          title:
            "进入USDT提现页面，先选择提币网络，商户后台支持的网络是（USDT-TRC20），所以在合理选择的时候要选择对应的网络（USDT-TRC20）才能转账成功，下图：",
          step_img: require("../../../assets/images/tu/recharge_tu_5.png"),
          without_m: true,
        },
        {
          index: 6,
          title:
            "进入USDT提现页面，先选择提币网络，商户后台支持的网络是（USDT-TRC20），所以在合理选择的时候要选择对应的网络（USDT-TRC20）才能转账成功，下图：",
          step_img: require("../../../assets/images/tu/recharge_tu_6.png"),
          remark:
            "注：提现地址可输入、复制粘贴，也可以扫描，为什么建议扫描呢，避免地址输错，所以建议用",
          danger: "扫描的形式获取提现地址！在哪里扫描？你可以参考上面第1条说明",
          without_m: true,
        },
      ],
    };
  },
  watch: {
    value: {
      handler: function (v) {
        this.rechargeTu = v;
      },
    },
    rechargeTu(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>