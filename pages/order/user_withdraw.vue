<template lang="pug">
.user-withdraw
  Order(
    identify="user",
    manageWay="withdraw",
    :pageTitle="$vuetify.lang.t('$vuetify.orderComponent.userWithdrawOrder')"
  )
</template>
    
<script>
import Order from "~/components/Order.vue";
export default {
  components: {
    Order,
  },
};
</script>

<style lang="stylus">
.user-withdraw {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>