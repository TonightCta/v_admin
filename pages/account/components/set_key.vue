<template>
  <div class="set-key">
    <el-dialog :visible.sync="keyBox" width="556px" :show-close="false">
      <div class="set-header" slot="title">
        <p>获取API KEY</p>
        <img
          @click="setPassBox = false"
          :src="require('../../../assets/images/close_icon_2.png')"
          alt=""
        />
      </div>
      <div class="set-slide">
        <p class="slide-lable">商户邮箱</p>
        <input
          type="text"
          v-model="email"
          disabled
          placeholder="请输入登录密码"
        />
      </div>
      <div class="set-slide">
        <p class="slide-lable">登录密码</p>
        <input
          type="password"
          v-model="loginPass"
          placeholder="请输入登录密码"
        />
      </div>
      <div class="set-oper">
        <button class="default-btn" @click="keyBox = false">取消</button>
        <p></p>
        <button class="primary-btn" @click="submitKey">确认</button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="gotBox" width="556px" :show-close="false">
      <div class="set-header" slot="title">
        <img
          @click="setPassBox = false"
          :src="require('../../../assets/images/close_icon_2.png')"
          alt=""
        />
      </div>
      <div class="got-content">
        <img
          class="green-right"
          :src="require('../../../assets/images/green_right.png')"
          alt=""
        />
        <p class="got-title">验证成功</p>
        <p class="got-remark">关闭后需重新获取，请及时保存！</p>
        <div class="got-code">
          <p>{{ gotKey }}</p>
          <p :data-clipboard-text="gotKey" @click="copyKey" id="copy-key">
            <img
              :src="require('../../../assets/images/copy_icon.png')"
              alt=""
            />
            复制
          </p>
        </div>
      </div>
      <div class="got-oper">
        <button @click="gotBox = false">关闭</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import Clipboard from "clipboard";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      keyBox: false, //获取Key窗口
      loginPass: null, //登录密码
      merchant: {},
      gotKey: null, //Key
      gotBox: false, //获取成功窗口
    };
  },
  computed: {
    account() {
      return this.$store.state.bossAssetsCenter.merchantInfo;
    },
    email() {
      const email = this.account.email || "";
      return (
        email.substring(0, 2) +
        "***" +
        email.substring(email.length - 6, email.length)
      );
    },
  },
  watch: {
    value: {
      immediate: true,
      handler: function (v) {
        this.keyBox = v;
      },
    },
    keyBox(val) {
      this.$emit("input", val);
      !val && (this.loginPass = null);
    },
  },
  methods: {
    //Get Merchant
    async merchantInfo() {
      const result = await this.$store.dispatch(
        "bossMember/queryMerchantVerifyInfo",
        {}
      );
      const { code } = result;
      if (code !== 200) {
        Message.error(result.message);
        return;
      }
      this.merchant = result.data || {};
    },
    //Get Key
    async submitKey() {
      if (!this.loginPass) {
        Message.error("请输入登录密码");
        return;
      }
      const result = await this.$store.dispatch("bossMember/queryUserApiKey", {
        accountNumber: this.merchant.email,
        enterpriseManagerId: this.merchant.enterpriseManagerId,
        userId: this.merchant.userId,
        password: this.loginPass,
      });
      const { code } = result;
      if (code !== 200) {
        Message.error(result.message);
        return;
      }
      this.gotKey = result.data.apiKey;
      this.keyBox = false;
      this.gotBox = true;
    },
    copyKey() {
      const clipboard = new Clipboard("#copy-key");
      clipboard.on("success", (e) => {
        Message.success("复制成功");
        //  释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        Message.error("该浏览器不支持复制");
        // 释放内存
        clipboard.destroy();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>