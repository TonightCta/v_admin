<template lang="pug">
.index-page.pa-6
  v-card.mb-6
    v-card-title {{ $vuetify.lang.t('$vuetify.indexPage.businessOverview') }}
    v-divider
    v-card-text.px-0.mb-4
      v-row.px-4.py-2
        v-col.text-center
          .index-title-label.index-title-today.mb-3 {{ $vuetify.lang.t('$vuetify.indexPage.todayReceived') }}
          .index-title-title.index-title-today {{ currentRateSymbol }}{{ $toNumberStr(calcFeeRate(totalTodayRecievedUSD), 2) }}
        v-col.text-center
          .index-title-label.mb-3 {{ $vuetify.lang.t('$vuetify.indexPage.yesterdayReceived') }}
          .index-title-title {{ currentRateSymbol }}{{ $toNumberStr(calcFeeRate(totalYesterdayRecievedUSD), 2) }}
        v-col.text-center
          .index-title-label.mb-3 {{ $vuetify.lang.t('$vuetify.indexPage.totalBalance') }}
          .index-title-title {{ currentRateSymbol }}{{ $toNumberStr(calcFeeRate(totalBalanceUSD), 2) }}
    v-card-title.py-2 {{ $vuetify.lang.t('$vuetify.indexPage.currencyStatistics') }}
    v-divider
    v-card-text
      v-data-table.elevation-0(
        :headers="currencyCount.headers",
        :items="currencyCount.items",
        hide-default-footer
      )
        template(v-slot:header.estimatedValue="{ header }")
          span {{ header.text }}（{{ currentRateSymbol }}）
        template(v-slot:item.asset="{ item }")
          v-avatar.mr-2(size="26", tile)
            img(:src="getCoinImg(item)")
          span {{ item.asset }}
        template(v-slot:item.estimatedValue="{ item }")
          span {{ calcFeeRate(item.estimatedValue) }}
        template(v-slot:item.coinPriceUSD="{ item }")
          span {{ calcFeeRate(item.coinPriceUSD) }}

  v-card
    v-card-title
      .title {{ $vuetify.lang.t('$vuetify.indexPage.collectionStatistics') }}
      v-spacer
      v-btn(text, small, color="primary", to="/bill") {{ $vuetify.lang.t('$vuetify.indexPage.showMore') }}
    v-divider
    v-card-text
      v-data-table.elevation-0(
        :headers="transDetail.headers",
        :items="transDetail.items",
        :itemsPerPage="15",
        hide-default-footer
      )
        template(v-slot:item.createTime="{ item }")
          span {{ item.createTime }}
        template(v-slot:item.income_expenditure="{ item }")
          span(v-if="item.type == 0") {{ $vuetify.lang.t('$vuetify.indexPage.income') }}
          span(v-else) {{ $vuetify.lang.t('$vuetify.indexPage.expenditure') }}
        template(v-slot:item.type="{ item }")
          span {{ item.enterpriseMemberId == '1' ? $vuetify.lang.t('$vuetify.table.merchant') : $vuetify.lang.t('$vuetify.table.user') }}
          span(v-if="item.type == 0") {{ $vuetify.lang.t('$vuetify.table.deposit') }}
          span(v-else-if="item.type == 1") {{ $vuetify.lang.t('$vuetify.table.withdraw') }}
          span(v-else-if="item.type == 2") {{ $vuetify.lang.t('$vuetify.table.deposit') + $vuetify.lang.t('$vuetify.table.minerFee') }}
          span(v-else-if="item.type == 3") {{ $vuetify.lang.t('$vuetify.table.deposit') + $vuetify.lang.t('$vuetify.table.serverFee') }}
          span(v-else-if="item.type == 4") {{ $vuetify.lang.t('$vuetify.table.withdraw') + $vuetify.lang.t('$vuetify.table.minerFee') }}
          span(v-else-if="item.type == 5") {{ $vuetify.lang.t('$vuetify.table.withdraw') + $vuetify.lang.t('$vuetify.table.serverFee') }}
          span(v-else-if="item.type == 7") {{ $vuetify.lang.t('$vuetify.table.withdraw') + $vuetify.lang.t('$vuetify.table.minerFee') }}
          span(v-else) {{ item.type }}
        template(v-slot:item.asset="{ item }")
          span {{ item.asset }}
        template(v-slot:item.amount="{ item }")
          span(v-if="item.type == 0 || item.type == 1") {{ $fixed8(item.amount) }}
          span(v-else) {{ $fixed8(item.fee) }}
        template(v-slot:item.afterChangeMerchantBalance="{ item }")
          span {{ item.afterChangeMerchantBalance }}
        template(v-slot:item.trxNo="{ item }")
          span {{ item.trxNo }}
        template(v-slot:item.txHash="{ item }")
          el-popover(
            placement="top",
            width="400",
            trigger="hover",
            theme="dark",
            :content="item.txHash",
            v-if="item.type == 0 || item.type == 1"
          )
            el-button(
              style="color: #5f74d2",
              size="mini",
              type="text",
              slot="reference",
              @click="$toBlockBrowser(item.txHash, item)"
            ) {{ $vuetify.lang.t('$vuetify.indexPage.view') }}
          span(v-else) -
