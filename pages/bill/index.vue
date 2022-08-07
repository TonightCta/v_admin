<template lang="pug">
  .my-bill
    Order(
      identify="all",
      manageWay="all"
      :pageTitle="$vuetify.lang.t('$vuetify.orderComponent.myBill')"
    )

</template>
    
<script>
import Order from "~/components/Order.vue"
export default {
  components: {
    Order
  },
  data: ()=> {
    return {
    
    }
  },
}
</script>

<style lang="stylus">

.my-bill {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>