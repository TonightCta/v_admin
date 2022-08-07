<template lang="pug">
.balance-alert-settings.pa-6
  v-card(style="flex-grow:1")
    v-card-title
      .title {{ $vuetify.lang.t('$vuetify.lable.balance_alert') }}
      .info_text {{ $vuetify.lang.t('$vuetify.lable.balance_alert_info') }}
    v-divider
    v-card-text
      v-data-table.elevation-0(
        :loading="tableLoading",
        :headers="table.headers",
        :items="table.items",
        hide-default-footer
      )
        template(v-slot:header.note="{ header }")
          span {{ header.text }}（{{ currentRateSymbol }}）
        template(v-slot:item.asset="{ item }")
          v-avatar.mr-2(size="26", tile)
            img(:src="getCoinImg(item)")
          span {{ item.asset }}
        template(v-slot:item.note="{ item }")
          span {{ calcFeeRate(item.noticeMinAmount * item.coinPriceUSD) }}
        template(v-slot:item.operation="{ item }")
          v-btn(small, text, color="primary", @click="update(item)") {{ $vuetify.lang.t('$vuetify.lable.edit') }}

  v-dialog(
    persistent,
    v-model="is_edit_open",
    max-width="450",
    v-if="is_edit_open"
  )
    v-card
      v-card-title {{ $vuetify.lang.t('$vuetify.lable.edit') }}
      v-text-field(
        v-if="is_edit_open == true",
        v-model="asset",
        :label="$vuetify.lang.t('$vuetify.table.asset')",
        :rules="[rules.required]",
        style="width:400px;margin:0 0 20px 25px;",
        disabled
      )
      v-form(ref="form", v-model="valid", lazy-validation)
        v-text-field(
          type="number",
          v-if="is_edit_open == true",
          v-model="num",
          :label="$vuetify.lang.t('$vuetify.lable.low_balance_num')",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.low_balance_num')",
          :rules="[rules.verifyNum]",
          style="width:400px;margin:0 0 20px 25px;"
        )
        v-card-actions.d-flex.flex-row-reverse
          v-btn(
            color="primary",
            dark,
            :loading="submit_loading",
            @click="submit",
            style="margin-left:10px"
          ) {{ $vuetify.lang.t('$vuetify.lable.submit') }}
          v-btn(
            outlined,
            color="indigo",
            text,
            @click="is_edit_open = false; curr_item = {}; submit_loading = false"
          ) {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
</template>
    
<script>
import eVue from "~/plugins/eVue";
var that = null;
export default {
  data: () => {
    return {
      valid: true,
      asset: "",
      is_edit_open: false,
      submit_loading: false,
      curr_item: {},
      tableLoading: false,
      table: {
        headers: [],
        items: [],
      },
      num: "",
      rules: {
        required: (value) => {
          return !!value || that.$vuetify.lang.t("$vuetify.loginPage.required");
        },
        verifyNum: (value) => {
          if (value === "") {
            return that.$vuetify.lang.t("$vuetify.loginPage.required");
          }
          let index = value.toString().indexOf(".");
          if (value < 0 || (index != -1 && value.length - 1 - index > 8)) {
            return that.$vuetify.lang.t(
              "$vuetify.placeholder.verify_low_balance_num"
            );
          } else {
            return true;
          }
        },
      },
    };
  },
  computed: {
    currentRateSymbol() {
      return this.$store.state.bossAssetsCenter.allRateSymbols[
        this.currentRate
      ];
    },
    allCoins() {
      return this.$store.state.bossAssetsCenter.allCoins;
    },
    currentLang() {
      return this.$vuetify.lang.current;
    },
    currentRate() {
      return this.$store.state.bossAssetsCenter.currentRate;
    },
    allFeeRates() {
      return this.$store.state.bossAssetsCenter.allRates || {};
    },
  },
  watch: {
    currentLang() {
      that.table.headers = [
        {
          text: that.$vuetify.lang.t("$vuetify.table.asset"),
          align: "start",
          sortable: false,
          value: "asset",
        },
        {
          text: that.$vuetify.lang.t("$vuetify.lable.asset_low_num"),
          align: "center",
          sortable: false,
          value: "noticeMinAmount",
        },
        {
          text: that.$vuetify.lang.t("$vuetify.lable.current_valuation"),
          align: "center",
          sortable: false,
          value: "note",
        },
        {
          text: that.$vuetify.lang.t("$vuetify.lable.operating"),
          align: "center",
          sortable: false,
          value: "operation",
          width: "220",
        },
      ];
    },
  },
  created() {
    that = this;
  },
  async mounted() {
    await this.$nextTick();
    this.calcHeaders();
    this.getData();
  },
  methods: {
    calcFeeRate(num) {
      let n = parseFloat(num);
      n = isNaN(n) ? 0 : n;
      return this.$fixed8(n / this.allFeeRates[this.currentRate]);
    },
    calcHeaders() {
      this.table.headers = [
        {
          text: this.$vuetify.lang.t("$vuetify.table.asset"),
          align: "start",
          sortable: false,
          value: "asset",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.lable.asset_low_num"),
          align: "center",
          sortable: false,
          value: "noticeMinAmount",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.lable.current_valuation"),
          align: "center",
          sortable: false,
          value: "note",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.lable.operating"),
          align: "center",
          sortable: false,
          value: "operation",
          width: "270",
        },
      ];
    },
    update(item) {
      this.curr_item = item;
      this.asset = item.asset;
      this.num = item.noticeMinAmount;
      this.is_edit_open = true;
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.submit_loading = true;
        try {
          let res = await this.$store.dispatch(
            "bossAssetsCenter/updateMerchantAssetsInfo",
            {
              asset: this.curr_item.asset,
              noticeMinAmount: this.num,
              noticeSwitch: "true",
            }
          );
          if (res.code == "200") {
            this.$success(
              this.$vuetify.lang.t("$vuetify.message.edit_tran_success")
            );
            this.getData();
            this.is_edit_open = false;
            this.curr_item = {};
          } else {
            this.$error(res.message);
          }
        } catch (error) {
          console.log(error);
        }
        this.submit_loading = false;
      }
    },
    pageChange(value) {
      this.getData();
    },
    async getData() {
      this.tableLoading = true;
      try {
        let res = await this.$store.dispatch(
          "bossAssetsCenter/merchantAssetsInfo",
          {}
        );
        if (res.code == "200") {
          this.table.items = res.data.coinStatementList;
        } else {
          this.$error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
      this.tableLoading = false;
    },
    getCoinImg(coin) {
      let url = "";
      switch (coin.asset) {
        case "BCH":
          url = "/coins/bch.png";
          break;
        case "BTC":
          url = "/coins/btc.png";
          break;
        case "DOGE":
          url = "/coins/doge.png";
          break;
        case "ETH":
          url = "/coins/eth.png";
          break;
        case "LTC":
          url = "/coins/ltc.png";
          break;
        case "TRX":
          url = "/coins/trx.png";
          break;
        case "USDC":
          url = "/coins/usdc.png";
          break;
        case "USDT":
          url = "/coins/usdt.png";
          break;
        case "USDT_ERC20":
          url = "/coins/usdterc20.png";
          break;
        case "XRP":
          url = "/coins/xrp.png";
          break;
        default:
          break;
      }
      return url;
    },
  },
};
</script>

<style lang="stylus">
.balance-alert-settings {
  min-height: 100%;
  display: flex;
  flex-direction: column;

  .info_text {
    width: 100%;
    box-sizing: border-box;
    padding-left: 20px;
    font-size: 16px;
    color: #969696;
  }

  .card-label {
    min-width: 115px;
    text-align: right;
    margin: 0 20px 0 0;
    line-height: 48px;
  }
}
</style>