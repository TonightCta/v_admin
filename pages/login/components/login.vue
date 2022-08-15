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
    <section vlaue="密码">
      <label>{{ $vuetify.lang.t("$vuetify.loginPage.pwd") }}</label>
      <div>
        <img :src="require('../../../assets/images/lock_icon.png')" alt="" />
        <input
          :type="pass"
          autocomplet="off"
          v-model="loginParams.password"
          :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterPwd')"
          @keydown.enter="boradEv"
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
    <section vlaue="谷歌验证码">
      <label>{{ $vuetify.lang.t("$vuetify.mine.谷歌验证码") }}</label>
      <div>
        <img :src="require('../../../assets/images/auth_icon.png')" alt="" />
        <input
          type="text"
          v-model="loginParams.ga_code"
          autocomplet="off"
          :placeholder="
            $vuetify.lang.t('$vuetify.mine.请输入谷歌验证码(未绑定请忽略)')
          "
          @keydown.enter="boradEv"
        />
      </div>
    </section>
    <section>
      <p @click="$emit('forgetPass')">
        {{ $vuetify.lang.t("$vuetify.loginPage.forget") }}？
      </p>
      <v-btn @click="loginBox">{{
        $vuetify.lang.t("$vuetify.loginPage.login")
      }}</v-btn>
    </section>
    <Loading v-if="isAuto" />
  </div>
</template>

<script>
import { Message } from "element-ui";
import { checkEmail } from "../../../utils";
import Loading from "./loading.vue";
export default {
  data() {
    return {
      pass: "password",
      loginParams: {
        email: null,
        password: null,
        ga_code: null,
      },
      isAuto: false,
      key: null,
    };
  },
  components: {
    Loading,
  },
  created() {
    if (this.GetUrlKey("auto", window.location.href)) {
      const key = this.GetUrlKey("auto", window.location.href);
      (this.key = key), (this.isAuto = true);
      this.autoLogin();
    }
  },
  methods: {
    async autoLogin() {
      let res = await this.$store.dispatch("bossMember/autoLogin", {
        merchant_id: this.key,
      });
      if (res.code === 200) {
        this.isAuto = false;
        this.$router.push("/account/merchant");
      } else {
        this.$error(
          res.message || this.$vuetify.lang.t("$vuetify.message.login_failed")
        );
      }
    },
    //获取地址栏参数
    GetUrlKey(name, url) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            url
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    loginBox() {
      if (!this.loginParams.email) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.请输入邮箱"));
        return;
      }
      if (!checkEmail(this.loginParams.email)) {
        Message.error(this.$vuetify.lang.t("$vuetify.loginPage.inValidEmail"));
      }
      if (!this.loginParams.password) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.请输入登录密码"));
        return;
      }
      this.$emit("click", this.loginParams);
    },
    boradEv(_code) {
      _code.keyCode == 13 && this.loginBox();
    },
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
      display: inline-block;
      margin-bottom: 10px;
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
      margin-bottom: 18px;
    }
    p {
      font-size: 14px;
      color: #4e62ff;
      margin-bottom: 10px;
      text-align: right;
      cursor: pointer;
      margin-top: 24px;
    }
  }
}
</style>