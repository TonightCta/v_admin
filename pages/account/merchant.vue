<template lang="pug">
.merchant-info.pa-6
  v-card-title {{ $vuetify.lang.t('$vuetify.merchantInfo.merchantInfo') }}
  v-divider
  .info-content
    //- 绑定谷歌验证器
    .google-setting.info-public(v-if="$store.state.bossAssetsCenter.merchantInfo.ga == 0") <GoogleAuth/>
    //- 对接资料
    .ma-info.info-public 
      .title.mb-4 {{ $vuetify.lang.t('$vuetify.lable.docking_information') }}
        span(
          @click="$toDoc",
          style="cursor: pointer; font-size: 15px; margin-left: 15px; color: #4266ff"
        ) {{ $vuetify.lang.t('$vuetify.defaultLayout.dev_doc') }}
      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.merchantSdkId') }}：
        span {{ merchant.enterpriseManagerId }}
      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.lable.gateway_server') }}：
        span {{ gateway }}
      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label API KEY：
        v-dialog(v-model="dialog", persistent, max-width="600")
          template(v-slot:activator="{ on, attrs }")
            v-btn(color="primary", small, dark, v-bind="attrs",depressed, v-on="on") {{ $vuetify.lang.t('$vuetify.lable.click_to_get') }}
          v-card
            v-card-title {{ $vuetify.lang.t('$vuetify.lable.get') }}API KEY
            v-text-field(
              v-if="dialog == true",
              disabled,
              readonly,
              hide-details,
              :label="$formatEmail(merchant.email)",
              style="width: 550px; margin: 0 0 20px 20px"
            )
            v-text-field(
              v-if="dialog == true",
              key="register-verifycode",
              v-model="password",
              type="password",
              :label="$vuetify.lang.t('$vuetify.loginPage.pwd')",
              :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterPwd')",
              :rules="[rules.verifyCode]",
              style="width: 550px; margin-left: 20px"
            )
              template(slot="append")

            v-card-actions.d-flex.flex-row-reverse
              v-btn(
                color="primary",
                depressed,
                dark,
                :loading="submit_loading",
                @click="submit",
                style="margin-left: 10px"
              ) {{ $vuetify.lang.t('$vuetify.lable.get') }}
              v-btn(
                outlined,
                color="indigo",
                text,
                @click="dialog = false; code = ''"
              ) {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
        v-dialog(
          v-model="is_return_key",
          max-width="600",
          v-if="is_return_key",
          persistent
        )
          v-card
            v-card-title {{ $vuetify.lang.t('$vuetify.lable.verified_successfully') }}
            v-card-text.subtitle-1 {{ $vuetify.lang.t('$vuetify.lable.close_tip') }}
            input#api_key(
              :value="api_key",
              style="outline: none; color: rgba(0, 0, 0, 0.6); margin: 0 24px; background-color: #eee; padding-left: 20px"
            )
            v-btn(
              small,
              rounded,
              depressed,
              outlined,
              style="margin-top: -3px",
              color="primary",
              @click="copyKey"
            ) {{ $vuetify.lang.t('$vuetify.lable.copy') }} API KEY
            v-card-text.text-center.py-4
              v-btn(
                depressed,
                color="primary",
                @click="(is_return_key = false), (code = '')"
              ) {{ $vuetify.lang.t('$vuetify.lable.cancel') }}

      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.lable.call_back_address') }}：
        span(v-if="call_back_ip_status", style="margin-right: 20px") {{ lock_call_back_ip }}
        v-dialog(v-model="call_back_dialog", persistent, max-width="600")
          template(v-slot:activator="{ on, attrs }")
            v-btn(
              v-if="!call_back_ip_status",
              color="primary",
              small,
                depressed,
              dark,
              v-bind="attrs",
              v-on="on"
            ) {{ $vuetify.lang.t('$vuetify.lable.set') }}
            v-btn(
              v-else,
              color="primary",
              small,
                depressed,
              dark,
              v-bind="attrs",
              v-on="on"
            ) {{ $vuetify.lang.t('$vuetify.lable.edit') }}
          v-card
            v-card-title {{ !call_back_ip_status ? $vuetify.lang.t('$vuetify.lable.set_call_back_ip') : $vuetify.lang.t('$vuetify.lable.edit_call_back_ip') }}
            v-text-field(
              v-if="call_back_dialog == true",
              disabled,
              readonly,
              hide-details,
              :label="$formatEmail(merchant.email)",
              style="width: 550px; margin: 0 0 20px 20px"
            )
            v-text-field(
              v-if="call_back_dialog == true",
              key="set_call_back_ip-verifycode",
              v-model="password",
              type="password",
              :label="$vuetify.lang.t('$vuetify.loginPage.pwd')",
              :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterPwd')",
              :rules="[rules.verifyCode]",
              style="width: 550px; margin-left: 20px"
            )
              template(slot="append")

            v-text-field(
              v-if="call_back_dialog == true",
              v-model="call_back_ip",
              :label="$vuetify.lang.t('$vuetify.lable.call_back_address')",
              :placeholder="$vuetify.lang.t('$vuetify.placeholder.call_back_address')",
              :rules="[rules.verifyCallBackIp]",
              style="width: 550px; margin: 0 0 20px 20px"
            )
            v-card-actions.d-flex.flex-row-reverse
              v-btn(
                color="primary",
                dark,
                :loading="submit_loading",
                depressed,
                @click="submit",
                style="margin-left: 10px"
              ) {{ $vuetify.lang.t('$vuetify.lable.submit') }}
              v-btn(
                outlined,
                depressed,
                color="indigo",
                text,
                @click="call_back_dialog = false; code = ''; call_back_ip = ''"
              ) {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.mine.白名单') }}：
        span(v-if="white_ip", style="margin-right: 20px") {{ white_ip.join(',') }}
        v-dialog(v-model="setWhiteIP", persistent, max-width="600")
          template(v-slot:activator="{ on, attrs }")
            v-btn(
              v-if="!white_ip",
              color="primary",
              small,
              dark,
                depressed,
              v-bind="attrs",
              v-on="on"
            ) {{ $vuetify.lang.t('$vuetify.lable.set') }}
            v-btn(
              v-else,
              color="primary",
              small,
              dark,
                depressed,
              v-bind="attrs",
              v-on="on"
            ) {{ $vuetify.lang.t('$vuetify.lable.edit') }}
          v-card 
            v-card-title(style="margin-bottom: 16px") {{ $vuetify.lang.t('$vuetify.mine.设置白名单地址') }}
            v-text-field(
              :label="$vuetify.lang.t('$vuetify.mine.登录密码')",
              type="password",
              v-model="enterPass",
              :placeholder="$vuetify.lang.t('$vuetify.mine.请输入登录密码')",
              style="width: 550px; margin: 0 0 20px 20px"
            )
            v-text-field(
              :label="$vuetify.lang.t('$vuetify.mine.白名单IP')",
              v-model="whiteIP",
              :placeholder="$vuetify.lang.t('$vuetify.mine.请输入白名单地址(多个IP地址请使用,隔开)')",
              style="width: 550px; margin: 0 0 20px 20px"
            )
            v-card-actions.d-flex.flex-row-reverse
              v-btn(
                color="primary",
                dark,
                @click="submitIP",
                :loading="loadWhiteIP",
                depressed,
                style="margin-left: 10px"
              ) {{ $vuetify.lang.t('$vuetify.lable.submit') }}
              v-btn(
                outlined,
                color="indigo",
                depressed,
                text,
                @click="setWhiteIP = false"
              ) {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
    //- 基本资料
    .info-public 
      .title.mb-4(v-if="merchant.level > 0") {{ $vuetify.lang.t('$vuetify.merchantInfo.basicInfo') }}
      //- .subtitle-1.px-6.py-2.cer-item
      //-   .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.merchantId') }}：
      //-   span {{ merchant.userId }}

      .subtitle-1.px-6.py-3.cer-item(v-if="merchant.level > 0")
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.merchantName') }}：
        span {{ merchant.merchantName }}
      .subtitle-1.px-6.py-3.cer-item(v-if="merchant.level > 0")
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.contact') }}：
        span {{ merchant.contactName }}
      .subtitle-1.px-6.py-3.cer-item(v-if="merchant.level > 0")
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.telephone') }}：
        span {{ merchant.phone }}
      .subtitle-1.px-6.py-3.cer-item(v-if="merchant.level > 0")
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.lable.merchant_email') }}：
        span {{ $formatEmail(merchant.email) }}
      .subtitle-1.px-6.py-3.cer-item(v-if="merchant.level > 0")
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.lable.url_name') }}：
        span {{ merchant.merchantWebsiteUrl }}
      .subtitle-1.px-6.py-3.cer-item(v-if="merchant.level > 0")
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.lable.business_introduction') }}：
        span {{ merchant.merchantDesc }}
    //- 企业认证
    .info-public(v-if="merchant.level > 0")
      .title.mb-4 {{ $vuetify.lang.t('$vuetify.merchantInfo.companyCertification') }}
      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.companyCountry') }}：
        span {{ merchant.country }}
      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.companyName') }}：
        span {{ merchant.companyName }}
      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.companyLicenseNumber') }}：
        span {{ merchant.companyRegistrationNumber }}
      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.registerDate') }}：
        span {{ merchant.companyRegistTime }}
      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.operatingAddress') }}：
        span {{ merchant.companyAddress }}
      .subtitle-1.px-6.py-3.cer-item
        .mr-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.companyLicensePic') }}：
        v-img(:src="merchant.companyBusinessLicensePic", max-width="150")
</template>
    
<script>
import { Message } from "element-ui";
var that = null;
export default {
  data: () => {
    return {
      setWhiteIP: false, //设置白名单
      whiteIP: null, //白名单设置字段
      white_ip: null, //白名单IP回执
      enterPass: null, //登录密码
      loadWhiteIP: false,
      dialog: false,
      call_back_dialog: false,
      is_return_key: false,
      submit_loading: false,
      gateway: "",
      is_open_call_back_dialog: false,
      call_back_ip_status: null,
      lock_call_back_ip: "",
      call_back_ip: "",
      sendingTimer: null,
      sendingTime: 0,
      api_key: "",
      code: "",
      password: "",
      rules: {
        verifyCode: (value) => {
          const pattern = /^[a-zA-Z0-9]*$/;
          return (
            /*(pattern.test(value) && */ value.length >= 8 ||
            that.$vuetify.lang.t("$vuetify.loginPage.enterPwd")
          );
        },
        verifyCallBackIp: (value) => {
          const pattern = /^((https|http)?:\/\/)[\S]{1,}/;
          if (!pattern.test(value)) {
            return that.$vuetify.lang.t("$vuetify.message.invalid_url");
          } else {
            return true;
          }
        },
        verifyResendAsset: (value) => {
          if (!!!value) {
            return that.$vuetify.lang.t(
              "$vuetify.message.currency_name_not_null"
            );
          } else {
            return true;
          }
        },
      },
      merchant: {},
    };
  },
  components: {
    GoogleAuth: (resolve) => require(["./components/google_auth"], resolve),
  },
  watch: {
    setWhiteIP(val) {
      !val && ((this.whiteIP = null), (this.enterPass = null));
    },
  },
  created() {
    that = this;
  },
  mounted() {
    this.queryMerchantVerifyInfo();
    // this.getCallBackStatus();
    this.getGatewayList();
  },
  computed: {
    disabledVerifyCode() {
      return this.sendingTime > 0;
    },
  },
  methods: {
    //设置白名单IP
    async submitIP() {
      if (!this.enterPass) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.请输入登录密码"));
        return;
      }
      if (!this.whiteIP) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.请输入IP地址"));
        return;
      }
      this.loadWhiteIP = true;
      const params = {
        password: this.enterPass,
        ip: this.whiteIP,
      };
      const result = await this.$store.dispatch(
        "bossAssetsCenter/setWhiteIP",
        params
      );
      this.loadWhiteIP = false;
      const { code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success(this.$vuetify.lang.t("$vuetify.mine.设置成功"));
      this.queryMerchantVerifyInfo();
      this.setWhiteIP = false;
    },
    async getGatewayList() {
      let res = await this.$store.dispatch("addressCenter/gatewayList", {});
      if (res.code === 200) {
        this.gateway = res.data.gatewayList[0].url;
      } else {
        this.$error(res.message);
      }
    },
    async getCallBackStatus() {
      let res = await this.$store.dispatch("bossMember/queryCallBackIp", {
        enterpriseManagerId: this.merchant.enterpriseManagerId,
      });
      if (res.code === 200) {
        this.call_back_ip_status = !!res.data.ip;
        this.call_back_ip = !!res.data.ip ? res.data.ip : "";
        this.lock_call_back_ip = !!res.data.ip ? res.data.ip : "";
      } else {
        this.$error(res.message);
      }
    },
    copyKey() {
      let ele = document.getElementById("api_key");
      ele.focus();
      ele.select();
      this.$setClip(this.api_key);
      this.$success("success");
    },
    async submit() {
      if (this.rules.verifyCode(this.password) !== true) {
        this.$error(this.$vuetify.lang.t("$vuetify.loginPage.enterPwd"));
        return false;
      }
      if (
        this.call_back_dialog &&
        this.rules.verifyCallBackIp(this.call_back_ip) != true &&
        this.call_back_ip == ""
      ) {
        this.$error(
          this.$vuetify.lang.t("$vuetify.message.call_back_address_not_null")
        );
        return false;
      } else if (
        this.call_back_dialog &&
        this.rules.verifyCallBackIp(this.call_back_ip) != true
      ) {
        this.$error(this.$vuetify.lang.t("$vuetify.message.invalid_url"));
        return false;
      }
      try {
        this.submit_loading = true;
        if (this.dialog) {
          let res = await this.$store.dispatch("bossMember/queryUserApiKey", {
            accountNumber: this.merchant.email,
            enterpriseManagerId: this.merchant.enterpriseManagerId,
            userId: this.merchant.userId,
            verifyCode: this.code,
            password: this.password,
          });
          if (res.code === 200) {
            this.api_key = res.data.apiKey;
            this.is_return_key = true;
            this.dialog = false;
            this.sendingTime = 0;
            clearTimeout(this.sendingTimer);
          } else {
            this.$error(res.message);
          }
        } else if (this.call_back_dialog) {
          let ress = await this.$store.dispatch("bossMember/setCallBackIp", {
            accountNumber: this.merchant.email,
            enterpriseManagerId: this.merchant.enterpriseManagerId,
            userId: this.merchant.userId,
            verifyCode: this.code,
            password: this.password,
            ip: this.call_back_ip,
          });
          if (ress.code === 200) {
            this.queryMerchantVerifyInfo();
            this.call_back_dialog = false;
            this.sendingTime = 0;
            clearTimeout(this.sendingTimer);
          } else {
            this.$error(ress.message);
          }
        }

        this.submit_loading = false;
      } catch (err) {
        this.submit_loading = false;
      }
    },
    async queryMerchantVerifyInfo() {
      try {
        let res = await this.$store.dispatch(
          "bossMember/queryMerchantVerifyInfo",
          {}
        );
        if (res.code === 200) {
          this.merchant = res.data || {};
          if (res.data.level > 0) {
            this.$store.dispatch("closeCertificationPage");
          }
          this.call_back_ip_status = !!res.data.notify_url;
          this.call_back_ip = !!res.data.notify_url ? res.data.notify_url : "";
          this.lock_call_back_ip = !!res.data.notify_url
            ? res.data.notify_url
            : "";
          this.white_ip = !!res.data.ip_list ? res.data.ip_list : null;
        } else {
          this.$error(res.message);
        }
      } catch (error) {}
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
      try {
        this.sendingTime = 60;
        this.startSendingTime();
        let res = await this.$store.dispatch("bossMember/sendVerifyCode", {
          accountNumber: this.merchant.email,
          accountType: 1,
          businessType: 3,
        });
        if (res.code === 200) {
          // this.$success('success')
          // this.sendingTime = 60;
          // this.startSendingTime();
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.send_code_failed")
          );
          this.sendingTime = 0;
          clearTimeout(this.sendingTimer);
        }
      } catch (error) {
        this.sendingTime = 0;
        clearTimeout(this.sendingTimer);
      }
    },
  },
};
</script>

<style lang="stylus">
.merchant-info {
  display: flex;
  flex-direction: column;
  flex-wrap:wrap;
  min-height: 100%;
  background-color: #F5F5FC;
  .v-card__title::before{
    content:'';
    width:3px;
    height:14px;
    background:#304888;
    margin-right:8px;
  }
  .info-content {
    display: flex;
    margin-top: 18px;
    flex-wrap: wrap;
    justify-content: space-between;
    .info-public {
      width: 49%;
      padding: 20px;
      background: white;
      border-radius: 4px;
      margin-bottom: 24px;
      min-width:914px;
      .subtitle-1 {
        justify-content: space-between;
        button{
          span{
            color:white;
          }
        }
        span {
          color: #666;
        }
      }
    }
  }

  .cer-item {
    display: flex;
    align-items: flex-start;

    .info-label {
      min-width: 130px;
    }

    .tip {
      font-size: 12px;
      color: #b5b0b0;
    }
  }

  .mine-info {
    display: flex;
    margin-top: 80px;

    .info-right {
      margin-left: 150px;
    }
  }
}
</style>