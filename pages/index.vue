<template>
  <div class="index-page">
    <AccountBalance @upMerchantID="upMerchantID" :merchantID="merchantID" />
    <OperateLog :merchantID="merchantID" />
    <CoinsCount :merchantID="merchantID" />
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      merchantID: JSON.parse(sessionStorage.getItem("merchantInfo")).mch_id,
    };
  },
  components: {
    OperateLog: (resolve) => require(["./components/operate_log.vue"], resolve),
    AccountBalance: (resolve) =>
      require(["./components/account_balance"], resolve),
    CoinsCount: (resolve) => require(["./components/coins_count.vue"], resolve),
  },
  methods: {
    upMerchantID(_id) {
      this.merchantID = _id;
    },
  },
};
</script>

<style lang="stylus">
@import ('./index.scss');
</style>