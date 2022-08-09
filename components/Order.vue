<template lang="pug">
.order-management.pa-6
  v-card
    v-card-title
      .title {{ pageTitle }}
    v-divider
    //- 
    v-card-text.data-tools(style="box-sizing: border-box; padding: 0 16px")
      .tool-box
        span {{ $vuetify.lang.t('$vuetify.table.orderId') }}：
        v-text-field.per-tool(
          x-small,
          v-model="order.id",
          style="width: 310px; transform: scale(0.85)",
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
          style="width: 150px; transform: scale(0.85)",
          :items="allCoins",
          outlined,
          single-line,
          dense,
          hide-details
        )

      .tool-box(v-if="identify == 'user' && manageWay == 'withdraw'")
        span {{ $vuetify.lang.t('$vuetify.table.username') }}/{{ $vuetify.lang.t('$vuetify.table.merchantOrderId') }}：
        v-text-field.per-tool(
          v-model="order.userName",
          style="width: 230px; transform: scale(0.85)",
          :label="$vuetify.lang.t('$vuetify.table.username') + '/' + $vuetify.lang.t('$vuetify.table.merchantOrderId')",
          outlined,
          single-line,
          dense,
          :placeholder="$vuetify.lang.t('$vuetify.orderComponent.pleaseEnter') + $vuetify.lang.t('$vuetify.table.username') + '/' + $vuetify.lang.t('$vuetify.table.merchantOrderId')",
          hide-details
        )

      .tool-box
        span(v-if="manageWay == 'deposit'") {{ $vuetify.lang.t('$vuetify.table.arrivalTime') }}：
        span(v-else-if="manageWay == 'withdraw'") {{ $vuetify.lang.t('$vuetify.table.orderTime') }}：
        span(v-else) {{ $vuetify.lang.t('$vuetify.table.time') }}：
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
              style="width: 200px; transform: scale(0.85)",
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
              style="width: 200px; transform: scale(0.85)",
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

      .tool-box(v-if="manageWay == 'all'")
        span {{ $vuetify.lang.t('$vuetify.table.type') }}：
        v-select.per-tool(
          v-model="order.type",
          style="width: 150px; transform: scale(0.85)",
          :items="transTypes",
          outlined,
          single-line,
          dense,
          hide-details
        )

      .tool-box(v-if="manageWay == 'all'")
        span {{ $vuetify.lang.t('$vuetify.table.incomeExpenditure') }}：
        v-select.per-tool(
          v-model="order.incomeAndExpend",
          style="width: 150px; transform: scale(0.85)",
          :items="incomeExpenditure",
          outlined,
          single-line,
          dense,
          hide-details
        )

      .tool-box(v-if="manageWay == 'withdraw'")
        span {{ $vuetify.lang.t('$vuetify.table.orderStatus') }}：
        v-select.per-tool(
          v-model="order.status",
          style="width: 150px; transform: scale(0.85)",
          :items="transStatus",
          outlined,
          single-line,
          dense,
          hide-details
        )

      .tool-box.filter-fee(v-if="manageWay != 'all'")
        span {{ manageWay == 'deposit' ? $vuetify.lang.t('$vuetify.table.arrival') : $vuetify.lang.t('$vuetify.table.withdraw') }} {{ $vuetify.lang.t('$vuetify.table.amount') }}：
        v-text-field.per-tool(
          v-model="order.min",
          style="width: 130px; transform: scale(0.85)",
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
          style="width: 130px; transform: scale(0.85)",
          :label="$vuetify.lang.t('$vuetify.table.max') + $vuetify.lang.t('$vuetify.table.amount')",
          outlined,
          single-line,
          dense,
          :placeholder="$vuetify.lang.t('$vuetify.table.max') + $vuetify.lang.t('$vuetify.table.amount')",
          type="number",
          max="10",
          @input="checkMinFee"
        )
      .tool-box(v-if="manageWay != 'all'")
        span {{ $vuetify.lang.t('$vuetify.table.address') }}：
        v-text-field.per-tool(
          x-small,
          v-model="order.address",
          style="width: 310px; transform: scale(0.85)",
          :label="$vuetify.lang.t('$vuetify.table.address')",
          outlined,
          single-line,
          dense,
          :placeholder="$vuetify.lang.t('$vuetify.orderComponent.pleaseEnter') + $vuetify.lang.t('$vuetify.table.address')",
          hide-details
        )
      .tool-box(v-if="manageWay != 'all'")
        span {{ $vuetify.lang.t('$vuetify.table.tag') }}：
        v-text-field.per-tool(
          x-small,
          v-model="order.tag",
          style="width: 120px; transform: scale(0.85)",
          :label="$vuetify.lang.t('$vuetify.table.tag')",
          outlined,
          single-line,
          dense,
          :placeholder="$vuetify.lang.t('$vuetify.orderComponent.pleaseEnter') + $vuetify.lang.t('$vuetify.table.tag')",
          hide-details
        )
      .tool-box(v-if="manageWay != 'all'")
        span {{ $vuetify.lang.t('$vuetify.table.txHash') }}：
        v-text-field.per-tool(
          x-small,
          v-model="order.txHash",
          style="width: 310px; transform: scale(0.85)",
          :label="$vuetify.lang.t('$vuetify.table.txHash')",
          outlined,
          single-line,
          dense,
          :placeholder="$vuetify.lang.t('$vuetify.orderComponent.pleaseEnter') + $vuetify.lang.t('$vuetify.table.txHash')",
          hide-details
        )
      .tool-box(v-if="manageWay != 'all'")
        span {{ $vuetify.lang.t('$vuetify.table.merchant') }}：
        //- v-select.per-tool(
        //-   v-model="order.selectedMerchant",
        //-   style="width: 150px; transform: scale(0.85)",
        //-   :items="merchantPerson",
        //-   outlined,
        //-   single-line,
        //-   dense,
        //-   hide-details
        //- )
        el-select(
          v-model="order.selectedMerchant",
          filterable,
          style="width: 150px; transform: scale(0.9)",
          :placeholder="$vuetify.lang.t('$vuetify.mine.商户邮箱')"
        )
          el-option(
            v-for="item,index in merchantPerson",
            :key="index",
            :label="item",
            :value="item"
          )
        //- <el-select v-model="value" filterable placeholder="请选择">
        //-   <el-option
        //-     v-for="item in options"
        //-     :key="item.value"
        //-     :label="item.label"
        //-     :value="item.value">
        //-   </el-option>
        //- </el-select>
        //- v-text-field.per-tool(
        //-   v-model="order.selectedMerchant",
        //-   style="width: 150px; transform: scale(0.85)",
        //-   :placeholder="$vuetify.lang.t('$vuetify.merchantInfo.merchantName')",
        //-   :label="$vuetify.lang.t('$vuetify.merchantInfo.merchantName')",
        //-   outlined,
        //-   single-line,
        //-   dense,
        //-   hide-details
        //- )
      .tool-box
        v-btn(
          depressed,
          color="primary",
          @click="filterTransDetail",
          :loading="tableLoading"
        ) {{ $vuetify.lang.t('$vuetify.orderComponent.search') }}

    v-card-text
      v-data-table.elevation-0(
        :key="identify + manageWay",
        :headers="transDetail.headers",
        :items="transDetail.items",
        :itemsPerPage="pagination.size",
        :server-items-length="pagination.total",
        :loading="tableLoading",
        loading-text="Loading... Please wait",
        hide-default-footer,
        v-if="showTable"
      )
        template(v-slot:item.toAddress="{ item }")
          span {{ getItemAddress(item.to) }}

        template(v-slot:item.note="{ item }")
          span(v-if="item.asset == 'XRP' || item.asset == 'EOS'") {{ getItemTag(item.toAddress) }}
          span(v-else) {{ item.note || '-' }}

        template(v-slot:item.created_at="{ item }")
          span {{ item.created_at }}

        template(v-slot:item.income_expenditure="{ item }")
          span(v-if="item.type === 1") {{ $vuetify.lang.t('$vuetify.indexPage.income') }}
          span(v-else) {{ $vuetify.lang.t('$vuetify.indexPage.expenditure') }}

        template(v-slot:item.type="{ item }")
          span {{ item.enterpriseMemberId == '1' ? $vuetify.lang.t('$vuetify.table.merchant') : $vuetify.lang.t('$vuetify.table.user') }} {{ ' ' }}
          span(v-if="item.type == 1") {{ $vuetify.lang.t('$vuetify.table.deposit') }}
          span(v-else-if="item.type == 2") {{ $vuetify.lang.t('$vuetify.table.withdraw') }}
          span(v-else-if="item.type == 2") {{ $vuetify.lang.t('$vuetify.table.deposit') + ' ' + $vuetify.lang.t('$vuetify.table.minerFee') }}
          span(v-else-if="item.type == 3") {{ $vuetify.lang.t('$vuetify.table.deposit') + ' ' + $vuetify.lang.t('$vuetify.table.serverFee') }}
          span(v-else-if="item.type == 4") {{ $vuetify.lang.t('$vuetify.table.withdraw') + ' ' + $vuetify.lang.t('$vuetify.table.minerFee') }}
          span(v-else-if="item.type == 5") {{ $vuetify.lang.t('$vuetify.table.withdraw') + ' ' + $vuetify.lang.t('$vuetify.table.serverFee') }}
          span(v-else-if="item.type == 7") {{ $vuetify.lang.t('$vuetify.table.withdraw') + ' ' + $vuetify.lang.t('$vuetify.table.minerFee') }}
          span(v-else) {{ item.type }}

        template(v-slot:item.status="{ item }")
          //- span(v-if="item.status == -1") {{ $vuetify.lang.t('$vuetify.mine.已拒绝') }}
          span(v-if="item.status == 0") {{ $vuetify.lang.t('$vuetify.mine.未处理') }}
          span(v-else-if="item.status == 1") {{ $vuetify.lang.t('$vuetify.mine.审核成功') }}
          span(v-else-if="item.status == 2") {{ $vuetify.lang.t('$vuetify.mine.审核驳回') }}
          span(v-else-if="item.status == 3") {{ $vuetify.lang.t('$vuetify.mine.交易成功') }}
          span(v-else-if="item.status == 4") {{ $vuetify.lang.t('$vuetify.mine.交易失败') }}

        template(v-slot:item.asset="{ item }")
          span {{ item.coin }}

        template(v-slot:item.addColumn="{ item }")
          span {{ item.userId }}

        template(v-slot:item.amount="{ item }")
          span(v-if="manageWay == 'withdraw'") {{ $fixed8(item.amount) }}
          span(v-else)
            span(v-if="item.type == 0 || item.type == 1") {{ $fixed8(item.amount) }}
            span(v-else) {{ $fixed8(item.fee) }}

        template(v-slot:item.afterChangeMerchantBalance="{ item }")
          span {{ $fixed8(item.afterChangeMerchantBalance) }}

        template(v-slot:item.trxNo="{ item }")
          span {{ item.own_order_sn }}

        template(v-slot:item.notify_status="{ item }")
          .align-center 
            el-button(
              v-if="item.notify_status == 0 && item.status == 3",
              style="color:#5f74d2",
              size="mini"
              @click="rebackOrder(item)"
            ) {{ $vuetify.lang.t('$vuetify.mine.重新回调') }}
            span(v-else) -
        template(v-slot:item.operate="{ item }")
          template(v-if="manageWay == 'withdraw'")
            el-popover(
              placement="top",
              width="400",
              trigger="hover",
              theme="dark",
              :content="item.transaction_id",
              v-if="item.type == 2"
            )
            .actions-box(v-if="item.status == 0")
              el-button(
                style="color: #5f74d2",
                size="mini",
                slot="reference",
                @click="rejectWithdraw(item)"
              ) {{ $vuetify.lang.t('$vuetify.mine.拒绝') }}
              el-button(
                style="color: #5f74d2",
                size="mini",
                slot="reference",
                v-if="false",
                @click="showTransForm(item)"
              ) {{ $vuetify.lang.t('$vuetify.mine.通过') }}
            span(v-else) -

        template(v-slot:item.txHash="{ item }")
          template(v-if="identify == 'all' && manageWay == 'all'")
            el-popover(
              placement="top",
              width="400",
              trigger="hover",
              theme="dark",
              :content="item.transaction_id",
              v-if="item.type == 0 || item.type == 1"
            )
              el-button(
                style="color: #5f74d2",
                size="mini",
                slot="reference",
                @click="$toBlockBrowser(item.transaction_id, item)"
              ) {{ $vuetify.lang.t('$vuetify.indexPage.view') }}
            span(v-else) 
          template(v-else)
            el-popover(
              placement="top",
              width="400",
              trigger="hover",
              theme="dark",
              :content="item.transaction_id",
              v-if="item.transaction_id"
            )
              div(slot="reference")
                el-button(
                  style="color: #5f74d2",
                  size="mini",
                  v-if="item.status == 3",
                  @click="$toBlockBrowser(item.transaction_id, item)"
                ) {{ $vuetify.lang.t('$vuetify.indexPage.view') }}
                span(v-else) -
              
            el-button(v-if="identify == 'merchant'")(
             :style="{ cursor: $store.state.bossAssetsCenter.merchantInfo.is_admin ? 'pointer' : 'not-allowed', color: $store.state.bossAssetsCenter.merchantInfo.is_admin ? '#5f74d2' : '#999' }",
               size="mini",
               @click="$store.state.bossAssetsCenter.merchantInfo.is_admin ? ((orderID = item.id), (setItemHash = true)) : null"
             ) {{ $vuetify.lang.t('$vuetify.mine.填写交易HASH') }}

    v-divider
    v-card-text.d-flex.align-center.justify-center
      el-pagination(
        background,
        layout="prev, pager, next",
        @current-change="pageChange",
        :total="pagination.total * 10"
      )

    // - 发起转账
    v-dialog(
      v-model="showTransModel",
      max-width="780",
      persistent,
      no-click-animation,
      v-if="showTransModel"
    )
      v-card.pb-4
        v-card-title.headline.pr-2.pb-6
          v-spacer
          v-btn(icon, @click="closeTransForm")
            v-icon mdi-close

        v-card-text.my-2.px-24
          withdraw(
            :asset="withdraw.coin",
            :assetProtocol="withdraw.protocol",
            :to="withdraw.to",
            :amount="Math.abs(withdraw.amount)",
            :userWithdrawId="withdraw.id"
          )
    v-dialog(
      v-model="setItemHash",
      max-width="500",
      persistent,
      no-click-animation,
      v-if="setItemHash"
    )
      v-card.pb-4 
        v-card-title.headline.pr-2.pb-6
          v-spacer
          v-btn(icon, @click="setItemHash = false; setAddress = null")
            v-icon mdi-close
        v-card-text.my-2.px-24
          v-text-field(
            placeholder="请输入地址",
            v-model="setAddress",
            style="width: 100%; transform: scale(0.85)",
            hide-details,
            :label="$vuetify.lang.t('$vuetify.mine.填写交易HASH')"
          )
        v-card-actions 
          v-spacer 
          v-btn(
            color="primary",
            text,
            @click="submitSetHash",
            :loading="waitSet"
          ) {{ $vuetify.lang.t('$vuetify.mine.确认') }}
    v-dialog(
      v-model="turnWithdraw",
      max-width="400",
      persistent,
      no-click-animation,
      v-if="turnWithdraw"
    )
      v-card.pb-4 
        v-card-title.headline.pr-2.pb-6 提示
          v-spacer
          v-btn(icon, @click="turnWithdraw = false;")
              v-icon mdi-close
        v-card-text.my-2.px-24.align-center
          h3.mine-title 是否确认提币?
        v-card-actions 
          v-spacer 
          v-btn(
            color="primary",
            text,
            @click="turnWithdraw = false",
            :loading="waitSet"
          ) {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
          v-btn(
            color="primary",
            @click="submitWithdraw",
            :loading="waitSet"
          ) {{ $vuetify.lang.t('$vuetify.mine.确认') }}

        
</template>
    
<script>
var that = null;
import withdraw from "../pages/funding/merchant_withdraw";
export default {
  components: {
    withdraw,
  },
  props: {
    identify: {
      type: String,
      default: "user",
    },
    manageWay: {
      type: String,
      default: "deposit",
    },
    pageTitle: {
      type: String,
      default: "",
    },
  },
  data: () => {
    return {
      turnWithdraw:false,//用户提币
      showTransModel: false,
      showTable: false,
      tableLoading: false,
      pageCircle: true,
      pagination: {
        size: 10,
        total: 1,
        current: 1,
      },
      rules: {
        minFee: (v) => {
          return true;
        },
      },
      order: {},
      showPickStartDate: false,
      showPickEndDate: false,
      transStatus: [],
      merchantPerson: [], //商户选择
      transTypes: [],
      incomeExpenditure: [],
      transDetail: {
        headers: [],
        items: [],
      },
      withdraw: {
        coin: "",
        to: "",
        amount: "",
      },
      merchantList: [], //商户列表
      setItemHash: false, //设置交易HASH
      setAddress: null, //交易HASH
      orderID: null,
      waitSet: false,
    };
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
      this.rules = {
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
      };
      this.order = {
        id: "",
        userName: "",
        coinType: this.$vuetify.lang.t("$vuetify.table.all"),
        incomeAndExpend: this.$vuetify.lang.t("$vuetify.table.all"),
        type: this.$vuetify.lang.t("$vuetify.table.all"),
        startTime: "",
        endTime: "",
        min: "",
        max: "",
        status: this.$vuetify.lang.t("$vuetify.table.all"),
        address: "",
        tag: "",
        txHash: "",
        merchant: "",
        selectedMerchant: this.$vuetify.lang.t("$vuetify.mine.全部"),
      };
      this.incomeExpenditure = [
        this.$vuetify.lang.t("$vuetify.table.all"),
        this.$vuetify.lang.t("$vuetify.indexPage.income"),
        this.$vuetify.lang.t("$vuetify.indexPage.expenditure"),
      ];
      this.transStatus = [
        this.$vuetify.lang.t("$vuetify.table.all"),
        this.$vuetify.lang.t("$vuetify.mine.已拒绝"),
        this.$vuetify.lang.t("$vuetify.table.withdrawing"),
        this.$vuetify.lang.t("$vuetify.table.withdrawFinished"),
      ];
      this.transTypes = [
        this.$vuetify.lang.t("$vuetify.table.all"),
        this.$vuetify.lang.t("$vuetify.table.merchant") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.deposit"),
        this.$vuetify.lang.t("$vuetify.table.merchant") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.deposit") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.serverFee"),
        // this.$vuetify.lang.t("$vuetify.table.merchant") + this.$vuetify.lang.t("$vuetify.table.deposit") + this.$vuetify.lang.t("$vuetify.table.minerFee"),
        this.$vuetify.lang.t("$vuetify.table.merchant") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.withdraw"),
        this.$vuetify.lang.t("$vuetify.table.merchant") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.withdraw") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.serverFee"),
        this.$vuetify.lang.t("$vuetify.table.merchant") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.withdraw") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.minerFee"),
        this.$vuetify.lang.t("$vuetify.table.user") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.deposit"),
        this.$vuetify.lang.t("$vuetify.table.user") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.deposit") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.serverFee"),
        // this.$vuetify.lang.t("$vuetify.table.user") + this.$vuetify.lang.t("$vuetify.table.deposit") + this.$vuetify.lang.t("$vuetify.table.minerFee"),
        this.$vuetify.lang.t("$vuetify.table.user") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.withdraw"),
        this.$vuetify.lang.t("$vuetify.table.user") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.withdraw") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.serverFee"),
        this.$vuetify.lang.t("$vuetify.table.user") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.withdraw") +
          " " +
          this.$vuetify.lang.t("$vuetify.table.minerFee"),
      ];
      this.calcTableHeader();
    },
  },
  created() {
    that = this;
    this.rules = {
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
    };
    this.order = {
      id: "",
      userName: "",
      coinType: this.$vuetify.lang.t("$vuetify.table.all"),
      incomeAndExpend: this.$vuetify.lang.t("$vuetify.table.all"),
      type: this.$vuetify.lang.t("$vuetify.table.all"),
      startTime: "",
      endTime: "",
      min: "",
      max: "",
      status: this.$vuetify.lang.t("$vuetify.table.all"),
      address: "",
      tag: "",
      txHash: "",
      merchant: "",
      selectedMerchant: this.$vuetify.lang.t("$vuetify.mine.全部"),
    };
    this.incomeExpenditure = [
      this.$vuetify.lang.t("$vuetify.table.all"),
      this.$vuetify.lang.t("$vuetify.indexPage.income"),
      this.$vuetify.lang.t("$vuetify.indexPage.expenditure"),
    ];
    this.transStatus = [
      this.$vuetify.lang.t("$vuetify.table.all"),
      this.$vuetify.lang.t("$vuetify.mine.已拒绝"),
      this.$vuetify.lang.t("$vuetify.table.withdrawing"),
      this.$vuetify.lang.t("$vuetify.table.withdrawFinished"),
    ];
    this.merchantPerson = [];
    this.transTypes = [
      this.$vuetify.lang.t("$vuetify.table.all"),
      this.$vuetify.lang.t("$vuetify.table.merchant") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.deposit"),
      this.$vuetify.lang.t("$vuetify.table.merchant") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.deposit") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.serverFee"),
      // this.$vuetify.lang.t("$vuetify.table.merchant") +
      //   this.$vuetify.lang.t("$vuetify.table.deposit") +
      //   this.$vuetify.lang.t("$vuetify.table.minerFee"),
      this.$vuetify.lang.t("$vuetify.table.merchant") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.withdraw"),
      this.$vuetify.lang.t("$vuetify.table.merchant") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.withdraw") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.serverFee"),
      this.$vuetify.lang.t("$vuetify.table.merchant") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.withdraw") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.minerFee"),
      this.$vuetify.lang.t("$vuetify.table.user") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.deposit"),
      this.$vuetify.lang.t("$vuetify.table.user") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.deposit") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.serverFee"),
      // this.$vuetify.lang.t("$vuetify.table.user") +
      //   this.$vuetify.lang.t("$vuetify.table.deposit") +
      //   this.$vuetify.lang.t("$vuetify.table.minerFee"),
      this.$vuetify.lang.t("$vuetify.table.user") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.withdraw"),
      this.$vuetify.lang.t("$vuetify.table.user") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.withdraw") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.serverFee"),
      this.$vuetify.lang.t("$vuetify.table.user") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.withdraw") +
        " " +
        this.$vuetify.lang.t("$vuetify.table.minerFee"),
    ];
    this.getAllMerchant();
  },
  async mounted() {
    await this.$nextTick();
    this.order.startTime = this.order.endTime = null;
    this.calcTableHeader();
    this.queryWalletAssetsFlow();
    this.showTable = true;
  },
  methods: {
    //确认提币
    async submitWithdraw(){
      console.log(this.withdraw);
      const result = await this.$store.dispatch('bossAssetsCenter/userWithdraw',{withdrawId:this.withdraw.id});
      const { code } = result;
      if(code != 200){
        Message.error(result.message);
        return;
      }
      Message.success('通过成功');
      this.turnWithdraw = false;  
      this.filterTransDetail();
    },
    //重新回调
    async rebackOrder(_item){
      const result = await this.$store.dispatch('bossAssetsCenter/rebackOrder',{orderId:_item.id});
      const { code } = result;
      if(code != 200){
        Message.error(result.message);
        return;
      };
      Message.success(this.$vuetify.lang.t("$vuetify.mine.从新回调成功"));
      this.filterTransDetail();
    },
    //拒绝提币
    async rejectWithdraw(_item) {
      const result = await this.$store.dispatch(
        "bossAssetsCenter/rejectWithdraw",
        { withdrawId: _item.id }
      );
      const { code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success(this.$vuetify.lang.t("$vuetify.mine.已拒绝"));
      this.filterTransDetail();
    },
    //上传交易HASH
    async submitSetHash() {
      if (!this.setAddress) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.请输入HASH地址"));
        return;
      }
      this.waitSet = true;
      const params = {
        txid: this.setAddress,
        withdraw_id: this.orderID,
      };
      const result = await this.$store.dispatch(
        "bossAssetsCenter/setHash",
        params
      );
      const { code } = result;
      this.waitSet = false;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success(this.$vuetify.lang.t("$vuetify.mine.设置成功"));
      this.filterTransDetail();
      this.setItemHash = false;
    },
    //选择商户
    selectMerchant(_val) {
      let val;
      this.merchantList.forEach((e) => {
        if (_val == e.name) {
          val = e.value;
        }
      });
      return val;
    },
    //获取所有商户
    async getAllMerchant() {
      const result = await this.$store.dispatch(
        "bossAssetsCenter/queryAllMerchant"
      );
      let arr = [];
      result.data.forEach((e) => {
        arr.push(e.name);
      });
      this.merchantList = result.data;
      this.merchantPerson = arr;
      this.merchantPerson.unshift(this.$vuetify.lang.t("$vuetify.mine.全部"));
      // this.merchantPerson = this.merchantPerson.map(item => {
      //   return {value:item,label:item}
      // })
      this.merchantList.unshift({
        name: this.$vuetify.lang.t("$vuetify.mine.全部"),
        value: null,
      });
    },
    showTransForm(item) {
      this.withdraw = item;
      this.turnWithdraw = true;
      // this.showTransModel = !this.showTransModel;
    },
    closeTransForm() {
      this.showTransModel = !this.showTransModel;
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
    getItemAddress(address) {
      let _data = address.split("|");
      return _data[0] || address;
    },
    getItemTag(address) {
      let _data = address.split("|");
      return _data[1] || "-";
    },
    calcTableHeader() {
      if (this.manageWay == "deposit" && this.identify == "user") {
        // 用户充币订单表头
        this.$set(this.transDetail, "headers", [
          {
            text: this.$vuetify.lang.t("$vuetify.table.orderId"),
            sortable: false,
            value: "trxNo",
          },
          // {
          //   class: "custom-min-width-column",
          //   text:
          //     this.$vuetify.lang.t("$vuetify.table.username") +
          //     "/" +
          //     this.$vuetify.lang.t("$vuetify.table.merchantOrderId"),
          //   sortable: false,
          //   value: "addColumn",
          // },
          // {
          //   class: 'custom-min-width-column',
          //   text: this.$vuetify.lang.t('$vuetify.table.username')+'/'+this.$vuetify.lang.t('$vuetify.table.merchantOrderId'),
          //   sortable: false,
          //   value: "userId ",
          // },
          {
            text: this.$vuetify.lang.t("$vuetify.table.arrivalTime"),
            sortable: false,
            value: "created_at",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.asset"),
            sortable: false,
            value: "asset",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.arrivalAmount"),
            sortable: false,
            value: "true_amount",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.address"),
            sortable: false,
            value: "toAddress",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.mine.回调次数"),
            sortable: false,
            align: "center",
            value: "notify_number",
          },
          {
            align: "center",
            text: this.$vuetify.lang.t("$vuetify.mine.回调状态"),
            sortable: false,
            value: "notify_status",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.txHash"),
            sortable: false,
            align: "center",
            value: "txHash",
            width: "104",
          },
        ]);
      } else if (this.manageWay === "withdraw" && this.identify === "user") {
        // 用户提币订单表头
        this.transDetail.headers = [
          {
            text: this.$vuetify.lang.t("$vuetify.table.orderId"),
            sortable: false,
            value: "trxNo",
          },
          {
            class: "custom-min-width-column",
            text:
              this.$vuetify.lang.t("$vuetify.table.username") +
              "/" +
              this.$vuetify.lang.t("$vuetify.table.merchantOrderId"),
            sortable: false,
            value: "addColumn",
          },
          // {
          //   class: 'custom-min-width-column',
          //   text: this.$vuetify.lang.t('$vuetify.table.username')+'/'+this.$vuetify.lang.t('$vuetify.table.merchantOrderId'),
          //   sortable: false,
          //   value: "userId ",
          // },
          {
            text: this.$vuetify.lang.t("$vuetify.table.orderTime"),
            sortable: false,
            value: "created_at",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.asset"),
            sortable: false,
            value: "asset",
          },
          {
            text: '提币金额',
            sortable: false,
            value: "amount",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.mine.到账金额"),
            sortable: false,
            value: "true_amount",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.userWithdrawAddress"),
            sortable: false,
            value: "toAddress",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.mine.回调次数"),
            sortable: false,
            align: "center",
            value: "notify_number",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.mine.回调状态"),
            sortable: false,
            align: "center",
            value: "notify_status",
          },
          {
            class: "custom-min-width-column",
            text: this.$vuetify.lang.t("$vuetify.table.orderStatus"),
            sortable: false,
            value: "status",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.txHash"),
            sortable: false,
            value: "txHash",
            align: "center",
            width: "104",
          },
          // {
          //   text: this.$vuetify.lang.t("$vuetify.mine.操作"),
          //   sortable: false,
          //   value: "operate",
          //   align: "center",
          //   width: "104",
          // },
        ];
      } else if (this.manageWay == "deposit" && this.identify == "merchant") {
        // 商家充币订单表头
        this.transDetail.headers = [
          {
            text: this.$vuetify.lang.t("$vuetify.table.orderId"),
            sortable: false,
            value: "trxNo",
          },

          {
            text: this.$vuetify.lang.t("$vuetify.table.arrivalTime"),
            sortable: false,
            value: "created_at",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.asset"),
            sortable: false,
            value: "asset",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.arrivalAmount"),
            sortable: false,
            value: "true_amount",
          },
          {
            text:
              this.$vuetify.lang.t("$vuetify.table.deposit") +
              this.$vuetify.lang.t("$vuetify.table.address"),
            sortable: false,
            value: "toAddress",
          },
          // {
          //   text:
          //     this.$vuetify.lang.t("$vuetify.table.deposit") +
          //     this.$vuetify.lang.t("$vuetify.table.tag"),
          //   sortable: false,
          //   value: "note",
          // },
          {
            text: this.$vuetify.lang.t("$vuetify.table.txHash"),
            sortable: false,
            value: "txHash",
            align: "center",
            width: "104",
          },
        ];
      } else if (this.manageWay == "withdraw" && this.identify == "merchant") {
        // 商家提币订单表头
        this.transDetail.headers = [
          {
            text: this.$vuetify.lang.t("$vuetify.table.orderId"),
            sortable: false,
            value: "trxNo",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.orderTime"),
            sortable: false,
            value: "created_at",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.asset"),
            sortable: false,
            value: "asset",
          },
          {
            text: '提币金额',
            sortable: false,
            value: "amount",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.mine.到账金额"),
            sortable: false,
            value: "true_amount",
          },

          {
            text: this.$vuetify.lang.t(
              "$vuetify.table.merchantWithdrawAddress"
            ),
            sortable: false,
            value: "toAddress",
          },
          // {
          //   class: "custom-min-width-column",
          //   text: this.$vuetify.lang.t("$vuetify.table.merchantWithdrawTag"),
          //   sortable: false,
          //   value: "note",
          // },
          {
            class: "custom-min-width-column",
            text: this.$vuetify.lang.t("$vuetify.table.orderStatus"),
            sortable: false,
            value: "status",
          },
          {
            text: this.$vuetify.lang.t("$vuetify.table.txHash"),
            sortable: false,
            value: "txHash",
            align: "center",
            width: "104",
          },
          {
            text: '操作',
            value:'operate',
            align: "center",
            sortable: false,
          }
        ];
      } else {
        // 我的账单
        this.transDetail.headers = [
          {
            text: this.$vuetify.lang.t("$vuetify.table.time"),
            sortable: false,
            value: "created_at",
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
            value: "txHash",
            align: "center",
            width: "104",
          },
        ];
      }
    },
    pageChange(_val) {
      this.pagination.current = _val;
      this.queryWalletAssetsFlow();
    },
    async filterTransDetail() {
      if (this.rules.minFee() != true) {
        this.$error("Minimum is greater than maximum");
        return;
      }
      this.pagination.current = 1;
      await this.queryWalletAssetsFlow();
    },
    async queryWalletAssetsFlow() {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      try {
        let params = this.getQueryParams();
        let res = {};
        if (this.manageWay === "withdraw") {
          params.sortAttribute = 1;
          params.isMerchant = this.identify == "merchant" ? 1 : null;
          res = await this.$store.dispatch(
            "bossAssetsCenter/queryWithdrawHistory",
            params
          );
        } else {
          if (this.identify === "user") {
            params.userId = this.order.userName
              ? this.order.userName.trim()
              : null;
          }
          res = await this.$store.dispatch(
            "bossAssetsCenter/queryWalletAssetsFlow",
            params
          );
        }
        if (res.code === 200) {
          this.transDetail.items = res.data.list;
          this.pagination.total = res.data.total;
          this.pagination.current = res.data.current_page;
          if (this.manageWay === "withdraw") {
            for (let i = 0; i < this.transDetail.items.length; i++) {
              this.transDetail.items[i].amount =
                this.transDetail.items[i].amount;
              this.transDetail.items[i].status =
                this.transDetail.items[i].status;
              this.transDetail.items[i].userId =
                /*this.transDetail.items[i].order_sn +
                "&" +*/
                this.transDetail.items[i].mch_order_sn;
            }
          }
        } else {
          this.$error(res.message);
        }
      } catch (error) {
        this.$error("Error");
      }
      this.tableLoading = false;
    },
    getQueryParams() {
      let txType = this.getTxType(this.order.type);
      let txFlow = this.getTxFlow(this.order.incomeAndExpend);
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
        state: this.getTxState(this.order.status),
        page: this.pagination.current,
        limit: this.pagination.size,
        startTime: startTime,
        endTime: endTime,
        amountLowerLimit: this.order.min || null,
        amountUpperLimit: this.order.max || null,
        flow: txFlow,
        asset:
          this.order.coinType == this.$vuetify.lang.t("$vuetify.table.all")
            ? null
            : this.order.coinType,
        trxNo: this.order.id.trim() || null,
        type: txType.type,
        enterpriseMemberId: txType.isUser,
        sortAttribute: 4,
        sortType: "descend",
        businessId: this.order.userName ? this.order.userName.trim() : null,
        txHash: this.order.txHash,
        merchant_id: this.selectMerchant(this.order.selectedMerchant),
      };

      if (this.manageWay === "deposit" && this.identify === "merchant") {
        params.isMerchant = 1;
      }

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
    getTxState(s) {
      let state = null;
      if (s == this.$vuetify.lang.t("$vuetify.mine.已拒绝")) {
        state = -1;
      } else if (s == this.$vuetify.lang.t("$vuetify.table.withdrawing")) {
        state = 0;
      } else if (s == this.$vuetify.lang.t("$vuetify.table.withdrawFinished")) {
        state = 1;
      }
      return state;
    },
    getTxFlow(val) {
      if (val == this.$vuetify.lang.t("$vuetify.indexPage.income")) {
        return 0;
      } else if (
        val == this.$vuetify.lang.t("$vuetify.indexPage.expenditure")
      ) {
        return 1;
      } else {
        return null;
      }
    },
    getTxType(s) {
      let data = {
        type: null,
        isUser: null,
      };

      if (this.identify == "all") {
        if (s != this.$vuetify.lang.t("$vuetify.table.all")) {
          data.isUser =
            s.indexOf(this.$vuetify.lang.t("$vuetify.table.user")) != -1
              ? 2
              : 1;
        }
      } else {
        data.isUser = this.identify == "merchant" ? 1 : 2;
      }
      if (this.identify == "all") {
        if (
          s.indexOf(
            this.$vuetify.lang.t("$vuetify.table.withdraw") +
              this.$vuetify.lang.t("$vuetify.table.minerFee")
          ) != -1
        ) {
          data.type = "4";
        } else if (
          s.indexOf(
            this.$vuetify.lang.t("$vuetify.table.withdraw") +
              this.$vuetify.lang.t("$vuetify.table.serverFee")
          ) != -1
        ) {
          data.type = "5";
        } else if (
          s.indexOf(
            this.$vuetify.lang.t("$vuetify.table.deposit") +
              this.$vuetify.lang.t("$vuetify.table.minerFee")
          ) != -1
        ) {
          data.type = "2";
        } else if (
          s.indexOf(
            this.$vuetify.lang.t("$vuetify.table.deposit") +
              this.$vuetify.lang.t("$vuetify.table.serverFee")
          ) != -1
        ) {
          data.type = "3";
        } else if (
          s.indexOf(this.$vuetify.lang.t("$vuetify.table.deposit")) != -1
        ) {
          data.type = "0";
        } else if (
          s.indexOf(this.$vuetify.lang.t("$vuetify.table.withdraw")) != -1
        ) {
          data.type = "1";
        }
      } else {
        data.type = this.manageWay === "deposit" ? "0" : "1";
      }
      return data;
    },
  },
};
</script>

<style lang="stylus">
.mine-title{
  padding-left:24px;
    font-weight:400;
    font-size:18px;
    color:#333;
  }
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

  .actions-box {
    display: flex;
  }
}
</style>