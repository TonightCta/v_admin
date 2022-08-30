<template>
  <div class="set-whitelist">
    <el-dialog :visible.sync="whiteListBox" width="30%" :show-close="false">
      <div class="set-header" slot="title">
        <p>
          {{ `${type === 1 ? "设置" : "编辑"}白名单地址` }}
        </p>
        <img
          @click="setPassBox = false"
          :src="require('../../../assets/images/close_icon_2.png')"
          alt=""
        />
      </div>
      <div class="set-slide">
        <p class="slide-lable">登录密码</p>
        <input
          type="password"
          v-model="loginPass"
          placeholder="请输入登录密码"
        />
      </div>
      <div class="set-slide">
        <p class="slide-lable">白名单IP</p>
        <input type="text" v-model="whiteIP" placeholder="请输入白名单IP" />
      </div>
      <div class="set-oper">
        <button class="default-btn" @click="whiteListBox = false">取消</button>
        <p></p>
        <button class="primary-btn" @click="submitWhiteIP">确认</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
    ip: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      whiteListBox: false,
      loginPass: null, //登录密码
      whiteIP: null, //白名单地址
    };
  },
  watch: {
    value: {
      immediate: true,
      handler: function (v) {
        this.whiteListBox = v;
      },
    },
    whiteListBox(val) {
      this.$emit("input", val);
      !val && ((this.loginPass = null), (this.whiteIP = null));
    },
  },
  methods: {
    //接收编辑地址
    getEditAddress(_url){
        this.whiteIP = _url;
    },
    //提交操作白名单
    async submitWhiteIP() {
      if (!this.loginPass) {
        Message.error("请输入登录密码");
        return;
      }
      if ((!this.whiteIP)) {
        Message.error("请输入白名单IP地址");
        return;
      }
      const params = {
        password: this.loginPass,
        ip: this.whiteIP,
      };
      const result = await this.$store.dispatch(
        "bossAssetsCenter/setWhiteIP",
        params
      );
      const { code } = result;
      if (code !== 200) {
        Message.error(result.message);
        return;
      }
      Message.success(`${this.type === 1 ? "设置" : "编辑"}成功`);
      this.whiteListBox = false;
      this.$emit("upload");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>