</template>
    
<script>
export default {
  data: () => {
    return {
      totalBalanceUSD: 0,
      totalTodayRecievedUSD: 0,
      totalYesterdayRecievedUSD: 0,
      currencyCount: {},
      transDetail: {},
    };
  },
  computed: {
    currentRateSymbol() {
      return this.$store.state.bossAssetsCenter.allRateSymbols[
        this.currentRate
      ];
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
      this.currencyCount.headers = [
        {
          text: this.$vuetify.lang.t("$vuetify.table.currency"),
          align: "start",
          sortable: false,
          value: "asset",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.indexPage.todayReceived"),
          align: "center",
          sortable: false,
          value: "todayRecieved",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.indexPage.yesterdayReceived"),
          align: "center",
          sortable: false,
          value: "yesterdayRecieved",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.withdrawBalance"),
          align: "center",
          sortable: false,
          value: "avaliableBalance",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.currentValuation"),
          align: "center",
          sortable: false,
          value: "estimatedValue",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.currentExchangeRate"),
          align: "center",
          sortable: false,
          value: "coinPriceUSD",
        },
      ];
      this.transDetail.headers = [
        {
          text: this.$vuetify.lang.t("$vuetify.table.time"),
          sortable: false,
          value: "createTime",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.incomeExpenditure"),
          sortable: false,
          value: "income_expenditure",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.type"),
          sortable: false,
          value: "type",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.asset"),
          sortable: false,
          value: "asset",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.amount"),
          sortable: false,
          value: "amount",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.balance"),
          sortable: false,
          value: "afterChangeMerchantBalance",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.orderId"),
          sortable: false,
          value: "trxNo",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.txHash"),
          sortable: false,
          align: "center",
          value: "txHash",
        },
      ];
    },
  },
  mounted() {
    this.currencyCount.headers = [
      {
        text: this.$vuetify.lang.t("$vuetify.table.currency"),
        align: "start",
        sortable: false,
        value: "asset",
      },
      {
        text: this.$vuetify.lang.t("$vuetify.indexPage.todayReceived"),
        align: "center",
        sortable: false,
        value: "todayRecieved",
      },
      {
        text: this.$vuetify.lang.t("$vuetify.indexPage.yesterdayReceived"),
        align: "center",
        sortable: false,
        value: "yesterdayRecieved",
      },
      {
        text: this.$vuetify.lang.t("$vuetify.table.withdrawBalance"),
        align: "center",
        sortable: false,
        value: "avaliableBalance",
      },
      {
        text: this.$vuetify.lang.t("$vuetify.table.currentValuation"),
        align: "center",
        sortable: false,
        value: "estimatedValue",
      },
      {
        text: this.$vuetify.lang.t("$vuetify.table.currentExchangeRate"),
        align: "center",
        sortable: false,
        value: "coinPriceUSD",
      },
    ];
    this.transDetail = {
      headers: [
        {
          text: this.$vuetify.lang.t("$vuetify.table.time"),
          sortable: false,
          value: "createTime",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.incomeExpenditure"),
          sortable: false,
          value: "income_expenditure",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.type"),
          sortable: false,
          value: "type",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.asset"),
          sortable: false,
          value: "asset",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.amount"),
          sortable: false,
          value: "amount",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.balance"),
          sortable: false,
          value: "afterChangeMerchantBalance",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.orderId"),
          sortable: false,
          value: "trxNo",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.txHash"),
          sortable: false,
          align: "center",
          value: "txHash",
        },
      ],
      items: [],
    };
    this.getMerchantAssetsInfo();
    this.queryWalletAssetsFlow();
  },
  methods: {
    calcFeeRate(num) {
      let n = parseFloat(num);
      n = isNaN(n) ? 0 : n;
      return this.$fixed8(n / this.allFeeRates[this.currentRate]);
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
    async getMerchantAssetsInfo() {
      try {
        // ********* 这里是获取统计数据
        /*let res = await this.$store.dispatch('bossAssetsCenter/merchantAssetsInfo',{})
        if (res.code == '200') {
          this.totalBalanceUSD = res.data.financialStatement.totalBalanceUSD
          this.totalTodayRecievedUSD = res.data.financialStatement.totalTodayRecievedUSD
          this.totalYesterdayRecievedUSD = res.data.financialStatement.totalYesterdayRecievedUSD
          this.currencyCount.items = res.data.coinStatementList
        } else {
          this.$error(res.message)
        }*/
      } catch (error) {
        this.$error("Error");
      }
    },
    async queryWalletAssetsFlow() {
      try {
        /*let res = await this.$store.dispatch('bossAssetsCenter/queryWalletAssetsFlow', {
          pageNumber: 1,
          pageSize: 15,
          sortAttribute: 4,
          sortType: 'descend',
        })
        if (res.code == '200') {
          this.transDetail.items = res.data.items
        } else {
          this.$error(res.message)
        }*/
      } catch (error) {
        this.$error("Error");
      }
    },
  },
};
</script>

<style lang="stylus">
.hash-text {
  white-space: wrap;
}

.index-page {
  min-height: 100%;
  background-color: #F5F5FC;
}
</style>