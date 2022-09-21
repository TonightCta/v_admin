<template lang="pug">
v-app#ib-wallet(
  :class="[{ 'light-ib-wallet': currentTheme == 'light' }, { 'dark-ib-wallet': currentTheme == 'dark' }]",
  v-if="$store.state.not_china"
)
  v-overlay(
    :value="$store.state.bossMember.is_register_join",
    z-index="30",
    opacity="0.7"
  ) 
    .overlay_box
      .overlay_top_box
        .overlay_top_box_item
          p {{ $vuetify.lang.t('$vuetify.guide.box_1_title') }}
          p {{ $vuetify.lang.t('$vuetify.guide.box_1_info') }}
        .overlay_top_box_item
          p {{ $vuetify.lang.t('$vuetify.guide.box_2_title') }}
          p {{ $vuetify.lang.t('$vuetify.guide.box_2_info') }}
        .overlay_top_box_item
          p {{ $vuetify.lang.t('$vuetify.guide.box_3_title') }}
          p {{ $vuetify.lang.t('$vuetify.guide.box_3_info') }}
      v-btn(
        color="primary",
        x-large,
        @click="$store.dispatch('bossMember/changeRegisterJoin')",
        style="width: 256px; height: 64px; background: #4466ff; border-radius: 10px"
      )
        span {{ $vuetify.lang.t('$vuetify.guide.btn') }}
        v-icon(right, dark) mdi-chevron-right

  //- 左侧 Drawer 面板
  v-navigation-drawer.ib-custom-drawer(
    v-if="showDrawer",
    permanent,
    app,
    overflow,
    :width="currentLang.lang == 'zh_CN' || currentLang.lang == 'zh_TW' ? 255 : 340"
  )
    v-list-item.mt-4.mb-8.ib-logo
      v-img.mr-3(src="/logo.png", style="width: 116px")
      v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.title') }}
    v-list-item(
      link,
      v-ripple="false",
      to="/",
      :class="[{ 'current-page': currentPage == '/' }]"
    )
      v-list-item-avatar
        i.iconfont.icon-6.ali-icon
      v-list-item-title 概览
    //- 订单管理
    v-list-group(
      no-action,
      value="true",
      :class="[{ 'current-group': currentPage.startsWith('/order') }]"
    )
      template(v-slot:activator)
        v-list-item
          v-list-item-avatar
            i.iconfont.icon-2.ali-icon
          v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.orderManagement') }}

      v-list-item(
        link,
        v-ripple="false",
        to="/order/user_recharge",
        :class="[{ 'current-page': currentPage == '/order/user_recharge' }]"
      )
        v-list-item-avatar
          i.iconfont-mine.icon-bianzu1.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.userDepositOrder') }}
      v-list-item(
        link,
        v-ripple="false",
        to="/order/user_withdraw",
        :class="[{ 'current-page': currentPage == '/order/user_withdraw' }]"
      )
        v-list-item-avatar
          i.iconfont-mine.icon-a-xinzengshanghubeifen4.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.userWithdrawOrder') }}

      v-list-item(
        link,
        v-ripple="false",
        to="/order/merchant_recharge",
        :class="[{ 'current-page': currentPage == '/order/merchant_recharge' }]"
      )
        v-list-item-avatar
          i.iconfont-mine.icon-a-xinzengshanghubeifen41.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.merchantDepositOrder') }}
      v-list-item(
        link,
        v-ripple="false",
        to="/order/merchant_withdraw",
        :class="[{ 'current-page': currentPage == '/order/merchant_withdraw' }]"
      )
        v-list-item-avatar
          i.iconfont-mine.icon-a-xinzengshanghubeifen42.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.merchantWithdrawOrder') }}

    //- 资金管理
    v-list-group(
      no-action,
      value="true",
      :class="[{ 'current-group': currentPage.startsWith('/funding') }]"
    )
      template(v-slot:activator)
        v-list-item
          v-list-item-avatar
            i.iconfont.icon-3.ali-icon
          v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.manageFunding') }}

      v-list-item(
        link,
        v-ripple="false",
        to="/funding/merchant_recharge",
        :class="[{ 'current-page': currentPage == '/funding/merchant_recharge' }]"
      )
        v-list-item-avatar
          i.iconfont-mine.icon-a-xinzengshanghubeifen43.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.merchantDeposit') }}

      v-list-item(
        link,
        v-ripple="false",
        to="/funding/merchant_withdraw",
        :class="[{ 'current-page': currentPage == '/funding/merchant_withdraw' }]"
      )
        v-list-item-avatar
          i.iconfont-mine.icon-a-xinzengshanghubeifen44.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.merchantWithdraw') }}

      // /funding/merchant_addresses
      v-list-item(
        link,
        v-ripple="false",
        to="/funding/merchant_addresses",
        :class="[{ 'current-page': currentPage == '/funding/merchant_addresses' }]"
      )
        v-list-item-avatar
          i.iconfont-mine.icon-a-xinzengshanghubeifen45.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.addresses') }}

    //- 账户信息
    v-list-group(
      no-action,
      value="true",
      :class="[{ 'current-group': currentPage.startsWith('/account') }]"
    )
      template(v-slot:activator)
        v-list-item
          v-list-item-avatar
            i.iconfont.icon-1.ali-icon
          v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.manageAccount') }}
      v-list-item(
        v-if="isAdmin",
        link,
        v-ripple="false",
        to="/account/merchant_list",
        :class="[{ 'current-page': currentPage == '/account/merchant_list' }]"
      )
        v-list-item-avatar
          i.iconfont-mine.icon-a-xinzengshanghubeifen46.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.mine.商家列表') }}

      v-list-item(
        v-if="isAdmin",
        link,
        v-ripple="false",
        to="/account/merchant_coins",
        :class="[{ 'current-page': currentPage == '/account/merchant_coins' }]"
      )
        v-list-item-avatar
          i.iconfont-mine.icon-shangjia.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.mine.商家配置') }}

      v-list-item(
        link,
        v-ripple="false",
        to="/account/merchant",
        :class="[{ 'current-page': currentPage == '/account/merchant' }]"
      )
        v-list-item-avatar
          i.iconfont-mine.icon-a-xinzengshanghubeifen47.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.merchantInfo') }}

      v-list-item(
        link,
        v-ripple="false",
        to="/account/certification",
        :class="[{ 'current-page': currentPage == '/account/certification' }]",
        v-if="accountInfo.level == 0 && $store.state.page_show"
      )
        v-list-item-avatar
          i.iconfont.icon-11.ali-icon
        v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.merchantCertification') }}

  //- 顶部 APP 导航条
  v-app-bar.ib-bar(app, flat)
    v-app-bar-nav-icon(@click.stop="showDrawer = !showDrawer")
    v-spacer
    // v-tooltip(bottom)
    //   template(v-slot:activator="{ on, attrs }")
    //     .suspension(@click="jump", v-bind="attrs", v-on="on")
    //   span Telegram
    v-btn.mx-2.mine_btn(outlined, @click="$toDoc") {{ $vuetify.lang.t('$vuetify.defaultLayout.dev_doc') }}
    v-menu(offset-y)
      template(v-slot:activator="{ on, attrs }")
        v-btn.mr-2.mine_btn(text, v-bind="attrs", v-on="on") 
          img(:src="require('../assets/images/user_icon.png')")
          span {{ $vuetify.lang.t('$vuetify.defaultLayout.hello') }},{{ infoEmail }}
          v-icon(right, size="24") mdi-menu-down
      v-list.text-center
        v-list-item(@click="setPassNew = true;setType = 1;")
          v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.updateLoginPwd') }}
        v-list-item(@click="setPassNew = true;setType = 2;")
          v-list-item-title {{ $vuetify.lang.t('$vuetify.defaultLayout.updateTransPwd') }}
        v-list-item(@click="showLogout = true")
          v-list-item-title 
            img(:src="require('../assets/images/out_icon.png')")
            span {{ $vuetify.lang.t('$vuetify.defaultLayout.logout') }}

    //- language
    v-menu(offset-y)
      template(v-slot:activator="{ on, attrs }")
        v-btn.mr-2.mine_btn(text, v-bind="attrs", v-on="on") 
          img(:src="require('../assets/images/lang_icon.png')")
          span {{ currentLang.name }}
          v-icon(right, size="24") mdi-menu-down
      .d-flex
        v-list.text-center(
          min-width="150",
          style="border-right: 1px solid rgba(150, 150, 170, 0.2)"
        )
          v-list-item(
            v-for="l, i in allLangs",
            :key="'lang' + i",
            @click="currentLang = l",
            :class="[{ 'current-menu-item': currentLang.lang == l.lang }]"
          )
            v-list-item-title {{ l.name }}

    //- v-btn(
    //-   icon,
    //-   @click="changeTheme"
    //- ).mr-2
    //-   v-icon(v-if="currentTheme=='light'") mdi-weather-night
    //-   v-icon(v-else) mdi-white-balance-sunny

  //- 子页面内容
  v-main
    nuxt

  //- 底部 备案信息
  //- v-footer(inset,app,style="justify-content:center")
  //-   span.pa-2 Copyright © 2020 All Rights Reserved

  //- 修改登录密码弹窗
  v-dialog(
    v-model="showLoginPwd",
    max-width="550",
    persistent,
    no-click-animation,
    v-if="showLoginPwd"
  )
    v-card.pb-4
      v-card-title.headline.pr-2.pb-6 {{ $vuetify.lang.t('$vuetify.defaultLayout.updateLoginPwd') }}
        v-spacer
        v-btn(icon, @click="closeLoginPwd")
          v-icon mdi-close

      v-card-text.my-2.px-12
        v-text-field(
          v-model="user.oldpassword",
          :label="$vuetify.lang.t('$vuetify.loginPage.pwd')",
          :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterPwd')",
          type="password",
          ref="updateLoginPwd"
        )

      v-card-text.my-2.px-12
        v-text-field(
          v-model="user.password",
          :label="$vuetify.lang.t('$vuetify.lable.new_pasw')",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.new_pasw')",
          type="password",
          ref="updateLoginPwd",
          :rules="[rules.password]"
        ) 

      v-card-text.my-2.px-12
        v-text-field(
          v-model="user.passwordAgain",
          :label="$vuetify.lang.t('$vuetify.lable.new_pasw_again')",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.new_pasw_again')",
          type="password",
          ref="updateLoginPwdAgain",
          :rules="[rules.passwordAgain]"
        ) 
      v-card-text.my-2.px-12
        v-text-field(
          v-model="user.email_code",
          :label="$vuetify.lang.t('$vuetify.mine.邮箱验证码')",
          :placeholder="$vuetify.lang.t('$vuetify.mine.请输入邮箱验证码')",
          type="number"
        ) 
          template(slot="append")
            v-btn(
              small,
              rounded,
              outlined,
              style="margin-top: -6px",
              :disabled="disabledVerifyCode",
              @click="sendVerifyCode(1)"
            ) {{ sendingTime > 0 ? sendingTime + 's' : $vuetify.lang.t('$vuetify.loginPage.getVerifyCode') }}

      v-card-actions.pr-4
        v-spacer
        v-btn.mr-2(outlined, @click="closeLoginPwd") {{ $vuetify.lang.t('$vuetify.lable.cancel') }}

        v-btn.mr-2(
          outlined,
          color="primary",
          :loading="isUpdateLogining",
          :disabled="disabledUpdateLogin",
          @click="updateLoginPwd"
        ) {{ $vuetify.lang.t('$vuetify.lable.ok') }}
  //- 修改交易密码弹窗
  v-dialog(
    v-model="showTransPwd",
    max-width="580",
    persistent,
    no-click-animation,
    v-if="showTransPwd"
  )
    v-card.pb-4
      v-card-title.headline.pr-2.pb-6 {{ forgetCardTitle }}
        v-spacer
        v-btn(icon, @click="closeTransPwd")
          v-icon mdi-close

      v-card-text.my-2.px-12
        v-text-field(
          v-model="user.oldpassword",
          :label="$vuetify.lang.t('$vuetify.loginPage.pwd')",
          :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterPwd')",
          type="password",
          ref="updateLoginPwd"
        )

      v-card-text.my-2.px-12
        v-text-field(
          v-model="user.transPwd",
          :label="$vuetify.lang.t('$vuetify.lable.new_tran_pasw')",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.new_tran_pasw')",
          type="password",
          ref="updateTransPwd",
          :rules="[rules.transPwd]"
        ) 

      v-card-text.my-2.px-12
        v-text-field(
          v-model="user.transPwdAgain",
          :label="$vuetify.lang.t('$vuetify.lable.new_tran_pasw_again')",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.new_tran_pasw_again')",
          type="password",
          ref="updateTransPwdAgain",
          :rules="[rules.passwordAgain]"
        ) 
      v-card-text.my-2.px-12
        v-text-field(
          v-model="user.email_code",
          :label="$vuetify.lang.t('$vuetify.mine.邮箱验证码')",
          :placeholder="$vuetify.lang.t('$vuetify.mine.请输入邮箱验证码')",
          type="number"
        ) 
          template(slot="append")
            v-btn(
              small,
              rounded,
              outlined,
              style="margin-top: -6px",
              :disabled="disabledVerifyCode",
              @click="sendVerifyCode(2)"
            ) {{ sendingTime > 0 ? sendingTime + 's' : $vuetify.lang.t('$vuetify.loginPage.getVerifyCode') }}

      v-card-actions.pr-4
        v-spacer
        v-btn.mr-2(outlined, @click="closeTransPwd") {{ $vuetify.lang.t('$vuetify.lable.cancel') }}

        v-btn.mr-2(
          outlined,
          color="primary",
          :loading="isUpdateTransing",
          :disabled="disabledUpdateTrans",
          @click="updateTransPwd"
        ) {{ $vuetify.lang.t('$vuetify.lable.ok') }}

  //- 退出弹窗
  v-dialog(v-model="showLogout", max-width="400")
    v-card.pb-4
      v-card-title.headline {{ $vuetify.lang.t('$vuetify.lable.prompt') }}
      v-card-text.title.text-center {{ $vuetify.lang.t('$vuetify.lable.is_logout_info') }}
      v-card-actions
        v-spacer
        v-btn.mr-2(outlined, @click="showLogout = false") {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
        v-btn.mr-2(
          outlined,
          color="primary",
          :disabled="isLogoutting",
          :loading="isLogoutting",
          @click="logout"
        ) {{ $vuetify.lang.t('$vuetify.lable.ok') }}
  //- 设置密码
  <ResetPass v-model="setPassNew" :type="setType"/>
</template>

<script>
import lang from "~/plugins/locale";
import eVue from "~/plugins/eVue";
var _layout = null;

export default {
  data: () => {
    return {
      sendingTime: 0, //验证码倒计时
      currentLang: {
        lang: "en_US",
        name: "English",
      },
      allLangs: [],
      currentTheme: "light",
      allThemes: ["dark", "light"],
      forgetCardTitle: "",
      isLogoutting: false,
      isUpdateLogining: false,
      isUpdateTransing: false,
      showDrawer: true,
      showLogout: false,
      showLoginPwd: false,
      showTransPwd: false,
      user: {
        email: "",
        verifyCode: "",
        password: "",
        oldpassword: "",
        passwordAgain: "",
        transPwd: "",
        transPwdAgain: "",
        emailCode: "",
      },
      rules: {
        verifyCode: (value) => {
          const pattern = /^[a-zA-Z0-9]*$/;
          return (
            (pattern.test(value) && value.length > 0) ||
            _layout.$vuetify.lang.t("$vuetify.loginPage.inValidVerifyCode")
          );
        },
        transPwd: (value) => {
          // const pattern = /^[0-9]*$/;
          return (
            /*(pattern.test(value) && value.length == 6) ||*/
            value.length >= 6 ||
            _layout.$vuetify.lang.t("$vuetify.loginPage.inValidTransPwd")
          );
        },
        password: (value) => {
          const pattern =
            /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{8,20}$/;
          return (
            pattern.test(value) ||
            _layout.$vuetify.lang.t("$vuetify.loginPage.inValidPwd")
          );
        },
        passwordAgain: (value) => {
          const login = _layout.user.password == _layout.user.passwordAgain;
          const trans = _layout.user.transPwd == _layout.user.transPwdAgain;
          return (
            (login && trans) ||
            _layout.$vuetify.lang.t("$vuetify.loginPage.inValidConfirmPwd")
          );
        },
        email: (value) => {
          const pattern =
            /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          return (
            pattern.test(value) ||
            _layout.$vuetify.lang.t("$vuetify.loginPage.inValidEmail")
          );
        },
      },
      sendingTimer: null,
      sendingTime: 0,
      setPassNew:false,//设置密码
      setType:1,//设置密码类型
    };
  },
  watch: {
    currentLang() {
      this.currentLangChange();
    },
  },
  components:{
    ResetPass:(resolve) => require(['./components/reset_password'],resolve)
  },
  computed: {
    isAdmin() {
      return this.$store.state.bossAssetsCenter.merchantInfo.is_admin;
    },
    disabledVerifyCode() {
      return this.sendingTime > 0;
    },
    currentRate() {
      return this.$store.state.bossAssetsCenter.currentRate;
    },
    allFeeRates() {
      return this.$store.state.bossAssetsCenter.allRates || {};
    },
    disabledUpdateLogin() {
      return (
        this.rules.password(this.user.password) != true ||
        this.rules.passwordAgain() != true ||
        this.isUpdateLogining
      );
      return (
        this.rules.email(this.user.email) != true ||
        this.rules.verifyCode(this.user.verifyCode) != true ||
        this.rules.password(this.user.password) != true ||
        this.rules.passwordAgain() != true ||
        this.isUpdateLogining
      );
    },
    disabledUpdateTrans() {
      return (
        this.rules.transPwd(this.user.transPwd) != true ||
        this.rules.passwordAgain() != true ||
        this.isUpdateTransing
      );
      return (
        this.rules.email(this.user.email) != true ||
        this.rules.verifyCode(this.user.verifyCode) != true ||
        this.rules.transPwd(this.user.transPwd) != true ||
        this.rules.passwordAgain() != true ||
        this.isUpdateTransing
      );
    },
    currentPage() {
      return this.$route.path;
    },
    accountInfo() {
      return this.$store.state.bossMember.accountInfo || {};
    },
    infoEmail() {
      return (
        this.$store.state.bossAssetsCenter.merchantInfo.email?.substr(0, 5) +
        "..."
      );
    },
  },
  async created() {
    _layout = this;
    let _this = this;
    let b_lang = null;
    let langs = ["zh", "zh-CN", "zh-TW", "en"];
    this.loading();
    this.allLangs = lang.localeKeys;

    if (this.$route.query.lang) {
      b_lang = this.$route.query.lang;
      b_lang = b_lang === "zh" ? "zh-CN" : b_lang;
      b_lang = b_lang === "zh-HK" ? "zh-TW" : b_lang;
      b_lang = b_lang === "en" ? "en_US" : b_lang;
      b_lang = b_lang.replace("-", "_");
      this.$vuetify.lang.current = b_lang;
      sessionStorage.setItem("language", b_lang);
      sessionStorage.setItem(
        "languageName",
        this.allLangs.find(function (item) {
          return item.lang == b_lang;
        }).name
      );
    } else {
      if (
        window.sessionStorage.getItem("language") &&
        sessionStorage.getItem("language") != undefined &&
        sessionStorage.getItem("language") != "undefined"
      ) {
        this.$vuetify.lang.current = window.sessionStorage.getItem("language");
      } else {
        b_lang = langs.find(function (item) {
          return item == window.navigator.language;
        });
        if (b_lang == undefined) b_lang = "en_US";
        b_lang = b_lang === "zh" ? "zh-CN" : b_lang;
        b_lang = b_lang === "zh-HK" ? "zh-TW" : b_lang;
        b_lang = b_lang === "en" ? "en_US" : b_lang;
        b_lang = b_lang.replace("-", "_");
        this.$vuetify.lang.current = b_lang;
        sessionStorage.setItem("language", b_lang);
        sessionStorage.setItem(
          "languageName",
          this.allLangs.find(function (item) {
            return item.lang == b_lang;
          }).name
        );
      }
    }

    this.getLocalLang();
    this.getLocalRate();
    this.currentLangChange();
    eVue.$on("forgetTransPwd", (type) => {
      if (type == "unset") {
        this.forgetCardTitle = _layout.$vuetify.lang.t(
          "$vuetify.message.forgetCardTitle"
        );
      }
      _layout.showTransPwd = true;
    });
  },
  async mounted() {
    //await this.$store.dispatch('bossMember/queryUserInfo')
    await this.$nextTick();
    this.$store.dispatch("bossAssetsCenter/merchantAssetsInfo", {});
    this.user.email = this.$store.state.bossMember.user.email;
    this.forgetCardTitle = this.$vuetify.lang.t(
      "$vuetify.defaultLayout.updateTransPwd"
    );
  },
  methods: {
    async loading() {
      this.$store.dispatch("isChina");
      // await axios.get(
      //     "https://api.tianapi.com/txapi/ipquery/index?key=b551c6b2223fc07578aaf3cbaaa8861b"
      //   ).then((res) => {
      //     let data = res.data.newslist[0];
      //     if (
      //       data.country == "中国" &&
      //       data.province != "香港特别行政区" &&
      //       data.province != "澳门特别行政区" &&
      //       data.province != "台湾"
      //     ) {
      //       this.open()
      //     }else{
      //       this.$store.dispatch('isChina')
      //     }
      //   });
    },
    open() {
      this.$alert(
        "根据相关政策暂不支持阁下所在地区(中国大陆)，如果您不在该地区请清除浏览器缓存再试试。",
        "ERROR 403 FORBIDDEN:",
        {
          showClose: false,
          showConfirmButton: false,
        }
      );
    },
    getLocalRate() {
      let rate = window.sessionStorage.getItem("currentRate");
      if (rate) {
        this.changeCurrentRate(rate);
      }
    },
    changeCurrentRate(rate) {
      window.sessionStorage.setItem("currentRate", rate);
      this.$store.dispatch("bossAssetsCenter/changeCurrentRate", rate);
    },
    getLocalLang() {
      let lang = window.sessionStorage.getItem("language");
      if (lang) {
        this.currentLang.lang = lang;
        this.currentLang.name = window.sessionStorage.getItem("languageName");
      }
    },
    closeLoginPwd() {
      this.showLoginPwd = false;
      this.user = {
        email: (this.user.email = this.$store.state.bossMember.user.email),
        verifyCode: "",
        password: "",
        passwordAgain: "",
        transPwd: "",
        transPwdAgain: "",
      };
    },
    closeTransPwd() {
      this.showTransPwd = false;
      this.user = {
        email: (this.user.email = this.$store.state.bossMember.user.email),
        verifyCode: "",
        password: "",
        passwordAgain: "",
        transPwd: "",
        transPwdAgain: "",
      };
    },
    async currentLangChange() {
      window.sessionStorage.setItem("language", this.currentLang.lang);
      window.sessionStorage.setItem("languageName", this.currentLang.name);
      this.showDrawer = false;
      await this.$nextTick();
      this.$vuetify.lang.current = this.currentLang.lang;
      await this.$nextTick();
      this.showDrawer = true;
    },
    changeTheme() {
      this.currentTheme = this.currentTheme == "dark" ? "light" : "dark";
      this.$vuetify.theme.dark = this.currentTheme == "dark";
    },
    async logout() {
      this.$store.dispatch("openCertificationPage");
      this.$store.dispatch("bossMember/logout");
      window.sessionStorage.clear();
      this.$router.push("/login");
      return;
      this.isLogoutting = true;
      try {
        let res = await this.$store.dispatch("bossMember/logout");
        if (res.code == "200") {
          this.$router.push("/login");
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.logout_failed")
          );
        }
      } catch (error) {
        this.$error(this.$vuetify.lang.t("$vuetify.message.logout_exception"));
      }
      this.isLogoutting = false;
      this.showLogout = false;
    },
    async updateLoginPwd() {
      /*if (this.rules.email(this.user.email) != true) {
        this.$error(this.$vuetify.lang.t('$vuetify.loginPage.inValidEmail'))
        try {
          this.$refs.updateLoginEmail.focus()
        } catch (error) {}
        return
      }
      
      if (this.user.verifyCode.trim() == "") {
        this.$error(this.$vuetify.lang.t('$vuetify.message.code_not_null'))
        try {
          this.$refs.updateLoginVerifyCode.focus()
        } catch (error) {}
        return
      }*/
      if (this.user.password.trim() == "") {
        this.$error(this.$vuetify.lang.t("$vuetify.message.pasw_not_null"));
        try {
          this.$refs.updateLoginPwd.focus();
        } catch (error) {}
        return;
      }
      if (this.user.passwordAgain.trim() != this.user.password.trim()) {
        this.$error(
          this.$vuetify.lang.t("$vuetify.loginPage.inValidConfirmPwd")
        );
        try {
          this.$refs.updateLoginPwdAgain.focus();
        } catch (error) {}
        return;
      }
      this.isUpdateLogining = true;
      try {
        let res = await this.$store.dispatch("bossMember/updatePwd", {
          accountNumber: this.user.email,
          code: this.user.email_code,
          accountType: 1,
          businessType: 3,
          oldpassword: this.user.oldpassword,
          password: this.user.password,
          passwordType: 0,
          verifyCode: this.user.verifyCode,
        });
        if (res.code === 200) {
          this.$success(
            this.$vuetify.lang.t("$vuetify.message.edit_pasw_success")
          );
          this.showLoginPwd = false;
          setTimeout(() => {
            window.sessionStorage.clear();
            window.location.href = "/login";
          }, 1000);
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.edit_pasw_failed")
          );
        }
      } catch (error) {
        this.$error(
          this.$vuetify.lang.t("$vuetify.message.edit_pasw_exception")
        );
      }
      this.isUpdateLogining = false;
    },
    async updateTransPwd() {
      /*if (this.rules.email(this.user.email) != true) {
        this.$error(this.$vuetify.lang.t('$vuetify.loginPage.inValidEmail'))
        try {
          this.$refs.updateTransEmail.focus()
        } catch (error) {}
        return
      }
      if (this.user.verifyCode.trim() == "") {
        this.$error(this.$vuetify.lang.t('$vuetify.message.code_not_null'))
        try {
          this.$refs.updateTransVerifyCode.focus()
        } catch (error) {}
        return
      }*/
      if (this.user.transPwd.trim() == "") {
        this.$error(this.$vuetify.lang.t("$vuetify.message.pasw_not_null"));
        try {
          this.$refs.updateTransPwd.focus();
        } catch (error) {}
        return;
      }
      if (this.user.transPwdAgain.trim() != this.user.transPwd.trim()) {
        this.$error(
          this.$vuetify.lang.t("$vuetify.loginPage.inValidConfirmPwd")
        );
        try {
          this.$refs.updateTransPwdAgain.focus();
        } catch (error) {}
        return;
      }
      this.isUpdateTransing = true;
      try {
        let res = await this.$store.dispatch("bossMember/updatePwd", {
          accountNumber: this.user.email,
          accountType: 1,
          code: this.user.email_code,
          businessType: 3,
          oldpassword: this.user.oldpassword,
          password: this.user.transPwd,
          passwordType: 1,
          verifyCode: this.user.verifyCode,
        });
        if (res.code === 200) {
          this.$success(
            this.$vuetify.lang.t("$vuetify.message.edit_tran_success")
          );
          this.showTransPwd = false;
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.edit_tran_failed")
          );
        }
      } catch (error) {
        this.$error(
          this.$vuetify.lang.t("$vuetify.message.edit_tran_exception")
        );
      }
      this.isUpdateTransing = false;
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
          scene: type,
        });
        if (res.code == "200") {
          // this.$success('success')
          // this.sendingTime = 60;
          // clearTimeout(this.sendingTimer)
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.send_code_failed")
          );
          this.sendingTime = 0;
          clearTimeout(this.sendingTimer);
        }
      } catch (error) {
        this.$error(
          this.$vuetify.lang.t("$vuetify.message.send_code_exception")
        );
        this.sendingTime = 0;
        clearTimeout(this.sendingTimer);
      }
    },
    jump() {
      window.open("https://t.me/joinchat/SkgBCB0S81hy8vlgoeGz0Q", "_blank");
    },
  },
};
</script>

