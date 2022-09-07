<template>
  <div class="index-page">
    <AdminView v-if="view" />
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
      view: false,
    };
  },
  components: {
    AdminView: (resolve) => require(["./components/admin_view"], resolve),
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
  created() {
    sessionStorage.getItem('TOKEN') && this.$store.state.bossAssetsCenter.merchantInfo.is_admin &&
      (this.view = true);
  },
};
</script>

<style lang="stylus">
@import ('./index.scss');
</style>