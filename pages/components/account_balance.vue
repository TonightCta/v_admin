<template>
  <div class="index-account-balance">
    <div class="account-msg acc-public">
      <div class="msg-left">
        <img :src="require('../../assets/images/home_logo.png')" alt="" />
        <el-popover
          v-if="account.ga == 0"
          content="谷歌验证器未绑定"
          placement="top"
          trigger="hover"
        >
          <p class="un-bind bind-public" slot="reference">未绑定</p>
        </el-popover>

        <p class="has-bind bind-public" v-else>已绑定</p>
      </div>
      <div class="msg-title">
        <div class="title-inner">
          <p class="account-name">
            {{ account.email }}
            <el-dropdown :show-timeout="100">
              <img
                class="el-dropdown-link"
                :src="require('../../assets/images/drop_icon.png')"
                alt=""
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <p class="drop-item-mine">s9756382730@outlook.com</p>
                </el-dropdown-item>
                <el-dropdown-item>
                  <p class="drop-item-mine">s9756382730@outlook.com</p>
                </el-dropdown-item>
                <el-dropdown-item>
                  <p class="drop-item-mine">s9756382730@outlook.com</p>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <ul>
            <li>
              <p>商户号<span></span></p>
              <p>AcRXpWejqMiKngA1wkxWJM2u</p>
            </li>
            <li>
              <p>邮箱<span></span></p>
              <p>{{ account.email }}</p>
            </li>
            <li>
              <p>上次登录时间<span></span></p>
              <p>2022-05-15 12:56:56</p>
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
            <p>0.00&nbsp;$</p>
          </div>
        </div>
        <button>{{ item.btn_name }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baList: [
        {
          icon: require("../../assets/images/home_icon_1.png"),
          name: "可代付",
          btn_name: "充值",
          url: "",
        },
        {
          icon: require("../../assets/images/home_icon_2.png"),
          name: "代付矿工费",
          btn_name: "充值",
          url: "",
          is_tooltip: true,
          tooltip: "商户代付时链上所需的矿工费",
        },
        {
          icon: require("../../assets/images/home_icon_3.png"),
          name: "可提现",
          btn_name: "提现",
          url: "",
        },
        {
          icon: require("../../assets/images/home_icon_4.png"),
          name: "提现矿工费",
          btn_name: "充值",
          url: "",
          is_tooltip: true,
          tooltip: "商户提现时链上所需的矿工费",
        },
      ],
    };
  },
  computed: {
    account() {
      return this.$store.state.bossAssetsCenter.merchantInfo;
    },
  },
};
</script>

<style>
</style>