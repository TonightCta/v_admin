<template lang="pug">
.merchant-recharge.pa-6
  v-card(style="flex-grow: 1", v-if="!showRecharge")
    v-card-title
      a.title(@click="closeShowRecharge") {{ $vuetify.lang.t('$vuetify.defaultLayout.merchantDeposit') }}
      .title.mx-4
    v-divider
    v-card-text.mb-4.per-card-item(style="align-items: flex-start")
      .subtitle-1.font-weight-bold.py-1.card-label(style="line-height: 48px") {{ $vuetify.lang.t('$vuetify.lable.select_account') }}：
      el-radio-group.mine-radio(v-model="normalCurrent",@change="selectCoin")
        el-radio-button(v-for="coin,i in allCoins",:label="coin.asset")
    

    v-card-text(v-if="false")
      v-btn.ma-4(
        :disabled="!currentCoin.asset",
        color="primary",
        depressed,
        @click="changeCurrenCoin"
      ) {{ $vuetify.lang.t('$vuetify.loginPage.nextStep') }}
    v-divider.mb-4
    .charge-msg 
      .msg-left 
          v-card-text.per-card-item(style="width: 350px")
            span.subtitle-1.font-weight-bold.mr-4.card-label {{ $vuetify.lang.t('$vuetify.lable.recharge_account') }}：
            //- v-select(
            //-   style="transform: scale(0.85)",
            //-   v-model="curr_asset",
            //-   :items="asset_list",
            //-   outlined,
            //-   single-line,
            //-   dense,
            //-   hide-details,
            //-   @change="changeSelect"
            //- )
            input#deposittag.text--primary(
              :value="curr_asset",
              style="outline: none",
              disabled
            )

          v-card-text.per-card-item(
            v-if="currentCoin.asset == 'XRP' || currentCoin.asset == 'EOS'"
          )
            span.subtitle-1.font-weight-bold.mr-4.card-label {{ $vuetify.lang.t('$vuetify.lable.recharge_tag') }}：
            input#deposittag.text--primary(
              :value="currentCoin.tag",
              style="outline: none"
            )
            v-btn.ml-12(text, small, color="primary", @click="copyTag")
              span {{ $vuetify.lang.t('$vuetify.lable.copy') }}
          v-card-text.per-card-item
            span.subtitle-1.font-weight-bold.mr-4.card-label {{ $vuetify.lang.t('$vuetify.lable.recharge_address') }}：
            .addr-input
              .input-layer
              input#depositaddress.text--primary(
                :value="currentCoin.merchantDepositAddress",
                style="outline: none"
              )
            v-btn.ml-4(text, small, color="primary", @click="copyAddress")
              span {{ $vuetify.lang.t('$vuetify.lable.copy') }}

          v-card-text.per-card-item
            .card-label.mr-4
            //- v-img(:src="currentCoin.qrCodeURL",max-width="160",width="160",height="160")
            #qrcode-container.qr-code-area


          v-card-text.per-card-item
            span.subtitle-1.font-weight-bold.mr-4.card-label {{ $vuetify.lang.t('$vuetify.lable.prompt') }}：
            span {{ $vuetify.lang.t('$vuetify.lable.tip1') }}
            span.mx-2.red--text {{ curr_asset }}
            span {{ $vuetify.lang.t('$vuetify.lable.tip2') }}

          v-card-text.per-card-item
            span.subtitle-1.font-weight-bold.mr-4.card-label {{ $vuetify.lang.t('$vuetify.mine.可代付手续费额度') }}：
            span.mx-2.red--text {{ currentCoin.mchFeeAvailable }}
      .msg-right(v-if="curr_asset !== 'USDT-TRC20'")
          v-card-text.per-card-item(style="width: 350px")
            span.subtitle-1.font-weight-bold.mr-4.card-label 手续费账户：
            input#deposittag.text--primary(
              :value="curr_asset",
              style="outline: none",
              disabled
            )

          v-card-text.per-card-item(
            v-if="currentCoinFee.asset == 'XRP' || currentCoinFee.asset == 'EOS'"
          )
            span.subtitle-1.font-weight-bold.mr-4.card-label {{ $vuetify.lang.t('$vuetify.lable.recharge_tag') }}：
            input#deposittag.text--primary(
              :value="currentCoinFee.tag",
              style="outline: none"
            )
            v-btn.ml-12(text, small, color="primary", @click="copyTag")
              span {{ $vuetify.lang.t('$vuetify.lable.copy') }}
          v-card-text.per-card-item
            span.subtitle-1.font-weight-bold.mr-4.card-label {{ $vuetify.lang.t('$vuetify.mine.手续费地址') }}：
            .addr-input
              .input-layer
              input#depositaddress.text--primary(
                :value="currentCoinFee.merchantDepositAddress",
                style="outline: none"
              )
            v-btn.ml-4(text, small, color="primary", @click="copyAddress")
              span {{ $vuetify.lang.t('$vuetify.lable.copy') }}

          v-card-text.per-card-item
            .card-label.mr-4
            //- v-img(:src="currentCoin.qrCodeURL",max-width="160",width="160",height="160")
            #qrcode-container-fee.qr-code-area

          v-card-text.per-card-item
            span.subtitle-1.font-weight-bold.mr-4.card-label {{ $vuetify.lang.t('$vuetify.lable.prompt') }}：
            span {{ $vuetify.lang.t('$vuetify.lable.tip1') }}
            span.mx-2.red--text {{ curr_asset }}
            span {{ $vuetify.lang.t('$vuetify.lable.tip2') }}

          v-card-text.per-card-item
            span.subtitle-1.font-weight-bold.mr-4.card-label {{ $vuetify.lang.t('$vuetify.mine.可提现手续费额度') }}：
            span.mx-2.red--text {{ currentCoinFee.userFeeAvailable }}

    //- v-card-text.per-card-item.pt-0
    //-   span.subtitle-1.font-weight-bold.mr-4.card-label
    //-   span 如果充币少于₿0.00100000，那么将会扣除₿0.00010000的佣金。

    v-card-text.per-card-item.mt-4
      span.subtitle-1.font-weight-bold.mr-4.card-label {{ $vuetify.lang.t('$vuetify.lable.buy_currency') }}：
      v-btn.mr-4(small, outlined, href="https://www.gate.ac/signup/1124713", target="_blank") Gate
      v-btn(small, outlined, href="https://www.okx.com", target="_blank") OKX

    v-card-text.per-card-item.py-0
      span.subtitle-1.font-weight-bold.mr-4.card-label
      span.text--disabled {{ $vuetify.lang.t('$vuetify.lable.buy_info') }}
    

  v-dialog(v-model="showForbidden", max-width="460", v-if="showForbidden")
    v-card
      v-card-title {{ $vuetify.lang.t('$vuetify.lable.prompt') }}
      v-card-text.subtitle-1 {{ $vuetify.lang.t('$vuetify.lable.account_freeze_reminder') }}
      v-card-actions.py-4.px-6
        v-spacer
        v-btn(depressed, color="error", @click="showForbidden = false") {{ $vuetify.lang.t('$vuetify.lable.ok') }}
        v-spacer
