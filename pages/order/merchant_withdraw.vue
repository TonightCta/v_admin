<template lang="pug">
.merchant-withdraw
    Order(
      identify="merchant",
      manageWay="withdraw"
      :pageTitle="$vuetify.lang.t('$vuetify.orderComponent.merchantWithdrawOrder')"
    )

</template>
    
<script>
import Order from "~/components/Order.vue"
export default {
  components: {
    Order
  }
}
</script>

<style lang="stylus">
.merchant-withdraw {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>