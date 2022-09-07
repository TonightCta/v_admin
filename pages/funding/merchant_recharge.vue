<template lang="pug">
.merchant-recharge.pa-6
  v-card.acrd-mine(style="flex-grow: 1", v-if="!showRecharge")
    v-card-title(style="margin-left: -48px")
      a.title(@click="closeShowRecharge") {{ $vuetify.lang.t('$vuetify.defaultLayout.merchantDeposit') }}
      .wring-read 到账时间说明：1-5分钟，快慢取决于链上区块拥堵情况
    v-divider(style="margin-left: -48px")
    .select-coin 
      p.select-coin-title 选择充币账户
      .el-select-mine 
        el-radio-group.mine-radio(
          v-model="normalCurrent",
          @change="selectCoin"
        )
          el-radio(v-for="coin, i in allCoins", :label="coin.asset", border)
    .charge-msg 
      .msg-left.msg-public
        .public-title 充币账户&nbsp;{{ curr_asset }}
          el-popover(
            placement="top",
            trigger="hover",
            theme="dark",
            :content="curr_asset === 'USDT-TRC20' ? '此充值仅供代付使用' : '商户代付时链上所需的矿工费'"
          )
            img(
              :src="require('../../assets/images/q_icon.png')",
              slot="reference"
            )
        v-card-text.per-card-item
          #qrcode-container.qr-code-area
        .need-read 
          img(:src="require('../../assets/images/info_icon.png')")
          span {{ $vuetify.lang.t('$vuetify.lable.tip1') }}
          span.red--text {{ curr_asset }}
          span {{ $vuetify.lang.t('$vuetify.lable.tip2') }}
        .text-card-mine 
          span {{ $vuetify.lang.t('$vuetify.mine.可代付手续费额度') }}：
          span.red-text {{ currentCoin.mchFeeAvailable }}
        .text-card-mine 
          span {{ $vuetify.lang.t('$vuetify.lable.recharge_address') }}：
          span.address-text {{ currentCoin.merchantDepositAddress }}
        #copy-btn-one.copy-mine-btn(
          :data-clipboard-text="currentCoin.merchantDepositAddress",
          @click="copyAddress"
        ) 
          img(:src="require('../../assets/images/copy_icon.png')")
          span 复制

      .msg-right.msg-public(v-if="curr_asset !== 'USDT-TRC20'")
        .public-title 手续费账户&nbsp;{{ curr_asset }}
          el-popover(
            placement="top",
            trigger="hover",
            theme="dark",
            content="商户提现时链上所需的矿工费"
          )
            img(
              :src="require('../../assets/images/q_icon.png')",
              slot="reference"
            )
        v-card-text.per-card-item
          #qrcode-container-fee.qr-code-area
        .need-read 
          img(:src="require('../../assets/images/info_icon.png')")
          span {{ $vuetify.lang.t('$vuetify.lable.tip1') }}
          span.red--text {{ curr_asset }}
          span {{ $vuetify.lang.t('$vuetify.lable.tip2') }}
        .text-card-mine 
          span {{ $vuetify.lang.t('$vuetify.mine.可提现手续费额度') }}：
          span.red-text {{ currentCoin.userFeeAvailable }}
        .text-card-mine 
          span {{ $vuetify.lang.t('$vuetify.lable.recharge_address') }}：
          span.address-text {{ currentCoinFee.merchantDepositAddress }}
        #copy-btn-two.copy-mine-btn(
          :data-clipboard-text="currentCoinFee.merchantDepositAddress",
          @click="copyAddressFee"
        ) 
          img(:src="require('../../assets/images/copy_icon.png')")
          span 复制

    //- v-card-text.per-card-item.pt-0
    //-   span.subtitle-1.font-weight-bold.mr-4.card-label
    //-   span 如果充币少于₿0.00100000，那么将会扣除₿0.00010000的佣金。
    p.buy-otc-title 去购买加密货币
    p.buy-otc-remark 支付方式根据您当前所在的位置有所不同
    ul.otc-list 
      li(@click="jumpSide('https://www.okx.com')")
        img(:src="require('../../assets/images/ok_logo.png')")
      li(@click="jumpSide('https://www.gate.ac/signup/1124713')")
        img(:src="require('../../assets/images/gate_logo.png')")

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
import Vue from "vue";
import * as QRcode from "qrcodejs2";
import Clipboard from "clipboard";
import { RadioGroup, RadioButton, Message } from "element-ui";
Vue.use(RadioGroup);
Vue.use(RadioButton);
export default {
  data() {
    return {
      showRecharge: false,
      currentCoin: {},
      currentCoinFee: {},
      curr_asset: "",
      asset_list: [],
      showForbidden: false,
      normalCurrent: "TRX",
    };
  },
  computed: {
    allCoins() {
      let re_allCoins = this.$store.state.bossAssetsCenter.allCoins || [];
      this.asset_list = Object.keys(re_allCoins);
      return re_allCoins;
    },
    allFeeCoins(){
      let re_allCoins = this.$store.state.bossAssetsCenter.allFeeCoins || [];
      return re_allCoins;
    }
  },
  created() {
    this.testEv();
    // setTimeout(() => {
    // this.currentCoinChange(this.$store.state.bossAssetsCenter.allCoins[0]);
    // },500)
  },
  methods: {
    jumpSide(_url) {
      window.open(_url);
    },
    selectCoin(_val) {
      this.currentCoinChange(this.allCoins[_val]);
      this.currentCoinChangeFee(this.allFeeCoins[_val]);
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
    async currentCoinChangeFee(coin) {
      if (!coin) coin = {};
      this.currentCoinFee = _.cloneDeep(coin);
      if (
        this.currentCoinFee.asset == "EOS" ||
        this.currentCoinFee.asset == "XRP"
      ) {
        let _data = this.currentCoinFee.merchantDepositAddress.split("|");
        this.currentCoinFee.merchantDepositAddress = _data[0];
        this.currentCoinFee.tag = _data[1];
      }
      this.$nextTick(() => {
        this.generateQRFee(this.currentCoinFee.merchantDepositAddress);
      });
    },
    // async changeSelect(val) {
    //   this.currentCoinChange(this.allCoins[val]);
    //   this.currentCoinChangeFee(this.allCoins[val]);
    // },
    copyTag() {
      let ele = document.getElementById("deposittag");
      ele.focus();
      ele.select();
      this.$setClip(this.currentCoin.tag);
      this.$setClip(this.currentCoinFee.tag);
      this.$success("success");
    },
    copyAddress() {
      const clipboard = new Clipboard("#copy-btn-one");
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
    copyAddressFee() {
      var clipboard = new Clipboard("#copy-btn-two");
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
          width: 210,
          height: 210,
          colorDark: "#000",
          colorLight: "#ffffff",
          correctLevel: 1,
        });
        ele.appendChild(qr);
      } catch (error) {}
    },
    generateQRFee(text) {
      try {
        let ele = document.getElementById("qrcode-container-fee");
        for (let el of ele.children) {
          ele.removeChild(el);
        }
        let qr = document.createElement("div");
        new QRcode(qr, {
          text: this.currentCoinFee.merchantDepositAddress,
          width: 210,
          height: 210,
          colorDark: "#000",
          colorLight: "#ffffff",
          correctLevel: 1,
        });
        ele.appendChild(qr);
      } catch (error) {}
    },
  },
};
</script>

<style lang="stylus">
@import ('./index.scss');

.merchant-recharge {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: #F5F5FC;
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
</style>