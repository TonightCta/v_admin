<template lang="pug">
.merchant-withdraw.pa-6
  v-card.acrd-mine(style="flex-grow: 1")
    v-card-title(style="margin-left: -48px")
      a.title {{ $vuetify.lang.t('$vuetify.defaultLayout.merchantWithdraw') }}
      .wring-read 到账时间说明：1-5分钟，快慢取决于链上区块拥堵情况
    v-divider(style="margin-left: -48px")
    //- v-card-text.d-flex.clo-flex
    //-   .subtitle-1.card-label {{ $vuetify.lang.t('$vuetify.lable.select_account') }}：
    //-   v-btn-toggle.d-flex.align-center.flex-wrap(
    //-     v-model="currentCoin",
    //-     tile,
    //-     color="primary",
    //-     @change="currentCoinChange",
    //-     group,
    //-     mandatory
    //-   )
    //-     v-btn.coin-btn.mr-4.my-0(
    //-       v-for="coin, i in allCoins",
    //-       :key="'withdraw' + i",
    //-       :value="coin"
    //-     ) {{ coin.asset }}
    .select-coin 
      p.select-coin-title 选择提币账户
      .el-select-mine 
        el-radio-group.mine-radio(
          v-model="defaultCoin",
          @change="currentCoinChange"
        )
          el-radio(v-for="coin, i in allCoins", :label="coin.asset", border)
    v-card-text.d-flex.pb-4.clo-flex(v-if="showInpAddress")
      .subtitle-1.card-label {{ $vuetify.lang.t('$vuetify.table.address') }}：
      //- v-autocomplete(
      //-   v-model="currentAddr.address",
      //-   :items="calcAddress",
      //-   :loading="addrLoading",
      //-   :disabled="!currentCoin.asset",
      //-   dense,
      //-   outlined,
      //-   hide-no-data,
      //-   hide-details,
      //-   allow-overflow,
      //-   ref="coinAddress",
      //-   style="width: 500px",
      //-   :placeholder="$vuetify.lang.t('$vuetify.placeholder.address')",
      //-   item-text="address",
      //-   item-value="address",
      //-   :class="[{ 'check-success': completeComponent.checkResult == 'success' }, { 'check-error': completeComponent.checkResult == 'error' }]",
      //-   @focus="addrFocus",
      //-   @update:search-input="currentAddrChange",
      //-   @blur="checkAddress"
      //- )
      //-   template(v-slot:append)
        //v-icon(
        //  @click="$router.push('/funding/merchant_withdraw_address')"
        // ) mdi-account-box-outline
      v-text-field(
        v-model="currentAddr.address",
        style="width: 560px",
        :placeholder="$vuetify.lang.t('$vuetify.placeholder.address')",
        outlined,
        dense,
        hide-details,
        :disabled="!currentCoin.asset"
      )

    v-card-text.d-flex.pt-0.clo-flex(v-if="showInpAddress")
      .card-label
      .red--text.text--accent-2(v-if="completeComponent.error") {{ completeComponent.errorMessages }}
      .text--disabled(v-else) {{ completeComponent.hint }}

    v-card-text.d-flex.pb-2.clo-flex(
      v-if="currentCoin.asset == 'XRP' || currentCoin.asset == 'EOS'"
    )
      .subtitle-1.card-label {{ $vuetify.lang.t('$vuetify.table.tag') }}：
      v-text-field(
        v-model="currentAddr.note",
        style="max-width: 360px",
        :placeholder="$vuetify.lang.t('$vuetify.placeholder.tag')",
        outlined,
        dense,
        hide-details,
        :disabled="currentAddr.hasTag"
      )

    v-card-text.d-flex.pt-0.clo-flex(
      v-if="currentCoin.asset == 'XRP' || currentCoin.asset == 'EOS'"
    )
      .card-label
      v-checkbox.mt-0.pt-0(
        v-model="currentAddr.hasTag",
        :label="$vuetify.lang.t('$vuetify.lable.not_tag')",
        hide-details,
        small
      )

    v-card-text.d-flex.pb-2.clo-flex
      .subtitle-1.card-label {{ $vuetify.lang.t('$vuetify.lable.number_of_withdrawals') }}：
      v-text-field.withdraw-num-btn(
        v-model="withdrawNum",
        style="width: 560px",
        placeholder="0.00",
        outlined,
        dense,
        type="number",
        :rules="[rules.verifyAmoumt]",
        :disabled="!currentCoin.asset"
      )
        template(v-slot:append)
          a.text-caption(@click="allWithdraw") {{ $vuetify.lang.t('$vuetify.table.all') }}

    //- v-card-text.d-flex.align-center.pt-0(v-if="false")
    //-   .card-label
    //-   .text--disabled {{ $vuetify.lang.t('$vuetify.lable.available') }} {{ $toNumberStr(currentCoin.avaliableBalance, 8) }}

    //- v-card-text.d-flex.align-center.pt-0 
    //-   .card-label
    //-   .text--disabled {{ $vuetify.lang.t('$vuetify.mine.总余额') }} {{ $toNumberStr(currentCoin.avaliableBalance,8) }}
    //- v-card-text.per-card-item
    //-         span.subtitle-1.font-weight-bold.mr-4.card-label 可代付手续费额度：
    //-         span.mx-2.red--text {{ currentCoin.mchFeeAvailable }}

    //- v-card-text.d-flex.align-center.pt-0 
    //-   .card-label
    //-   .text--disabled {{ $vuetify.lang.t('$vuetify.mine.可代付') }} {{ $toNumberStr(currentCoin.mchAvailable, 8) }}
    //- v-card-text.d-flex.align-center.pt-0 
    //-   .card-label
    //-   .text--disabled {{ $vuetify.lang.t('$vuetify.mine.可代付手续费额度') }}： {{ $toNumberStr(currentCoin.mchFeeAvailable, 8) }}

    //- v-card-text.d-flex.align-center.pt-0 
    //-   .card-label
    //-   .text--disabled {{ $vuetify.lang.t('$vuetify.mine.可提现') }} {{ $toNumberStr(currentCoin.userAvailable, 8) }}
    //- v-card-text.d-flex.align-center.pt-0 
    //-   .card-label
    //-   .text--disabled {{ $vuetify.lang.t('$vuetify.mine.可提现手续费额度') }}： {{ $toNumberStr(currentCoin.userFeeAvailable, 8) }}
    .balance-box
      .balance-fee 
        p 
          span.color-6 矿工费：
          span {{ $toNumberStr(currentCoin.withdrawMinerFee, 8) }}&nbsp;{{ currentCoin.mainAsset }}
        p 
          span.color-6 提币手续费：
          span {{ $toNumberStr(calcServerFee, 8) }}
      .balance-con 
        p.m-16 {{ $vuetify.lang.t('$vuetify.mine.可提现') }}&nbsp;&nbsp;&nbsp;&nbsp;{{ $toNumberStr(currentCoin.userAvailable, 8) }}
        p.m-16 提现矿工费：&nbsp;&nbsp;&nbsp;&nbsp;{{ $toNumberStr(currentCoin.userFeeAvailable, 8) }}
        p {{ $vuetify.lang.t('$vuetify.mine.可代付') }}&nbsp;&nbsp;&nbsp;&nbsp;{{ $toNumberStr(currentCoin.mchAvailable, 8) }}
        p 代付矿工费：&nbsp;&nbsp;&nbsp;&nbsp;{{ $toNumberStr(currentCoin.mchFeeAvailable, 8) }}

    //- v-card-text.d-flex.align-center
    //-   .subtitle-1.card-label {{ $vuetify.lang.t('$vuetify.lable.fee') }}：
    //-   .subtitle-1 {{ $toNumberStr(calcServerFee, 8) }}

    //- v-card-text.d-flex.align-center.pb-1
    //-   .subtitle-1.card-label {{ $vuetify.lang.t('$vuetify.lable.prompt') }}：
    //-   .text--disabled {{ $vuetify.lang.t('$vuetify.lable.min_withdrawal_amount') }}：{{ $fixed8(currentCoin.minWithdrawAmount) || 0 }}

    //- v-card-text.d-flex.align-center.pt-0
      .card-label
      .text--disabled 服务费：{{$fixed8(withdrawNum * currentCoin.withdraw_service_fee_rate) || 0}}

    v-card-text.mine-v-btn
      v-btn.ma-4(
        depressed,
        color="primary",
        :disabled="disabledWithdraw",
        v-loading="waitCheck",
        @click="startWithdraw"
      ) {{ $vuetify.lang.t('$vuetify.loginPage.nextStep') }}

  //- 提交成功
  v-dialog(
    v-model="showWithdrawSuccess",
    max-width="460",
    v-if="showWithdrawSuccess"
  )
    v-card
      v-card-title {{ $vuetify.lang.t('$vuetify.lable.prompt') }}
      v-card-text.subtitle-1 {{ $vuetify.lang.t('$vuetify.lable.application_submitted') }}
      v-divider
      v-card-text.text-center.py-4
        a(@click="withdrawSuccess") {{ $vuetify.lang.t('$vuetify.lable.view_record') }}

  //- 是否冻结
  v-dialog(v-model="showForbidden", max-width="460", v-if="showForbidden")
    v-card
      v-card-title {{ $vuetify.lang.t('$vuetify.lable.prompt') }}
      v-card-text.subtitle-1 {{ $vuetify.lang.t('$vuetify.lable.freeze_info') }}
      v-card-actions.py-4.px-6
        v-spacer
        v-btn(depressed, color="error", @click="showForbidden = false") {{ $vuetify.lang.t('$vuetify.lable.ok') }}
        v-spacer

  //- 是否企业认证过
  v-dialog(v-model="showIsVerify", max-width="460", v-if="showIsVerify")
    v-card
      v-card-title
        span {{ $vuetify.lang.t('$vuetify.lable.prompt') }}
        v-spacer
        v-btn(small, icon, @click="showIsVerify = false")
          v-icon mdi-close
      v-card-text.subtitle-1 {{ $vuetify.lang.t('$vuetify.lable.not_certified_info') }}

      v-card-text.text-center
        v-btn(depressed, color="primary", @click="toVerify") {{ $vuetify.lang.t('$vuetify.lable.go_to_certification') }}
      v-card-text.text-center
        a.text--disabled(
          @click="continueWithdraw",
          style="text-decoration: underline"
        ) {{ $vuetify.lang.t('$vuetify.lable.not_go_to_certification') }}

  //- 提币确认
  v-dialog(
    v-model="showWithdrawSure",
    max-width="580",
    persistent,
    no-click-animation
  )
    v-card
      v-card-title
        span {{ isNewAddress ? $vuetify.lang.t('$vuetify.lable.new_address_tip') : $vuetify.lang.t('$vuetify.lable.confirm_withdrawal') }}
        v-spacer
        v-btn(small, icon, @click="closeWithdrawSure")
          v-icon mdi-close
      v-card-text.px-12
        .address-area {{ currentAddr.address }}

      v-card-text.px-12.mb-6.d-flex.align-center
        v-spacer
        .coin-item.text-center.mx-6
          .item-title {{ $vuetify.lang.t('$vuetify.lable.withdrawal_currency') }}
          .item-text {{ currentCoin.asset }}

        .coin-item.text-center.mx-6
          .item-title {{ $vuetify.lang.t('$vuetify.lable.expected_arrival') }}
          .item-text {{ calcReceivedAmount() }}

        .coin-item.text-center.mx-6
          .item-title {{ $vuetify.lang.t('$vuetify.lable.deduct_cost') }}
          .item-text {{ $fixed8(calcServerFee) }}
        v-spacer

      v-card-text.px-12(style="padding-bottom: 0")
        v-text-field(
          v-model="withdrawVerifyCode",
          :label="$vuetify.lang.t('$vuetify.loginPage.verifyCode')",
          :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterVerifyCode')",
          ref="updateTransVerifyCode",
          :rules="[rules.verifyCode]"
        ) 
          template(slot="append")
            v-btn(
              small,
              rounded,
              outlined,
              style="margin-top: -6px",
              :disabled="disabledVerifyCode",
              @click="sendVerifyCode"
            ) {{ sendingTime > 0 ? sendingTime + 's' : $vuetify.lang.t('$vuetify.loginPage.getVerifyCode') }}

      v-card-text.px-12.pb-0
        v-text-field(
          v-model="withdrawTransPwd",
          :label="$vuetify.lang.t('$vuetify.loginPage.transPwd')",
          :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterTransPwd')",
          type="password",
          ref="updateTransPwd",
          :rules="[rules.transPwd]"
        ) 
      v-card-text.px-12.pb-0
        v-text-field(
          v-model="googleAuth",
          :label="$vuetify.lang.t('$vuetify.mine.谷歌验证码')",
          :placeholder="$vuetify.lang.t('$vuetify.mine.请输入谷歌验证码')",
          type="text",
          ref="updateGoogleInp",
          :rules="[rules.googleInp]"
        ) 
      v-card-text.text-right.px-12
        a(@click="forgetTransPwd") {{ $vuetify.lang.t('$vuetify.loginPage.forget') }}

      v-divider
      v-card-actions.d-flex.align-center.justify-center.text-center.pa-0
        v-btn.text--disabled.py-2(
          height="42",
          text,
          depressed,
          style="flex-grow: 1; border-right: 1px solid rgba(0, 0, 0, 0.12)",
          v-ripple="false",
          @click="closeWithdrawSure"
        ) {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
        v-btn.ma-0.py-2(
          height="42",
          text,
          depressed,
          color="primary",
          style="flex-grow: 1",
          v-ripple="false",
          :loading="isSubmitting",
          @click="withdrawSubmit"
        ) {{ $vuetify.lang.t('$vuetify.lable.ok') }}
  //- 检索矿工费
  v-dialog(v-model="checkFee", max-width="580", persistent, no-click-animation)
    v-card.mine-card-withdraw
      v-card-title
        span 提示
        v-spacer
        v-btn(small, icon, @click="checkFee = false")
          v-icon mdi-close
      .check-content 
        .un-check.check-public(v-if="checkStatus === 1") 提币前请先检查提币矿工费是否充裕
        .check-processing.check-public(v-if="checkStatus === 2") 正在检查中，请耐心等待…
        .check-pass.check-public(v-if="checkStatus === 3") 提币矿工费充裕，可提币！
        .check-faild.check-public(v-if="checkStatus === 4") 提币矿工费不足，请充值！
      .check-btn-box
        button.wait-btn(@click="checkFee = false") 再想想
        button.go-recharge.oper-btn(
          v-if="checkStatus === 1",
          @click="checkService"
        ) 检查
        button.check-btn.oper-btn(disabled)(v-if="checkStatus === 2") 检查中...
        button.go-withdraw.oper-btn(
          v-if="checkStatus === 3",
          @click="checkFee = false"
        ) 去提币
        button.go-recharge.oper-btn(
          v-if="checkStatus === 4",
          @click="checkFee = false; $router.push('/funding/merchant_recharge')"
        ) 去充值
  //- 提币
  <WithDraw ref="withdraw" @resetInput="resetInput"/>
  //- 检查矿工费
  <CheckFee ref="checkfee"/>
</template>
    
<script>
import eVue from "~/plugins/eVue";
var that = null;
export default {
  props: {
    asset: {
      type: String,
      default: "",
    },
    assetProtocol: {
      type: String,
      default: "",
    },
    to: {
      type: String,
      default: "",
    },
    amount: {
      type: String,
      default: "",
    },
    userWithdrawId: {
      type: Number,
      default: 0,
    },
    showInpAddress: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isSubmitting: false,
      sendingTimer: null,
      sendingTime: 0,
      withdrawVerifyCode: "",
      withdrawTransPwd: "",
      googleAuth: "",
      isNewAddress: false,
      showWithdrawSure: false,
      showWithdrawSuccess: false,
      showForbidden: false,
      showIsVerify: false,
      allAddress: [],
      currentCoin: "",
      defaultCoin: "TRX",
      curr_coin: {},
      waitCheck:false,
      currentAddr: {
        address: "",
        note: "",
        hasTag: false,
      },
      addrLoading: false,
      withdrawNum: 0,
      withdrawFee: 0,
      isSetTransPwd: true,
      completeComponent: {
        checkResult: "unchecked", // success  error
        error: false,
        errorMessages: "",
        hint: "",
      },
      rules: {
        verifyCode: (value) => {
          const pattern = /^[a-zA-Z0-9]*$/;
          return (
            (pattern.test(value) && value.length > 0) ||
            this.$vuetify.lang.t("$vuetify.loginPage.inValidVerifyCode")
          );
        },
        transPwd: (value) => {
          //const pattern = /^[0-9]*$/;
          return (
            /*(pattern.test(value) && value.length == 6) ||*/
            value.length >= 6 ||
            this.$vuetify.lang.t("$vuetify.loginPage.inValidTransPwd")
          );
        },
        googleInp: (value) => {
          const pattern = /^[0-9]*$/;
          return (
            (pattern.test(value) && value.length == 6) || "谷歌验证码6位数字"
          );
        },
        verifyAmoumt: (value) => {
          let n = parseFloat(value);
          if (n == 0) return true;
          if (isNaN(n))
            return this.$vuetify.lang.t("$vuetify.message.amount_invalid");
          let index = value.toString().indexOf(".");
          if (index != -1 && value.length - 1 - index > 8) {
            return this.$vuetify.lang.t("$vuetify.message.max_limit");
          }
          if (n < that.currentCoin.minWithdrawAmount)
            return this.$vuetify.lang.t("$vuetify.message.less_than_min_limit");
          if (n > that.currentCoin.userAvailable)
            return this.$vuetify.lang.t(
              "$vuetify.message.greater_than_max_limit"
            );
          // if (n > that.currentCoin.maxWithdrawAmountDaily - that.currentCoin.todayOut) return "今日提现金额已达上限"
          if (n > that.currentCoin.maxWithdrawAmount)
            return this.$vuetify.lang.t(
              "$vuetify.message.greater_than_max_amount"
            );
          if (that.calcServerFee > parseFloat(that.currentCoin.userAvailable))
            return this.$vuetify.lang.t(
              "$vuetify.message.insufficient_balance"
            );
          const pattern = /^[0-9.]*$/;
          return (
            (pattern.test(value.toString()) && value.toString().length > 0) ||
            this.$vuetify.lang.t("$vuetify.message.amount_invalid")
          );
        },
      },
      checkFee: false, //检索矿工费
      checkStatus: 1, //检索状态
    };
  },
  created() {
    that = this;
  },
  components: {
    WithDraw: (resolve) => require(["./components/withdraw"], resolve),
    CheckFee: (resolve) => require(["./components/check_fee"], resolve),
  },
  computed: {
    disabledVerifyCode() {
      return this.sendingTime > 0;
    },
    calcServerFee() {
      let n = 0;
      n =
        parseFloat(this.withdrawNum) *
        this.currentCoin.withdraw_service_fee_rate;
      return isNaN(n) ? 0 : n;
    },
    allCoins() {
      return this.$store.state.bossAssetsCenter.allCoins;
    },
    calcAddress() {
      if (this.currentAddr.address) {
        let lst = [];
        let filterText = this.currentAddr.address.toLowerCase();
        for (let addr of this.allAddress) {
          let itemText = addr.address.toLowerCase();
          if (itemText.indexOf(filterText) > -1) {
            lst.push(addr);
          }
        }
        return [].concat([this.currentAddr], lst);
      }
      return this.allAddress;
    },
    disabledWithdraw() {
      return (
        parseFloat(this.withdrawNum) === 0 ||
        !this.currentCoin ||
        this.rules.verifyAmoumt(this.withdrawNum) !== true ||
        this.completeComponent.error
      );
    },
    currentLang() {
      return this.$vuetify.lang.current;
    },
  },
  watch: {
    currentLang() {
      this.completeComponent.hint = `${this.$vuetify.lang.t(
        "$vuetify.lable.tip3"
      )} ${this.curr_coin.asset} ${this.$vuetify.lang.t(
        "$vuetify.lable.tip4"
      )}`;
    },
    "currentAddr.address"(val) {
      val && this.checkAddress();
    },
  },
  async mounted() {
    if (this.asset !== "") {
    }
    await this.$nextTick();
    await this.$store.dispatch("bossAssetsCenter/merchantAssetsInfo", {});
    this.initWithdraw();
  },
  methods: {
    //重置输入
    resetInput() {
      this.withdrawNum = 0;
      this.currentAddr.address = "";
    },
    //检查矿工费
    async checkService() {
      this.checkStatus = 2;
      const result = await this.$store.dispatch(
        "bossAssetsCenter/queryCoinCollectFee",
        {
          coin: this.currentCoin.mainAsset,
          merchant_id: this.$store.state.bossAssetsCenter.merchantInfo.mch_id,
        }
      );
      this.checkStatus =
        Number(this.currentCoin.userFeeAvailable) >
        Number(result.data.totalToolFee)
          ? 3
          : 4;
    },
    calcReceivedAmount() {
      let n = parseFloat(this.withdrawNum);
      if (n + this.calcServerFee > this.currentCoin.userAvailable) {
        let res =
          n - (this.calcServerFee - (this.currentCoin.userAvailable - n));
        return this.$fixed8(res);
      } else {
        return this.$fixed8(n);
      }
    },
    allWithdraw() {
      this.withdrawNum = this.currentCoin.userAvailable - this.currentCoin.userAvailable * this.currentCoin.withdraw_service_fee_rate;
    },
    forgetTransPwd() {
      eVue.$emit("forgetTransPwd");
    },
    closeWithdrawSure() {
      this.withdrawVerifyCode = "";
      this.withdrawTransPwd = "";
      this.googleAuth = "";
      this.isNewAddress = false;
      this.showWithdrawSure = false;
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
          scene: 3,
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
        this.sendingTime = 0;
        clearTimeout(this.sendingTimer);
      }
    },
    withdrawSuccess() {
      this.showWithdrawSuccess = false;
      this.$router.push("/order/merchant_withdraw");
    },
    toVerify() {
      this.showIsVerify = false;
      this.$router.push("/account/certification");
    },
    currentCoinChange(coin) {
      this.curr_coin = this.allCoins[coin];
      this.currentCoin = this.allCoins[coin];
      this.allAddress = [];
      this.withdrawNum = 0;
      this.currentAddr = {
        address: "",
        note: "",
        hasTag: false,
      };
      this.completeComponent = {
        checkResult: "unchecked", // success  error
        error: false,
        errorMessages: "",
        hint: `${this.$vuetify.lang.t("$vuetify.lable.tip3")} ${
          this.curr_coin.asset
        } ${this.$vuetify.lang.t("$vuetify.lable.tip4")}`,
      };

      if (!this.currentCoin) {
        this.currentCoin = {};
        return;
      }
      // this.getAddressBook()
    },
    currentAddrChange(v) {
      if (!!!v) {
        return;
      }
      if (this.currentCoin.asset == "XRP" || this.currentCoin.asset == "EOS") {
        if (v.includes("|")) {
          this.currentAddr.address = v.split("|")[0];
          this.currentAddr.note = v.split("|")[1];
        } else {
          this.currentAddr.address = v;
        }
      } else {
        this.currentAddr.address = v;
      }
    },
    addrFocus() {
      if (!this.currentCoin) {
        this.completeComponent.errorMessages = this.$vuetify.lang.t(
          "$vuetify.message.at_least_select_currency"
        );
        this.completeComponent.error = true;
      } else {
        this.completeComponent.error = false;
      }
    },
    async initWithdraw() {
      if (this.$route.query.coin || this.asset !== "") {
        let routeCoin = "";
        if (this.$route.query.coin) {
          routeCoin = this.$route.query.coin;
        }
        if (this.asset !== "") {
          if (this.asset === "USDT") {
            routeCoin = this.asset + "-" + this.assetProtocol;
          } else {
            routeCoin = this.asset;
          }
        }
        this.currentCoin = this.allCoins[routeCoin];

        // 地址
        this.currentAddr.address = this.to;
        // 数量
        this.withdrawNum = this.amount;
        // await this.getAddressBook()
        if (this.$route.query.id) {
          let id = parseInt(this.$route.query.id);
          if (isNaN(id)) return;
          for (let addr of this.allAddress) {
            if (addr.id == id) {
              let t = addr.address;
              if (t.includes("|")) {
                this.$set(this.currentAddr, "addr", t.split("|")[0]);
                this.$set(this.currentAddr, "note", t.split("|")[1]);
              } else {
                this.$set(this.currentAddr, "addr", addr.address);
              }

              break;
            }
          }
          if (this.currentAddr.addr) {
            await this.$nextTick();
            this.currentAddr.address = this.currentAddr.addr;
          }
        }
      } else {
        this.currentCoin = this.allCoins[Object.keys(this.allCoins)[0]];
        this.currentCoinChange(this.defaultCoin);
      }
    },
    async getAddressBook() {
      try {
        let res = await this.$store.dispatch(
          "addressCenter/getAddressBookPage",
          {
            pageNumber: 1,
            pageSize: 100,
            supportCoin: this.currentCoin.asset,
          }
        );
        if (res.code == "200") {
          this.allAddress = res.data.items;
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.get_address_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    async startWithdraw() {
      // 是否冻结
      if (this.$store.state.bossAssetsCenter.merchantInfo.status === 0) {
        this.showForbidden = true;
        return;
      }
      // 是否企业认证
      if (this.$store.state.bossAssetsCenter.merchantInfo.level > 0) {
        this.continueWithdraw();
      } else {
        this.showIsVerify = true;
      }
    },
    async continueWithdraw() {
      this.showIsVerify = false;
      // let address =(this.currentCoin.asset == "XRP" || this.currentCoin.asset == "EOS") ? `${this.currentAddr.address}|${this.currentAddr.note}` : this.currentAddr.address;
      // 是否是新的地址
      // try {
      //   let res = await this.$store.dispatch('bossAssetsCenter/isAddressExist',{
      //     address: address,
      //     asset: this.currentCoin.asset,
      //     walletId: window.localStorage.getItem('userId')
      //   })
      //   if (res.code == '200') {
      //     this.isNewAddress = !res.data.result
      //   } else {
      //     this.isNewAddress = false
      //     this.$error(res.message || this.$vuetify.lang.t("$vuetify.message.address_book_failed"))
      //   }
      // } catch (error) {
      //    console.log(error)
      // }
      // this.showWithdrawSure = true;
      this.waitCheck = true;
      const check = {
        coin: this.currentCoin.asset,
        amount: this.withdrawNum,
      };
      const result = await this.$store.dispatch(
        "bossAssetsCenter/checkWorkfee",
        check
      );
      this.waitCheck = false;
      const { code } = result;
      if(code != 200){
        this.$refs.checkfee.getErrorMsg(result.data);
        return;
      };
      let toAddress = this.currentAddr.address;
      if (this.currentAddr.note) {
        toAddress = toAddress + "|" + this.currentAddr.note;
      }
      const params = {
        asset: this.currentCoin.asset,
        toAddress: toAddress,
        txAmount: this.withdrawNum,
        walletId: window.sessionStorage.getItem("userId"),
        userWithdrawId: this.userWithdrawId,
        fee: this.$fixed8(this.calcServerFee),
        toolFee:result.data.totalToolFee
      };
      this.$refs.withdraw.getWithdrawMsg(params);
    },
    async withdrawSubmit() {
      //检查手续费
      // 数量 & 币种
      // withdraw

      // return;
      this.isSubmitting = true;
      try {
        let toAddress = this.currentAddr.address;
        if (this.currentAddr.note) {
          toAddress = toAddress + "|" + this.currentAddr.note;
        }
        let res = await this.$store.dispatch(
          "bossAssetsCenter/merchantWithdraw",
          {
            accountNumber: this.$store.state.bossMember.user.email,
            asset: this.currentCoin.asset,
            password: this.withdrawTransPwd,
            ga_code: this.googleAuth,
            toAddress: toAddress,
            txAmount: this.withdrawNum,
            verifyCode: this.withdrawVerifyCode,
            walletId: window.sessionStorage.getItem("userId"),
            userWithdrawId: this.userWithdrawId,
          }
        );
        if (res.code == "200") {
          // 已经提交申请
          this.withdrawResult = res.data.state == 0;
          this.closeWithdrawSure();
          this.showWithdrawSuccess = true;
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.submit_review_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
      this.isSubmitting = false;
    },
    async checkAddress() {
      this.completeComponent.error = false;
      if (!this.currentCoin) {
        return;
      }
      this.addrLoading = true;
      try {
        let res = await this.$store.dispatch("bossAssetsCenter/checkAddress", {
          address: this.currentAddr.address,
          asset: this.currentCoin.asset,
        });
        if (res.code === 200) {
          this.completeComponent.error = !res.data.result;
          this.completeComponent.errorMessages = !res.data.result
            ? this.$vuetify.lang.t("$vuetify.message.invalid_address_format")
            : "";
          this.completeComponent.checkResult = res.data.result
            ? "success"
            : "error";
        } else {
          this.completeComponent.error = true;
          this.completeComponent.errorMessages = "地址格式错误";
        }
      } catch (error) {
        this.completeComponent.checkResult = "error";
        this.completeComponent.error = true;
        console.log(error);
      }
      this.addrLoading = false;
    },
  },
};
</script>

<style lang="stylus">
@import ('./index.scss');

.merchant-withdraw {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #f5f5fc;

  .select-coin {
    margin-bottom: 38px;
  }

  .card-label {
    min-width: 115px;
    text-align: right;
    margin: 0 20px 0 0;
    line-height: 48px;
  }

  .v-card__text {
    padding-left: 0;
  }

  .coin-btn {
    // height: 36px !important;
    border-radius: 4px !important;
  }

  .check-success fieldset {
    border: 1px solid $success;
  }

  .check-error fieldset {
    border: 1px solid $error;
  }

  .withdraw-num-btn {
    .v-input__append-inner {
      margin-top: 0 !important;
      align-self: center;
    }
  }
}

.address-area {
  width: 100%;
  background: rgba(122, 122, 122, 0.3);
  padding: 12px;
  border-radius: 6px;
  white-space: pre-wrap;
}

.coin-item {
  .item-title {
    white-space: nowrap;
  }

  .item-text {
    white-space: nowrap;
  }
}

.clo-flex {
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding-bottom: 0;

  fieldset {
    border: 1px solid #eee !important;
  }

  .card-label {
    text-align: left;
    margin-bottom: 0;
    font-size: 18px !important;
    color: #333;
    font-weight: 500;
  }

  .v-text-field__slot {
    height: 50px;
  }
}

.balance-box {
  width: 560px;
  margin-top: 12px;

  .balance-fee {
    display: flex;
    justify-content: space-between;

    .color-6 {
      color: #666;
    }

    p {
      width: 50%;
    }
  }

  .balance-con {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20px;
    background: #f8f8f8;
    border-radius: 4px;

    p {
      width: 50%;
      margin-bottom: 0;
      color: #999;
    }

    .m-16 {
      margin-bottom: 16px;
    }
  }
}

.mine-card-withdraw {
  box-sizing: border-box;

  .v-card__title::before {
    display: none;
  }

  .check-content {
    margin: 0 auto;
    box-sizing: border-box;
    width: 90%;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;

    .check-public {
      width: 100%;
      box-sizing: border-box;
      margin: 20px 0;
      padding: 20px 0;
      text-align: center;
      border-radius: 4px;
      background: rgba(253, 86, 86, 0.1);
      border: 1px solid #FD5656;
      color: #FD5656;
    }

    .check-pass {
      background: rgba(37, 196, 157, 0.06);
      color: #25C49D;
      border-color: #25C49D;
    }
  }

  .check-btn-box {
    width: 90%;
    margin: 0 auto;
    padding: 18px 0;
    display: flex;

    button {
      height: 44px;
      font-size: 20;
      border-radius: 4px;
    }

    .wait-btn {
      width: 200px;
      margin-right: 16px;
      background: #F8F8F8;
      color: #999;
    }

    .oper-btn {
      flex: 1;
      color: white;
    }

    .go-withdraw {
      background: #25C19E;
    }

    .go-recharge {
      background: #FD5656;
    }

    .check-btn {
      background: #ccc;
    }
  }
}
</style>