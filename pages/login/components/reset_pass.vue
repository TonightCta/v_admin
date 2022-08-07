<template>
  <div class="login-box">
    <section vlaue="邮箱">
      <label>{{ $vuetify.lang.t("$vuetify.loginPage.email") }}</label>
      <div>
        <img :src="require('../../../assets/images/email_icon.png')" alt="" />
        <input
          type="text"
          v-model="loginParams.email"
          autocomplet="off"
          :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterEmail')"
        />
        <img
          :src="require('../../../assets/images/close_icon.png')"
          alt=""
          class="need-position"
          v-if="isClear"
          @click="loginParams.email = null"
        />
      </div>
    </section>
    <section vlaue="邮箱验证码">
      <label>{{ $vuetify.lang.t("$vuetify.mine.邮箱验证码") }}</label>
      <div>
        <img :src="require('../../../assets/images/safe_icon.png')" alt="" />
        <input
          type="number"
          autocomplet="off"
          v-model="loginParams.code"
          :placeholder="$vuetify.lang.t('$vuetify.mine.请输入邮箱验证码')"
        />
        <p class="send-code" @click="sendCode">
          {{
            count == 0
              ? $vuetify.lang.t("$vuetify.loginPage.getVerifyCode")
              : currentLang == "en_US"
              ? `Resend after ${count}s`
              : `${count}s后重发`
          }}
        </p>
      </div>
    </section>
    <section vlaue="新密码">
      <label>{{ $vuetify.lang.t("$vuetify.loginPage.pwd") }}</label>
      <div>
        <img :src="require('../../../assets/images/lock_icon.png')" alt="" />
        <input
          :type="pass"
          autocomplet="off"
          v-model="loginParams.password"
          :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterPwd')"
        />
        <img
          :src="require('../../../assets/images/show_icon.png')"
          alt=""
          class="need-position"
          v-if="isShow"
          @click="pass = pass == 'password' ? 'text' : 'password'"
        />
      </div>
    </section>
    <section vlaue="验证新密码">
      <label>{{ $vuetify.lang.t("$vuetify.loginPage.newConfirmPwd") }}</label>
      <div>
        <img :src="require('../../../assets/images/lock_icon.png')" alt="" />
        <input
          :type="pass_repeat"
          v-model="loginParams.repeat_password"
          autocomplet="off"
          :placeholder="
            $vuetify.lang.t('$vuetify.loginPage.enterNewConfirmPwd')
          "
        />
        <img
          :src="require('../../../assets/images/show_icon.png')"
          alt=""
          class="need-position"
          v-if="isShowRepeat"
          @click="pass_repeat = pass_repeat == 'password' ? 'text' : 'password'"
        />
      </div>
    </section>
    <section>
      <v-btn @click="resetPass">{{
        $vuetify.lang.t("$vuetify.mine.确认")
      }}</v-btn>
    </section>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { checkEmail } from "../../../utils/index";
export default {
  data() {
    return {
      pass: "password",
      pass_repeat: "password",
      loginParams: {
        email: null,
        code: null,
        password: null,
        repeat_password: null,
      },
      count: 0,
    };
  },
  computed: {
    isClear() {
      return this.loginParams.email != null && this.loginParams.email != "";
    },
    isShow() {
      return (
        this.loginParams.password != null && this.loginParams.password != ""
      );
    },
    isShowRepeat() {
      return (
        this.loginParams.repeat_password != null &&
        this.loginParams.repeat_password != ""
      );
    },
    currentLang() {
      return this.$vuetify.lang.current;
    },
  },
  methods: {
    //发送验证码
    async sendCode() {
      if (!this.loginParams.email) {
        Message.error(this.$vuetify.lang.t("$vuetify.loginPage.enterEmail"));
        return;
      }
      if (!checkEmail(this.loginParams.email)) {
        Message.error(this.$vuetify.lang.t("$vuetify.loginPage.inValidEmail"));
        return;
      }
      const result = await this.$store.dispatch("bossMember/sendVerifyCode", {
        scene: 4,
        email: this.loginParams.email,
      });
      const { code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success("验证码发送成功");
      this.count = 60;
      const next = setInterval(() => {
        this.count--;
        if (this.count < 1) {
          clearInterval(next);
        }
      }, 1000);
    },
    //重置密码
    async resetPass() {
      if (!this.loginParams.email) {
        Message.error(this.$vuetify.lang.t("$vuetify.loginPage.enterEmail"));
        return;
      }
      if (!checkEmail(this.loginParams.email)) {
        Message.error(this.$vuetify.lang.t("$vuetify.loginPage.inValidEmail"));
        return;
      }
      if (!this.loginParams.code) {
        Message.error(
          this.$vuetify.lang.t("$vuetify.loginPage.enterVerifyCode")
        );
        return;
      }
      if (!this.loginParams.password) {
        Message.error(this.$vuetify.lang.t("$vuetify.loginPage.enterNewPwd"));
        return;
      }
      if (!this.loginParams.repeat_password) {
        Message.error(this.$vuetify.lang.t("$vuetify.loginPage.enterNewPwd"));
        return;
      }
      if (this.loginParams.password !== this.loginParams.repeat_password) {
        Message.error(
          this.$vuetify.lang.t("$vuetify.loginPage.inValidConfirmPwd")
        );
        return;
      }
      const params = {
        email: this.loginParams.email,
        code: this.loginParams.code,
        password: this.loginParams.repeat_password,
      };
      const result = await this.$store.dispatch(
        "bossMember/forgetPass",
        params
      );
      console.log(result);
      const { code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success(
        this.$vuetify.lang.t("$vuetify.message.edit_tran_success")
      );
      this.$emit("backLogin");
    },
  },
};
</script>

<style lang="scss" scoped>
.login-box {
  section {
    padding: 0 18px;
    label {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 10px;
      display: inline-block;
    }
    div {
      width: 100%;
      height: 56px;
      border: 1px solid rgba(248, 248, 248, 0.08);
      border-radius: 4px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 19px;
      img {
        width: 20px;
        height: 20px;
      }
      img:first-child {
        margin-right: 14px;
      }
      img:last-child {
        cursor: pointer;
      }
      input {
        flex: 1;
        transform: translateY(1px);
        outline: none;
        color: white;
        background: rgba(0, 0, 0, 0) !important;
      }
      input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important;
        -webkit-transition-delay: 99999s;
        -webkit-transition: color 99999s ease-out,
          background-color 99999s ease-out;
      }
    }
    button {
      width: 100%;
      height: 50px !important;
      border-radius: 4px;
      background: #2d3ec7 !important;
      color: white;
      font-size: 16px;
      margin: 18px 0;
    }
    .send-code {
      padding: 7px 12px;
      background: rgba(216, 216, 216, 0.08);
      border-radius: 4px;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0;
      cursor: pointer;
      margin-right: -10px;
    }
  }
}
</style>