<template>
  <div class="admin-view-bill">
    <ul>
      <li
        v-for="(item, index) in card"
        :key="index"
        :style="{ background: item.bg }"
      >
        <div class="amount-msg">
          <div class="icon-name">
            <img :src="item.icon" alt="" />
            <div class="icon-title-msg">
              {{ item.name }}
              <el-popover
                placement="top"
                v-if="item.is_remark"
                trigger="hover"
                content="矿工费未剔除实际消耗"
              >
                <img
                  :src="require('../../assets/images/q_icon_2.png')"
                  slot="reference"
                  alt=""
                />
              </el-popover>
            </div>
          </div>
          <div class="amount-num">
            <p>{{ item.amount }}&nbsp;{{ item.unit === "USDT" ? "U" : "" }}</p>
            <div class="bill-tootip">
              <el-popover
                v-if="item.is_tooltip"
                placement="bottom"
                trigger="hover"
                popper-class="without-padding-popover"
              >
                <ul class="popver-coin-bill">
                  <li v-for="(coin, index) in item.list" :key="index + 'coin'">
                    <p class="list-title">
                      {{ coin.name }}
                    </p>
                    <ul>
                      <li
                        v-for="(coinInner, indexInner) in coin.amount"
                        :key="indexInner + 'inner'"
                      >
                        <p>{{ coinInner.coin }}</p>
                        <p>{{ coinInner.total }}</p>
                      </li>
                    </ul>
                  </li>
                </ul>
                <div class="bill-touch" slot="reference">
                  <div class="down-icon">
                    <img :src="item.down" alt="" />
                  </div>
                  <p>明细</p>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="icon-box">
          <img :src="item.right_icon" alt="" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      card: [
        {
          icon: require("../../assets/images/index/card_1_icon.png"),
          right_icon: require("../../assets/images/index/card_1.png"),
          name: "商户数",
          bg: "linear-gradient(47deg, #FF98B7 0%, #FF7398 100%)",
          is_tooltip: false,
          unit: "NULL",
          amount: 0,
        },
        {
          icon: require("../../assets/images/index/card_2_icon.png"),
          right_icon: require("../../assets/images/index/card_2.png"),
          name: "总充值",
          bg: "linear-gradient(44deg, #8AE3BE 0%, #53C390 100%)",
          is_tooltip: true,
          unit: "USDT",
          down: require("../../assets/images/index/down_1.png"),
          amount: 0,
          list: [
            {
              name: "商户",
              amount: [
                {
                  coin: "USDT",
                  total: "12",
                },
                {
                  coin: "USDT",
                  total: "12",
                },
              ],
            },
            {
              name: "用户",
              amount: [
                {
                  coin: "USDT",
                  total: "12",
                },
                {
                  coin: "USDT",
                  total: "12",
                },
              ],
            },
          ],
        },
        {
          icon: require("../../assets/images/index/card_3_icon.png"),
          right_icon: require("../../assets/images/index/card_3.png"),
          name: "总提币",
          bg: "linear-gradient(45deg, #D7ACFC 0%, #B27AFF 100%)",
          is_tooltip: true,
          unit: "USDT",
          down: require("../../assets/images/index/down_2.png"),
          amount: 0,
          list: [
            {
              name: "商户",
              amount: [
                {
                  coin: "USDT",
                  total: "12",
                },
                {
                  coin: "USDT",
                  total: "12",
                },
              ],
            },
            {
              name: "用户",
              amount: [
                {
                  coin: "USDT",
                  total: "12",
                },
                {
                  coin: "USDT",
                  total: "12",
                },
              ],
            },
          ],
        },
        {
          icon: require("../../assets/images/index/card_4_icon.png"),
          right_icon: require("../../assets/images/index/card_4.png"),
          name: "总手续费",
          bg: "linear-gradient(46deg, #E7DC5D 0%, #E5CA4D 100%)",
          is_tooltip: true,
          is_remark: false,
          unit: "USDT",
          down: require("../../assets/images/index/down_3.png"),
          amount: 0,
          list: [
            {
              name: "充值手续费",
              amount: [
                {
                  coin: "USDT",
                  total: "12",
                },
                {
                  coin: "USDT",
                  total: "12",
                },
              ],
            },
            {
              name: "提现手续费",
              amount: [
                {
                  coin: "USDT",
                  total: "12",
                },
                {
                  coin: "USDT",
                  total: "12",
                },
              ],
            },
            {
              name: "矿工费",
              amount: [
                {
                  coin: "USDT",
                  total: "12",
                },
                {
                  coin: "USDT",
                  total: "12",
                },
              ],
            },
          ],
        },
        {
          icon: require("../../assets/images/index/card_4_icon.png"),
          right_icon: require("../../assets/images/index/card_4.png"),
          name: "已结利润",
          bg: "linear-gradient(46deg, #FFC970 0%, #F39F47 100%)",
          is_tooltip: true,
          is_remark: false,
          unit: "USDT",
          down: require("../../assets/images/index/down_5.png"),
          amount: 0,
          list: [
            {
              name: "商户",
              amount: [
                {
                  coin: "USDT",
                  total: "12",
                },
                {
                  coin: "USDT",
                  total: "12",
                },
              ],
            },
          ],
        },
      ],
    };
  },
  created() {
    this.billAssets();
  },
  methods: {
    async billAssets() {
      const result = await this.$store.dispatch("bossAssetsCenter/billAssets");
      console.log(result);
      const { data } = result;
      this.$set(this.card[0], "amount", data.merchantsNumber);
      this.$set(this.card[1], "amount", data.totalDeposit.toFixed(0));
      this.$set(this.card[2], "amount", data.totalWithdraw.toFixed(0));
      this.$set(this.card[3], "amount", data.totalFee.toFixed(0));
      this.$set(this.card[4], "amount", data.totalCheckout.toFixed(0));
      this.card[1].list[0].amount = data.merchantsDeposits;
      this.card[1].list[1].amount = data.usersDeposits;
      this.card[2].list[0].amount = data.merchantsWithdraws;
      this.card[2].list[1].amount = data.usersWithdraws;
      this.card[3].list[0].amount = data.allDepositFee;
      this.card[3].list[1].amount = data.allWithdrawFee;
      this.card[3].list[2].amount = data.allMinerFee;
      this.card[4].list[0].amount = data.checkoutHistory;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>