<style lang="stylus">
.mine_btn {
  background: #F8F8F8;
  border: 0;

  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
}

#ib-wallet {
  .text-center {
    img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
      transform: translateY(2px);
    }
  }

  // .v-menu__content {
  // max-height: calc(100vh - 24px) !important;
  // }
  .overlay_box {
    display: flex;
    flex-direction: column;
    align-items: center;

    .overlay_top_box {
      display: flex;

      .overlay_top_box_item {
        width: 310px;
        height: 150px;
        background: #5E76E8;
        border-radius: 10px;
        margin-bottom: 30px;
        margin-right: 15px;
        background-repeat: no-repeat;
        background-size: 100%;

        p {
          width: 270px;
          height: 41px;
          font-family: PingFang TC;
          color: #FFFFFF;

          &:nth-child(1) {
            font-weight: 500;
            font-size: 28px;
            margin: 12px 0 0 85px;
          }

          &:nth-child(2) {
            margin: 20px 0 0 33px;
            font-weight: 300;
            font-size: 15px;
          }
        }

        &:nth-child(1) {
          background-image: url('/tip_1_bg.png');
        }

        &:nth-child(2) {
          background-image: url('/tip_2_bg.png');
        }

        &:nth-child(3) {
          background-image: url('/tip_3_bg.png');
        }
      }
    }
  }

  .suspension {
    width: 32px;
    height: 32.5px;
    margin-right: 16px;
    background-image: url('/telegram@2x.png');
    background-repeat: no-repeat;
    background-size: 100%;
    cursor: pointer;
  }

  .v-list-group > .v-list-item {
    padding-left: 0;
  }

  .v-list-group > .v-list-group__items > .v-list-item {
    padding-left: 56px;
  }

  .ib-custom-drawer {
    background: linear-gradient(180deg, #1A203A, #0C1222) !important;

    .ib-logo {
      cursor: default;

      .v-list-item__title {
        padding-top: 3px;
        font-size: 18px !important;
      }

      &:hover {
        i, .v-list-item__title {
          color: #fff !important;
        }
      }
    }

    .v-list-item {
      &::before {
        opacity: 0;
      }

      &:hover {
        .v-list-item__title {
          color: #fff !important;
        }

        i {
          color: #fff !important;
        }
      }

      .v-list-item__avatar, .v-list-item__icon {
        margin-right: 5px;

        i {
          color: #A9AFC1;
          font-size: 18px;
        }
      }

      .v-list-item__title {
        color: #A9AFC1;
        font-size: 14px;
      }
    }

    .current-group {
      background: #222A48;

      .v-list-group__header {
        // background: #343C60;
      }
    }

    .current-page {
      background: #343C60;

      &::before {
        right: unset;
        width: 3px;
        background: #7480FF;
        opacity: 1;
      }

      .v-list-item__title {
        color: #fff;
      }

      i {
        color: #fff !important;
      }
    }

    .v-navigation-drawer__content {
      &>.v-list-item, .v-list-group__header {
        .v-list-item__title {
          color: #fff !important;
        }

        i {
          color: #fff !important;
        }
      }

      &::-webkit-scrollbar {
        width: 10px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0);
      }

      &::-webkit-scrollbar-thumb {
        background: #364794;
        border-radius: 5px;
      }
    }
  }
}

.current-menu-item::before {
  opacity: 0.12;
  background: rgba(24, 103, 205, 1);
}
</style>