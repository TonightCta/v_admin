<template>
  <div class="check-fee">
    <el-dialog :visible.sync="checkFeeBox" width="634px" :show-close="false">
      <div class="set-header" slot="title">
        <p>提币矿工费不足</p>
        <img
          @click="checkFeeBox = false"
          :src="require('../../../assets/images/close_icon_2.png')"
          alt=""
        />
      </div>
      <div class="draw-msg">
        <ul class="remark-list">
          <li v-for="(item, index) in remarkList" :key="index">
            <p>{{ item.name }}</p>
            <el-popover
              placement="top"
              trigger="hover"
              content="提币矿工费 + 归集矿工费"
              v-if="item.tootip"
            >
              <img class="pop-img" slot="reference" :src="item.too" alt="" />
            </el-popover>
          </li>
        </ul>
        <ul class="msg-list">
          <li>{{ faildMsg?.txIds }}</li>
          <li>{{ faildMsg?.oneFee }}</li>
          <li>{{ faildMsg?.totalToolFee }}&nbsp;{{ faildMsg?.feeCoin }}</li>
        </ul>
      </div>
      <div class="submit-btn">
        <button
          @click="
            checkFeeBox = false;
            $router.push('/funding/merchant_recharge');
          "
        >
          去充值
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checkFeeBox: false,
      remarkList: [
        {
          name: "该商户交易流水笔数",
        },
        {
          name: "单笔矿工费用",
        },
        {
          name: "合计需要矿工费",
          tootip: true,
          too: require("../../../assets/images/q_icon.png"),
        },
      ],
      faildMsg: {},
    };
  },
  watch: {
    value: {
      handler: function (v) {
        this.checkFeeBox = v;
      },
    },
    checkFeeBox(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    getErrorMsg(obj) {
      this.checkFeeBox = true;
      this.faildMsg = obj;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>