</template>
    
<script>
import _ from "lodash";
import Vue from 'vue';
import * as QRcode from "qrcodejs2";
import { RadioGroup,RadioButton } from "element-ui";
Vue.use(RadioGroup);
Vue.use(RadioButton)
export default {
  data() {
    return {
      showRecharge: false,
      currentCoin: {},
      currentCoinFee:{},
      curr_asset: "",
      asset_list: [],
      showForbidden: false,
      normalCurrent:"TRX",
    };
  },
  computed: {
    allCoins() {
      let re_allCoins = this.$store.state.bossAssetsCenter.allCoins || [];
      this.asset_list = Object.keys(re_allCoins);
      return re_allCoins;
    },
  },
  created() {
    this.testEv();
    // setTimeout(() => {
    // this.currentCoinChange(this.$store.state.bossAssetsCenter.allCoins[0]);
    // },500)
  },
  methods: {
    selectCoin(_val){
      this.currentCoinChange(this.allCoins[_val]);
    },
    async testEv() {
      const result = await this.$store.dispatch(
        "bossAssetsCenter/merchantAssetsInfo"
      );
      this.currentCoinChange(result.data.coinStatementList[0]);
      this.currentCoinChangeFee(result.data.feeCoinStatementList[0]);
    },
    closeShowRecharge() {
      this.currentCoin = {};
      this.currentCoinFee = {};
      this.showRecharge = false;
    },
    async currentCoinChange(coin) {
      if (!coin) coin = {};
      this.currentCoin = _.cloneDeep(coin);
      this.curr_asset = this.currentCoin.asset;
      if (this.currentCoin.asset == "EOS" || this.currentCoin.asset == "XRP") {
        let _data = this.currentCoin.merchantDepositAddress.split("|");
        this.currentCoin.merchantDepositAddress = _data[0];
        this.currentCoin.tag = _data[1];
      }
      this.generateQR(this.currentCoin.merchantDepositAddress);
    },
    async currentCoinChangeFee(coin){
      if (!coin) coin = {};
      this.currentCoinFee = _.cloneDeep(coin);
      this.curr_asset = this.currentCoinFee.asset;
      if (this.currentCoinFee.asset == "EOS" || this.currentCoinFee.asset == "XRP") {
        let _data = this.currentCoinFee.merchantDepositAddress.split("|");
        this.currentCoinFee.merchantDepositAddress = _data[0];
        this.currentCoinFee.tag = _data[1];
      }
      this.generateQRFee(this.currentCoinFee.merchantDepositAddress);
    },
    async changeSelect(val) {
      this.currentCoinChange(this.allCoins[val]);
      this.currentCoinChangeFee(this.allCoins[val]);
    },
    copyTag() {
      let ele = document.getElementById("deposittag");
      ele.focus();
      ele.select();
      this.$setClip(this.currentCoin.tag);
      this.$setClip(this.currentCoinFee.tag);
      this.$success("success");
    },
    copyAddress() {
      let ele = document.getElementById("depositaddress");
      ele.focus();
      ele.select();
      this.$setClip(this.currentCoin.merchantDepositAddress);
      this.$setClip(this.currentCoinFee.merchantDepositAddress);
      this.$success("success");
    },
    async changeCurrenCoin() {
      if (this.$store.state.bossAssetsCenter.merchantInfo.status == 0) {
        this.showForbidden = true;
        return;
      }
      //判断账户是否冻结，并展示弹窗，如果未冻结，跳转至充币详情
      // if (this.currentCoin.asset == "EOS" || this.currentCoin.asset == "XRP") {

      //   let _data = this.currentCoin.merchantDepositAddress.split('|')
      //   console.log(_data)
      //   this.currentCoin.merchantDepositAddress = _data[0]
      //   this.currentCoin.tag = _data[1]
      //   console.log(this.currentCoin.tag)
      // }
      this.showRecharge = true;
      await this.$nextTick();
      this.generateQR(this.currentCoin.merchantDepositAddress);
    },
    generateQR(text) {
      try {
        let ele = document.getElementById("qrcode-container");
        for (let el of ele.children) {
          ele.removeChild(el);
        }
        let qr = document.createElement("div");
        new QRcode(qr, {
          text: this.currentCoin.merchantDepositAddress,
          width: 160,
          height: 160,
          colorDark: "#000",
          colorLight: "#ffffff",
          correctLevel: 1,
        });
        ele.appendChild(qr);
      } catch (error) {}
    },
    generateQRFee(text){
      try {
        let ele = document.getElementById("qrcode-container-fee");
        for (let el of ele.children) {
          ele.removeChild(el);
        }
        let qr = document.createElement("div");
        new QRcode(qr, {
          text: this.currentCoinFee.merchantDepositAddress,
          width: 160,
          height: 160,
          colorDark: "#000",
          colorLight: "#ffffff",
          correctLevel: 1,
        });
        ele.appendChild(qr);
      } catch (error) {}
    }
  },
};
</script>

<style lang="stylus">
.merchant-recharge {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: #F5F5FC;
  .mine-radio{
    margin-top: 8px
  }
  .per-card-item {
    display: flex;
    align-items: center;

    .card-label {
      min-width: 115px;
      text-align: right;
    }

    .coin-btn {
      // height: 36px !important;
      border-radius: 4px !important;
      border: 1px solid #c1c1c1;
      width: 130px;
    }
  }

  .qr-code-area {
    background: #fff;
    padding: 8px;
  }
}

.addr-input {
  flex-grow: 1;
  position: relative;
  max-width: 420px;

  .input-layer {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
  }

  input {
    width: 100%;
  }
}
.charge-msg{
  display: flex;
  .card-label{
    width:150px;
    text-align:right;
  }
  .msg-right{
    margin-left:80px;
  }
}
</style>