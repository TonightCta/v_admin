<template lang="pug">
.exception_callback
  .order-management.pa-6
    v-card
      v-card-title
        .title {{ $vuetify.lang.t('$vuetify.defaultLayout.exceptionCallback') }}
      v-divider

      v-card-text.data-tools(style="box-sizing: border-box;padding:0 16px;")
        .tool-box
          span {{ $vuetify.lang.t('$vuetify.table.orderId') }}：
          v-text-field.per-tool(
            x-small,
            v-model="order.id",
            style="width:310px;transform: scale(.85);",
            :label="$vuetify.lang.t('$vuetify.table.orderId')",
            outlined,
            single-line,
            dense,
            :placeholder="$vuetify.lang.t('$vuetify.orderComponent.pleaseEnter') + $vuetify.lang.t('$vuetify.table.orderId')",
            hide-details
          )
        .tool-box
          span {{ $vuetify.lang.t('$vuetify.table.currency') }}：
          v-select.per-tool(
            v-model="order.coinType",
            style="width:150px;transform: scale(.85);",
            :items="allCoins",
            outlined,
            single-line,
            dense,
            hide-details
          )
        .tool-box
          span {{ $vuetify.lang.t('$vuetify.table.orderTime') }}：
          v-menu(
            v-model="showPickStartDate",
            :close-on-content-click="false",
            :nudge-right="40",
            transition="scale-transition",
            offset-y,
            max-width="290",
            min-width="290"
          )
            template(v-slot:activator="{ on, attrs }")
              v-text-field(
                v-model="order.startTime",
                clearable,
                outlined,
                single-line,
                dense,
                readonly,
                hide-details,
                :label="$vuetify.lang.t('$vuetify.table.time')",
                :placeholder="$vuetify.lang.t('$vuetify.table.date')",
                append-icon="mdi-calendar-month",
                style="width:200px;transform: scale(.85);",
                v-bind="attrs",
                v-on="on",
                @click:append="showPickStartDate = true"
              )
            v-date-picker(
              v-model="order.startTime",
              no-title,
              scrollable,
              :allowed-dates="allowedStartTime",
              @input="showPickStartDate = false"
            )
          span {{ $vuetify.lang.t('$vuetify.table.to') }}
          v-menu(
            v-model="showPickEndDate",
            :close-on-content-click="false",
            :nudge-right="40",
            transition="scale-transition",
            offset-y,
            max-width="290",
            min-width="290"
          )
            template(v-slot:activator="{ on, attrs }")
              v-text-field(
                v-model="order.endTime",
                clearable,
                outlined,
                single-line,
                dense,
                readonly,
                hide-details,
                :label="$vuetify.lang.t('$vuetify.table.time')",
                :placeholder="$vuetify.lang.t('$vuetify.table.date')",
                append-icon="mdi-calendar-month",
                style="width:200px;transform: scale(.85);",
                v-bind="attrs",
                v-on="on",
                @click:append="showPickEndDate = true"
              )
            v-date-picker(
              v-model="order.endTime",
              no-title,
              scrollable,
              :allowed-dates="allowedEndTime",
              @input="showPickEndDate = false"
            )

        .tool-box.filter-fee
          span {{ $vuetify.lang.t('$vuetify.lable.amount_number') }}：
          v-text-field.per-tool(
            v-model="order.min",
            style="width:130px;transform: scale(.85);",
            :label="$vuetify.lang.t('$vuetify.table.min') + $vuetify.lang.t('$vuetify.table.amount')",
            outlined,
            single-line,
            dense,
            :placeholder="$vuetify.lang.t('$vuetify.table.min') + $vuetify.lang.t('$vuetify.table.amount')",
            type="number",
            :rules="[rules.minFee]",
            ref="minFee"
          )
          span {{ $vuetify.lang.t('$vuetify.table.to') }}
          v-text-field.per-tool(
            v-model="order.max",
            style="width:130px;transform: scale(.85);",
            :label="$vuetify.lang.t('$vuetify.table.max') + $vuetify.lang.t('$vuetify.table.amount')",
            outlined,
            single-line,
            dense,
            :placeholder="$vuetify.lang.t('$vuetify.table.max') + $vuetify.lang.t('$vuetify.table.amount')",
            type="number",
            max="10",
            @input="checkMinFee"
          ) 
        .tool-box
          span {{ $vuetify.lang.t('$vuetify.lable.call_back_status') }}：
          v-select.per-tool(
            v-model="order.notifyState",
            style="width:150px;transform: scale(.85);",
            :items="notifyStates",
            outlined,
            single-line,
            dense,
            hide-details
          ) 
        .tool-box
          span {{ $vuetify.lang.t('$vuetify.table.address') }}：
          v-text-field.per-tool(
            x-small,
            v-model="order.address",
            style="width:310px;transform: scale(.85);",
            :label="$vuetify.lang.t('$vuetify.table.address')",
            outlined,
            single-line,
            dense,
            :placeholder="$vuetify.lang.t('$vuetify.orderComponent.pleaseEnter') + $vuetify.lang.t('$vuetify.table.address')",
            hide-details
          )
        .tool-box
          span {{ $vuetify.lang.t('$vuetify.table.tag') }}：
          v-text-field.per-tool(
            x-small,
            v-model="order.tag",
            style="width:120px;transform: scale(.85);",
            :label="$vuetify.lang.t('$vuetify.table.tag')",
            outlined,
            single-line,
            dense,
            :placeholder="$vuetify.lang.t('$vuetify.orderComponent.pleaseEnter') + $vuetify.lang.t('$vuetify.table.tag')",
            hide-details
          )
        .tool-box
          span {{ $vuetify.lang.t('$vuetify.table.txHash') }}：
          v-text-field.per-tool(
            x-small,
            v-model="order.txHash",
            style="width:310px;transform: scale(.85);",
            :label="$vuetify.lang.t('$vuetify.table.txHash')",
            outlined,
            single-line,
            dense,
            :placeholder="$vuetify.lang.t('$vuetify.orderComponent.pleaseEnter') + $vuetify.lang.t('$vuetify.table.txHash')",
            hide-details
          ) 
        .tool-box
          v-btn(
            depressed,
            color="primary",
            @click="filterTransDetail",
            :loading="tableLoading"
          ) {{ $vuetify.lang.t('$vuetify.orderComponent.search') }}

        .tool-box
          v-dialog(v-model="resend_dialog", persistent, max-width="400")
            template(v-slot:activator="{ on, attrs }")
              v-btn(color="primary", dark, v-bind="attrs", v-on="on") {{ $vuetify.lang.t('$vuetify.lable.one_click_resend') }}
            v-card
              v-card-title {{ $vuetify.lang.t('$vuetify.lable.exception_back') }}
              div(
                style="display: flex;box-sizing: border-box;padding: 0 20px;align-items: center;width:250px;"
              )
                span(style="width:100px;") {{ $vuetify.lang.t('$vuetify.table.currency') }}：
                v-select.per-tool(
                  v-model="resend_asset",
                  :items="allCoins",
                  outlined,
                  single-line,
                  dense,
                  hide-details,
                  style="transform: scale(.85);"
                )
              v-card-actions.d-flex.flex-row-reverse
                v-btn(
                  color="primary",
                  dark,
                  :loading="resend_loading",
                  @click="resend",
                  style="margin-left:10px"
                ) {{ $vuetify.lang.t('$vuetify.lable.ok') }}
                v-btn(
                  outlined,
                  color="indigo",
                  text,
                  @click="resend_dialog = false"
                ) {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
      v-card-text
        v-data-table.elevation-0(
          :key="identify + manageWay",
          :headers="transDetail.headers",
          :items="transDetail.items",
          :itemsPerPage="pagination.size",
          :loading="tableLoading",
          hide-default-footer,
          v-if="showTable"
        )
          template(v-slot:item.cmdId="{ item }")
            span(v-if="item.cmdId == 'DEPOSIT'") {{ $vuetify.lang.t('$vuetify.table.deposit') }}
            span(v-else-if="item.cmdId == 'WITHDRAW'") {{ $vuetify.lang.t('$vuetify.table.withdraw') }}
          template(v-slot:item.notifyState="{ item }")
            span(v-if="item.notifyState == 0") {{ $vuetify.lang.t('$vuetify.lable.wait_send') }}
            span(v-else-if="item.notifyState == 1") {{ $vuetify.lang.t('$vuetify.lable.send_success') }}
          template(v-slot:item.toAddress="{ item }")
            span {{ getItemAddress(item.toAddress) }}
          template(v-slot:item.note="{ item }")
            span(v-if="item.asset == 'XRP' || item.asset == 'EOS'") {{ getItemTag(item.toAddress) }}
            span(v-else) {{ item.note || '-' }}
          template(v-slot:item.txHash="{ item }")
            template(v-if="identify == 'all' && manageWay == 'all'")
              el-popover(
                placement="top",
                width="400",
                trigger="hover",
                theme="dark",
                :content="item.txHash",
                v-if="item.type == 0 || item.type == 1"
              )
                el-button(
                  style="color:#5F74D2",
                  size="mini",
                  type="text",
                  slot="reference",
                  @click="$toBlockBrowser(item.txHash, item)"
                ) {{ $vuetify.lang.t('$vuetify.indexPage.view') }}
              span(v-else) -
            template(v-else)
              el-popover(
                placement="top",
                width="400",
                trigger="hover",
                theme="dark",
                :content="item.txHash",
                v-if="item.txHash"
              )
                el-button(
                  style="color:#5F74D2",
                  size="mini",
                  type="text",
                  slot="reference",
                  @click="$toBlockBrowser(item.txHash, item)"
                ) {{ $vuetify.lang.t('$vuetify.indexPage.view') }}
              span(v-else) -
          template(v-slot:item.operating="{ item }")
            v-btn(
              v-if="item.notifyState == 0",
              color="primary",
              dark,
              small,
              @click="is_resend = true; curr_item = item"
            ) {{ $vuetify.lang.t('$vuetify.lable.resend') }}
            span(v-else) -
      v-divider
      v-card-text.d-flex.align-center.justify-center
        v-pagination.custom-pagination(
          v-model="pagination.current",
          circle,
          :length="pagination.total",
          :disabled="tableLoading",
          :total-visible="10",
          @input="pageChange"
        )
    v-dialog(v-model="is_resend", max-width="350", v-if="is_resend")
      v-card
        v-card-title {{ $vuetify.lang.t('$vuetify.lable.prompt') }}
        v-card-text.subtitle-1 {{ $vuetify.lang.t('$vuetify.lable.resend_tip') }}
        v-divider
        v-card-text.text-center.py-4
          v-btn(
            @click="(is_resend = false), (curr_item = {})",
            style="margin-right:10px;"
          ) {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
          v-btn(
            @click="resendOne",
            :resend_loading="resend_loading",
            depressed,
            color="primary"
          ) {{ $vuetify.lang.t('$vuetify.lable.ok') }}
</template>
    
<script>
export default {
  name: "ExceptionCallback",
  data() {
    return {
      showTable: false,
      tableLoading: false,
      is_resend: false,
      resend_loading: false,
      resend_dialog: false,
      resend_asset: "USDT",
      showPickStartDate: false,
      showPickEndDate: false,
      curr_item: {},
      notifyStates: [
        this.$vuetify.lang.t("$vuetify.table.all"),
        this.$vuetify.lang.t("$vuetify.lable.wait_send"),
        this.$vuetify.lang.t("$vuetify.lable.send_success"),
      ],
      order: {
        id: "",
        startTime: "",
        endTime: "",
        coinType: this.$vuetify.lang.t("$vuetify.table.all"),
        max: "",
        min: "",
        notifyState: this.$vuetify.lang.t("$vuetify.table.all"),
        address: "",
        tag: "",
        txHash: "",
      },
      pagination: {
        size: 15,
        total: 1,
        current: 1,
      },
      transDetail: {
        headers: [
          {
            text: this.$vuetify.lang.t("$vuetify.table.orderId"),
            sortable: false,
            value: "trxNo",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.orderTime"),
            sortable: false,
            value: "createTime",
          },
          {
            class: "custom-min-width-column",
            text: this.$vuetify.lang.t("$vuetify.lable.tran_type"),
            sortable: false,
            value: "cmdId",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.asset"),
            sortable: false,
            value: "asset",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.lable.amount_number"),
            sortable: false,
            value: "txAmount",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.address"),
            sortable: false,
            value: "toAddress",
          },
          {
            class: "custom-min-width-column",
            text: this.$vuetify.lang.t("$vuetify.table.tag"),
            sortable: false,
            value: "note",
          },
          {
            class: "custom-min-width-column",
            text: this.$vuetify.lang.t("$vuetify.lable.call_back_status"),
            sortable: false,
            value: "notifyState",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.txHash"),
            sortable: false,
            value: "txHash",
            align: "center",
            width: "104",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.lable.operating"),
            sortable: false,
            value: "operating",
            align: "center",
            width: "104",
          },
        ],
        items: [],
      },
      rules: {
        minFee: (v) => {
          if (!v) {
            v = 0;
          }
          if (this.order.max) {
            let max = parseFloat(this.order.max);
            let min = parseFloat(this.order.min || 0);
            return (
              min <= max ||
              this.$vuetify.lang.t("$vuetify.orderComponent.moreThanMax")
            );
          }
          return true;
        },
      },
    };
  },
  mounted() {
    this.getData();
    this.showTable = true;
  },
  computed: {
    allCoins() {
      let coins = [this.$vuetify.lang.t("$vuetify.table.all")];
      return coins.concat(
        Object.keys(this.$store.state.bossAssetsCenter.allCoins)
      );
    },
    currentLang() {
      return this.$vuetify.lang.current;
    },
  },
  watch: {
    currentLang() {
      this.notifyStates = [
        this.$vuetify.lang.t("$vuetify.table.all"),
        this.$vuetify.lang.t("$vuetify.lable.wait_send"),
        this.$vuetify.lang.t("$vuetify.lable.send_success"),
      ];
      (this.order = {
        id: "",
        startTime: "",
        endTime: "",
        coinType: this.$vuetify.lang.t("$vuetify.table.all"),
        max: "",
        min: "",
        notifyState: this.$vuetify.lang.t("$vuetify.table.all"),
        address: "",
        tag: "",
        txHash: "",
      }),
        (this.transDetail.headers = [
          {
            text: this.$vuetify.lang.t("$vuetify.table.orderId"),
            sortable: false,
            value: "trxNo",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.orderTime"),
            sortable: false,
            value: "createTime",
          },
          {
            class: "custom-min-width-column",
            text: this.$vuetify.lang.t("$vuetify.lable.tran_type"),
            sortable: false,
            value: "cmdId",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.asset"),
            sortable: false,
            value: "asset",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.lable.amount_number"),
            sortable: false,
            value: "txAmount",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.address"),
            sortable: false,
            value: "toAddress",
          },
          {
            class: "custom-min-width-column",
            text: this.$vuetify.lang.t("$vuetify.table.tag"),
            sortable: false,
            value: "note",
          },
          {
            class: "custom-min-width-column",
            text: this.$vuetify.lang.t("$vuetify.lable.call_back_status"),
            sortable: false,
            value: "notifyState",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.txHash"),
            sortable: false,
            value: "txHash",
            align: "center",
            width: "104",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.lable.operating"),
            sortable: false,
            value: "operating",
            align: "center",
            width: "104",
          },
        ]);
    },
  },
  methods: {
    getItemAddress(address) {
      let _data = address.split("|");
      return _data[0] || address;
    },
    getItemTag(address) {
      let _data = address.split("|");
      return _data[1] || "-";
    },
    checkMinFee() {
      let msg = this.rules.minFee();
      if (msg != true) {
        this.$refs.minFee.messages = msg;
        this.$refs.minFee.error = true;
      } else {
        this.$refs.minFee.messages = "";
        this.$refs.minFee.error = false;
      }
    },
    allowedStartTime(val) {
      return !!this.order.endTime
        ? val <= this.order.endTime
        : val <= this.$formatTime("yyyy-mm-dd");
    },
    allowedEndTime(val) {
      return !!this.order.startTime
        ? val >= this.order.startTime && val <= this.$formatTime("yyyy-mm-dd")
        : val <= this.$formatTime("yyyy-mm-dd");
    },
    async resend() {
      this.resend_loading = true;
      let res = await this.$store.dispatch("bossAssetsCenter/pushNotifyAgain", {
        enterpriseManagerId: sessionStorage.getItem("enterpriseManagerId"),
        asset: this.resend_asset,
      });
      if (res.code == 200) {
        this.$success("success");
        this.resend_dialog = false;
        this.getData();
      } else {
        this.$error(res.message);
      }
      this.resend_loading = false;
    },
    async resendOne() {
      this.resend_loading = true;
      let res = await this.$store.dispatch("bossAssetsCenter/pushNotifyAgain", {
        enterpriseManagerId: sessionStorage.getItem("enterpriseManagerId"),
        asset: this.curr_item.asset,
        id: this.curr_item.id,
      });
      if (res.code == 200) {
        this.$success("success");
        this.is_resend = false;
        this.getData();
      } else {
        this.$error(res.message);
      }
      this.resend_loading = false;
    },
    getQueryParams() {
      let startTime = this.order.startTime
        ? new Date(
            parseInt(this.order.startTime.split("-")[0]),
            parseInt(this.order.startTime.split("-")[1]) - 1,
            parseInt(this.order.startTime.split("-")[2]),
            0,
            0,
            0,
            0
          ).getTime()
        : null;
      let endTime = this.order.endTime
        ? new Date(
            parseInt(this.order.endTime.split("-")[0]),
            parseInt(this.order.endTime.split("-")[1]) - 1,
            parseInt(this.order.endTime.split("-")[2]),
            23,
            59,
            59,
            0
          ).getTime()
        : null;
      let params = {
        enterpriseMemberId:2,
        pageNumber: this.pagination.current,
        pageSize: this.pagination.size,
        trxNo: this.order.id,
        startTime: startTime,
        endTime: endTime,
        asset:
          this.order.coinType == this.$vuetify.lang.t("$vuetify.table.all")
            ? null
            : this.order.coinType,
        maxTxAmount: this.order.max,
        minTxAmount: this.order.min,
        notifyState:
          this.order.notifyState == this.$vuetify.lang.t("$vuetify.table.all")
            ? null
            : this.order.notifyState ==
              this.$vuetify.lang.t("$vuetify.lable.wait_send")
            ? 0
            : 1,
        txHash: this.order.txHash,
        sortAttribute: 1,
        sortType: "descend",
      };
      if (
        this.order.coinType == this.$vuetify.lang.t("$vuetify.table.all") ||
        this.order.coinType == "XRP" ||
        this.order.coinType == "EOS"
      ) {
        params.toAddress =
          this.order.tag == ""
            ? this.order.address || ""
            : this.order.address == ""
            ? this.order.tag
            : `${this.order.address}|${this.order.tag}`;
      } else {
        params.toAddress = this.order.address;
      }

      return params;
    },
    async getData() {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      try {
        let params = this.getQueryParams();
        params.walletId = window.sessionStorage.getItem('userId')
        let res = await this.$store.dispatch(
          "bossAssetsCenter/queryWalletNotify",
          params
        );
        if (res.code == "200") {
          this.transDetail.items = res.data.items;
          this.pagination.total = res.data.totalPage;
          this.pagination.current = res.data.pageNumber;
        } else {
          this.$error(res.message);
        }
      } catch (error) {
        this.$error("Error");
      }
      this.tableLoading = false;
    },
    async filterTransDetail() {
      this.pagination.current = 1;
      await this.getData();
    },
    pageChange() {
      this.getData();
    },
  },
};
</script>

<style lang="stylus" scope>
.exception_callback {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F5F5FC;

  .order-management {
    min-height: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: #F5F5FC;

    .v-card {
      flex-grow: 1;
    }

    .data-tools {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-left: -16px;
      width: calc(100% + 16px);

      .filter-fee {
        .v-input__slot {
          margin-bottom: 0;
        }

        .v-text-field__details {
          margin-bottom: 0;
          position: absolute;
          bottom: 0;
          transform: translateY(calc(100% + 4px));
        }
      }

      .tool-box {
        display: flex;
        align-items: center;
        margin: 16px 0 0 16px;
        justify-content: space-between;
      }

      .per-tool {
        flex-grow: 0;
      }
    }

    .custom-min-width-column {
      min-width: 90px;
    }
  }
}
</style>