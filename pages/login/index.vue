<template lang="pug">
v-container.fill-height.ib-login-index(fluid)
  v-row(align="center", justify="center")
    v-col(cols="11", sm="10", md="7", lg="5", xl="3")
      v-card.px-4.py-2
        //- 找回登陆密码标题 
        //- v-card-title.pr-13(v-if="currentOperation == 'login' && loginType == 'forget'")
        //-   .back-btn
        //-     v-btn(icon, depressed, @click="loginType = 'login'")
        //-       v-icon(size="36") mdi-chevron-left
        //-   v-spacer
        //-   .title.px-4.py-2 {{ $vuetify.lang.t('$vuetify.loginPage.retrieveLoginPassword') }}
        //-   v-spacer

        //- //- 设置交易密码标题
        //- v-card-title.pr-13(
        //-   v-else-if="currentOperation == 'register' && registerType == 'register_finished'"
        //- )
        //-   .back-btn
        //-     v-btn(icon, depressed, @click="registerType = 'register'")
        //-       v-icon(size="36") mdi-chevron-left
        //-   v-spacer
        //-   .title.px-4.py-2 {{ $vuetify.lang.t('$vuetify.lable.set_transaction_password') }}
        //-   v-spacer

        //- 登录注册
        v-card-title
          v-spacer
          .title-mine
            p(v-if="loginType == 'forget'",@click="loginType = 'login'") 
              img(:src="require('../../assets/images/back_icon.png')")
            .oper-title(:class="loginType == 'forget' ? 'small-size' : ''") {{loginType == 'forget' ? $vuetify.lang.t('$vuetify.loginPage.forget') : $vuetify.lang.t('$vuetify.loginPage.login')}}
            
          //- .op-item.title.px-4.py-2(
          //-   :class="[{ 'primary--text': currentOperation == 'login' }]",
          //-   @click="switchOperation('login')"
          //- ) {{ $vuetify.lang.t('$vuetify.loginPage.login') }}
          //- .title.px-4.py-2 |
          //- .op-item.title.px-4.py-2(
          //-   v-ripple,
          //-   :class="[{ 'primary--text': currentOperation == 'register' }]",
          //-   @click="switchOperation('register')"
          //- ) {{ $vuetify.lang.t('$vuetify.loginPage.register') }}
          v-spacer

        v-card-text
        v-tabs-items(v-model="loginType", v-if="currentOperation == 'login'")
          //- 登录
          v-tab-item(value="login")
            LoginBox(@click="login",@forgetPass="loginType = 'forget'")
          //- 忘记密码
          v-tab-item(value="forget")
            ResetPass(@backLogin="loginType = 'login'")
        //- 注册
        v-tabs-items(
          v-model="registerType",
          v-if="currentOperation == 'register'"
        )
          v-tab-item(value="register")
            v-card-text.my-2
              v-text-field(
                key="register-email",
                v-model="user.email",
                @blur="userEmailInput",
                :label="$vuetify.lang.t('$vuetify.loginPage.email')",
                :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterEmail')",
                ref="registerEmail",
                :rules="[rules.email]"
              ) 

            v-card-text.my-2
              v-text-field(
                key="register-verifycode",
                v-model="user.verifyCode",
                :label="$vuetify.lang.t('$vuetify.loginPage.verifyCode')",
                :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterVerifyCode')",
                ref="registerVerifyCode",
                :rules="[rules.verifyCode]"
              )
                template(slot="append")
                  v-btn(
                    small,
                    rounded,
                    outlined,
                    style="margin-top:-6px",
                    :disabled="disabledVerifyCode",
                    @click="sendVerifyCode(1)"
                  ) {{ sendingTime > 0 ? sendingTime + 's' : $vuetify.lang.t('$vuetify.loginPage.getVerifyCode') }}

            v-card-text.my-2
              v-text-field(
                key="register-pwd",
                type="password",
                v-model="user.password",
                :label="$vuetify.lang.t('$vuetify.loginPage.pwd')",
                :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterPwd')",
                ref="registerPwd",
                :rules="[rules.password]"
              ) 

            v-card-text.my-2
              v-text-field(
                key="register-pwdAgain",
                type="password",
                v-model="user.passwordAgain",
                :label="$vuetify.lang.t('$vuetify.loginPage.confirmPwd')",
                :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterConfirmPwd')",
                ref="registerPwdAgain",
                :rules="[rules.passwordAgain]"
              ) 

            v-card-text.my-2
              v-btn(
                block,
                x-large,
                depressed,
                color="primary",
                :loading="isRegistering",
                :disabled="disabledRegister",
                @click="register"
              ) {{ $vuetify.lang.t('$vuetify.loginPage.nextStep') }}

          v-tab-item(value="register_finished")
            v-card-text.my-2
              v-text-field(
                key="trans-pwd",
                v-model="trans.password",
                type="password",
                :label="$vuetify.lang.t('$vuetify.loginPage.transPwd')",
                :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterTransPwd')",
                ref="transPwd",
                :rules="[rules.transPwd]"
              ) 

            v-card-text.my-2
              v-text-field(
                key="trans-pwdAgain",
                v-model="trans.passwordAgain",
                type="password",
                :label="$vuetify.lang.t('$vuetify.loginPage.confirmTransPwd')",
                :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterConfirmTransPwd')",
                ref="transPwdAgain",
                :rules="[rules.passwordAgain]"
              ) 

            v-card-text.my-2
              v-btn(
                block,
                x-large,
                depressed,
                color="primary",
                :loading="isSetTrans",
                :disabled="disabledSetTrans",
                @click="submitRegister"
              ) {{ $vuetify.lang.t('$vuetify.loginPage.finish') }}
  v-dialog(v-model="is_to_login", max-width="350", v-if="is_to_login")
    v-card
      v-card-title {{ $vuetify.lang.t('$vuetify.lable.prompt') }}
      v-card-text.subtitle-1 {{ $vuetify.lang.t('$vuetify.lable.to_login') }}
      v-divider
      v-card-text.text-center.py-4
        v-btn(@click="switchOperation('login')", depressed, color="primary") {{ $vuetify.lang.t('$vuetify.lable.go_to') }}
  v-dialog(v-model="is_to_home", max-width="350", v-if="is_to_home")
    v-card
      v-card-title {{ $vuetify.lang.t('$vuetify.lable.prompt') }}
      v-card-text.subtitle-1 {{ $vuetify.lang.t('$vuetify.lable.to_home') }}
      v-divider
      v-card-text.text-center.py-4
        v-btn(@click="toHome", depressed, color="primary") {{ $vuetify.lang.t('$vuetify.lable.go_to') }}
