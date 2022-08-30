<template>
  <div class="withdraw-box">
    <el-dialog :visible.sync="withDrawBox" width="634px" :show-close="false">
      <div class="set-header" slot="title">
        <p>确认提币</p>
        <img
          @click="withDrawBox = false"
          :src="require('../../../assets/images/close_icon_2.png')"
          alt=""
        />
      </div>
      <div class="draw-msg">
        <div class="draw-address">
          <p>TDfW4nfxWDu3SaGntX1nJk5pruCvcjwAxs</p>
        </div>
        <ul class="remark-list">
          <li v-for="(item, index) in remarkList" :key="index">
            <img :src="item.icon" alt="" />
            <p>{{ item.name }}</p>
            <el-popover
              placement="top"
              trigger="hover"
              content="手续费+链上矿工费"
              v-if="item.tootip"
            >
              <img class="pop-img" slot="reference" :src="item.too" alt="" />
            </el-popover>
          </li>
        </ul>
        <ul class="msg-list">
            <!-- <li v-for=" i "></li> -->
        </ul>
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
  data: () => {
    return {
      withDrawBox: false,
      remarkList: [
        {
          name: "提币币种",
          icon: require("../../../assets/images/with_icon.png"),
          tootip: false,
        },
        {
          name: "预期到账",
          icon: require("../../../assets/images/with_icon.png"),
          tootip: false,
        },
        {
          name: "扣除费用",
          icon: require("../../../assets/images/fee_icon.png"),
          tootip: true,
          too: require("../../../assets/images/q_icon.png"),
        },
      ],
    };
  },
  watch: {
    value: {
      handler: function (v) {
        this.withDrawBox = v;
      },
    },
    withDrawBox(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>