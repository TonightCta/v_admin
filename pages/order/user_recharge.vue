<template lang="pug">
.user-recharge
    Order(
      identify="user",
      manageWay="deposit"
      :pageTitle="$vuetify.lang.t('$vuetify.orderComponent.userDepositOrder')"
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
.user-recharge {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>