</template>
    
<script>
var that = null;
export default {
  layout: "login_register",
  data: () => {
    return {
      isLogining: false,
      isForgetting: false,
      isRegistering: false,
      is_to_home: false,
      is_to_login: false,
      isSetTrans: false,
      sendingTimer: null,
      sendingTime: 0,
      user: {
        email: "",
        verifyCode: "",
        password: "",
        passwordAgain: "",
      },
      loginParams: {
        password: "",
        ga_code:"",
      },
      forget: {
        password: "",
        passwordAgain: "",
      },
      trans: {
        password: "",
        passwordAgain: "",
      },
      currentOperation: "login",
      loginType: "login", // #forget
      registerType: "register", // #register_finished
      rules: {
        required: (value) => {
          return !!value || that.$vuetify.lang.t("$vuetify.loginPage.required");
        },
        verifyCode: (value) => {
          const pattern = /^[a-zA-Z0-9]*$/;
          return (
            (pattern.test(value) && value.length > 0) ||
            that.$vuetify.lang.t("$vuetify.loginPage.inValidVerifyCode")
          );
        },
        transPwd: (value) => {
          const pattern = /^[0-9]*$/;
          return (
            (pattern.test(value) && value.length == 6) ||
            that.$vuetify.lang.t("$vuetify.loginPage.inValidTransPwd")
          );
        },
        password: (value) => {
          return (
            value.length >= 8 ||
            that.$vuetify.lang.t("$vuetify.loginPage.inValidPwd")
          );
          const pattern =
            /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{8,20}$/;
          return (
            pattern.test(value) ||
            that.$vuetify.lang.t("$vuetify.loginPage.inValidPwd")
          );
        },
        passwordAgain: (value) => {
          const forget = that.forget.password == that.forget.passwordAgain;
          const trans = that.trans.password == that.trans.passwordAgain;
          const register = that.user.password == that.user.passwordAgain;
          return (
            (forget && trans && register) ||
            that.$vuetify.lang.t("$vuetify.loginPage.inValidConfirmPwd")
          );
        },
        email: (value) => {
          const pattern =
            /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          return (
            pattern.test(value) ||
            that.$vuetify.lang.t("$vuetify.loginPage.inValidEmail")
          );
        },
      },
      registerParams: {},
    };
  },
  computed: {
    disabledLogin() {
      return (
        this.rules.email(this.user.email) != true ||
        this.rules.password(this.loginParams.password) != true ||
        this.isLogining
      );
    },
    disabledVerifyCode() {
      return this.rules.email(this.user.email) != true || this.sendingTime > 0;
    },
    disabledForget() {
      return (
        this.rules.email(this.user.email) != true ||
        this.rules.verifyCode(this.user.verifyCode) != true ||
        this.rules.password(this.forget.password) != true ||
        this.rules.passwordAgain() != true ||
        this.isForgetting
      );
    },
    disabledRegister() {
      return (
        this.rules.email(this.user.email) != true ||
        this.rules.verifyCode(this.user.verifyCode) != true ||
        this.rules.password(this.user.password) != true ||
        this.rules.passwordAgain() != true ||
        this.isRegistering
      );
    },
    disabledSetTrans() {
      return (
        this.rules.transPwd(this.trans.password) != true ||
        this.rules.passwordAgain() != true ||
        this.isSetTrans
      );
    },
  },
  components:{
    LoginBox:(resolve) => require(['./components/login'],resolve),
    ResetPass:(resolve) => require(['./components/reset_pass'],resolve)
  },
  async created() {
    that = this;
    // let res = await this.$store.dispatch('bossMember/refreshToken')
    // let url = this.$route.params.from || '/'
    // if (res.code == '200') {
    //   this.$router.push(url)
    // }
    if (!!sessionStorage.getItem("TOKEN") && !this.GetUrlKey("auto", window.location.href)) {
      this.is_to_home = true;
      // setTimeout(function(){
      //   that.$router.push('/')
      // },1500)
    }
    document.onkeydown = function () {
      if (window.event.keyCode == 13 && !that.disabledLogin) {
        that.login();
      }
    };
  },
  mounted(){
    if(/Mobile|Android|iPhone/i.test(navigator.userAgent)){
      window.location.href = 'https://mobile.ib.cc/#/login';
    }
  },
  methods: {
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
    toHome() {
      this.$router.push("/");
    },
    userEmailInput() {
      this.user.email = this.user.email.trim();
      if (this.currentOperation == "register") {
        this.verifyEmail();
      }
    },
    async resetPassword() {
      if (this.rules.email(this.user.email) != true) {
        this.$error(this.$vuetify.lang.t("$vuetify.loginPage.inValidEmail"));
        try {
          this.$refs.forgetEmail.focus();
        } catch (error) {}
        return;
      }
      if (this.user.verifyCode.trim() == "") {
        this.$error(this.$vuetify.lang.t("$vuetify.message.code_not_null"));
        try {
          this.$refs.forgetVerifyCode.focus();
        } catch (error) {}
        return;
      }
      if (this.forget.password.trim() == "") {
        this.$error(this.$vuetify.lang.t("$vuetify.message.pasw_not_null"));
        try {
          this.$refs.forgetPwd.focus();
        } catch (error) {}
        return;
      }
      if (this.forget.passwordAgain.trim() != this.forget.password.trim()) {
        this.$error(
          this.$vuetify.lang.t("$vuetify.loginPage.inValidConfirmPwd")
        );
        try {
          this.$refs.forgetPwdAgain.focus();
        } catch (error) {}
        return;
      }
      this.isForgetting = true;
      try {
        let res = await this.$store.dispatch("bossMember/resetLoginPwd", {
          accountNumber: this.user.email,
          accountType: 1,
          password: this.forget.password,
          verifyCode: this.user.verifyCode,
        });
        if (res.code == "200") {
          // this.$success('success')
          this.loginType = "login";
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.reset_pasw_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
      this.isForgetting = false;
    },
    async submitRegister() {
      if (this.trans.password.trim() == "") {
        this.$error(
          this.$vuetify.lang.t("$vuetify.message.tran_pasw_not_null")
        );
        return;
      }
      if (this.trans.password != this.trans.passwordAgain) {
        this.$error(
          this.$vuetify.lang.t("$vuetify.message.tran_pasw_inconsistent")
        );
        return;
      }
      this.isSetTrans = true;
      try {
        this.registerParams.transPassword = this.trans.password;
        this.registerParams.ga_code = this.trans.ga_code;
        let res = await this.$store.dispatch(
          "bossMember/register",
          this.registerParams
        );
        if (res.code == "200") {
          this.loginParams.password = this.user.password;
          this.$store.dispatch("bossMember/changeRegisterJoin");
          this.login();
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.registration_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
      this.isSetTrans = false;
    },
    startSendingTime() {
      this.sendingTimer = setTimeout(() => {
        if (this.sendingTime > 0) {
          this.sendingTime -= 1;
          this.startSendingTime();
        } else {
          clearTimeout(this.sendingTimer);
        }
      }, 1000);
    },
    async sendVerifyCode(type) {
      if (this.sendingTime > 0) {
        return;
      }
      if (this.rules.email(this.user.email) != true) {
        this.$error(this.$vuetify.lang.t("$vuetify.loginPage.inValidEmail"));
        return;
      }
      try {
        this.sendingTime = 60;
        this.startSendingTime();
        let res = await this.$store.dispatch("bossMember/sendVerifyCode", {
          accountNumber: this.user.email,
          accountType: 1,
          businessType: type,
        });
        if (res.code == "200") {
          // this.$success('success')
          // this.sendingTime = 60
          // this.startSendingTime()
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.send_code_failed")
          );
          this.sendingTime = 0;
          clearTimeout(this.sendingTimer);
        }
      } catch (error) {
        console.log(error);
        this.sendingTime = 0;
        clearTimeout(this.sendingTimer);
      }
    },
    switchOperation(t) {
      this.currentOperation = t;
      this.loginType = "login";
      this.registerType = "register";
      if (t == "login") {
        this.user.verifyCode = "";
        this.user.password = "";
        this.user.passwordAgain = "";
        this.trans.password = "";
        this.trans.passwordAgain = "";
        this.is_to_login = false;
      } else {
        this.user.verifyCode = "";
        this.loginParams.password = "";
        this.forget.password = "";
        this.forget.passwordAgain = "";
      }
    },
    async login(_params) {
      // if (this.rules.email(_params.email) != true) {
      //   Message.error(this.$vuetify.lang.t("$vuetify.loginPage.inValidEmail"));
        // try {
        //   this.$refs.loginEmail.focus();
        // } catch (error) {}
        // return;
      // }
      // if (_params.password.trim() == "") {
      //   Message.error(this.$vuetify.lang.t("$vuetify.message.pasw_not_null"));
        // try {
        //   this.$refs.loginPwd.focus();
        // } catch (error) {}
        // return;
      // }
      try {
        let res = await this.$store.dispatch("bossMember/login", {
          email: _params.email,
          loginMode: "pwd",
          ga_code:_params.ga_code,
          password: _params.password,
          pushId: "11",
        });
        if (res.code === 200) {
          this.$router.push("/account/merchant");
        } else {
          this.$error(
            res.message || this.$vuetify.lang.t("$vuetify.message.login_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
      this.isLogining = false;
    },
    async verifyEmail() {
      try {
        // 验证用户是否存在
        let checkResult = await this.$store.dispatch(
          "bossMember/checkUserAccount",
          {
            accountId: this.user.email,
          }
        );
        if (checkResult.code == "200") {
          if (checkResult.data.checkResult == 1) {
            this.is_to_login = true;
          } else {
          }
        } else {
          this.$error(
            checkResult.message ||
              this.$vuetify.lang.t("$vuetify.message.email_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    async register() {
      if (this.rules.email(this.user.email) != true) {
        this.$error(this.$vuetify.lang.t("$vuetify.loginPage.inValidEmail"));
        try {
          this.$refs.registerEmail.focus();
        } catch (error) {}
        return;
      }
      if (this.user.verifyCode.trim() == "") {
        this.$error(this.$vuetify.lang.t("$vuetify.message.code_not_null"));
        try {
          this.$refs.registerVerifyCode.focus();
        } catch (error) {}
        return;
      }
      if (this.user.password.trim() == "") {
        this.$error(this.$vuetify.lang.t("$vuetify.message.pasw_not_null"));
        try {
          this.$refs.registerPwd.focus();
        } catch (error) {}
        return;
      }
      if (this.user.passwordAgain.trim() != this.user.password.trim()) {
        this.$error(
          this.$vuetify.lang.t("$vuetify.loginPage.inValidConfirmPwd")
        );
        try {
          this.$refs.registerPwdAgain.focus();
        } catch (error) {}
        return;
      }
      try {
        // 验证用户是否存在
        let checkResult = await this.$store.dispatch(
          "bossMember/checkUserAccount",
          {
            accountId: this.user.email,
          }
        );
        if (checkResult.code == "200") {
          if (checkResult.data.checkResult == 1) {
            this.is_to_login = true;
            return;
          } else {
          }
        } else {
          this.$error(
            checkResult.message ||
              this.$vuetify.lang.t("$vuetify.message.email_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }

      try {
        // 验证验证码是否有效
        this.trans.password = "";
        this.trans.passwordAgain = "";
        let res = await this.$store.dispatch("bossMember/checkVerifyCode", {
          accountNumber: this.user.email,
          businessType: 1,
          ga_code:this.trans.ga_code,
          verifyCode: this.user.verifyCode,
        });
        if (res.code == "200") {
          this.registerParams = {
            acceptAgreement: 0,
            email: this.user.email,
            loginPassword: this.user.password,
            ga_code:this.trans.ga_code,
            userType: "C",
            verifyCode: this.user.verifyCode,
          };
          this.registerType = "register_finished";
        } else {
          this.$error(
            res.message || this.$vuetify.lang.t("$vuetify.message.code_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="stylus">
.ib-login-index {
  background-image:url('../../assets/images/login_bg.png');
  background-size:100% 100%;
  .v-card{
    background: rgba(255, 255,255, 0.1);
    backdrop-filter: saturate(90%) blur(6px);
    .title-mine{
      display:flex;
      justify-content: flex-start;
      width:100%;
      p{
        margin-bottom:0;
        display:flex;
        align-items:center;
        margin-right:8px;
        cursor:pointer;
        img{
          width:30px;
          height:30px;
          // transform:translateY(2px)
        }
      }
      .oper-title{
        text-align:left;
        width:100%;
        font-size:40px;
        color:#f8f8f8;
        margin-top:6px;
        margin-bottom:8px;
      }
      .small-size{
        font-size:36px;
      }
    }
    
    .v-item-group{
      background: rgba(0, 0, 0, 0);
    }
  }
  .op-item {
    cursor: pointer;
  }
}
</style>