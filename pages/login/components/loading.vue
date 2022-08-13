<template>
  <div
    class="loading-all"
    v-loading="true"
    element-loading-text="请等待..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  ></div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.loading-all {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
</style>