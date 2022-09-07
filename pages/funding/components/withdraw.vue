<template>
  <div class="withdraw-box">
    <el-dialog :visible.sync="withDrawBox" width="834px" :show-close="false">
      <div class="set-header" slot="title">
        <p>确认提币</p>
        <img
          @click="withDrawBox = false"
          :src="require('../../../assets/images/close_icon_2.png')"
          alt=""
        />
      </div>
      <div class="draw-msg">
        <div class="draw-address">
          <p>{{ drawMsg?.toAddress }}</p>
        </div>
        <ul class="remark-list">
          <li v-for="(item, index) in remarkList" :key="index">
            <img :src="item.icon" alt="" />
            <p>{{ item.name }}</p>
            <el-popover
              placement="top"
              trigger="hover"
              content="提币矿工费 + 归集矿工费"
              v-if="item.tootip"
            >
              <img class="pop-img" slot="reference" :src="item.too" alt="" />
            </el-popover>
          </li>
        </ul>
        <ul class="msg-list">
          <li>{{ drawMsg?.asset }}</li>
          <li>{{ Number(drawMsg?.txAmount).toFixed(8) }}</li>
          <li>{{ drawMsg?.fee }}</li>
          <li>{{drawMsg?.toolFee}}</li>
        </ul>
        <div class="verify-msg">
          <!-- 验证码 -->
          <div class="inp-box">
            <p class="inp-label">验证码</p>
            <div class="inp-content">
              <input
                type="number"
                placeholder="请输入邮箱验证码"
                v-model="emailCode"
                autocomplete="off"
              />
              <p
                class="send-code"
                @click="count === 0 ? sendCodeService() : null"
                :class="[count > 0 && 'stop-click']"
              >
                {{ count === 0 ? "发送验证码" : `${count}s` }}
              </p>
            </div>
          </div>
          <!-- 交易密码 -->
          <div class="inp-box">
            <p class="inp-label">交易密码</p>
            <div class="inp-content">
              <input
                :type="passType"
                placeholder="请输入交易密码"
                autocomplete="new-password"
                v-model="tradePass"
              />
              <img
                @click="
                  passType = passType === 'password' ? 'text' : 'password'
                "
                :src="
                  require(`../../../assets/images/${
                    passType === 'password' ? 'see' : 'un_see'
                  }.png`)
                "
                alt=""
              />
            </div>
          </div>
          <!-- 谷歌验证码 -->
          <div class="inp-box">
            <p class="inp-label">谷歌验证码</p>
            <div class="inp-content">
              <input
                type="number"
                v-model="gaCode"
                placeholder="请输入谷歌验证码"
                autocomplete="off"
              />
            </div>
          </div>
        </div>
        <div class="submit-btn">
          <button class="default-btn" @click="withDrawBox = false">取消</button>
          <p class="label-mask"></p>
          <button
            class="primary-btn"
            element-loading-spinner="el-icon-loading"
            @click="submitWithdraw"
            v-loading="waitResult"
            :disabled="waitResult"
          >
            确定
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      withDrawBox: false,
      remarkList: [
        {
          name: "提币币种",
          icon: require("../../../assets/images/with_icon.png"),
          tootip: false,
        },
        {
          name: "预期到账",
          icon: require("../../../assets/images/wallet_icon.png"),
          tootip: false,
        },
        {
          name: "所需手续费",
          icon: require("../../../assets/images/fee_icon.png"),
          tootip: false,
          too: require("../../../assets/images/q_icon.png"),
        },
        {
          name: "所需矿工费",
          icon: require("../../../assets/images/fee_icon.png"),
          tootip: true,
          tip: "",
          too: require("../../../assets/images/q_icon.png"),
        },
      ],
      passType: "password",
      count: 0, //倒计时
      timer: null, //计时器
      emailCode: null, //邮箱验证码
      tradePass: null, //交易密码
      gaCode: null, //谷歌验证码
      drawMsg: {}, //交易信息
      waitResult: false,
    };
  },
  watch: {
    value: {
      handler: function (v) {
        this.withDrawBox = v;
      },
    },
    withDrawBox(val) {
      this.$emit("input", val);
      !val &&
        (clearInterval(this.timer),
        (this.count = 0),
        (this.drawMsg = {}),
        (this.emailCode = null),
        (this.tradePass = null),
        (this.gaCode = null));
    },
  },
  methods: {
    //发送验证码
    async sendCodeService() {
      const result = await this.$store.dispatch("bossMember/sendVerifyCode", {
        scene: 3,
      });
      const { code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success("验证码发送成功");
      this.count = 60;
      this.timer = setInterval(() => {
        this.count--;
        if (this.count <= 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    //获取提币参数
    getWithdrawMsg(obj) {
      this.drawMsg = obj;
      this.withDrawBox = true;
    },
    //提交提币
    async submitWithdraw() {
      if (!this.emailCode) {
        Message.error("请输入邮箱验证码");
        return;
      }
      if (!this.tradePass) {
        Message.error("请输入交易密码");
        return;
      }
      if (!this.gaCode) {
        Message.error("请输入谷歌验证码");
        return;
      }
      this.waitResult = true;
      // let res = await this.$store.dispatch(
      //     "bossAssetsCenter/merchantWithdraw",
      //     {

      //     }
      //   );
      const params = {
        asset: this.drawMsg.asset,
        password: this.tradePass,
        ga_code: this.gaCode,
        toAddress: this.drawMsg.toAddress,
        txAmount: this.drawMsg.txAmount,
        verifyCode: this.emailCode,
        walletId: window.sessionStorage.getItem("userId"),
        userWithdrawId: this.drawMsg.userWithdrawId,
      };
      const result = await this.$store.dispatch(
        "bossAssetsCenter/merchantWithdraw",
        params
      );
      this.waitResult = false;
      const { code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success("提币申请成功");
      this.withDrawBox = false;
      this.$emit("resetInput");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>