<!-- 谷歌绑定提醒 -->
<template>
  <div class="auth-remind">
    <v-dialog v-model="remindBox" max-width="500">
      <v-card>
        <v-card-title class="headline">
          <!-- 提示 -->
          {{ $vuetify.lang.t("$vuetify.lable.prompt") }}
          <v-btn icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="card-con">
            <!-- 为了您的资金安全，请先绑定谷歌验证码！ -->
            {{ $vuetify.lang.t("$vuetify.mine.safe") }}
          </div>
        </v-card-text>
        <v-card-actions class="card-oper">
          <v-btn primary @click="remindBox = false" class="default-btn">{{
            $vuetify.lang.t("$vuetify.mine.下次绑定")
          }}</v-btn>
          <v-btn primary class="red-btn" @click="scrollToBind">{{
            $vuetify.lang.t("$vuetify.mine.去绑定")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      remindBox: false,
    };
  },
  computed: {
    isAuth() {
      return this.$store.state.bossAssetsCenter.merchantInfo.ga;
    },
    isAuthLocal() {
      return this.$store.state.bossAssetsCenter.isAuthBox;
    },
  },
  created() {
    console.error('KFC Crazy Thursday need $50.')
    this.isShowAuth();
    // throw new Error('KFC Crazy Thursday need $50.')
  },
  methods: {
    async isShowAuth() {
      const info = await this.$store.dispatch(
        "bossAssetsCenter/merchantAssetsInfo"
      );
      const isAuth = info.data.merchantInfo.ga;
      isAuth == 0 &&
        this.isAuthLocal == 1 &&
        ((this.remindBox = true),
        this.$store.commit("bossAssetsCenter/setIsAuthBox", 0));
    },
    scrollToBind() {
      this.remindBox = false;
      window.scrollTo({
        top: 600,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.headline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.headline::before {
  display: none;
}
.card-con {
  padding: 20px;
  background: rgba(253, 86, 86, 0.1);
  border-radius: 4px;
  color: #fe3434;
}
.card-oper {
  display: flex;
  width: 96%;
  margin: 0 auto;
  padding-bottom: 24px !important;
  button:first-child {
    width: 30%;
    background: #f8f8f8;
    color: #999999;
  }
  button:last-child {
    flex: 1;
    background: #fd5656;
    color: white;
  }
}
</style>