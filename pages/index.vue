<template>
  <div class="index-page">
      <AccountBalance/>
      <OperateLog/>
      <CoinsCount/>
  </div>
</template>

<script>

export default {
  components:{
    OperateLog:resolve => require(['./components/operate_log.vue'],resolve),
    AccountBalance:resolve => require(['./components/account_balance'],resolve),
    CoinsCount:resolve => require(['./components/coins_count.vue'],resolve)
  }
}
</script>

<style lang="stylus">
@import ('./index.scss');
</style>