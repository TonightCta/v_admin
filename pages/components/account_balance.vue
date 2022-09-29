<template>
  <div class="index-account-balance">
    <div class="account-msg acc-public">
      <div class="msg-left">
        <img :src="require('../../assets/images/home_logo.png')" alt="" />
        <div v-if="account.ga != undefined">
          <el-popover
            v-if="account.ga == 0"
            content="谷歌验证器未绑定"
            placement="top"
            trigger="hover"
          >
            <p
              class="un-bind bind-public"
              slot="reference"
              @click="$router.push('/account/merchant')"
            >
              未绑定
            </p>
          </el-popover>
          <p class="has-bind bind-public" v-else>已绑定</p>
        </div>
      </div>
      <div class="msg-title">
        <div class="title-inner">
          <p class="account-name">
            {{ account.name }}
            <el-dropdown
              :show-timeout="100"
              v-if="token && sourceAccount.is_admin"
            >
              <img
                class="el-dropdown-link"
                :src="require('../../assets/images/drop_icon.png')"
                alt=""
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(merchant, index) in merchantList"
                  :key="index"
                  @click.native="selectMerchant(merchant)"
                >
                  <p class="drop-item-mine">{{ merchant.name }}</p>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <button
              v-if="token && sourceAccount.is_admin"
              class="settlement-btn"
              @click="operAssets(1)"
            >
              利润结算
            </button>
            <button
              v-if="token && sourceAccount.is_admin"
              class="extract-btn"
              @click="operAssets(2)"
            >
              提取余额
            </button>

            <el-popover
              placement="bottom"
              trigger="hover"
              popper-class="out-padding"
              v-if="token && sourceAccount.is_admin"
            >
              <ul class="popver-coin-bill">
                <li v-for="(coin, index) in rechargeFee" :key="index + 'coin'">
                  <div>
                    <p>{{ coin.coin }}</p>
                    <p
                      class="inquire-balance"
                      v-if="coin.url && sourceAccount.is_admin"
                      @click="inquireAsset(coin)"
                    >
                      查询
                      <span class="iconfont-mine icon-right"></span>
                    </p>
                  </div>
                  <p class="count">{{ Number(coin.total).toFixed(4) }}</p>
                </li>
                <li v-if="rechargeFee.length === 0" class="no-data-li">暂无</li>
              </ul>
              <button
                class="extract-btn"
                slot="reference"
              >
                充值收益
                <span class="iconfont-mine icon-right"></span>
              </button>
            </el-popover>
          </p>
          <ul>
            <li>
              <p>商户号<span></span></p>
              <p>{{ account.mch_id }}</p>
            </li>
            <li>
              <p>邮箱<span></span></p>
              <p>{{ account.email }}</p>
            </li>
            <li>
              <p>上次登录时间<span></span></p>
              <p>{{ account.last_login_time }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="balance-msg acc-public">
      <div class="msg-box" v-for="(item, index) in baList" :key="index">
        <div class="name-balance">
          <img :src="item.icon" alt="" />
          <div class="name-tooltip">
            <p>
              {{ item.name }}
              <el-popover
                v-if="item.is_tooltip"
                placement="top"
                trigger="hover"
                :content="item.tooltip"
              >
                <img
                  slot="reference"
                  :src="require('../../assets/images/q_icon.png')"
                  alt=""
                />
              </el-popover>
            </p>
            <p>{{ Number(item.balance).toFixed(4) }}&nbsp;{{ item.unit }}</p>
            <div class="bill-tootip">
              <el-popover
                placement="bottom"
                trigger="hover"
                popper-class="out-padding"
              >
                <ul class="popver-coin-bill">
                  <li v-for="(coin, index) in item.list" :key="index + 'coin'">
                    <div>
                      <p>{{ coin.coin }}</p>
                      <p
                        class="inquire-balance"
                        v-if="coin.link && sourceAccount.is_admin"
                        @click="inquireAsset(coin)"
                      >
                        查询
                        <span class="iconfont-mine icon-right"></span>
                      </p>
                    </div>
                    <p class="count">{{ Number(coin.amount).toFixed(4) }}</p>
                  </li>
                </ul>
                <p slot="reference">
                  币种明细
                  <img
                    :src="require('../../assets/images/down_icon_2.png')"
                    alt=""
                  />
                </p>
              </el-popover>
            </div>
          </div>
        </div>
        <button @click="$router.push(item.url)">{{ item.btn_name }}</button>
      </div>
    </div>
    <!-- 资产操作 -->
    <AssetsOper ref="assets-oper" @refreshBalance="refreshBalance" />
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  props: {
    merchantID: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      baList: [
        {
          icon: require("../../assets/images/home_icon_1.png"),
          name: "可代付",
          btn_name: "充值",
          url: "/funding/merchant_recharge",
          list: [],
          unit: "U",
          balance: 0,
        },
        {
          icon: require("../../assets/images/home_icon_2.png"),
          name: "代付矿工费",
          btn_name: "充值",
          url: "/funding/merchant_recharge",
          is_tooltip: true,
          tooltip: "商户代付时链上所需的矿工费",
          list: [],
          unit: "TRX",
          balance: 0,
        },
        {
          icon: require("../../assets/images/home_icon_3.png"),
          name: "可提现",
          btn_name: "提现",
          url: "/funding/merchant_withdraw",
          list: [],
          unit: "U",
          balance: 0,
        },
        {
          icon: require("../../assets/images/home_icon_4.png"),
          name: "提现矿工费",
          btn_name: "充值",
          url: "/funding/merchant_recharge",
          is_tooltip: true,
          tooltip: "商户提现时链上所需的矿工费",
          list: [],
          unit: "TRX",
          balance: 0,
        },
      ],
      merchantList: [],
      walletMsg: {},
      selectMsg: {},
      account: {},
      rechargeFee:[],
    };
  },
  components: {
    AssetsOper: (resolve) => require(["./components/assets_oper.vue"], resolve),
  },
  computed: {
    sourceAccount() {
      return this.$store.state.bossAssetsCenter.merchantInfo;
    },
    token() {
      return sessionStorage.getItem("TOKEN") || "";
    },
  },
  created() {
    this.getMerchantList();
  },
  mounted() {
    this.account = this.$store.state.bossAssetsCenter.merchantInfo;
  },
  watch: {
    merchantID: {
      immediate: true,
      handler: function (v) {
        this.getCoinMsg();
      },
    },
  },
  methods: {
    //选择商户
    selectMerchant(_val) {
      if (_val.is_admin === 1) {
        this.account = this.$store.state.bossAssetsCenter.merchantInfo;
      } else {
        this.account = _val;
      }
      this.$emit("upMerchantID", _val.mch_id);
    },
    //商户列表
    async getMerchantList() {
      const result = await this.$store.dispatch(
        "bossAssetsCenter/getAllMerchants",
        {
          page: 1,
          limit: 200,
        }
      );
      this.merchantList = result.data.list;
    },
    //币种概况
    async getCoinMsg() {
      const result = await this.$store.dispatch(
        "bossAssetsCenter/walletOverview",
        {
          mch_id: this.merchantID,
        }
      );
      this.walletMsg = result.data;
      this.$set(this.baList[0], "list", result.data.mchAvailable);
      this.$set(this.baList[0], "balance", result.data.mchAvailableTotal);
      this.$set(this.baList[1], "list", result.data.mchFeeAvailable);
      this.$set(this.baList[1], "balance", result.data.mchFeeAvailableTotal);
      this.$set(this.baList[2], "list", result.data.userAvailable);
      this.$set(this.baList[2], "balance", result.data.userAvailableTotal);
      this.$set(this.baList[3], "list", result.data.userFeeAvailable);
      this.$set(this.baList[3], "balance", result.data.userFeeAvailableTotal);
      this.rechargeFee = result.data.usersDeposits;
      console.log(result)
    },
    //查询资产
    inquireAsset(_item) {
      window.open(_item.link);
    },
    //操作资产
    async operAssets(_type) {
      const params = {
        mchId: this.account.mch_id,
      };
      const loading = this.$loading({
        lock: true,
        text: "查询中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const result =
        _type === 1
          ? await this.$store.dispatch(
              "bossAssetsCenter/settlementProfitCheck",
              params
            )
          : await this.$store.dispatch(
              "bossAssetsCenter/clearBalanceCheck",
              params
            );
      loading.close();
      const { data, code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      const trx = _type === 1 ? data.trxProfit : data.mchFeeAvailableTotal;
      const usdt = _type === 1 ? data.usdtProfit : data.mchAvailableTotal;
      const trx_2 = _type === 1 ? 0 : data.userFeeAvailableTotal;
      if (_type === 1 && !data.needCheckout) {
        Message.error(`最少结算数量为 ${data.minUsdtProfit} USDT`);
        return;
      }
      this.$refs["assets-oper"].outSide(
        _type,
        this.account.mch_id,
        trx,
        usdt,
        trx_2
      );
    },
    //刷新余额
    refreshBalance() {
      this.getCoinMsg();
    },
  },
};
</script>

<style>
</style>