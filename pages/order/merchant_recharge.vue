<template lang="pug">
.merchant-recharge
    Order(
      identify="merchant",
      manageWay="deposit"
      :pageTitle="$vuetify.lang.t('$vuetify.orderComponent.merchantDepositOrder')"
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
.merchant-recharge {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color:#F5F5FC;
}
</style>